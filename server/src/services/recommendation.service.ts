import prisma from "../prisma.js";
import { calculateUserSkillGaps } from "./gapAnalysis.service.js";
import { logActivity } from "./activityLog.service.js";
import { CoursePathItem } from "../types/index.js";

const DIFFICULTY_WEIGHT: Record<string, number> = {
  foundational: 1,
  intermediate: 2,
  advanced: 3
};

export interface LearningPathResult {
  trackName: string;
  totalSteps: number;
  estimatedHours: number;
  path: CoursePathItem[];
  unmetSkillsCovered: string[];
}

/**
 * Builds an optimal learning path using prerequisiteCourseId chains,
 * ordering foundational -> advanced, and saves the sequence to learning_paths.
 */
export async function generateLearningPath(
  userId: string,
  targetTrackId?: string | null
): Promise<LearningPathResult> {
  const gapAnalysis = await calculateUserSkillGaps(userId, targetTrackId);
  const gapSkills = gapAnalysis.unmetGaps.length > 0 ? gapAnalysis.unmetGaps : gapAnalysis.gaps;

  const skillIds = gapSkills.map((g) => g.skillId);

  // Fetch all available courses mapped to these gap skills or track
  const availableCourses = await prisma.course.findMany({
    where: {
      OR: [
        { taggedSkillId: { in: skillIds } },
        { trackId: gapAnalysis.track.id }
      ]
    },
    include: {
      taggedSkill: true,
      prerequisiteCourse: true
    }
  });

  // Build a lookup map of all courses
  const courseById = new Map<string, typeof availableCourses[0]>();
  availableCourses.forEach((c) => courseById.set(c.id, c));

  // Determine initial candidate courses needed to resolve the skill gaps
  const requiredCourseSet = new Set<string>();
  for (const c of availableCourses) {
    if (skillIds.includes(c.taggedSkillId)) {
      requiredCourseSet.add(c.id);
      // Recursively include all prerequisite courses in chain
      let currentPrereq = c.prerequisiteCourseId;
      while (currentPrereq) {
        requiredCourseSet.add(currentPrereq);
        const parent = courseById.get(currentPrereq);
        currentPrereq = parent?.prerequisiteCourseId || null;
      }
    }
  }

  // Filter candidates to those required
  const candidateCourses = availableCourses.filter((c) => requiredCourseSet.has(c.id));

  // Topological / dependency sorting using prerequisite_course_id chains
  // A course can only be scheduled once all its prerequisites are scheduled.
  const orderedList: typeof availableCourses = [];
  const scheduledIds = new Set<string>();
  const remaining = [...candidateCourses];

  let iterations = 0;
  const maxIterations = remaining.length * 3 + 10;

  while (remaining.length > 0 && iterations < maxIterations) {
    iterations++;
    // Find courses whose prerequisite is either null or already scheduled
    const readyIndices: number[] = [];

    for (let i = 0; i < remaining.length; i++) {
      const c = remaining[i];
      const prereqId = c.prerequisiteCourseId;
      if (!prereqId || scheduledIds.has(prereqId)) {
        readyIndices.push(i);
      }
    }

    if (readyIndices.length === 0) {
      // Break circular or unresolvable dependencies by picking foundational first
      readyIndices.push(0);
    }

    // Sort ready candidates by difficulty (foundational first), then rating descending
    const readyCandidates = readyIndices.map((idx) => remaining[idx]);
    readyCandidates.sort((a, b) => {
      const wA = DIFFICULTY_WEIGHT[a.difficultyLevel.toLowerCase()] || 2;
      const wB = DIFFICULTY_WEIGHT[b.difficultyLevel.toLowerCase()] || 2;
      if (wA !== wB) return wA - wB;
      return b.rating - a.rating;
    });

    const chosen = readyCandidates[0];
    orderedList.push(chosen);
    scheduledIds.add(chosen.id);

    // Remove chosen from remaining list
    const chosenIdx = remaining.findIndex((c) => c.id === chosen.id);
    if (chosenIdx !== -1) {
      remaining.splice(chosenIdx, 1);
    }
  }

  // Construct structured linear path
  const linearPath: CoursePathItem[] = orderedList.map((course, idx) => ({
    id: course.id,
    title: course.title,
    description: course.description,
    sourceLink: course.sourceLink,
    taggedSkillId: course.taggedSkillId,
    skillName: course.taggedSkill.name,
    difficultyLevel: course.difficultyLevel,
    durationHours: course.durationHours,
    provider: course.provider,
    rating: course.rating,
    prerequisiteCourseId: course.prerequisiteCourseId,
    prerequisiteCourseTitle: course.prerequisiteCourse?.title || null,
    stepNumber: idx + 1,
    status: idx === 0 ? "in_progress" : "not_started"
  }));

  const estimatedHours = linearPath.reduce((acc, c) => acc + c.durationHours, 0);
  const unmetSkillsCovered = Array.from(new Set(linearPath.map((c) => c.skillName)));

  // Persist to learning_paths table
  try {
    await prisma.learningPath.create({
      data: {
        learnerId: userId,
        orderedSequence: JSON.stringify(linearPath),
        generatedAt: new Date()
      }
    });

    // Write to activity_logs
    await logActivity(userId, "RECOMMENDATION_RECALCULATED", {
      trackName: gapAnalysis.track.name,
      stepsCount: linearPath.length,
      estimatedHours,
      priorityGapsCovered: unmetSkillsCovered
    });
  } catch (dbErr) {
    console.warn("Could not save learning path snapshot to database:", dbErr);
  }

  return {
    trackName: gapAnalysis.track.name,
    totalSteps: linearPath.length,
    estimatedHours,
    path: linearPath,
    unmetSkillsCovered
  };
}
