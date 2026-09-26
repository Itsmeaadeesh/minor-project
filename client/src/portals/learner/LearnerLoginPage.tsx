import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { usePlatform } from "../../context/PlatformContext.js";
import { signInWithGoogle, isSupabaseConfigured } from "../../services/supabase.js";
import { GraduationCap, ArrowRight, ShieldCheck, Mail, Lock, User as UserIcon, Sparkles } from "lucide-react";

export const LearnerLoginPage: React.FC = () => {
  const { login, register, switchDemoAccount, addToast } = usePlatform();
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("aarav.learner@skillsetu.dev");
  const [password, setPassword] = useState<string>("Password123!");
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isRegister) {
        if (!name.trim()) throw new Error("Full name is required");
        await register({ email, password, name, role: "LEARNER" });
        navigate("/onboarding");
      } else {
        await login(email, password);
        navigate("/");
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
      addToast(err.message || "Authentication failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleOAuth = async () => {
    try {
      if (!isSupabaseConfigured) {
        addToast("Supabase OAuth is unconfigured. Using 1-click Demo Learner login.", "info");
        await handleQuickDemo("aarav.learner@skillsetu.dev");
        return;
      }
      await signInWithGoogle();
    } catch (err: any) {
      addToast(err.message || "Google sign in failed", "error");
    }
  };

  const handleQuickDemo = async (demoEmail: string) => {
    setLoading(true);
    setError(null);
    try {
      await switchDemoAccount(demoEmail);
      navigate("/");
    } catch (err: any) {
      // Fallback
      try {
        await login(demoEmail, "Password123!");
        navigate("/");
      } catch (loginErr: any) {
        setError(loginErr.message || "Demo login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 flex flex-col justify-center items-center p-4 font-sans text-gray-800 dark:text-gray-100 transition-colors">
      <div className="w-full max-w-md space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-emerald-500 flex items-center justify-center text-white mx-auto shadow-xl shadow-indigo-600/20">
            <GraduationCap className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
            Skill Setu
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            AI-Enabled Skill Diagnostic & Automated Pathway Engineering
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-8 shadow-xl space-y-6">
          {/* Tab selector */}
          <div className="flex rounded-xl bg-slate-100 dark:bg-gray-800 p-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setIsRegister(false);
                setError(null);
              }}
              className={`flex-1 py-2 rounded-lg transition-all ${
                !isRegister
                  ? "bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegister(true);
                setError(null);
              }}
              className={`flex-1 py-2 rounded-lg transition-all ${
                isRegister
                  ? "bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-300 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleOAuth}
            className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-slate-50 dark:hover:bg-gray-750 text-xs font-bold text-gray-700 dark:text-gray-200 transition-colors flex items-center justify-center gap-2.5 shadow-2xs"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative flex items-center justify-center">
            <span className="h-px bg-slate-200 dark:bg-gray-800 w-full" />
            <span className="bg-white dark:bg-gray-900 px-3 text-[10px] uppercase font-bold text-gray-400 absolute">
              or email
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs bg-slate-50 dark:bg-gray-850 border border-slate-200 dark:border-gray-800 rounded-xl pl-9 pr-3.5 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                  />
                  <UserIcon className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
                </div>
              </div>
            )}

            <div>
              <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="learner@skillsetu.dev"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-gray-850 border border-slate-200 dark:border-gray-800 rounded-xl pl-9 pr-3.5 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                />
                <Mail className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-gray-850 border border-slate-200 dark:border-gray-800 rounded-xl pl-9 pr-3.5 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                />
                <Lock className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>{loading ? "Authenticating..." : isRegister ? "Create Learner Account" : "Access Learning Dashboard"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Quick Demo Learner Buttons */}
          <div className="pt-4 border-t border-slate-100 dark:border-gray-800 space-y-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block text-center">
              1-Click Demo Profiles (Evaluator Access)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo("aarav.learner@skillsetu.dev")}
                className="p-2 rounded-xl bg-slate-50 dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-left border border-slate-200 dark:border-gray-700 transition-colors"
              >
                <div className="font-bold text-xs text-gray-900 dark:text-white">Aarav Sharma</div>
                <div className="text-[10px] text-indigo-600 dark:text-indigo-400">Web Track (Gaps)</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo("diya.learner@skillsetu.dev")}
                className="p-2 rounded-xl bg-slate-50 dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-left border border-slate-200 dark:border-gray-700 transition-colors"
              >
                <div className="font-bold text-xs text-gray-900 dark:text-white">Diya Verma</div>
                <div className="text-[10px] text-purple-600 dark:text-purple-400">AI Track (Advanced)</div>
              </button>
            </div>
          </div>
        </div>

        {/* Link to Admin Portal */}
        <div className="text-center">
          <Link
            to="/admin/login"
            className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 font-semibold transition-colors"
          >
            <ShieldCheck className="h-4 w-4 text-amber-500" />
            <span>Administrator or Instructor? Go to Admin Portal (/admin)</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LearnerLoginPage;
