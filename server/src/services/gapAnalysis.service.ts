import prisma from "../prisma.js";
import { SkillGapItem } from "../types/index.js";

export interface GapAnalysisResult {
  track: {
    id: string;
    name: string;
    description: string;
    icon: string;
  };
  gaps: SkillGapItem[];
  unmetGaps: SkillGapItem[];
  readinessPercentage: number;
  totalSkills: number;
  skillsMastered: number;
}

/**
 * Compares learner's LearnerSkillLevel against TrackSkill requirements.
 * Ranks gaps by priority: largest deficit first, with prerequisite skills weighted higher.
 */
export async function calculateUserSkillGaps(
  userId: string,
  targetTrackId?: string | null
): Promise<GapAnalysisResult> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      skillLevels: {
        include: { skill: true }
      }
    }
  });

  if (!user) {
    throw new Error("User not found");
  }

  const trackId = targetTrackId || user.targetTrackId;
  let track = null;

  if (trackId) {
    track = await prisma.track.findUnique({
      where: { id: trackId },
      include: {
        trackSkills: {
          include: { skill: true }
        }
      }
    });
  }

  // Fallback to first track if user hasn't selected one
  if (!track) {
    track = await prisma.track.findFirst({
      include: {
        trackSkills: {
          include: { skill: true }
        }
      }
    });
  }

  if (!track) {
    throw new Error("No learning tracks found in system.");
  }

  // Fetch courses with prerequisite relations to identify prerequisite skills
  const coursesWithPrereqs = await prisma.course.findMany({
    where: { trackId: track.id },
    select: {
      id: true,
      taggedSkillId: true,
      prerequisiteCourseId: true,
      difficultyLevel: true
    }
  });

  // Build a set of skills that act as prerequisites for other courses
  const prerequisiteCourseIds = new Set(
    coursesWithPrereqs.map((c) => c.prerequisiteCourseId).filter(Boolean) as string[]
  );
  const prerequisiteSkillIds = new Set<string>();
  coursesWithPrereqs.forEach((c) => {
    if (prerequisiteCourseIds.has(c.id)) {
      prerequisiteSkillIds.add(c.taggedSkillId);
    }
  });

  const levelMap = new Map<string, { level: number; source: string }>();
  user.skillLevels.forEach((sl) => {
    levelMap.set(sl.skillId, { level: sl.currentLevel, source: sl.source });
  });

  const gapItems: SkillGapItem[] = track.trackSkills.map((ts) => {
    const levelInfo = levelMap.get(ts.skillId);
    const currentLevel = levelInfo ? levelInfo.level : 1;
    const source = levelInfo ? levelInfo.source : "unassessed";
    const requiredLevel = ts.requiredProficiencyLevel;
    const deficit = Math.max(0, requiredLevel - currentLevel);

    // Prerequisite weighting: foundational skills that unlock downstream courses get a 1.5x multiplier
    const isPrerequisite = prerequisiteSkillIds.has(ts.skillId);
    const priorityWeight = Number(
      (deficit * 2 + (isPrerequisite ? 2.5 : 0) + (currentLevel <= 2 ? 1.0 : 0.5)).toFixed(1)
    );

    let tag: "foundational" | "intermediate" | "advanced";
    if (currentLevel <= 2) {
      tag = "foundational";
    } else if (currentLevel === 3) {
      tag = "intermediate";
    } else {
      tag = "advanced";
    }

    return {
      skillId: ts.skillId,
      skillName: ts.skill.name,
      category: ts.skill.category,
      icon: ts.skill.icon,
      currentLevel,
      requiredLevel,
      gap: deficit,
      priorityWeight,
      tag,
      source,
      isMet: currentLevel >= requiredLevel
    };
  });

  // Rank gaps by priority: priorityWeight descending, then largest deficit descending
  gapItems.sort((a, b) => b.priorityWeight - a.priorityWeight || b.gap - a.gap || a.currentLevel - b.currentLevel);

  const totalSkills = gapItems.length;
  const skillsMastered = gapItems.filter((g) => g.isMet).length;
  const unmetGaps = gapItems.filter((g) => !g.isMet);

  // Compute readiness percentage toward target track
  const totalRequiredPoints = gapItems.reduce((acc, g) => acc + g.requiredLevel, 0);
  const totalAcquiredPoints = gapItems.reduce((acc, g) => acc + Math.min(g.currentLevel, g.requiredLevel), 0);
  const readinessPercentage =
    totalRequiredPoints > 0 ? Math.round((totalAcquiredPoints / totalRequiredPoints) * 100) : 0;

  return {
    track: {
      id: track.id,
      name: track.name,
      description: track.description,
      icon: track.icon
    },
    gaps: gapItems,
    unmetGaps,
    readinessPercentage,
    totalSkills,
    skillsMastered
  };
}
