import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";
import prisma from "../prisma.js";
import { AuthRequest, UserRole } from "../types/index.js";

const JWT_SECRET = process.env.JWT_SECRET || "skill_setu_super_secret_jwt_key_2026_secure";
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

let supabase: ReturnType<typeof createClient> | null = null;
if (SUPABASE_URL && SUPABASE_ANON_KEY && !SUPABASE_URL.includes("[PROJECT-REF]")) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (err) {
    console.warn("Could not initialize Supabase client in auth middleware:", err);
  }
}

export async function authenticate(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Authentication required. Missing or malformed token." });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    // 1. Try Supabase Auth token if configured
    if (supabase) {
      const { data, error } = await supabase.auth.getUser(token);
      if (!error && data?.user) {
        const supabaseUser = data.user;
        const email = supabaseUser.email || "";
        const roleFromMetadata = (
          supabaseUser.app_metadata?.role ||
          supabaseUser.user_metadata?.role ||
          "LEARNER"
        ).toUpperCase() as UserRole;

        // Find or sync user in Prisma DB
        let dbUser = await prisma.user.findFirst({
          where: {
            OR: [
              { supabaseUid: supabaseUser.id },
              { email: email }
            ]
          }
        });

        if (!dbUser) {
          dbUser = await prisma.user.create({
            data: {
              supabaseUid: supabaseUser.id,
              email: email,
              name: supabaseUser.user_metadata?.name || email.split("@")[0] || "Learner",
              role: roleFromMetadata === "ADMIN" ? "ADMIN" : "LEARNER",
              avatar: supabaseUser.user_metadata?.avatar_url || null
            }
          });
        } else if (!dbUser.supabaseUid) {
          dbUser = await prisma.user.update({
            where: { id: dbUser.id },
            data: { supabaseUid: supabaseUser.id }
          });
        }

        const userRole = (dbUser.role?.toString().toUpperCase() === "ADMIN" ? "ADMIN" : "LEARNER") as UserRole;

        req.user = {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name,
          role: userRole,
          targetTrackId: dbUser.targetTrackId,
          hasOnboarded: dbUser.hasOnboarded,
          avatar: dbUser.avatar
        };
        next();
        return;
      }
    }

    // 2. Local JWT token verification (supports seamless local auth, seeded admin, and demo users)
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email?: string; role?: string };
    const dbUser = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!dbUser) {
      res.status(401).json({ error: "User session expired or user not found in database." });
      return;
    }

    const userRole = (dbUser.role?.toString().toUpperCase() === "ADMIN" ? "ADMIN" : "LEARNER") as UserRole;

    req.user = {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      role: userRole,
      targetTrackId: dbUser.targetTrackId,
      hasOnboarded: dbUser.hasOnboarded,
      avatar: dbUser.avatar
    };

    next();
  } catch (err: any) {
    res.status(401).json({ error: "Invalid or expired session token.", details: err.message });
  }
}

export function requireRole(allowedRole: UserRole | "ADMIN" | "LEARNER") {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: "Authentication required." });
      return;
    }

    const currentRole = req.user.role.toUpperCase();
    const targetRole = allowedRole.toUpperCase();

    // Admins have universal administrative access
    if (currentRole === "ADMIN" || currentRole === targetRole) {
      next();
      return;
    }

    res.status(403).json({
      error: `Access forbidden: requires '${targetRole}' privileges. Your current role is '${currentRole}'.`
    });
  };
}
