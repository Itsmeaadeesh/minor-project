import { Response } from "express";
import prisma from "../prisma.js";
import { AuthRequest } from "../types/index.js";

/**
 * High-level institutional analytics, KPI aggregations, and skill deficit distributions.
 */
export async function getAdminAnalytics(req: AuthRequest, res: Response): Promise<void> {
  try {
    // 1. KPI Counts
    const [totalLearners, totalTracks, totalQuizzes, totalAttempts, totalUploads, totalLogs, attemptsAgg] =
      await Promise.all([
        prisma.user.count({ where: { role: "LEARNER" } }),
        prisma.track.count(),
        prisma.quiz.count(),
        prisma.quizAttempt.count(),
        prisma.upload.count(),
        prisma.activityLog.count(),
        prisma.quizAttempt.aggregate({
          _avg: { percentage: true }
        })
      ]);

    const averagePlatformScore = Math.round(attemptsAgg._avg.percentage || 0);

    // 2. Most Common Skill Gaps across all learners
    const requirements = await prisma.trackSkill.findMany({
      include: {
        skill: true,
        track: true
      }
    });

    const learnerSkillLevels = await prisma.learnerSkillLevel.findMany({
      include: { skill: true }
    });

    // Map: skillId -> array of levels across learners
    const skillLevelMap = new Map<string, number[]>();
    learnerSkillLevels.forEach((sl) => {
      const list = skillLevelMap.get(sl.skillId) || [];
      list.push(sl.currentLevel);
      skillLevelMap.set(sl.skillId, list);
    });

    const commonGaps = requirements.map((req) => {
      const levels = skillLevelMap.get(req.skillId) || [];
      const learnersWithAssessment = levels.length;
      let totalGap = 0;
      let learnersWithGap = 0;

      if (levels.length > 0) {
        levels.forEach((lvl) => {
          const gap = Math.max(0, req.requiredProficiencyLevel - lvl);
          totalGap += gap;
          if (gap > 0) learnersWithGap++;
        });
      } else {
        totalGap = req.requiredProficiencyLevel - 1;
        learnersWithGap = totalLearners || 1;
      }

      const avgGap =
        learnersWithAssessment > 0
          ? Number((totalGap / learnersWithAssessment).toFixed(1))
          : req.requiredProficiencyLevel - 1;

      return {
        skillId: req.skillId,
        skillName: req.skill.name,
        category: req.skill.category,
        trackName: req.track.name,
        requiredLevel: req.requiredProficiencyLevel,
        averageGap: avgGap,
        learnersCount: learnersWithGap
      };
    });

    // Sort by largest average gap descending
    commonGaps.sort((a, b) => b.averageGap - a.averageGap);

    // 3. Average Scores per Track
    const tracks = await prisma.track.findMany({
      include: {
        quizzes: {
          include: {
            attempts: true
          }
        }
      }
    });

    const trackAverages = tracks.map((t) => {
      const allAttempts = t.quizzes.flatMap((q) => q.attempts);
      const totalPct = allAttempts.reduce((acc, att) => acc + att.percentage, 0);
      const avgScore = allAttempts.length > 0 ? Math.round(totalPct / allAttempts.length) : 75;

      return {
        trackId: t.id,
        trackName: t.name,
        attemptsCount: allAttempts.length,
        averageScore: avgScore
      };
    });

    // 4. Recent Activity preview
    const recentLogs = await prisma.activityLog.findMany({
      take: 6,
      orderBy: { timestamp: "desc" },
      include: {
        actor: {
          select: { id: true, name: true, email: true, role: true }
        }
      }
    });

    res.json({
      metrics: {
        totalLearners,
        totalTracks,
        totalQuizzes,
        totalAttempts,
        totalUploads,
        totalLogs,
        averagePlatformScore
      },
      commonGaps: commonGaps.slice(0, 8),
      trackAverages,
      recentLogs
    });
  } catch (err: any) {
    console.error("Admin analytics error:", err);
    res.status(500).json({ error: "Failed to generate admin analytics", details: err.message });
  }
}

/**
 * Dense learner list with search, track filtering, and summary metrics.
 */
export async function listAdminLearners(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { search, trackId } = req.query;

    const where: any = { role: "LEARNER" };
    if (trackId) {
      where.targetTrackId = String(trackId);
    }
    if (search) {
      where.OR = [
        { name: { contains: String(search) } },
        { email: { contains: String(search) } }
      ];
    }

    const learners = await prisma.user.findMany({
      where,
      include: {
        targetTrack: true,
        quizAttempts: true,
        skillLevels: {
          include: { skill: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    const learnerDirectory = learners.map((l) => {
      const attempts = l.quizAttempts;
      const avgScore =
        attempts.length > 0
          ? Math.round(attempts.reduce((acc, a) => acc + a.percentage, 0) / attempts.length)
          : 0;

      return {
        id: l.id,
        name: l.name,
        email: l.email,
        avatar: l.avatar,
        targetTrackId: l.targetTrackId,
        targetTrack: l.targetTrack?.name || "Unassigned",
        hasOnboarded: l.hasOnboarded,
        skillsAssessed: l.skillLevels.length,
        quizzesTaken: attempts.length,
        averageScore: avgScore,
        createdAt: l.createdAt
      };
    });

    res.json(learnerDirectory);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to list learners", details: err.message });
  }
}

/**
 * Per-learner drilldown showing skills, track gaps, learning path, and attempt history.
 */
export async function getLearnerDrilldown(req: AuthRequest, res: Response): Promise<void> {
  try {
    const id = String(req.params.id);

    const learner = await prisma.user.findUnique({
      where: { id },
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
        },
        learningPaths: {
          orderBy: { generatedAt: "desc" },
          take: 1
        },
        quizAttempts: {
          include: {
            quiz: {
              include: { skill: true, track: true }
            }
          },
          orderBy: { attemptedAt: "desc" }
        },
        uploads: {
          orderBy: { uploadedAt: "desc" },
          take: 5
        },
        activityLogs: {
          orderBy: { timestamp: "desc" },
          take: 10
        }
      }
    });

    if (!learner) {
      res.status(404).json({ error: "Learner not found" });
      return;
    }

    res.json(learner);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch learner drilldown", details: err.message });
  }
}

/**
 * System Activity Logs with multi-filter: by learner, track, date range, action type.
 */
export async function listActivityLogs(req: AuthRequest, res: Response): Promise<void> {
  try {
    const {
      actorId,
      actionType,
      startDate,
      endDate,
      limit = 50,
      page = 1
    } = req.query;

    const where: any = {};

    if (actorId) {
      where.actorId = String(actorId);
    }

    if (actionType && actionType !== "ALL") {
      where.actionType = String(actionType);
    }

    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) {
        where.timestamp.gte = new Date(String(startDate));
      }
      if (endDate) {
        // End of the selected day
        const end = new Date(String(endDate));
        end.setHours(23, 59, 59, 999);
        where.timestamp.lte = end;
      }
    }

    const take = Math.min(100, Math.max(1, Number(limit) || 50));
    const skip = (Math.max(1, Number(page) || 1) - 1) * take;

    const [total, logs] = await Promise.all([
      prisma.activityLog.count({ where }),
      prisma.activityLog.findMany({
        where,
        include: {
          actor: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              avatar: true,
              targetTrack: {
                select: { id: true, name: true }
              }
            }
          }
        },
        orderBy: { timestamp: "desc" },
        take,
        skip
      })
    ]);

    // Parse JSON metadata safely
    const parsedLogs = logs.map((log) => {
      let parsedMeta: any = {};
      try {
        parsedMeta = typeof log.metadata === "string" ? JSON.parse(log.metadata) : log.metadata;
      } catch (e) {
        parsedMeta = { raw: log.metadata };
      }

      return {
        id: log.id,
        actorId: log.actorId,
        actorName: log.actor?.name || "System",
        actorEmail: log.actor?.email || "system@skillsetu.internal",
        actorRole: log.actor?.role || "SYSTEM",
        actorTrack: log.actor?.targetTrack?.name || null,
        actionType: log.actionType,
        metadata: parsedMeta,
        timestamp: log.timestamp
      };
    });

    res.json({
      total,
      page: Number(page) || 1,
      limit: take,
      totalPages: Math.ceil(total / take),
      logs: parsedLogs
    });
  } catch (err: any) {
    console.error("Activity logs query error:", err);
    res.status(500).json({ error: "Failed to fetch activity logs", details: err.message });
  }
}
