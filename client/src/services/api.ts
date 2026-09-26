import {
  User,
  Track,
  LearnerSkillLevel,
  GapAnalysisResult,
  LearningPathResult,
  Course,
  Quiz,
  QuizAttempt,
  QuizAttemptResult,
  AdminAnalytics,
  AdminLearnerItem,
  ActivityLog
} from "../types/index.js";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("skill_setu_token");
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse<T>(res: Response, fallbackError: string): Promise<T> {
  let json: any = null;
  try {
    json = await res.json();
  } catch {
    // not JSON
  }

  if (!res.ok) {
    const errorMsg = json?.error || fallbackError;
    const err = new Error(errorMsg) as Error & { status?: number };
    err.status = res.status;
    throw err;
  }

  return json as T;
}

export const api = {
  // Auth
  async register(data: { email: string; password: string; name: string; role?: string; targetTrackId?: string }): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return handleResponse(res, "Registration failed");
  },

  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(res, "Login failed");
  },

  async getMe(): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res, "Failed to load session profile");
  },

  async completeOnboarding(targetTrackId: string): Promise<{ user: User }> {
    const res = await fetch(`${API_BASE}/auth/onboard`, {
      method: "POST",
      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ targetTrackId })
    });
    return handleResponse(res, "Failed to complete onboarding");
  },

  async switchDemo(email: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/switch-demo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    return handleResponse(res, "Demo switch failed");
  },

  async listDemoAccounts(): Promise<Array<{ id: string; email: string; name: string; role: string; targetTrack?: { name: string } }>> {
    const res = await fetch(`${API_BASE}/auth/demo-accounts`);
    if (!res.ok) return [];
    return res.json();
  },

  // Tracks
  async getTracks(): Promise<Track[]> {
    const res = await fetch(`${API_BASE}/tracks`);
    return handleResponse(res, "Failed to fetch tracks");
  },

  async getTrackById(id: string): Promise<Track> {
    const res = await fetch(`${API_BASE}/tracks/${id}`);
    return handleResponse(res, "Failed to fetch track details");
  },

  // Assessments & Self Ratings
  async submitSelfRatings(ratings: Array<{ skillId: string; level: number }>): Promise<{ updatedProfiles: LearnerSkillLevel[]; freshGaps: GapAnalysisResult; freshPath?: LearningPathResult }> {
    const res = await fetch(`${API_BASE}/assessments/self-rate`, {
      method: "POST",
      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ ratings })
    });
    return handleResponse(res, "Failed to update skill self-ratings");
  },

  async getMySkillProfiles(): Promise<LearnerSkillLevel[]> {
    const res = await fetch(`${API_BASE}/assessments/my-profile`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res, "Failed to fetch skill profiles");
  },

  // Skill Gap Analysis
  async getMyGaps(trackId?: string): Promise<GapAnalysisResult> {
    const url = trackId ? `${API_BASE}/gap-analysis/my-gaps?trackId=${trackId}` : `${API_BASE}/gap-analysis/my-gaps`;
    const res = await fetch(url, {
      headers: getAuthHeaders()
    });
    return handleResponse(res, "Failed to analyze skill gaps");
  },

  // Recommendations
  async getMyLearningPath(trackId?: string): Promise<LearningPathResult> {
    const url = trackId ? `${API_BASE}/recommendations/my-path?trackId=${trackId}` : `${API_BASE}/recommendations/my-path`;
    const res = await fetch(url, {
      headers: getAuthHeaders()
    });
    return handleResponse(res, "Failed to generate learning path");
  },

  // Courses
  async getCourses(filters?: { skillId?: string; trackId?: string; difficulty?: string }): Promise<Course[]> {
    const params = new URLSearchParams();
    if (filters?.skillId) params.append("skillId", filters.skillId);
    if (filters?.trackId) params.append("trackId", filters.trackId);
    if (filters?.difficulty) params.append("difficulty", filters.difficulty);
    const res = await fetch(`${API_BASE}/courses?${params.toString()}`);
    return handleResponse(res, "Failed to fetch courses");
  },

  async getCourseById(id: string): Promise<Course> {
    const res = await fetch(`${API_BASE}/courses/${id}`);
    return handleResponse(res, "Failed to fetch course details");
  },

  // Quizzes & AI Generation
  async listQuizzes(filters?: { trackId?: string; skillId?: string; isBaseline?: boolean }): Promise<Quiz[]> {
    const params = new URLSearchParams();
    if (filters?.trackId) params.append("trackId", filters.trackId);
    if (filters?.skillId) params.append("skillId", filters.skillId);
    if (filters?.isBaseline !== undefined) params.append("isBaseline", String(filters.isBaseline));
    const res = await fetch(`${API_BASE}/quizzes?${params.toString()}`);
    return handleResponse(res, "Failed to fetch quizzes");
  },

  async getQuizById(id: string, mode: "take" | "review" = "take"): Promise<Quiz> {
    const res = await fetch(`${API_BASE}/quizzes/${id}?mode=${mode}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res, "Failed to fetch quiz");
  },

  async generateQuizFromFile(formData: FormData): Promise<{ message: string; quiz: Quiz; isScannedPdf: boolean }> {
    const headers = getAuthHeaders();
    const res = await fetch(`${API_BASE}/quizzes/generate-from-file`, {
      method: "POST",
      headers,
      body: formData
    });
    return handleResponse(res, "AI Quiz generation failed");
  },

  async submitQuizAttempt(quizId: string, answers: Record<string, number>): Promise<QuizAttemptResult> {
    const res = await fetch(`${API_BASE}/quizzes/${quizId}/attempt`, {
      method: "POST",
      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ answers })
    });
    return handleResponse(res, "Failed to submit quiz attempt");
  },

  async getMyAttempts(): Promise<QuizAttempt[]> {
    const res = await fetch(`${API_BASE}/quizzes/my-attempts`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res, "Failed to fetch quiz attempts");
  },

  async deleteQuiz(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/quizzes/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    return handleResponse(res, "Failed to delete quiz");
  },

  // Admin Portal Endpoints
  async getAdminAnalytics(): Promise<AdminAnalytics> {
    const res = await fetch(`${API_BASE}/admin/analytics`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res, "Failed to load admin analytics");
  },

  async getAdminLearners(params?: { search?: string; trackId?: string }): Promise<AdminLearnerItem[]> {
    const q = new URLSearchParams();
    if (params?.search) q.append("search", params.search);
    if (params?.trackId) q.append("trackId", params.trackId);
    const res = await fetch(`${API_BASE}/admin/learners?${q.toString()}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res, "Failed to load learners directory");
  },

  async getLearnerDrilldown(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/learners/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res, "Failed to load learner drilldown");
  },

  async getAdminLogs(params?: {
    actorId?: string;
    actionType?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{ total: number; page: number; limit: number; totalPages: number; logs: ActivityLog[] }> {
    const q = new URLSearchParams();
    if (params?.actorId) q.append("actorId", params.actorId);
    if (params?.actionType) q.append("actionType", params.actionType);
    if (params?.startDate) q.append("startDate", params.startDate);
    if (params?.endDate) q.append("endDate", params.endDate);
    if (params?.page) q.append("page", String(params.page));
    if (params?.limit) q.append("limit", String(params.limit));

    const res = await fetch(`${API_BASE}/admin/logs?${q.toString()}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res, "Failed to load activity logs");
  }
};
