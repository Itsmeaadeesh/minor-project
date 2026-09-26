import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePlatform } from "../../context/PlatformContext.js";
import { ShieldAlert, ArrowLeft, KeyRound, LogOut } from "lucide-react";

export const AdminForbiddenPage: React.FC = () => {
  const { currentUser, switchDemoAccount, logout } = usePlatform();
  const navigate = useNavigate();

  const handleSwitchAdmin = async () => {
    try {
      await switchDemoAccount("admin@skillsetu.dev");
      navigate("/admin");
    } catch (err) {
      console.error("Failed to switch:", err);
    }
  };

  const handleLogoutAndLogin = async () => {
    await logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 font-sans text-slate-100">
      <div className="w-full max-w-lg bg-slate-900 border border-red-900/50 rounded-3xl p-8 shadow-2xl text-center space-y-6">
        <div className="h-16 w-16 rounded-3xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto shadow-xl shadow-red-500/10">
          <ShieldAlert className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <div className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest">
            HTTP 403 • ACCESS FORBIDDEN
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Administrative Role Required
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
            You are currently authenticated as <strong className="text-slate-200">{currentUser?.email}</strong> with role{" "}
            <span className="px-2 py-0.5 rounded bg-slate-800 text-indigo-300 font-mono font-bold">
              {currentUser?.role?.toUpperCase() || "LEARNER"}
            </span>. Access to the <code className="text-amber-300">/admin/*</code> namespace is restricted exclusively to administrators.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 text-left space-y-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-300">
            <KeyRound className="h-4 w-4 text-amber-400" />
            <span>Role-Based Access Control (RBAC) Enforcement</span>
          </div>
          <p className="text-slate-400 text-[11px]">
            Server middleware strictly validates authorization claims. Learner tokens attempting to execute administrative queries will receive an HTTP 403 Forbidden status code.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <button
            onClick={handleSwitchAdmin}
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
          >
            <span>Switch to Demo Administrator (Dr. Sarah Chen)</span>
          </button>

          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/"
              className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700 flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Learner Portal</span>
            </Link>

            <button
              onClick={handleLogoutAndLogin}
              className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700 flex items-center justify-center gap-1.5"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Admin Login</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminForbiddenPage;
