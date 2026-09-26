const API_BASE = "http://localhost:5000/api";

function getAuthHeaders() {
  const token = localStorage.getItem("skill_setu_token");
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Auth
  async register(data) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Registration failed");
    return json;
  },

  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Login failed");
    return json;
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to fetch user");
    return json;
  },

  async completeOnboarding(data) {
    const res = await fetch(`${API_BASE}/auth/onboard`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Onboarding failed");
    return json;
  },

  async switchDemo(email) {
    const res = await fetch(`${API_BASE}/auth/switch-demo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Demo switch failed");
    return json;
  },

  async listDemoAccounts() {
    const res = await fetch(`${API_BASE}/auth/demo-accounts`);
    return res.json();
  },

  // Tracks & Competencies
  async getTracks() {
    const res = await fetch(`${API_BASE}/tracks`);
    return res.json();
  },

  async getTrackById(id) {
    const res = await fetch(`${API_BASE}/tracks/${id}`);
    return res.json();
  },

  // Skill Gap Analysis
  async getMySkillGaps() {
    const res = await fetch(`${API_BASE}/gap-analysis/my-gaps`, {
      headers: getAuthHeaders()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to compute skill gaps");
    return json;
  },

  // Recommendations
  async getRecommendations() {
    const res = await fetch(`${API_BASE}/recommendations`, {
      headers: getAuthHeaders()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to fetch recommendations");
    return json;
  },

  // Courses
  async getCourses(filters = {}) {
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(`${API_BASE}/courses?${query}`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  async enrollCourse(courseId) {
    const res = await fetch(`${API_BASE}/courses/enroll`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ courseId })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Enrollment failed");
    return json;
  },

  async completeCourse(courseId) {
    const res = await fetch(`${API_BASE}/courses/${courseId}/complete`, {
      method: "POST",
      headers: getAuthHeaders()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to complete course");
    return json;
  },

  // Quizzes & Assessments
  async getQuizzes(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/quizzes?${query}`);
    return res.json();
  },

  async getQuizById(id) {
    const res = await fetch(`${API_BASE}/quizzes/${id}`, {
      headers: getAuthHeaders()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to fetch quiz");
    return json;
  },

  async getBaselineQuiz(trackId) {
    const res = await fetch(`${API_BASE}/quizzes/baseline/${trackId}`, {
      headers: getAuthHeaders()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Baseline quiz not found");
    return json;
  },

  async submitQuiz(quizId, answers) {
    const res = await fetch(`${API_BASE}/quizzes/${quizId}/submit`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ answers })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Quiz submission failed");
    return json;
  },

  async getMyQuizHistory() {
    const res = await fetch(`${API_BASE}/quizzes/history/my`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // AI Quiz Generation (File Upload)
  async uploadAndGenerateQuiz(formData) {
    const token = localStorage.getItem("skill_setu_token");
    const headers = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/ai-quiz/upload`, {
      method: "POST",
      headers,
      body: formData
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Quiz generation failed");
    return json;
  },

  async updateGeneratedQuestion(questionId, data) {
    const res = await fetch(`${API_BASE}/ai-quiz/questions/${questionId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteGeneratedQuestion(questionId) {
    const res = await fetch(`${API_BASE}/ai-quiz/questions/${questionId}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    return res.json();
  },

  async publishQuiz(quizId, data = {}) {
    const res = await fetch(`${API_BASE}/ai-quiz/publish/${quizId}`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to publish quiz");
    return json;
  },

  async getReviewQueue() {
    const res = await fetch(`${API_BASE}/ai-quiz/review-queue`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // Analytics
  async getAdminAnalytics() {
    const res = await fetch(`${API_BASE}/analytics/admin`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  exportCSVUrl() {
    return `${API_BASE}/analytics/export-csv`;
  },

  // AI Chat Assistant
  async sendChatMessage(message) {
    const res = await fetch(`${API_BASE}/chat/message`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ message })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Chat request failed");
    return json;
  },

  async getChatHistory() {
    const res = await fetch(`${API_BASE}/chat/history`, {
      headers: getAuthHeaders()
    });
    return res.json();
  }
};
