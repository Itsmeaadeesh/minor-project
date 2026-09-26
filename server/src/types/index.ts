import { Request } from "express";

export type UserRole = "LEARNER" | "ADMIN";

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  targetTrackId?: string | null;
  hasOnboarded: boolean;
  avatar?: string | null;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

export interface QuizMCQ {
  question: string;
  options: string[];
  correct_option: number;
  explanation: string;
  difficulty?: "foundational" | "intermediate" | "advanced";
}

export interface SkillGapItem {
  skillId: string;
  skillName: string;
  category: string;
  icon: string;
  currentLevel: number;
  requiredLevel: number;
  gap: number; // requiredLevel - currentLevel (minimum 0)
  priorityWeight: number; // weighted gap incorporating prerequisite importance
  tag: "foundational" | "intermediate" | "advanced";
  source: string;
  isMet: boolean;
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

export interface ActivityLogMetadata {
  [key: string]: any;
}
