import React from "react";
import { usePlatform } from "../context/PlatformContext.js";
import {
  LayoutDashboard,
  Compass,
  Sparkles,
  BookOpen,
  Award,
  History,
  ShieldCheck,
  UserCheck,
  LogOut,
  Sun,
  Moon,
  ChevronRight,
  TrendingUp
} from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  adminOnly?: boolean;
}

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    role,
    currentUser,
    logout,
    darkMode,
    toggleDarkMode,
    gapsData
  } = usePlatform();

  const navItems: NavItem[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "assessments", label: "Skill Assessment", icon: Award },
    {
      id: "path",
      label: "Learning Path",
      icon: Compass,
      badge: gapsData?.unmetGaps.length ? `${gapsData.unmetGaps.length} Gaps` : undefined
    },
    { id: "courses", label: "Course Catalog", icon: BookOpen },
    { id: "ai-studio", label: "AI Quiz Studio", icon: Sparkles, badge: "Gemini" },
    { id: "history", label: "Quiz History", icon: History },
    { id: "admin", label: "Admin Analytics", icon: ShieldCheck, adminOnly: true },
    { id: "profile", label: "Profile & Track", icon: UserCheck }
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-slate-200 dark:border-gray-800 flex flex-col h-screen sticky top-0 transition-colors z-20">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
                Skill Setu
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                AI
              </span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
              Bridge To Competency
            </p>
          </div>
        </div>

        {/* Target Track Pill */}
        {currentUser?.targetTrack && (
          <div className="mt-3.5 px-3 py-2 rounded-lg bg-slate-50 dark:bg-gray-800/80 border border-slate-200/80 dark:border-gray-700/60">
            <div className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider">
              Enrolled Track
            </div>
            <div className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate mt-0.5">
              {currentUser.targetTrack.name}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-3.5 space-y-1.5 overflow-y-auto">
        <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider px-3 py-1">
          Navigation
        </div>
        {navItems.map((item) => {
          if (item.adminOnly && role !== "admin") return null;

          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25 font-semibold"
                  : "text-gray-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-gray-400"}`} />
                <span>{item.label}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? "bg-indigo-700 text-indigo-100"
                        : "bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight className="h-3.5 w-3.5 opacity-80" />}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Bottom User Profile & Preferences */}
      <div className="p-3.5 border-t border-slate-100 dark:border-gray-800 space-y-2.5">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            {darkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-600" />}
            <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
          </div>
          <span className="text-[10px] text-gray-400 uppercase font-semibold">Theme</span>
        </button>

        {/* User Card */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-gray-800/60 border border-slate-200/60 dark:border-gray-700/50">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <img
              src={
                currentUser?.avatar ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              }
              alt="Avatar"
              className="h-8 w-8 rounded-full object-cover ring-2 ring-indigo-500/20"
            />
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-gray-800 dark:text-gray-100 truncate">
                {currentUser?.name || "Learner"}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                    role === "admin"
                      ? "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
                      : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                  }`}
                >
                  {role}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            title="Sign Out"
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
