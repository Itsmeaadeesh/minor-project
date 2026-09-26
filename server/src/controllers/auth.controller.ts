import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prisma.js";
import { AuthRequest, UserRole } from "../types/index.js";
import { logActivity } from "../services/activityLog.service.js";

const JWT_SECRET = process.env.JWT_SECRET || "skill_setu_super_secret_jwt_key_2026_secure";

function generateToken(user: { id: string; email: string; role: string }) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role.toUpperCase() },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { email, password, name, role = "LEARNER", targetTrackId } = req.body;

    if (!email || !password || !name) {
      res.status(400).json({ error: "Email, password, and name are required." });
      return;
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(409).json({ error: "An account with this email already exists." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const assignedRole: UserRole = role?.toString().toUpperCase() === "ADMIN" ? "ADMIN" : "LEARNER";

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: assignedRole,
        targetTrackId: targetTrackId || null,
        hasOnboarded: Boolean(targetTrackId)
      }
    });

    const token = generateToken(user);

    // Log Activity
    await logActivity(user.id, "AUTH_REGISTER", {
      email: user.email,
      role: user.role,
      targetTrackId: user.targetTrackId
    });

    res.status(201).json({
      message: "Account registered successfully.",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        targetTrackId: user.targetTrackId,
        hasOnboarded: user.hasOnboarded
      }
    });
  } catch (err: any) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Registration failed", details: err.message });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required." });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { targetTrack: true }
    });

    if (!user || !user.password) {
      res.status(401).json({ error: "Invalid email or password." });
      return;
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(401).json({ error: "Invalid email or password." });
      return;
    }

    const token = generateToken(user);

    // Log Activity
    await logActivity(user.id, "AUTH_LOGIN", {
      email: user.email,
      role: user.role,
      trackName: user.targetTrack?.name || "None"
    });

    res.json({
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        targetTrackId: user.targetTrackId,
        targetTrack: user.targetTrack,
        hasOnboarded: user.hasOnboarded,
        avatar: user.avatar
      }
    });
  } catch (err: any) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed", details: err.message });
  }
}

export async function getMe(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        targetTrack: {
          include: {
            trackSkills: {
              include: { skill: true }
            }
          }
        },
        skillLevels: {
          include: { skill: true }
        }
      }
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json(user);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch profile", details: err.message });
  }
}

export async function completeOnboarding(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { targetTrackId } = req.body;
    if (!targetTrackId) {
      res.status(400).json({ error: "targetTrackId is required." });
      return;
    }

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        targetTrackId,
        hasOnboarded: true
      },
      include: { targetTrack: true }
    });

    // Log Activity
    await logActivity(req.user.id, "TRACK_SELECTED", {
      trackId: targetTrackId,
      trackName: updated.targetTrack?.name || "Unknown Track"
    });

    res.json({
      message: "Onboarding completed successfully",
      user: updated
    });
  } catch (err: any) {
    res.status(500).json({ error: "Onboarding failed", details: err.message });
  }
}

export async function switchDemo(req: Request, res: Response): Promise<void> {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({
      where: { email },
      include: { targetTrack: true }
    });

    if (!user) {
      res.status(404).json({ error: `Demo account '${email}' not found.` });
      return;
    }

    const token = generateToken(user);

    // Log Activity
    await logActivity(user.id, "AUTH_LOGIN", {
      demoSwitch: true,
      email: user.email,
      role: user.role
    });

    res.json({
      message: `Switched to demo account: ${user.name}`,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        targetTrackId: user.targetTrackId,
        targetTrack: user.targetTrack,
        hasOnboarded: user.hasOnboarded,
        avatar: user.avatar
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: "Demo switch failed", details: err.message });
  }
}

export async function listDemoAccounts(req: Request, res: Response): Promise<void> {
  try {
    const accounts = await prisma.user.findMany({
      where: {
        email: {
          in: [
            "admin@skillsetu.dev",
            "aarav.learner@skillsetu.dev",
            "diya.learner@skillsetu.dev",
            "rohan.learner@skillsetu.dev",
            "learner@skillsetu.ai",
            "admin@skillsetu.ai"
          ]
        }
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        targetTrack: {
          select: { name: true }
        }
      }
    });

    res.json(accounts);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to list demo accounts" });
  }
}
