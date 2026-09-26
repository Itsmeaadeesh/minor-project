import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "../services/api.js";
import { signOutSupabase, supabase } from "../services/supabase.js";
import {
  User,
  UserRole,
  Track,
  SkillProfile,
  GapAnalysisResult,
  LearningPathResult,
  Course,
  Quiz,
  QuizAttempt
} from "../types/index.js";

export interface ToastItem {
  id: number;
  message: string;
  type: "success" | "error" | "info" | "warning";
}

interface PlatformContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  role: UserRole;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeQuizId: string | null;
  startQuiz: (quizId: string) => void;
  closeQuiz: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  tracks: Track[];
  gapsData: GapAnalysisResult | null;
  pathData: LearningPathResult | null;
  skillProfiles: SkillProfile[];
  courses: Course[];
  quizzes: Quiz[];
  quizAttempts: QuizAttempt[];
  loadingData: boolean;
  toasts: ToastItem[];
  addToast: (message: string, type?: "success" | "error" | "info" | "warning", duration?: number) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; name: string; targetTrackId?: string }) => Promise<void>;
  logout: () => Promise<void>;
  switchDemoAccount: (email: string) => Promise<void>;
  completeOnboarding: (trackId: string) => Promise<void>;
  refreshDashboardData: () => Promise<void>;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export const PlatformProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("skill_setu_token"));
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(Boolean(token));
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [role, setRole] = useState<UserRole>("learner");

  // Navigation state
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);

  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("skill_setu_theme") === "dark";
  });

  // Data states
  const [tracks, setTracks] = useState<Track[]>([]);
  const [gapsData, setGapsData] = useState<GapAnalysisResult | null>(null);
  const [pathData, setPathData] = useState<LearningPathResult | null>(null);
  const [skillProfiles, setSkillProfiles] = useState<SkillProfile[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(false);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback(
    (message: string, type: "success" | "error" | "info" | "warning" = "info", duration = 4000) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    },
    []
  );

  // Sync theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("skill_setu_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("skill_setu_theme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // Load user session
  const loadUser = useCallback(async () => {
    const storedToken = localStorage.getItem("skill_setu_token");
    if (!storedToken) {
      setIsAuthenticated(false);
      setCurrentUser(null);
      setAuthLoading(false);
      return;
    }

    try {
      setAuthLoading(true);
      const user = await api.getMe();
      setCurrentUser(user);
      setRole((user.role as UserRole) || "learner");
      setIsAuthenticated(true);
    } catch (err) {
      console.warn("Session expired or invalid, logging out:", err);
      localStorage.removeItem("skill_setu_token");
      setToken(null);
      setCurrentUser(null);
      setIsAuthenticated(false);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  // Listen to Supabase Auth State changes if Supabase is initialized
  useEffect(() => {
    if (!supabase) return;

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.access_token) {
        localStorage.setItem("skill_setu_token", session.access_token);
        setToken(session.access_token);
        loadUser();
      } else if (event === "SIGNED_OUT") {
        localStorage.removeItem("skill_setu_token");
        setToken(null);
        setCurrentUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadUser]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Load baseline tracks list
  useEffect(() => {
    api.getTracks().then(setTracks).catch(console.error);
  }, []);

  // Fetch full dashboard data
  const refreshDashboardData = useCallback(async () => {
    const storedToken = localStorage.getItem("skill_setu_token");
    if (!storedToken) return;

    setLoadingData(true);
    try {
      const [gapsRes, pathRes, coursesRes, quizzesRes, attemptsRes, profilesRes] = await Promise.allSettled([
        api.getMyGaps(),
        api.getMyLearningPath(),
        api.getCourses(),
        api.listQuizzes(),
        api.getMyAttempts(),
        api.getMySkillProfiles()
      ]);

      if (gapsRes.status === "fulfilled") setGapsData(gapsRes.value);
      if (pathRes.status === "fulfilled") setPathData(pathRes.value);
      if (coursesRes.status === "fulfilled") setCourses(coursesRes.value);
      if (quizzesRes.status === "fulfilled") setQuizzes(quizzesRes.value);
      if (attemptsRes.status === "fulfilled") setQuizAttempts(attemptsRes.value);
      if (profilesRes.status === "fulfilled") setSkillProfiles(profilesRes.value);
    } catch (err) {
      console.error("Dashboard refresh error:", err);
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      refreshDashboardData();
    }
  }, [isAuthenticated, currentUser?.id, refreshDashboardData]);

  // Auth operations
  const login = async (email: string, pass: string) => {
    const data = await api.login(email, pass);
    localStorage.setItem("skill_setu_token", data.token);
    setToken(data.token);
    setCurrentUser(data.user);
    setRole(data.user.role);
    setIsAuthenticated(true);
    addToast(`Welcome back, ${data.user.name}!`, "success");
  };

  const register = async (data: { email: string; password: string; name: string; targetTrackId?: string }) => {
    const result = await api.register(data);
    localStorage.setItem("skill_setu_token", result.token);
    setToken(result.token);
    setCurrentUser(result.user);
    setRole(result.user.role);
    setIsAuthenticated(true);
    addToast(`Account created! Welcome to Skill Setu, ${result.user.name}.`, "success");
  };

  const logout = async () => {
    localStorage.removeItem("skill_setu_token");
    setToken(null);
    setCurrentUser(null);
    setIsAuthenticated(false);
    setActiveQuizId(null);
    await signOutSupabase();
    addToast("Logged out successfully.", "info");
  };

  const switchDemoAccount = async (email: string) => {
    try {
      const data = await api.switchDemo(email);
      localStorage.setItem("skill_setu_token", data.token);
      setToken(data.token);
      setCurrentUser(data.user);
      setRole(data.user.role);
      setIsAuthenticated(true);
      addToast(`Switched account to: ${data.user.name} (${data.user.role.toUpperCase()})`, "success");
      // Set appropriate landing tab
      setActiveTab("dashboard");
    } catch (err: any) {
      addToast(err.message || "Failed to switch demo account", "error");
    }
  };

  const completeOnboarding = async (targetTrackId: string) => {
    try {
      const result = await api.completeOnboarding(targetTrackId);
      setCurrentUser(result.user);
      addToast("Track selected! Loading personalized assessment...", "success");
      await refreshDashboardData();
      setActiveTab("assessments");
    } catch (err: any) {
      addToast(err.message || "Onboarding failed", "error");
    }
  };

  const startQuiz = (quizId: string) => {
    setActiveQuizId(quizId);
  };

  const closeQuiz = () => {
    setActiveQuizId(null);
  };

  return (
    <PlatformContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        authLoading,
        role,
        activeTab,
        setActiveTab,
        activeQuizId,
        startQuiz,
        closeQuiz,
        darkMode,
        toggleDarkMode,
        tracks,
        gapsData,
        pathData,
        skillProfiles,
        courses,
        quizzes,
        quizAttempts,
        loadingData,
        toasts,
        addToast,
        login,
        register,
        logout,
        switchDemoAccount,
        completeOnboarding,
        refreshDashboardData
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = (): PlatformContextType => {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error("usePlatform must be used within a PlatformProvider");
  }
  return context;
};
