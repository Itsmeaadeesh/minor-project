import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { usePlatform } from "../../context/PlatformContext.js";
import {
  Compass,
  LayoutDashboard,
  CheckCircle,
  Route,
  BookOpen,
  Sparkles,
  History,
  Sun,
  Moon,
  LogOut,
  ShieldCheck,
  User,
  GraduationCap
} from "lucide-react";
import ToastContainer from "../../components/ToastContainer.js";
import QuizTakingModal from "../../pages/QuizTakingModal.js";

export const LearnerLayout: React.FC = () => {
  const { currentUser, logout, darkMode, toggleDarkMode, gapsData } = usePlatform();
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { label: "Dashboard", path: "/", icon: LayoutDashboard },
    { label: "Skill Assessments", path: "/assessments", icon: CheckCircle },
    { label: "Learning Path", path: "/path", icon: Route },
    { label: "Course Catalogue", path: "/courses", icon: BookOpen },
    { label: "AI Quiz Studio", path: "/ai-studio", icon: Sparkles },
    { label: "Quiz History", path: "/history", icon: History }
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-gray-950 text-gray-800 dark:text-gray-100 transition-colors">
      {/* 1. Learner Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-slate-200 dark:border-gray-800 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-base font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-1.5">
                    Skill Setu
                    <span className="text-[10px] uppercase px-1.5 py-0.2 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200 dark:border-indigo-800">
                      LEARNER
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">AI Skill Assessment & Pathways</p>
                </div>
              </Link>

              {/* Active Track Badge */}
              {gapsData?.track && (
                <div className="hidden md:flex items-center gap-1.5 ml-4 pl-4 border-l border-slate-200 dark:border-gray-800">
                  <span className="text-[10px] text-gray-400 uppercase font-semibold">TRACK:</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    {gapsData.track.name}
                  </span>
                </div>
              )}
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive =
                  link.path === "/"
                    ? location.pathname === "/"
                    : location.pathname.startsWith(link.path);

                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/20"
                        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right utilities */}
            <div className="flex items-center gap-2.5">
              {/* Link to Admin Portal */}
              <Link
                to="/admin"
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
                title="Switch to Admin Portal (/admin)"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Admin Portal</span>
              </Link>

              {/* Theme toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
                title="Toggle Theme"
              >
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>

              {/* User Profile & Logout */}
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-gray-800">
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  {currentUser?.name?.charAt(0) || "L"}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-gray-900 dark:text-white leading-tight">
                    {currentUser?.name?.split(" ")[0] || "Learner"}
                  </p>
                  <p className="text-[10px] text-gray-400 capitalize">{currentUser?.role || "Learner"}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                  title="Log out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Nav sub-bar */}
        <div className="lg:hidden px-4 py-2 border-t border-slate-100 dark:border-gray-800 overflow-x-auto flex gap-1 scrollbar-none">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive =
              link.path === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(link.path);

            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-gray-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-800"
                }`}
              >
                <Icon className="h-3 w-3" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </header>

      {/* 2. Main Content Route Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        <Outlet />
      </main>

      {/* 3. Learner Portal Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-slate-200 dark:border-gray-800 py-6 px-4 sm:px-6 lg:px-8 text-center text-xs text-gray-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Skill Setu Platform • Portfolio Quality AI Assessment & Recommendation Engine</p>
          <div className="flex items-center gap-4">
            <Link to="/admin" className="text-amber-500 hover:underline font-semibold">
              Admin Portal (/admin)
            </Link>
            <span>•</span>
            <span className="text-gray-500">React + TypeScript + Supabase + Gemini API</span>
          </div>
        </div>
      </footer>

      {/* Modals & Notifications */}
      <QuizTakingModal />
      <ToastContainer />
    </div>
  );
};

export default LearnerLayout;
