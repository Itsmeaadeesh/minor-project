import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { usePlatform } from "../../context/PlatformContext.js";
import { ShieldCheck, Lock, AlertTriangle, ArrowRight, ArrowLeft } from "lucide-react";

export const AdminLoginPage: React.FC = () => {
  const { login, switchDemoAccount, addToast } = usePlatform();
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("admin@skillsetu.dev");
  const [password, setPassword] = useState<string>("Password123!");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      navigate("/admin");
    } catch (err: any) {
      setError(err.message || "Failed to authenticate administrator");
      addToast(err.message || "Authentication failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAdmin = async () => {
    setLoading(true);
    setError(null);
    try {
      await switchDemoAccount("admin@skillsetu.dev");
      navigate("/admin");
    } catch (err: any) {
      // Fallback to direct password login
      try {
        await login("admin@skillsetu.dev", "Password123!");
        navigate("/admin");
      } catch (loginErr: any) {
        setError(loginErr.message || "Admin login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 font-sans text-slate-100">
      <div className="w-full max-w-md space-y-6">
        {/* Security Warning Badge */}
        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-300">
            <span className="font-bold block">RESTRICTED ACCESS PORTAL</span>
            This interface is intended strictly for administrative personnel, instructors, and system operators.
          </div>
        </div>

        {/* Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-amber-500/20">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-black tracking-tight text-white">Skill Setu Admin Console</h2>
            <p className="text-xs text-slate-400">Authenticate with administrative credentials</p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-950/50 border border-red-800/80 text-red-300 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Admin Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                placeholder="admin@skillsetu.dev"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                placeholder="••••••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              <Lock className="h-3.5 w-3.5" />
              <span>{loading ? "Authenticating..." : "Authorize Admin Session"}</span>
            </button>
          </form>

          {/* 1-Click Demo Admin button */}
          <div className="pt-4 border-t border-slate-800/80 space-y-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block text-center">
              Quick Evaluator Access
            </span>
            <button
              onClick={handleDemoAdmin}
              disabled={loading}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
              <span>1-Click Demo Admin (Dr. Sarah Chen)</span>
            </button>
          </div>
        </div>

        {/* Back to Learner Portal */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Public Learner Portal (/)</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
