import React, { useState } from "react";
import { usePlatform } from "../context/PlatformContext.js";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import {
  Compass,
  Award,
  BookOpen,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Star,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  FileText
} from "lucide-react";
import { QuestionReviewItem } from "../types/index.js";

export const LearnerDashboard: React.FC = () => {
  const {
    currentUser,
    gapsData,
    pathData,
    quizAttempts,
    setActiveTab,
    startQuiz,
    quizzes
  } = usePlatform();

  const [selectedAttemptReview, setSelectedAttemptReview] = useState<{
    quizTitle: string;
    score: number;
    total: number;
    percentage: number;
    passed: boolean;
    answers: QuestionReviewItem[];
  } | null>(null);

  // Prepare Data for Radar and Bar Charts
  const chartData = (gapsData?.gaps || []).map((item) => ({
    skill: item.skillName.length > 12 ? item.skillName.slice(0, 11) + "…" : item.skillName,
    fullSkill: item.skillName,
    current: item.currentLevel,
    required: item.requiredLevel,
    gap: item.gap
  }));

  const getTagBadge = (tag: "foundational" | "intermediate" | "advanced") => {
    switch (tag) {
      case "foundational":
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            Foundational
          </span>
        );
      case "intermediate":
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            Intermediate
          </span>
        );
      case "advanced":
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            Advanced
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. KPI Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Track Readiness */}
        <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Track Readiness
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-gray-900 dark:text-white">
              {gapsData?.readinessPercentage || 0}%
            </span>
            <span className="text-xs text-gray-400">to target competency</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-gray-800 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${gapsData?.readinessPercentage || 0}%` }}
            />
          </div>
        </div>

        {/* Skills Mastered */}
        <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Skills Calibrated
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-gray-900 dark:text-white">
              {gapsData?.skillsMastered || 0}
            </span>
            <span className="text-xs text-gray-400">of {gapsData?.totalSkills || 0} skills met</span>
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-2">
            {gapsData?.unmetGaps.length === 0
              ? "All baseline track goals achieved!"
              : `${gapsData?.unmetGaps.length} skill gaps need attention`}
          </p>
        </div>

        {/* Recommended Path */}
        <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Curated Roadmap
            </span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <Compass className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-gray-900 dark:text-white">
              {pathData?.totalSteps || 0}
            </span>
            <span className="text-xs text-gray-400">linear course steps</span>
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-2">
            ~{pathData?.estimatedHours || 0} estimated study hours
          </p>
        </div>

        {/* Assessment Attempts */}
        <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Diagnostic Quizzes
            </span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-gray-900 dark:text-white">
              {quizAttempts.length}
            </span>
            <span className="text-xs text-gray-400">attempts completed</span>
          </div>
          <p className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold mt-2">
            Instant telemetry enabled
          </p>
        </div>
      </div>

      {/* 2. Visualizations Section (Recharts Radar & Bar Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-slate-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span>360° Skill Competency Radar</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  Target vs Actual
                </span>
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Current proficiency (blue) vs Track requirement (purple)
              </p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="75%">
                <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: "#64748b", fontSize: 11 }} />
                <PolarRadiusAxis domain={[0, 5]} tick={{ fill: "#94a3b8", fontSize: 10 }} />
                <Radar
                  name="Current Level"
                  dataKey="current"
                  stroke="#4f46e5"
                  fill="#4f46e5"
                  fillOpacity={0.4}
                />
                <Radar
                  name="Required Level"
                  dataKey="required"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.15}
                />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Level Comparison */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-slate-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span>Proficiency Level Calibration</span>
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Side-by-side gap breakdown (1 to 5 scale)
              </p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="skill"
                  angle={-25}
                  textAnchor="end"
                  tick={{ fill: "#64748b", fontSize: 10 }}
                />
                <YAxis domain={[0, 5]} tick={{ fill: "#64748b", fontSize: 10 }} />
                <Tooltip
                  formatter={(val: any) => [`Level ${val}`, ""]}
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    borderRadius: "12px",
                    border: "none",
                    color: "#fff",
                    fontSize: "11px"
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                <Bar dataKey="current" name="Current Level" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                <Bar dataKey="required" name="Target Level" fill="#cbd5e1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. Skill-Gap Analysis Module (Ranked Descending) */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-slate-200 dark:border-gray-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-gray-900 dark:text-white">
                Ranked Skill Gaps
              </h2>
              <span className="text-xs font-semibold text-gray-400">
                (requiredLevel - currentLevel descending)
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Prioritized by severity. Each gap is mathematically mapped to remedial foundational or intermediate courses.
            </p>
          </div>

          <button
            onClick={() => setActiveTab("assessments")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-xs font-bold text-gray-700 dark:text-gray-200 transition-colors self-start"
          >
            <span>Update Self-Ratings</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(gapsData?.gaps || []).map((gap) => (
            <div
              key={gap.skillId}
              className={`p-4 rounded-2xl border transition-all ${
                gap.gap > 0
                  ? "border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-850 hover:border-indigo-400 shadow-sm"
                  : "border-emerald-200 dark:border-emerald-950 bg-emerald-50/20 dark:bg-emerald-950/10"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                    {gap.skillName}
                  </h3>
                  <span className="text-[10px] text-gray-400 font-medium">
                    {gap.category}
                  </span>
                </div>
                {getTagBadge(gap.tag)}
              </div>

              {/* Levels breakdown */}
              <div className="mt-4 flex items-center justify-between text-xs">
                <div>
                  <span className="text-gray-400 text-[10px] block">Current</span>
                  <span className="font-extrabold text-gray-800 dark:text-gray-200">
                    Lvl {gap.currentLevel}/5
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-gray-400 text-[10px] block">Gap</span>
                  <span
                    className={`font-black ${
                      gap.gap > 0 ? "text-red-500" : "text-emerald-500"
                    }`}
                  >
                    {gap.gap > 0 ? `-${gap.gap}` : "Met ✓"}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-gray-400 text-[10px] block">Required</span>
                  <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
                    Lvl {gap.requiredLevel}/5
                  </span>
                </div>
              </div>

              {/* Gap Progress Bar */}
              <div className="w-full bg-slate-100 dark:bg-gray-800 h-2 rounded-full mt-3 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    gap.gap === 0
                      ? "bg-emerald-500"
                      : gap.tag === "foundational"
                      ? "bg-blue-500"
                      : "bg-amber-500"
                  }`}
                  style={{ width: `${(gap.currentLevel / gap.requiredLevel) * 100}%` }}
                />
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-gray-800/80 flex items-center justify-between text-[11px]">
                <span className="text-gray-400 capitalize">Source: {gap.source}</span>
                <button
                  onClick={() => {
                    // Find a quiz for this skill or switch to assessment tab
                    const matchingQuiz = quizzes.find((q) => q.skillId === gap.skillId);
                    if (matchingQuiz) {
                      startQuiz(matchingQuiz.id);
                    } else {
                      setActiveTab("assessments");
                    }
                  }}
                  className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <span>Test Skill</span>
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Course Recommendation Linear Path */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-slate-200 dark:border-gray-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-gray-900 dark:text-white">
                Curated Linear Learning Path
              </h2>
              <span className="text-xs font-semibold text-gray-400">
                (Foundational-First Sequencing)
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Constructed specifically from your diagnostic gaps. Step 1 bridges foundational gaps before advancing to intermediate and high-level concepts.
            </p>
          </div>

          <button
            onClick={() => setActiveTab("courses")}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 self-start"
          >
            <span>Explore Full Catalog</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </button>
        </div>

        {pathData && pathData.path.length > 0 ? (
          <div className="space-y-3">
            {pathData.path.map((course, idx) => (
              <div
                key={course.id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-850/50 hover:bg-white dark:hover:bg-gray-800 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                <div className="flex items-start gap-4">
                  {/* Step Badge */}
                  <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center shrink-0 text-sm shadow-md shadow-indigo-600/20">
                    {course.stepNumber}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {course.title}
                      </h3>
                      {getTagBadge(course.difficulty)}
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-200/60 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                        {course.skillName}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                      {course.description}
                    </p>

                    <div className="flex items-center gap-4 mt-2 text-[11px] text-gray-400">
                      <span>Provider: {course.provider}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {course.durationHours} hrs
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-amber-500 font-semibold">
                        <Star className="h-3 w-3 fill-amber-500" />
                        {course.rating}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    onClick={() => setActiveTab("courses")}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all"
                  >
                    Start Course
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No active learning gaps detected! Take an AI quiz to challenge your knowledge or explore elective tracks.
            </p>
          </div>
        )}
      </div>

      {/* 5. Quiz History Table */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-slate-200 dark:border-gray-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-extrabold text-gray-900 dark:text-white">
              Assessment Attempt History
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Review completed diagnostic assessments, score records, and pedagogy answers.
            </p>
          </div>
        </div>

        {quizAttempts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 dark:border-gray-800 text-gray-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Quiz Title</th>
                  <th className="py-3 px-4">Skill</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                {quizAttempts.map((att) => {
                  let parsedAnswers: QuestionReviewItem[] = [];
                  try {
                    parsedAnswers = JSON.parse(att.answersJson);
                  } catch (e) {
                    parsedAnswers = [];
                  }

                  return (
                    <tr key={att.id} className="hover:bg-slate-50/60 dark:hover:bg-gray-800/40">
                      <td className="py-3.5 px-4 text-gray-500 dark:text-gray-400">
                        {new Date(att.timestamp).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-gray-900 dark:text-gray-100">
                        {att.quiz?.title || "Assessment"}
                      </td>
                      <td className="py-3.5 px-4 text-gray-600 dark:text-gray-300">
                        {att.quiz?.skill?.name || "General"}
                      </td>
                      <td className="py-3.5 px-4 font-semibold">
                        {att.score}/{att.totalQuestions} ({att.percentage}%)
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            att.passed
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                              : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                          }`}
                        >
                          {att.passed ? "PASSED" : "REVISE"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedAttemptReview({
                              quizTitle: att.quiz?.title || "Quiz",
                              score: att.score,
                              total: att.totalQuestions,
                              percentage: att.percentage,
                              passed: att.passed,
                              answers: parsedAnswers
                            });
                          }}
                          className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          <span>Review Answers</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-xs text-gray-400">
              No assessments attempted yet. Start with a baseline quiz in the Assessment Engine!
            </p>
          </div>
        )}
      </div>

      {/* Review Modal for Past Quiz Attempt */}
      {selectedAttemptReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 max-w-2xl w-full rounded-3xl p-6 max-h-[85vh] overflow-y-auto border border-slate-200 dark:border-gray-800 shadow-2xl space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white">
                  {selectedAttemptReview.quizTitle}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                    Result: {selectedAttemptReview.score}/{selectedAttemptReview.total} (
                    {selectedAttemptReview.percentage}%)
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      selectedAttemptReview.passed
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedAttemptReview.passed ? "PASSED" : "FAILED"}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedAttemptReview(null)}
                className="p-1 rounded-lg text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-800 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Questions breakdown */}
            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-gray-800">
              {selectedAttemptReview.answers.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border text-xs ${
                    item.isCorrect
                      ? "border-emerald-200 dark:border-emerald-950 bg-emerald-50/20"
                      : "border-red-200 dark:border-red-950 bg-red-50/20"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-900 dark:text-white">
                      Q{idx + 1}: {item.question}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                        item.isCorrect
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.isCorrect ? "CORRECT ✓" : "INCORRECT ✗"}
                    </span>
                  </div>

                  <div className="space-y-1 my-2">
                    {item.options.map((opt, optIdx) => {
                      const isUserChoice = item.selectedOption === optIdx;
                      const isCorrectChoice = item.correctOption === optIdx;

                      let rowStyle = "text-gray-600 dark:text-gray-400";
                      if (isCorrectChoice) rowStyle = "text-emerald-600 font-bold";
                      if (isUserChoice && !item.isCorrect) rowStyle = "text-red-500 line-through";

                      return (
                        <div key={optIdx} className={`flex items-center gap-2 ${rowStyle}`}>
                          <span className="w-5 font-bold">({String.fromCharCode(65 + optIdx)})</span>
                          <span>{opt}</span>
                          {isCorrectChoice && <span className="text-[10px]"> (Correct Answer)</span>}
                          {isUserChoice && !isCorrectChoice && (
                            <span className="text-[10px]"> (Your Selection)</span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {item.explanation && (
                    <div className="mt-2.5 p-2.5 rounded-xl bg-slate-100 dark:bg-gray-800 text-[11px] text-gray-600 dark:text-gray-300">
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">
                        Explanation:{" "}
                      </span>
                      {item.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedAttemptReview(null)}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 text-xs font-bold text-gray-700 dark:text-gray-200 transition-colors"
            >
              Close Review
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearnerDashboard;
