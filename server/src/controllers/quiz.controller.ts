import { Request, Response } from "express";
import fs from "fs/promises";
import { createClient } from "@supabase/supabase-js";
import prisma from "../prisma.js";
import { AuthRequest } from "../types/index.js";
import { extractTextFromFile } from "../services/document.service.js";
import { generateQuizFromText } from "../services/ai.service.js";
import { calculateUserSkillGaps } from "../services/gapAnalysis.service.js";
import { generateLearningPath } from "../services/recommendation.service.js";
import { logActivity } from "../services/activityLog.service.js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

let supabase: ReturnType<typeof createClient> | null = null;
if (SUPABASE_URL && SUPABASE_ANON_KEY && !SUPABASE_URL.includes("[PROJECT-REF]")) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (e) {
    console.warn("Supabase client init failed in quiz controller:", e);
  }
}

/**
 * Upload study material (PDF/PPT/DOCX), parse text, call Gemini API,
 * validate JSON, persist to uploads, quizzes, quiz_questions, and write to activity_logs.
 */
export async function generateQuizFromUpload(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No document file uploaded." });
      return;
    }

    const { skillId, trackId, title, numQuestions = 5 } = req.body;
    const file = req.file;
    const learnerId = req.user?.id || (await prisma.user.findFirst())?.id || "anonymous-user";

    // 1. Resolve Skill & Track
    let skill = null;
    if (skillId) {
      skill = await prisma.skill.findUnique({ where: { id: skillId } });
    }
    if (!skill) {
      skill = await prisma.skill.findFirst();
    }
    const skillName = skill ? skill.name : "Core Competencies";

    let track = null;
    if (trackId) {
      track = await prisma.track.findUnique({ where: { id: trackId } });
    }

    // 2. Upload to Supabase Storage if configured, or fallback to local path
    let fileStorageUrl = `/uploads/${file.filename}`;
    if (supabase) {
      try {
        const fileBuffer = await fs.readFile(file.path);
        const cleanName = `${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
        const { data: storageData, error: storageErr } = await supabase.storage
          .from("documents")
          .upload(cleanName, fileBuffer, {
            contentType: file.mimetype,
            upsert: true
          });

        if (!storageErr && storageData) {
          const { data: publicUrlData } = supabase.storage
            .from("documents")
            .getPublicUrl(cleanName);
          fileStorageUrl = publicUrlData.publicUrl;
        }
      } catch (storageException: any) {
        console.warn("Supabase Storage upload fallback to local storage:", storageException.message);
      }
    }

    // 3. Extract text from document (runs Tesseract OCR if scanned PDF)
    const { text, isScannedPdf } = await extractTextFromFile(
      file.path,
      file.mimetype,
      file.originalname
    );

    // 4. Save to uploads table
    const uploadRecord = await prisma.upload.create({
      data: {
        learnerId,
        fileUrl: fileStorageUrl,
        fileName: file.originalname,
        fileType: file.mimetype || file.originalname.split(".").pop() || "unknown",
        fileSize: file.size || 0,
        extractedText: text.slice(0, 5000),
        uploadedAt: new Date()
      }
    });

    // Log Activity: UPLOAD_PROCESSED
    await logActivity(learnerId, "UPLOAD_PROCESSED", {
      uploadId: uploadRecord.id,
      fileName: file.originalname,
      fileType: file.mimetype,
      fileSize: file.size,
      ocrUsed: isScannedPdf,
      extractedLength: text.length
    });

    // 5. Generate MCQs using Google Gemini API
    const questionsCount = Math.max(3, Math.min(10, Number(numQuestions) || 5));
    const generatedMCQs = await generateQuizFromText(
      text,
      skillName,
      track?.name || "Technical Track",
      questionsCount
    );

    // 6. Persist Quiz and Questions in Prisma
    const quizTitle =
      title || `${skillName} AI Assessment: ${file.originalname.replace(/\.[^/.]+$/, "")}`;

    const quiz = await prisma.quiz.create({
      data: {
        title: quizTitle,
        description: `AI-generated assessment derived from ${file.originalname}${
          isScannedPdf ? " (analyzed via OCR)" : ""
        }.`,
        skillId: skill?.id || null,
        trackId: track?.id || null,
        uploadId: uploadRecord.id,
        generatedFrom: "upload",
        isBaseline: false,
        createdById: req.user?.id || null,
        timeLimitMinutes: Math.max(5, questionsCount * 2)
      }
    });

    // Create QuizQuestions
    for (const q of generatedMCQs) {
      await prisma.quizQuestion.create({
        data: {
          quizId: quiz.id,
          questionText: q.question,
          options: JSON.stringify(q.options),
          correctAnswer: q.correct_option,
          explanation: q.explanation,
          difficulty: q.difficulty || "intermediate"
        }
      });
    }

    // Log Activity: QUIZ_GENERATED
    await logActivity(learnerId, "QUIZ_GENERATED", {
      quizId: quiz.id,
      quizTitle: quiz.title,
      questionsCount: generatedMCQs.length,
      skillName,
      sourceFileName: file.originalname,
      aiProvider: process.env.GEMINI_API_KEY ? "Google Gemini API" : "Smart Fallback Engine"
    });

    // Retrieve populated quiz
    const fullQuiz = await prisma.quiz.findUnique({
      where: { id: quiz.id },
      include: {
        skill: true,
        track: true,
        questions: true
      }
    });

    res.status(201).json({
      message: "AI Quiz generated successfully!",
      isScannedPdf,
      quiz: fullQuiz
    });
  } catch (err: any) {
    console.error("AI Quiz generation error:", err);
    res.status(500).json({
      error: err.message || "Failed to generate AI quiz from document.",
      details: err.stack
    });
  }
}

export async function listQuizzes(req: Request, res: Response): Promise<void> {
  try {
    const { trackId, skillId, isBaseline } = req.query;

    const where: any = {};
    if (trackId) where.trackId = String(trackId);
    if (skillId) where.skillId = String(skillId);
    if (isBaseline !== undefined) where.isBaseline = isBaseline === "true";

    const quizzes = await prisma.quiz.findMany({
      where,
      include: {
        skill: true,
        track: true,
        _count: {
          select: { questions: true, attempts: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    res.json(quizzes);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to list quizzes", details: err.message });
  }
}

export async function getQuizById(req: AuthRequest, res: Response): Promise<void> {
  try {
    const id = String(req.params.id);
    const { mode } = req.query; // "take" or "review"

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        skill: true,
        track: true,
        questions: true
      }
    });

    if (!quiz) {
      res.status(404).json({ error: "Quiz not found" });
      return;
    }

    // Parse question options
    const parsedQuestions = quiz.questions.map((q) => {
      let optionsArray: string[] = [];
      try {
        optionsArray = JSON.parse(q.options);
      } catch (e) {
        optionsArray = [q.options];
      }

      if (mode === "take") {
        // Obfuscate correct answer during live quiz taking
        return {
          id: q.id,
          question: q.questionText,
          options: optionsArray,
          difficulty: q.difficulty
        };
      }

      return {
        id: q.id,
        question: q.questionText,
        options: optionsArray,
        correct_option: q.correctAnswer,
        explanation: q.explanation,
        difficulty: q.difficulty
      };
    });

    res.json({
      ...quiz,
      questions: parsedQuestions
    });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch quiz details", details: err.message });
  }
}

/**
 * Instant scoring of submitted quiz answers, persists QuizAttempt,
 * updates LearnerSkillLevel, recalculates LearningPath, and writes to ActivityLog.
 */
export async function submitQuizAttempt(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const quizId = String(req.params.id);
    const { answers } = req.body as { answers: Record<string, number> };

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: true,
        skill: true
      }
    });

    if (!quiz) {
      res.status(404).json({ error: "Quiz not found." });
      return;
    }

    // Instant grading
    let rawScore = 0;
    const totalQuestions = quiz.questions.length;
    const reviewBreakdown = [];

    for (const q of quiz.questions) {
      let optionsArray: string[] = [];
      try {
        optionsArray = JSON.parse(q.options);
      } catch (e) {
        optionsArray = [];
      }

      const selectedOption = answers ? answers[q.id] : undefined;
      const isCorrect = selectedOption === q.correctAnswer;

      if (isCorrect) {
        rawScore++;
      }

      reviewBreakdown.push({
        questionId: q.id,
        question: q.questionText,
        options: optionsArray,
        selectedOption: selectedOption !== undefined ? selectedOption : null,
        correctOption: q.correctAnswer,
        isCorrect,
        explanation: q.explanation,
        difficulty: q.difficulty
      });
    }

    const percentage = totalQuestions > 0 ? Math.round((rawScore / totalQuestions) * 100) : 0;
    const passed = percentage >= 60;

    // 1. Store QuizAttempt
    const attempt = await prisma.quizAttempt.create({
      data: {
        learnerId: req.user.id,
        quizId: quiz.id,
        score: rawScore,
        totalQuestions,
        percentage,
        passed,
        answers: JSON.stringify(reviewBreakdown),
        attemptedAt: new Date()
      }
    });

    // Log Activity: QUIZ_ATTEMPTED
    await logActivity(req.user.id, "QUIZ_ATTEMPTED", {
      quizId: quiz.id,
      quizTitle: quiz.title,
      score: rawScore,
      totalQuestions,
      percentage,
      passed,
      skillName: quiz.skill?.name || "General"
    });

    // 2. Update Learner's LearnerSkillLevel for tested skill
    let updatedSkillLevel = null;
    if (quiz.skillId) {
      let derivedLevel = 1;
      if (percentage >= 85) derivedLevel = 5;
      else if (percentage >= 70) derivedLevel = 4;
      else if (percentage >= 55) derivedLevel = 3;
      else if (percentage >= 40) derivedLevel = 2;
      else derivedLevel = 1;

      // Existing level
      const existing = await prisma.learnerSkillLevel.findUnique({
        where: {
          learnerId_skillId: {
            learnerId: req.user.id,
            skillId: quiz.skillId
          }
        }
      });

      const oldLevel = existing?.currentLevel || 1;
      const newLevel = Math.max(oldLevel, derivedLevel);

      const updated = await prisma.learnerSkillLevel.upsert({
        where: {
          learnerId_skillId: {
            learnerId: req.user.id,
            skillId: quiz.skillId
          }
        },
        update: {
          currentLevel: newLevel,
          source: "quiz",
          lastUpdated: new Date()
        },
        create: {
          learnerId: req.user.id,
          skillId: quiz.skillId,
          currentLevel: derivedLevel,
          source: "quiz"
        },
        include: { skill: true }
      });

      updatedSkillLevel = updated;

      // Log Activity: SCORE_CHANGED
      if (newLevel !== oldLevel) {
        await logActivity(req.user.id, "SCORE_CHANGED", {
          skillName: quiz.skill?.name || "Skill",
          oldLevel,
          newLevel,
          trigger: `Quiz Passed: ${quiz.title} (${percentage}%)`
        });
      }
    }

    // 3. Dynamic Progress Recalculation (Gaps + Recommendations)
    const freshGaps = await calculateUserSkillGaps(req.user.id);
    const freshPath = await generateLearningPath(req.user.id);

    res.json({
      message: passed ? "Assessment Passed!" : "Assessment Completed",
      attemptId: attempt.id,
      score: rawScore,
      totalQuestions,
      percentage,
      passed,
      questionsReview: reviewBreakdown,
      updatedSkillLevel,
      freshGaps,
      freshPath
    });
  } catch (err: any) {
    console.error("Quiz submission scoring error:", err);
    res.status(500).json({ error: "Failed to score quiz submission", details: err.message });
  }
}

export async function getMyAttempts(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const attempts = await prisma.quizAttempt.findMany({
      where: { learnerId: req.user.id },
      include: {
        quiz: {
          include: { skill: true, track: true }
        }
      },
      orderBy: { attemptedAt: "desc" }
    });

    res.json(attempts);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch quiz attempts", details: err.message });
  }
}

export async function deleteQuiz(req: AuthRequest, res: Response): Promise<void> {
  try {
    const id = String(req.params.id);
    await prisma.quiz.delete({ where: { id } });
    res.json({ message: "Quiz deleted successfully." });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to delete quiz", details: err.message });
  }
}
