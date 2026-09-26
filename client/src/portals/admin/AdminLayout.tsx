import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { usePlatform } from "../../context/PlatformContext.js";
import {
  ShieldCheck,
  LayoutDashboard,
  Users,
  FileText,
  Sparkles,
  BookOpen,
  LogOut,
  ExternalLink,
  Sun,
  Moon,
  Database,
  Cpu
} from "lucide-react";

export const AdminLayout: React.FC = () => {
  const { currentUser, logout, darkMode, toggleDarkMode } = usePlatform();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: "Overview & Analytics", path: "/admin", icon: LayoutDashboard },
    { label: "Learner Directory", path: "/admin/learners", icon: Users },
    { label: "System Activity Logs", path: "/admin/logs", icon: FileText },
    { label: "Quiz Repository", path: "/admin/quizzes", icon: Sparkles },
    { label: "Course Catalogue", path: "/admin/courses", icon: BookOpen }
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100 font-sans">
      {/* 1. Internal Tool Admin Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0 select-none">
        {/* Brand header */}
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-black tracking-tight text-white flex items-center gap-1.5">
                Skill Setu
                <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  OPS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Administration Console</p>
            </div>
          </div>
        </div>

        {/* System telemetry status badge */}
        <div className="px-4 py-3 mx-4 my-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1.5">
            <span>INFRASTRUCTURE</span>
            <span className="flex items-center gap-1 text-emerald-400 font-bold text-[10px]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE
            </span>
          </div>
          <div className="space-y-1 text-[10px] text-slate-300 font-mono">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-slate-400"><Database className="h-3 w-3" /> Supabase DB:</span>
              <span className="text-emerald-400 font-semibold">Postgres OK</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-slate-400"><Cpu className="h-3 w-3" /> Gemini AI:</span>
              <span className="text-purple-400 font-semibold">Ready</span>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Management Modules
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.path === "/admin"
                ? location.pathname === "/admin" || location.pathname === "/admin/"
                : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-amber-400" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Switch Portal Link */}
        <div className="p-3 border-t border-slate-800">
          <Link
            to="/"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="h-3.5 w-3.5 text-indigo-400" />
              <span>Learner Portal</span>
            </span>
            <span className="text-[10px] font-mono bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">/</span>
          </Link>
        </div>

        {/* Admin User Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-8 w-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center font-bold text-xs text-amber-300 flex-shrink-0">
              {currentUser?.name?.charAt(0) || "A"}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-200 truncate">{currentUser?.name || "Administrator"}</p>
              <p className="text-[10px] text-amber-400/90 font-mono font-bold tracking-tight">ROLE: ADMIN</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log out of Admin Portal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {/* 2. Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top internal bar */}
        <header className="h-14 bg-slate-900/80 backdrop-blur border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400">admin@skillsetu.internal</span>
            <span className="text-slate-600">/</span>
            <span className="text-xs font-semibold text-slate-200">
              {navItems.find((n) =>
                n.path === "/admin"
                  ? location.pathname === "/admin" || location.pathname === "/admin/"
                  : location.pathname.startsWith(n.path)
              )?.label || "Admin Console"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700/60 text-xs"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </button>
            <span className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-mono font-bold">
              ADMINISTRATIVE PRIVILEGES
            </span>
          </div>
        </header>

        {/* Main Routed Content */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
