import React, { useState } from "react";
import { usePlatform } from "../context/PlatformContext.js";
import {
  User,
  Compass,
  Award,
  Calendar,
  Mail,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Sparkles
} from "lucide-react";

export const ProfilePage: React.FC = () => {
  const {
    currentUser,
    role,
    tracks,
    skillProfiles,
    completeOnboarding,
    switchDemoAccount,
    addToast
  } = usePlatform();

  const [selectedTrackId, setSelectedTrackId] = useState<string>(
    currentUser?.targetTrackId || ""
  );
  const [updating, setUpdating] = useState<boolean>(false);

  const handleUpdateTrack = async () => {
    if (!selectedTrackId) return;
    setUpdating(true);
    try {
      await completeOnboarding(selectedTrackId);
      addToast("Track updated! Learning path and gap analysis recalculated.", "success");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto">
      {/* Profile Header Card */}
      <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-slate-200 dark:border-gray-800 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <img
          src={
            currentUser?.avatar ||
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
          }
          alt="Avatar"
          className="h-24 w-24 rounded-3xl object-cover ring-4 ring-indigo-500/20 shadow-md"
        />

        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h2 className="text-xl font-black text-gray-900 dark:text-white">
              {currentUser?.name || "Learner"}
            </h2>
            <span
              className={`inline-block self-center sm:self-auto text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                role === "admin"
                  ? "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
                  : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
              }`}
            >
              {role}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-gray-500 dark:text-gray-400 pt-1">
            <span className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-gray-400" />
              {currentUser?.email}
            </span>
            <span className="flex items-center gap-1.5">
              <Compass className="h-3.5 w-3.5 text-indigo-500" />
              {currentUser?.targetTrack?.name || "No track selected"}
            </span>
            <span className="flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5 text-amber-500" />
              {skillProfiles.length} Calibrated Skills
            </span>
          </div>
        </div>
      </div>

      {/* Target Track Settings */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-slate-200 dark:border-gray-800 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">
            Career Track Enrollment
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Switching your enrolled track updates your gap analysis and dynamically re-sequences your course recommendations.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <select
            value={selectedTrackId}
            onChange={(e) => setSelectedTrackId(e.target.value)}
            className="w-full sm:w-80 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 text-xs font-medium text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {tracks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleUpdateTrack}
            disabled={updating || selectedTrackId === currentUser?.targetTrackId}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all disabled:opacity-40"
          >
            {updating ? "Saving..." : "Update Enrolled Track"}
          </button>
        </div>
      </div>

      {/* Verified Skills Profile */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-slate-200 dark:border-gray-800 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">
            Calibrated Skill Competencies
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Persisted SkillProfile records backed by diagnostic quizzes and self-rating inputs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {skillProfiles.map((sp) => (
            <div
              key={sp.id}
              className="p-4 rounded-2xl border border-slate-100 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-850/50 flex items-center justify-between"
            >
              <div>
                <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                  {sp.skill?.name || "Skill"}
                </h4>
                <div className="flex items-center gap-2 mt-0.5 text-[10px] text-gray-400">
                  <span className="capitalize">Source: {sp.source}</span>
                  <span>•</span>
                  <span>
                    {new Date(sp.lastAssessedAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric"
                    })}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-indigo-600 text-white">
                  Level {sp.level}/5
                </span>
              </div>
            </div>
          ))}

          {skillProfiles.length === 0 && (
            <div className="sm:col-span-2 py-8 text-center text-xs text-gray-400">
              No skill calibrations recorded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
