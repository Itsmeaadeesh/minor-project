import React, { useState, useEffect } from "react";
import { usePlatform } from "../context/PlatformContext.js";
import { api } from "../services/api.js";
import {
  Award,
  Sliders,
  CheckCircle2,
  PlayCircle,
  HelpCircle,
  Save,
  Clock,
  Sparkles,
  Zap
} from "lucide-react";

export const AssessmentEnginePage: React.FC = () => {
  const {
    currentUser,
    gapsData,
    quizzes,
    startQuiz,
    addToast,
    refreshDashboardData
  } = usePlatform();

  const [activeTab, setActiveTab] = useState<"self-rate" | "baseline-quizzes">("self-rate");
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);

  // Initialize sliders with current skill profile levels
  useEffect(() => {
    if (gapsData?.gaps) {
      const initial: Record<string, number> = {};
      gapsData.gaps.forEach((g) => {
        initial[g.skillId] = g.currentLevel;
      });
      setRatings(initial);
    }
  }, [gapsData]);

  const handleSliderChange = (skillId: string, value: number) => {
    setRatings((prev) => ({ ...prev, [skillId]: value }));
  };

  const handleSaveSelfRatings = async () => {
    const payload = Object.entries(ratings).map(([skillId, level]) => ({
      skillId,
      level
    }));

    if (payload.length === 0) return;

    setSaving(true);
    try {
      await api.submitSelfRatings(payload);
      addToast("Skill proficiency self-ratings saved! Skill-gap analysis updated.", "success");
      await refreshDashboardData();
    } catch (err: any) {
      addToast(err.message || "Failed to save self-ratings", "error");
    } finally {
      setSaving(false);
    }
  };

  const getLevelDescription = (lvl: number) => {
    switch (lvl) {
      case 1:
        return "Novice (Theoretical awareness; requires guidance)";
      case 2:
        return "Beginner (Basic working knowledge; simple tasks)";
      case 3:
        return "Competent (Independent execution; production ready)";
      case 4:
        return "Proficient (Deep knowledge; handles complex edge cases)";
      case 5:
        return "Master (System architect; mentors others & optimizes)";
      default:
        return "";
    }
  };

  const baselineQuizzes = quizzes.filter((q) => q.isBaseline);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-slate-200 dark:border-gray-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-gray-900 dark:text-white">
              Skill Assessment Engine
            </h2>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              Diagnostic Mode
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Calibrate your competency profile for{" "}
            <span className="font-bold text-gray-800 dark:text-gray-200">
              {currentUser?.targetTrack?.name || "your target track"}
            </span>
            . Changes immediately recalculate your skill gaps and roadmap.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex p-1 bg-slate-100 dark:bg-gray-800 rounded-2xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("self-rate")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "self-rate"
                ? "bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-gray-500 hover:text-gray-900 dark:text-gray-400"
            }`}
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>Self-Rating (1-5)</span>
          </button>
          <button
            onClick={() => setActiveTab("baseline-quizzes")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "baseline-quizzes"
                ? "bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-gray-500 hover:text-gray-900 dark:text-gray-400"
            }`}
          >
            <Award className="h-3.5 w-3.5" />
            <span>Baseline Quizzes ({baselineQuizzes.length})</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Self-Rating Sliders */}
      {activeTab === "self-rate" && (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-slate-200 dark:border-gray-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Proficiency Level Sliders (1 to 5 Scale)
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Adjust each slider to reflect your current real-world experience.
              </p>
            </div>

            <button
              onClick={handleSaveSelfRatings}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all disabled:opacity-60"
            >
              {saving ? (
                <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  <span>Save Ratings</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-6">
            {(gapsData?.gaps || []).map((skillGap) => {
              const currentVal = ratings[skillGap.skillId] || skillGap.currentLevel || 1;

              return (
                <div
                  key={skillGap.skillId}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-850/50 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                        {skillGap.skillName}
                      </h4>
                      <span className="text-[10px] text-gray-400">{skillGap.category}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400">
                        Target Level:{" "}
                        <strong className="text-indigo-600 dark:text-indigo-400">
                          {skillGap.requiredLevel}/5
                        </strong>
                      </span>
                      <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-indigo-600 text-white">
                        Selected: Level {currentVal}
                      </span>
                    </div>
                  </div>

                  {/* Interactive Slider */}
                  <div className="pt-2">
                    <input
                      type="range"
                      min={1}
                      max={5}
                      step={1}
                      value={currentVal}
                      onChange={(e) => handleSliderChange(skillGap.skillId, Number(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 dark:bg-gray-700 rounded-lg"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-semibold px-1">
                      <span>1 (Novice)</span>
                      <span>2 (Beginner)</span>
                      <span>3 (Competent)</span>
                      <span>4 (Proficient)</span>
                      <span>5 (Master)</span>
                    </div>
                  </div>

                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                    {getLevelDescription(currentVal)}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-gray-800">
            <button
              onClick={handleSaveSelfRatings}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              <span>Save Calibration & Update Learning Path</span>
            </button>
          </div>
        </div>
      )}

      {/* Mode 2: Baseline Diagnostic Quizzes */}
      {activeTab === "baseline-quizzes" && (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-slate-200 dark:border-gray-800 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Standardized Diagnostic Baseline Quizzes
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Taking an official quiz automatically validates and updates your SkillProfile based on real score metrics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {baselineQuizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="p-5 rounded-2xl border border-slate-200 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-850/50 flex flex-col justify-between gap-4 hover:border-indigo-400 transition-all group"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      Baseline Diagnostic
                    </span>
                    <span className="text-[11px] text-gray-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {quiz.timeLimitMinutes} mins
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-gray-900 dark:text-white mt-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {quiz.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                    {quiz.description || "Diagnostic assessment to calibrate your baseline score."}
                  </p>

                  <div className="mt-3 flex items-center gap-2 text-[11px] text-gray-400">
                    <span>Tested Skill:</span>
                    <strong className="text-gray-700 dark:text-gray-300">
                      {quiz.skill?.name || "Technical"}
                    </strong>
                  </div>
                </div>

                <button
                  onClick={() => startQuiz(quiz.id)}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm flex items-center justify-center gap-2 transition-all"
                >
                  <PlayCircle className="h-4 w-4" />
                  <span>Start Assessment</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentEnginePage;
