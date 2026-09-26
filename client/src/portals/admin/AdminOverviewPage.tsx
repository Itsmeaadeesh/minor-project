import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api.js";
import { AdminAnalytics } from "../../types/index.js";
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
  Users,
  Compass,
  Sparkles,
  Award,
  TrendingUp,
  Activity,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  AlertTriangle
} from "lucide-react";

export const AdminOverviewPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAdminAnalytics();
      setAnalytics(data);
    } catch (err: any) {
      setError(err.message || "Failed to load admin analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Format gaps chart data
  const gapsChartData = (analytics?.commonGaps || []).map((g) => ({
    skill: g.skillName.length > 14 ? g.skillName.slice(0, 13) + "…" : g.skillName,
    fullSkill: g.skillName,
    averageGap: g.averageGap,
    studentsAffected: g.learnersCount
  }));

  // Format track chart data
  const trackChartData = (analytics?.trackAverages || []).map((t) => ({
    track: t.trackName.length > 16 ? t.trackName.slice(0, 15) + "…" : t.trackName,
    fullTrack: t.trackName,
    averageScore: t.averageScore,
    attempts: t.attemptsCount
  }));

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3">
        <div className="h-9 w-9 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-slate-400 font-mono">Aggregating platform telemetry & cohort models...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-2xl bg-red-950/40 border border-red-800 text-red-300 max-w-xl mx-auto my-12 text-center space-y-3">
        <AlertTriangle className="h-8 w-8 text-red-400 mx-auto" />
        <h3 className="font-bold text-sm">Failed to Load Institutional Analytics</h3>
        <p className="text-xs text-red-300/80">{error}</p>
        <button
          onClick={loadData}
          className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors inline-block"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-amber-400" />
            <span>Institutional Overview & Cohort Intelligence</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Aggregate skill deficiencies, track benchmarks, and real-time learning path recalculation metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors shadow-sm"
          >
            <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
            <span>Sync Stats</span>
          </button>
          <Link
            to="/admin/logs"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors shadow-sm shadow-amber-500/20"
          >
            <Activity className="h-3.5 w-3.5" />
            <span>Live Audit Logs</span>
          </Link>
        </div>
      </div>

      {/* 2. Primary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Active Learners
          </span>
          <div className="mt-2 text-2xl font-black text-white flex items-center justify-between">
            <span>{analytics?.metrics.totalLearners || 0}</span>
            <Users className="h-4 w-4 text-indigo-400" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Career Tracks
          </span>
          <div className="mt-2 text-2xl font-black text-white flex items-center justify-between">
            <span>{analytics?.metrics.totalTracks || 0}</span>
            <Compass className="h-4 w-4 text-emerald-400" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Quizzes Deployed
          </span>
          <div className="mt-2 text-2xl font-black text-white flex items-center justify-between">
            <span>{analytics?.metrics.totalQuizzes || 0}</span>
            <Sparkles className="h-4 w-4 text-purple-400" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Assessments Taken
          </span>
          <div className="mt-2 text-2xl font-black text-white flex items-center justify-between">
            <span>{analytics?.metrics.totalAttempts || 0}</span>
            <Award className="h-4 w-4 text-amber-400" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Cohort Avg Score
          </span>
          <div className="mt-2 text-2xl font-black text-white flex items-center justify-between">
            <span>{analytics?.metrics.averagePlatformScore || 0}%</span>
            <TrendingUp className="h-4 w-4 text-teal-400" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            System Events
          </span>
          <div className="mt-2 text-2xl font-black text-white flex items-center justify-between">
            <span>{analytics?.metrics.totalLogs || 0}</span>
            <Activity className="h-4 w-4 text-rose-400" />
          </div>
        </div>
      </div>

      {/* 3. Recharts Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Common Skill Gaps Chart */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Cohort Skill Gap Severity Distribution</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Average deficit levels (required vs current proficiency) across student cohort
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gapsChartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  dataKey="skill"
                  angle={-20}
                  textAnchor="end"
                  tick={{ fill: "#94a3b8", fontSize: 10 }}
                />
                <YAxis domain={[0, 4]} tick={{ fill: "#94a3b8", fontSize: 10 }} />
                <Tooltip
                  formatter={(val: any, name: any) => [
                    name === "Average Deficit" ? `-${val} levels` : `${val} students`,
                    name
                  ]}
                  contentStyle={{
                    backgroundColor: "#020617",
                    borderColor: "#334155",
                    borderRadius: "12px",
                    color: "#f8fafc",
                    fontSize: "11px"
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Bar
                  dataKey="averageGap"
                  name="Average Deficit"
                  fill="#f43f5e"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="studentsAffected"
                  name="Learners Impacted"
                  fill="#818cf8"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Diagnostic Averages by Track Chart */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Benchmark Diagnostic Scores by Career Track</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Mean examination percentage attained per track assessment
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trackChartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  dataKey="track"
                  angle={-15}
                  textAnchor="end"
                  tick={{ fill: "#94a3b8", fontSize: 10 }}
                />
                <YAxis domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 10 }} />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, "Average Diagnostic Score"]}
                  contentStyle={{
                    backgroundColor: "#020617",
                    borderColor: "#334155",
                    borderRadius: "12px",
                    color: "#f8fafc",
                    fontSize: "11px"
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Bar
                  dataKey="averageScore"
                  name="Average Score (%)"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. Recent System Events Activity Stream Preview */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="h-4 w-4 text-amber-400" />
              <span>Real-Time Audit Trail Preview</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Latest system transactions automatically captured across assessments, uploads, and AI generations.
            </p>
          </div>
          <Link
            to="/admin/logs"
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold inline-flex items-center gap-1"
          >
            <span>View All Logs</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="space-y-2">
          {(analytics?.recentLogs || []).map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-bold">
                  {log.actionType}
                </span>
                <span className="font-semibold text-slate-200">{log.actorName || "System"}</span>
                <span className="text-slate-400 text-[11px]">
                  {log.actionType === "QUIZ_ATTEMPTED" && `Attempted quiz assessment`}
                  {log.actionType === "QUIZ_GENERATED" && `Synthesized AI MCQs from upload`}
                  {log.actionType === "UPLOAD_PROCESSED" && `Uploaded study material`}
                  {log.actionType === "SCORE_CHANGED" && `Skill score updated`}
                  {log.actionType === "AUTH_LOGIN" && `Logged into platform`}
                  {log.actionType === "RECOMMENDATION_RECALCULATED" && `Learning path recalculation executed`}
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 whitespace-nowrap">
                {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminOverviewPage;
