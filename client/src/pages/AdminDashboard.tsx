import React, { useState, useEffect } from "react";
import { usePlatform } from "../context/PlatformContext.js";
import { api } from "../services/api.js";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import {
  ShieldCheck,
  Users,
  Compass,
  Award,
  Sparkles,
  Trash2,
  TrendingUp,
  FileText,
  AlertTriangle,
  PlayCircle
} from "lucide-react";
import { AdminAnalytics, Quiz } from "../types/index.js";

export const AdminDashboard: React.FC = () => {
  const { addToast, startQuiz } = usePlatform();

  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [analyticsData, quizzesData] = await Promise.all([
        api.getAdminAnalytics(),
        api.listQuizzes()
      ]);
      setAnalytics(analyticsData);
      setQuizzes(quizzesData);
    } catch (err: any) {
      console.error("Admin dashboard fetch error:", err);
      addToast(err.message || "Failed to load admin analytics", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleDeleteQuiz = async (quizId: string) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;
    try {
      await api.deleteQuiz(quizId);
      addToast("Quiz deleted successfully.", "info");
      loadAdminData();
    } catch (err: any) {
      addToast(err.message || "Failed to delete quiz", "error");
    }
  };

  // Common gaps chart data
  const gapsChartData = (analytics?.commonGaps || []).map((g) => ({
    skill: g.skillName.length > 12 ? g.skillName.slice(0, 11) + "…" : g.skillName,
    fullSkill: g.skillName,
    averageGap: g.averageGap,
    studentsAffected: g.learnersCount
  }));

  // Track averages chart data
  const trackChartData = (analytics?.trackAverages || []).map((t) => ({
    track: t.trackName.length > 14 ? t.trackName.slice(0, 13) + "…" : t.trackName,
    fullTrack: t.trackName,
    averageScore: t.averageScore,
    attempts: t.attemptsCount
  }));

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3">
        <div className="h-10 w-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-gray-400">Aggregating platform telemetry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-7xl mx-auto">
      {/* 1. Admin KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-sm">
          <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
            Active Learners
          </span>
          <div className="mt-2 text-2xl font-black text-gray-900 dark:text-white flex items-center justify-between">
            <span>{analytics?.metrics.totalLearners || 0}</span>
            <Users className="h-5 w-5 text-indigo-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-sm">
          <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
            Career Tracks
          </span>
          <div className="mt-2 text-2xl font-black text-gray-900 dark:text-white flex items-center justify-between">
            <span>{analytics?.metrics.totalTracks || 0}</span>
            <Compass className="h-5 w-5 text-emerald-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-sm">
          <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
            Quizzes Deployed
          </span>
          <div className="mt-2 text-2xl font-black text-gray-900 dark:text-white flex items-center justify-between">
            <span>{analytics?.metrics.totalQuizzes || 0}</span>
            <Sparkles className="h-5 w-5 text-amber-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-sm">
          <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
            Total Attempts
          </span>
          <div className="mt-2 text-2xl font-black text-gray-900 dark:text-white flex items-center justify-between">
            <span>{analytics?.metrics.totalAttempts || 0}</span>
            <Award className="h-5 w-5 text-purple-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-sm">
          <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
            Platform Avg Score
          </span>
          <div className="mt-2 text-2xl font-black text-gray-900 dark:text-white flex items-center justify-between">
            <span>{analytics?.metrics.averagePlatformScore || 0}%</span>
            <TrendingUp className="h-5 w-5 text-teal-500" />
          </div>
        </div>
      </div>

      {/* 2. Institutional Visualizations (Recharts Bar Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Common Skill Gaps */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-slate-200 dark:border-gray-800 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span>Most Common Skill Gaps Across Cohort</span>
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Average deficit magnitude per competency across all learners
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gapsChartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="skill"
                  angle={-25}
                  textAnchor="end"
                  tick={{ fill: "#64748b", fontSize: 10 }}
                />
                <YAxis domain={[0, 4]} tick={{ fill: "#64748b", fontSize: 10 }} />
                <Tooltip
                  formatter={(val: any, name: any) => [
                    name === "Average Deficit (Levels)" ? `-${val} levels` : `${val} learners`,
                    name
                  ]}
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    borderRadius: "12px",
                    border: "none",
                    color: "#fff",
                    fontSize: "11px"
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Bar
                  dataKey="averageGap"
                  name="Average Deficit (Levels)"
                  fill="#ef4444"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="studentsAffected"
                  name="Learners Impacted"
                  fill="#818cf8"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Average Scores by Track */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-slate-200 dark:border-gray-800 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span>Average Diagnostic Score by Career Track</span>
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Comparative cohort diagnostic test performance (%)
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trackChartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="track"
                  angle={-20}
                  textAnchor="end"
                  tick={{ fill: "#64748b", fontSize: 10 }}
                />
                <YAxis domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 10 }} />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, "Average Score"]}
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    borderRadius: "12px",
                    border: "none",
                    color: "#fff",
                    fontSize: "11px"
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Bar
                  dataKey="averageScore"
                  name="Average Score (%)"
                  fill="#10b981"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. Quiz Management Section */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-slate-200 dark:border-gray-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-extrabold text-gray-900 dark:text-white">
              Quiz & Assessment Repository
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Manage baseline assessments and AI-synthesized quizzes generated from uploaded documents.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 dark:border-gray-800 text-gray-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Track</th>
                <th className="py-3 px-4">Skill</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Questions</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
              {quizzes.map((q) => (
                <tr key={q.id} className="hover:bg-slate-50/60 dark:hover:bg-gray-800/40">
                  <td className="py-3.5 px-4 font-bold text-gray-900 dark:text-gray-100">
                    {q.title}
                  </td>
                  <td className="py-3.5 px-4 text-gray-600 dark:text-gray-300">
                    {q.track?.name || "General"}
                  </td>
                  <td className="py-3.5 px-4 text-gray-600 dark:text-gray-300">
                    {q.skill?.name || "Multiple"}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        q.isBaseline
                          ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                          : "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
                      }`}
                    >
                      {q.isBaseline ? "Baseline" : "AI Generated"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold">
                    {q._count?.questions || q.questions?.length || 0} MCQs
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => startQuiz(q.id)}
                      className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                    >
                      Preview
                    </button>
                    {!q.isBaseline && (
                      <button
                        onClick={() => handleDeleteQuiz(q.id)}
                        className="text-red-500 hover:text-red-700 font-bold ml-2"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Enrolled Learners Directory */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-slate-200 dark:border-gray-800 shadow-sm">
        <div className="mb-4">
          <h3 className="text-base font-extrabold text-gray-900 dark:text-white">
            Enrolled Learner Directory
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Individual student telemetry, target tracks, and average quiz scores.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 dark:border-gray-800 text-gray-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Learner Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Target Track</th>
                <th className="py-3 px-4">Assessed Skills</th>
                <th className="py-3 px-4">Quizzes Taken</th>
                <th className="py-3 px-4">Average Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
              {(analytics?.learners || []).map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/60 dark:hover:bg-gray-800/40">
                  <td className="py-3.5 px-4 font-bold text-gray-900 dark:text-gray-100">
                    {l.name}
                  </td>
                  <td className="py-3.5 px-4 text-gray-500 dark:text-gray-400">{l.email}</td>
                  <td className="py-3.5 px-4 text-gray-700 dark:text-gray-300">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-gray-800 font-semibold">
                      {l.targetTrack}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold">{l.skillsAssessed}</td>
                  <td className="py-3.5 px-4 font-semibold">{l.quizzesTaken}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`font-black ${
                        l.averageScore >= 70 ? "text-emerald-500" : "text-amber-500"
                      }`}
                    >
                      {l.averageScore}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
