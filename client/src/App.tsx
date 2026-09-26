import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PlatformProvider } from "./context/PlatformContext.js";

// Learner Portal components
import LearnerLayout from "./portals/learner/LearnerLayout.js";
import LearnerRouteGuard from "./portals/learner/LearnerRouteGuard.js";
import LearnerLoginPage from "./portals/learner/LearnerLoginPage.js";
import LearnerDashboard from "./pages/LearnerDashboard.js";
import LearningPathPage from "./portals/learner/LearningPathPage.js";
import AssessmentEnginePage from "./pages/AssessmentEnginePage.js";
import CourseCataloguePage from "./pages/CourseCataloguePage.js";
import AIQuizStudioPage from "./pages/AIQuizStudioPage.js";
import QuizHistoryPage from "./portals/learner/QuizHistoryPage.js";
import LearnerOnboardingPage from "./pages/LearnerOnboardingPage.js";
import ProfilePage from "./pages/ProfilePage.js";

// Admin Portal components
import AdminLayout from "./portals/admin/AdminLayout.js";
import AdminRouteGuard from "./portals/admin/AdminRouteGuard.js";
import AdminLoginPage from "./portals/admin/AdminLoginPage.js";
import AdminOverviewPage from "./portals/admin/AdminOverviewPage.js";
import AdminLearnersPage from "./portals/admin/AdminLearnersPage.js";
import AdminLogsPage from "./portals/admin/AdminLogsPage.js";
import AdminQuizManagementPage from "./portals/admin/AdminQuizManagementPage.js";
import AdminCoursesPage from "./portals/admin/AdminCoursesPage.js";

export const App: React.FC = () => {
  return (
    <PlatformProvider>
      <BrowserRouter>
        <Routes>
          {/* ========================================================================= */}
          {/* LEARNER PORTAL (Served at / namespace)                                    */}
          {/* ========================================================================= */}
          <Route path="/login" element={<LearnerLoginPage />} />
          <Route path="/onboarding" element={<LearnerOnboardingPage />} />

          <Route
            path="/"
            element={
              <LearnerRouteGuard>
                <LearnerLayout />
              </LearnerRouteGuard>
            }
          >
            <Route index element={<LearnerDashboard />} />
            <Route path="assessments" element={<AssessmentEnginePage />} />
            <Route path="path" element={<LearningPathPage />} />
            <Route path="courses" element={<CourseCataloguePage />} />
            <Route path="ai-studio" element={<AIQuizStudioPage />} />
            <Route path="history" element={<QuizHistoryPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* ========================================================================= */}
          {/* ADMIN PORTAL (Served at /admin namespace with distinct layout & nav)      */}
          {/* ========================================================================= */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          <Route
            path="/admin"
            element={
              <AdminRouteGuard>
                <AdminLayout />
              </AdminRouteGuard>
            }
          >
            <Route index element={<AdminOverviewPage />} />
            <Route path="learners" element={<AdminLearnersPage />} />
            <Route path="logs" element={<AdminLogsPage />} />
            <Route path="quizzes" element={<AdminQuizManagementPage />} />
            <Route path="courses" element={<AdminCoursesPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </PlatformProvider>
  );
};

export default App;
