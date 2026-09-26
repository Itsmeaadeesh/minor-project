import React, { useState } from "react";
import { usePlatform } from "../context/PlatformContext.js";
import {
  Sparkles,
  Users,
  CheckCircle2,
  ChevronDown
} from "lucide-react";

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentUser,
    switchDemoAccount,
    role
  } = usePlatform();

  const [showDemoMenu, setShowDemoMenu] = useState(false);

  const getPageMeta = () => {
    switch (activeTab) {
      case "dashboard":
        return {
          title: "Learner Competency Dashboard",
          subtitle: "Live skill telemetry, gap distribution, and personalized learning roadmaps."
        };
      case "assessments":
        return {
          title: "Skill Assessment & Diagnostic Engine",
          subtitle: "Calibrate your proficiency via 1-5 self-ratings or validated baseline MCQs."
        };
      case "path":
        return {
          title: "Personalized Learning Path",
          subtitle: "Linear, foundational-first curriculum mathematically tailored to close your skill gaps."
        };
      case "courses":
        return {
          title: "Course Catalog",
          subtitle: "Explore foundational, intermediate, and advanced courses mapped by industry skills."
        };
      case "ai-studio":
        return {
          title: "AI Quiz Studio",
          subtitle: "Upload PDF/DOCX/PPT study materials; Gemini extracts insights and synthesizes MCQs."
        };
      case "history":
        return {
          title: "Assessment History & Telemetry",
          subtitle: "Review per-question answers, score percentages, and pedagogical explanations."
        };
      case "admin":
        return {
          title: "Institutional Admin Analytics",
          subtitle: "Platform-wide skill gap trends, track metrics, and curriculum management."
        };
      case "profile":
        return {
          title: "Learner Profile & Track Settings",
          subtitle: "Review your verified skills, track enrollment, and platform milestones."
        };
      default:
        return {
          title: "Skill Setu Platform",
          subtitle: "Empowering learners through AI-enabled diagnostic assessment."
        };
    }
  };

  const meta = getPageMeta();

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-slate-200 dark:border-gray-800 sticky top-0 z-10 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
      <div>
        <h1 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          {meta.title}
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {meta.subtitle}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Quick Demo Switcher Dropdown for evaluators */}
        <div className="relative">
          <button
            onClick={() => setShowDemoMenu(!showDemoMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-gray-700/80 transition-all shadow-sm"
          >
            <Users className="h-3.5 w-3.5 text-indigo-500" />
            <span>Switch Persona</span>
            <ChevronDown className="h-3 w-3 text-gray-400" />
          </button>

          {showDemoMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-slate-200 dark:border-gray-800 p-2 z-50 text-xs">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 py-1">
                Quick Evaluator Personas
              </div>

              <button
                onClick={() => {
                  switchDemoAccount("learner@skillsetu.ai");
                  setShowDemoMenu(false);
                }}
                className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center justify-between group"
              >
                <div>
                  <div className="font-bold text-gray-800 dark:text-gray-200">Aaditya Sharma</div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400">Frontend Track (Learner)</div>
                </div>
                {currentUser?.email === "learner@skillsetu.ai" && (
                  <CheckCircle2 className="h-3.5 w-3.5 text-indigo-600" />
                )}
              </button>

              <button
                onClick={() => {
                  switchDemoAccount("analyst@skillsetu.ai");
                  setShowDemoMenu(false);
                }}
                className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/50 flex items-center justify-between group"
              >
                <div>
                  <div className="font-bold text-gray-800 dark:text-gray-200">Rohan Patel</div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400">Data Analyst (Learner)</div>
                </div>
                {currentUser?.email === "analyst@skillsetu.ai" && (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                )}
              </button>

              <button
                onClick={() => {
                  switchDemoAccount("admin@skillsetu.ai");
                  setShowDemoMenu(false);
                }}
                className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-950/50 flex items-center justify-between group"
              >
                <div>
                  <div className="font-bold text-gray-800 dark:text-gray-200">Dr. Sunita Rao</div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400">Academic Director (Admin)</div>
                </div>
                {currentUser?.email === "admin@skillsetu.ai" && (
                  <CheckCircle2 className="h-3.5 w-3.5 text-purple-600" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Quick Action Button */}
        {role === "learner" && (
          <button
            onClick={() => setActiveTab("ai-studio")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Generate AI Quiz</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
