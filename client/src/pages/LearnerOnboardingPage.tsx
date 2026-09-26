import React, { useState } from "react";
import { usePlatform } from "../context/PlatformContext.js";
import {
  Compass,
  ArrowRight,
  CheckCircle,
  Layout,
  BarChart3,
  Cpu,
  Layers,
  Sparkles
} from "lucide-react";

export const LearnerOnboardingPage: React.FC = () => {
  const { tracks, completeOnboarding } = usePlatform();
  const [selectedTrackId, setSelectedTrackId] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleSelect = async () => {
    if (!selectedTrackId) return;
    setSubmitting(true);
    try {
      await completeOnboarding(selectedTrackId);
    } finally {
      setSubmitting(false);
    }
  };

  const getTrackIcon = (iconName: string) => {
    switch (iconName?.toLowerCase()) {
      case "layout":
        return <Layout className="h-6 w-6 text-indigo-500" />;
      case "barchart3":
        return <BarChart3 className="h-6 w-6 text-emerald-500" />;
      case "cpu":
        return <Cpu className="h-6 w-6 text-purple-500" />;
      default:
        return <Compass className="h-6 w-6 text-indigo-500" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-slate-50 dark:bg-gray-950 transition-colors">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl border border-slate-200 dark:border-gray-800 shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-3">
            <Sparkles className="h-3 w-3" />
            <span>Welcome to Skill Setu</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Select Your Target Career Track
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-lg mx-auto leading-relaxed">
            Our recommendation engine dynamically compares your current competencies against industry requirements to build your personalized learning bridge.
          </p>
        </div>

        {/* Tracks Grid */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          {tracks.map((track) => {
            const isSelected = selectedTrackId === track.id;
            return (
              <div
                key={track.id}
                onClick={() => setSelectedTrackId(track.id)}
                className={`cursor-pointer relative p-5 rounded-2xl border transition-all duration-200 flex items-start gap-4 ${
                  isSelected
                    ? "border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/40 ring-2 ring-indigo-600/30 shadow-md"
                    : "border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-850 hover:border-indigo-300 dark:hover:border-gray-700 hover:shadow-sm"
                }`}
              >
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-gray-800 shrink-0">
                  {getTrackIcon(track.icon)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                      {track.name}
                    </h3>
                    {isSelected && (
                      <CheckCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                    {track.description}
                  </p>

                  {/* Requirements preview pills */}
                  {track.requirements && track.requirements.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {track.requirements.slice(0, 4).map((req) => (
                        <span
                          key={req.id}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                        >
                          {req.skill.name} (Lvl {req.requiredLevel})
                        </span>
                      ))}
                      {track.requirements.length > 4 && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md text-gray-400">
                          +{track.requirements.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <button
          onClick={handleSelect}
          disabled={!selectedTrackId || submitting}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Lock Track & Begin Skill Calibration</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default LearnerOnboardingPage;
