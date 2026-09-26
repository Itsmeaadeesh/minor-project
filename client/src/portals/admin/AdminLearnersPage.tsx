import React, { useState, useEffect } from "react";
import { api } from "../../services/api.js";
import { AdminLearnerItem, Track } from "../../types/index.js";
import {
  Users,
  Search,
  Filter,
  ExternalLink,
  Award,
  BookOpen,
  Calendar,
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers
} from "lucide-react";

export const AdminLearnersPage: React.FC = () => {
  const [learners, setLearners] = useState<AdminLearnerItem[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedTrack, setSelectedTrack] = useState<string>("");

  // Drilldown Modal
  const [drilldownLearner, setDrilldownLearner] = useState<any | null>(null);
  const [drilldownLoading, setDrilldownLoading] = useState<boolean>(false);

  const fetchLearners = async () => {
    setLoading(true);
    try {
      const [learnersData, tracksData] = await Promise.all([
        api.getAdminLearners({
          search: searchTerm || undefined,
          trackId: selectedTrack || undefined
        }),
        api.getTracks()
      ]);
      setLearners(learnersData);
      setTracks(tracksData);
    } catch (err: any) {
      console.error("Failed to load learners:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLearners();
  }, [selectedTrack]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLearners();
  };

  const openDrilldown = async (learnerId: string) => {
    setDrilldownLoading(true);
    try {
      const data = await api.getLearnerDrilldown(learnerId);
      setDrilldownLearner(data);
    } catch (err: any) {
      console.error("Failed to fetch drilldown:", err);
    } finally {
      setDrilldownLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-400" />
            <span>Enrolled Learner Directory</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Search enrolled students, inspect track onboarding, competency mastery, and individualized diagnostic scores.
          </p>
        </div>

        <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-bold self-start sm:self-auto">
          {learners.length} Active Records
        </span>
      </div>

      {/* Search and Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Search by student name or email address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
          <Search className="h-4 w-4 text-slate-500 absolute left-3 top-3" />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedTrack}
            onChange={(e) => setSelectedTrack(e.target.value)}
            className="text-xs bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-amber-500 flex-1 sm:w-56"
          >
            <option value="">All Career Tracks</option>
            {tracks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          <button
            onClick={fetchLearners}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700 whitespace-nowrap"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Dense Learners Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Learner Profile</th>
                <th className="py-3.5 px-4">Target Track</th>
                <th className="py-3.5 px-4">Skills Assessed</th>
                <th className="py-3.5 px-4">Quizzes Taken</th>
                <th className="py-3.5 px-4">Avg Score</th>
                <th className="py-3.5 px-4">Enrolled Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400 font-sans">
                    <div className="inline-block h-6 w-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-2" />
                    <p className="text-xs">Loading learner directory...</p>
                  </td>
                </tr>
              ) : learners.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400 font-sans">
                    <p className="text-sm font-bold text-slate-300">No matching learners found</p>
                  </td>
                </tr>
              ) : (
                learners.map((learner) => (
                  <tr key={learner.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Profile */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                          {learner.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-sans font-bold text-slate-200">{learner.name}</div>
                          <div className="text-[10px] text-slate-500 font-sans">{learner.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Track */}
                    <td className="py-3.5 px-4 font-sans text-xs">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                        {learner.targetTrack}
                      </span>
                    </td>

                    {/* Assessed Skills */}
                    <td className="py-3.5 px-4 font-bold text-slate-300">
                      {learner.skillsAssessed} skills
                    </td>

                    {/* Quizzes Taken */}
                    <td className="py-3.5 px-4 font-bold text-slate-300">
                      {learner.quizzesTaken} attempts
                    </td>

                    {/* Avg Score */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`font-black ${
                          learner.averageScore >= 70
                            ? "text-emerald-400"
                            : learner.averageScore > 0
                            ? "text-amber-400"
                            : "text-slate-500"
                        }`}
                      >
                        {learner.averageScore > 0 ? `${learner.averageScore}%` : "—"}
                      </span>
                    </td>

                    {/* Enrolled Date */}
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {new Date(learner.createdAt).toLocaleDateString()}
                    </td>

                    {/* Drilldown button */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => openDrilldown(learner.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 font-sans text-xs font-bold transition-colors border border-indigo-500/30"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span>Drill Down</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drilldown Modal */}
      {drilldownLearner && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-sm font-bold text-indigo-300">
                  {drilldownLearner.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>{drilldownLearner.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      ID: {drilldownLearner.id.slice(0, 8)}…
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">{drilldownLearner.email} • Track: <strong className="text-slate-200">{drilldownLearner.targetTrack?.name || "Unassigned"}</strong></p>
                </div>
              </div>
              <button
                onClick={() => setDrilldownLearner(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Competency Mastery vs Track Requirements */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Award className="h-4 w-4 text-amber-400" />
                <span>Competency Proficiency Levels</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(drilldownLearner.skillLevels || []).map((sl: any) => {
                  return (
                    <div key={sl.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-white">{sl.skill?.name}</div>
                        <div className="text-[10px] text-slate-500 uppercase">{sl.source} assessment</div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-400">Level</span>
                        <span className="h-6 w-6 rounded-md bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center border border-amber-500/30">
                          {sl.currentLevel}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quiz Attempts Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Clock className="h-4 w-4 text-emerald-400" />
                <span>Quiz & Diagnostic Assessment History</span>
              </h4>

              <div className="space-y-2">
                {(drilldownLearner.quizAttempts || []).length === 0 ? (
                  <p className="text-xs text-slate-500 italic p-3 rounded-xl bg-slate-950">No quizzes attempted yet.</p>
                ) : (
                  (drilldownLearner.quizAttempts || []).map((att: any) => (
                    <div key={att.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-white">{att.quiz?.title}</div>
                        <div className="text-[10px] text-slate-400">
                          {new Date(att.attemptedAt).toLocaleDateString()} at{" "}
                          {new Date(att.attemptedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-200">
                          Score: <span className={att.passed ? "text-emerald-400" : "text-amber-400"}>{att.score}/{att.totalQuestions}</span> ({att.percentage}%)
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${att.passed ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                          {att.passed ? "PASSED" : "FAILED"}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Close button */}
            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setDrilldownLearner(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors"
              >
                Close Drilldown
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLearnersPage;
