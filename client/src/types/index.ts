export type UserRole = "LEARNER" | "ADMIN" | "learner" | "admin";

export interface User {
  id: string;
  supabaseUid?: string | null;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string | null;
  targetTrackId?: string | null;
  targetTrack?: Track | null;
  hasOnboarded: boolean;
  createdAt: string;
  updatedAt: string;
  skillLevels?: LearnerSkillLevel[];
}

export interface Track {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color?: string;
  trackSkills?: TrackSkill[];
  courses?: Course[];
  quizzes?: Quiz[];
  _count?: {
    users?: number;
    courses?: number;
    quizzes?: number;
  };
}

export interface Skill {
  id: string;
  name: string;
  slug: string;
  category: string;
  description?: string | null;
  icon: string;
}

export interface TrackSkill {
  id: string;
  trackId: string;
  skillId: string;
  requiredProficiencyLevel: number;
  skill: Skill;
}

export interface LearnerSkillLevel {
  id: string;
  learnerId: string;
  skillId: string;
  currentLevel: number; // 1 to 5
  source: "quiz" | "self-rated" | "assessment" | string;
  lastUpdated: string;
  skill: Skill;
}

export interface SkillGapItem {
  skillId: string;
  skillName: string;
  category: string;
  icon: string;
  currentLevel: number;
  requiredLevel: number;
  gap: number;
  priorityWeight: number;
  tag: "foundational" | "intermediate" | "advanced";
  source: string;
  isMet: boolean;
}

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

export interface Course {
  id: string;
  title: string;
  description: string;
  sourceLink?: string | null;
  taggedSkillId: string;
  trackId?: string | null;
  difficultyLevel: "FOUNDATIONAL" | "INTERMEDIATE" | "ADVANCED" | string;
  durationHours: number;
  provider: string;
  rating: number;
  thumbnail?: string | null;
  prerequisiteCourseId?: string | null;
  prerequisiteCourse?: Course | null;
  dependentCourses?: Course[];
  taggedSkill?: Skill;
  track?: Track;
}

export interface CoursePathItem {
  id: string;
  title: string;
  description: string;
  sourceLink?: string | null;
  taggedSkillId: string;
  skillName: string;
  difficultyLevel: "FOUNDATIONAL" | "INTERMEDIATE" | "ADVANCED" | string;
  durationHours: number;
  provider: string;
  rating: number;
  prerequisiteCourseId?: string | null;
  prerequisiteCourseTitle?: string | null;
  stepNumber: number;
  status?: "not_started" | "in_progress" | "completed";
}

export interface LearningPathResult {
  trackName: string;
  totalSteps: number;
  estimatedHours: number;
  path: CoursePathItem[];
  unmetSkillsCovered: string[];
}

export interface QuizQuestion {
  id: string;
  quizId: string;
  question: string;
  options: string[]; // parsed array
  correct_option?: number; // only present in review mode or score response
  explanation?: string;
  difficulty: "foundational" | "intermediate" | "advanced" | string;
}

export interface Quiz {
  id: string;
  title: string;
  description?: string | null;
  trackId?: string | null;
  skillId?: string | null;
  uploadId?: string | null;
  sourceFileUrl?: string | null;
  sourceFilename?: string | null;
  isBaseline: boolean;
  timeLimitMinutes: number;
  createdAt: string;
  skill?: Skill | null;
  track?: Track | null;
  questions?: QuizQuestion[];
  _count?: {
    questions?: number;
    attempts?: number;
  };
}

export interface QuestionReviewItem {
  questionId: string;
  question: string;
  options: string[];
  selectedOption: number | null;
  correctOption: number;
  isCorrect: boolean;
  explanation: string;
  difficulty: string;
}

export interface QuizAttempt {
  id: string;
  learnerId: string;
  quizId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  answers: string; // JSON string of QuestionReviewItem[]
  attemptedAt: string;
  quiz: Quiz;
}

export interface QuizAttemptResult {
  message: string;
  attemptId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  questionsReview: QuestionReviewItem[];
  updatedSkillLevel?: LearnerSkillLevel | null;
  freshGaps?: GapAnalysisResult;
  freshPath?: LearningPathResult;
}

export interface ActivityLog {
  id: string;
  actorId?: string | null;
  actorName: string;
  actorEmail: string;
  actorRole: string;
  actorTrack?: string | null;
  actionType:
    | "AUTH_LOGIN"
    | "AUTH_REGISTER"
    | "TRACK_SELECTED"
    | "PROFILE_UPDATED"
    | "ASSESSMENT_SUBMITTED"
    | "SKILL_SELF_RATED"
    | "SCORE_CHANGED"
    | "UPLOAD_PROCESSED"
    | "QUIZ_GENERATED"
    | "QUIZ_ATTEMPTED"
    | "RECOMMENDATION_RECALCULATED"
    | string;
  metadata: Record<string, any>;
  timestamp: string;
}

export interface AdminAnalytics {
  metrics: {
    totalLearners: number;
    totalTracks: number;
    totalQuizzes: number;
    totalAttempts: number;
    totalUploads: number;
    totalLogs: number;
    averagePlatformScore: number;
  };
  commonGaps: Array<{
    skillId: string;
    skillName: string;
    category: string;
    trackName: string;
    requiredLevel: number;
    averageGap: number;
    learnersCount: number;
  }>;
  trackAverages: Array<{
    trackId: string;
    trackName: string;
    attemptsCount: number;
    averageScore: number;
  }>;
  recentLogs?: ActivityLog[];
}

export interface AdminLearnerItem {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  targetTrackId?: string | null;
  targetTrack: string;
  hasOnboarded: boolean;
  skillsAssessed: number;
  quizzesTaken: number;
  averageScore: number;
  createdAt: string;
}
