import { Response } from "express";
import prisma from "../prisma.js";
import { AuthRequest } from "../types/index.js";
import { calculateUserSkillGaps } from "../services/gapAnalysis.service.js";
import { generateLearningPath } from "../services/recommendation.service.js";
import { logActivity } from "../services/activityLog.service.js";

export async function submitSelfRatings(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { ratings } = req.body as { ratings: Array<{ skillId: string; level: number }> };

    if (!ratings || !Array.isArray(ratings) || ratings.length === 0) {
      res.status(400).json({ error: "Ratings array is required." });
      return;
    }

    // Upsert each skill rating in LearnerSkillLevel
    const updatedProfiles = [];
    for (const item of ratings) {
      const clampedLevel = Math.max(1, Math.min(5, Math.round(item.level)));
      const profile = await prisma.learnerSkillLevel.upsert({
        where: {
          learnerId_skillId: {
            learnerId: req.user.id,
            skillId: item.skillId
          }
        },
        update: {
          currentLevel: clampedLevel,
          source: "self-rated",
          lastUpdated: new Date()
        },
        create: {
          learnerId: req.user.id,
          skillId: item.skillId,
          currentLevel: clampedLevel,
          source: "self-rated"
        },
        include: { skill: true }
      });
      updatedProfiles.push(profile);
    }

    // Log Activity for self-rating
    await logActivity(req.user.id, "SKILL_SELF_RATED", {
      skillsCount: updatedProfiles.length,
      ratings: updatedProfiles.map((p) => ({ skill: p.skill.name, level: p.currentLevel }))
    });

    // Recompute gaps dynamically
    const freshGaps = await calculateUserSkillGaps(req.user.id);

    // Auto-recalculate learning path
    const freshPath = await generateLearningPath(req.user.id);

    res.json({
      message: "Skill profile updated successfully via self-assessment.",
      updatedProfiles,
      freshGaps,
      freshPath
    });
  } catch (err: any) {
    console.error("Failed to submit self-ratings:", err);
    res.status(500).json({ error: "Failed to update skill profile", details: err.message });
  }
}

export async function getMySkillProfiles(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const profiles = await prisma.learnerSkillLevel.findMany({
      where: { learnerId: req.user.id },
      include: { skill: true },
      orderBy: { lastUpdated: "desc" }
    });

    res.json(profiles);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch skill profiles", details: err.message });
  }
}
