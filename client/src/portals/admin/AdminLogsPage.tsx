import React, { useState, useEffect, useCallback } from "react";
import { api } from "../../services/api.js";
import { ActivityLog, AdminLearnerItem } from "../../types/index.js";
import {
  FileText,
  Filter,
  RefreshCw,
  Search,
  Calendar,
  User as UserIcon,
  Activity,
  Code,
  CheckCircle2,
  AlertCircle,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export const AdminLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [learners, setLearners] = useState<AdminLearnerItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Filters
  const [selectedLearner, setSelectedLearner] = useState<string>("");
  const [selectedAction, setSelectedAction] = useState<string>("ALL");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [searchFilter, setSearchFilter] = useState<string>("");

  // Inspect Modal
  const [inspectedLog, setInspectedLog] = useState<ActivityLog | null>(null);

  const actionTypes = [
    { value: "ALL", label: "All Event Types" },
    { value: "AUTH_LOGIN", label: "User Login (AUTH_LOGIN)" },
    { value: "AUTH_REGISTER", label: "Registration (AUTH_REGISTER)" },
    { value: "TRACK_SELECTED", label: "Track Selection (TRACK_SELECTED)" },
    { value: "ASSESSMENT_SUBMITTED", label: "Assessment Submitted" },
    { value: "SKILL_SELF_RATED", label: "Skill Self-Rated" },
    { value: "SCORE_CHANGED", label: "Score Level Changed" },
    { value: "UPLOAD_PROCESSED", label: "Document Uploaded (UPLOAD_PROCESSED)" },
    { value: "QUIZ_GENERATED", label: "Quiz Synthesized (QUIZ_GENERATED)" },
    { value: "QUIZ_ATTEMPTED", label: "Quiz Attempted (QUIZ_ATTEMPTED)" },
    { value: "RECOMMENDATION_RECALCULATED", label: "Recommendation Recalculated" }
  ];

  // Fetch Learners list for dropdown
  useEffect(() => {
    api.getAdminLearners().then(setLearners).catch(console.error);
  }, []);

  // Fetch Activity Logs
  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getAdminLogs({
        actorId: selectedLearner || undefined,
        actionType: selectedAction,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        page,
        limit: 25
      });
      setLogs(data.logs);
      setTotal(data.total);
      setTotalPages(data.totalPages || 1);
    } catch (err: any) {
      console.error("Failed to load logs:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedLearner, selectedAction, startDate, endDate, page]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleResetFilters = () => {
    setSelectedLearner("");
    setSelectedAction("ALL");
    setStartDate("");
    setEndDate("");
    setSearchFilter("");
    setPage(1);
  };

  const getActionBadgeClass = (type: string) => {
    switch (type) {
      case "QUIZ_GENERATED":
      case "UPLOAD_PROCESSED":
        return "bg-purple-500/15 text-purple-300 border-purple-500/30";
      case "QUIZ_ATTEMPTED":
      case "SCORE_CHANGED":
        return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
      case "RECOMMENDATION_RECALCULATED":
        return "bg-amber-500/15 text-amber-300 border-amber-500/30";
      case "AUTH_LOGIN":
      case "AUTH_REGISTER":
      case "TRACK_SELECTED":
        return "bg-blue-500/15 text-blue-300 border-blue-500/30";
      default:
        return "bg-slate-700/40 text-slate-300 border-slate-600/40";
    }
  };

  // Filter logs locally by search term
  const displayedLogs = logs.filter((log) => {
    if (!searchFilter.trim()) return true;
    const term = searchFilter.toLowerCase();
    return (
      log.actorName?.toLowerCase().includes(term) ||
      log.actorEmail?.toLowerCase().includes(term) ||
      log.actionType?.toLowerCase().includes(term) ||
      JSON.stringify(log.metadata).toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <Activity className="h-5 w-5 text-amber-400" />
              <span>System Activity Logs</span>
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold border border-slate-700">
              {total} Total Logged Events
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time audit trail of quiz attempts, material uploads, recommendation recalculations, and auth events.
          </p>
        </div>

        <button
          onClick={() => fetchLogs()}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors shadow-sm self-start sm:self-auto"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-amber-400" : ""}`} />
          <span>Refresh Feed</span>
        </button>
      </div>

      {/* Filter Control Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
          <Filter className="h-3.5 w-3.5 text-amber-400" />
          <span>Multi-Dimensional Filtering</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* 1. Filter by Learner */}
          <div>
            <label className="text-[10px] font-semibold text-slate-400 block mb-1">LEARNER</label>
            <select
              value={selectedLearner}
              onChange={(e) => {
                setSelectedLearner(e.target.value);
                setPage(1);
              }}
              className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="">All Actors / Learners</option>
              {learners.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name} ({l.targetTrack || "Learner"})
                </option>
              ))}
            </select>
          </div>

          {/* 2. Filter by Event Type */}
          <div>
            <label className="text-[10px] font-semibold text-slate-400 block mb-1">EVENT TYPE</label>
            <select
              value={selectedAction}
              onChange={(e) => {
                setSelectedAction(e.target.value);
                setPage(1);
              }}
              className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
            >
              {actionTypes.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Start Date */}
          <div>
            <label className="text-[10px] font-semibold text-slate-400 block mb-1">START DATE</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPage(1);
              }}
              className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* 4. End Date */}
          <div>
            <label className="text-[10px] font-semibold text-slate-400 block mb-1">END DATE</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPage(1);
              }}
              className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* 5. Free Text / Metadata Search */}
          <div>
            <label className="text-[10px] font-semibold text-slate-400 block mb-1">SEARCH PAYLOAD</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search logs..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              <Search className="h-3.5 w-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            </div>
          </div>
        </div>

        {(selectedLearner || selectedAction !== "ALL" || startDate || endDate || searchFilter) && (
          <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
            <span className="text-[11px] text-amber-400 font-medium">Filters active</span>
            <button
              onClick={handleResetFilters}
              className="text-[11px] text-slate-400 hover:text-white underline font-medium"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* Dense Logs Data Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Actor</th>
                <th className="py-3.5 px-4">Action Type</th>
                <th className="py-3.5 px-4">Summary & Details</th>
                <th className="py-3.5 px-4 text-right">Raw Metadata</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-slate-400 font-sans">
                    <div className="inline-block h-6 w-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-2" />
                    <p className="text-xs">Querying activity logs...</p>
                  </td>
                </tr>
              ) : displayedLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-slate-400 font-sans">
                    <AlertCircle className="h-8 w-8 text-slate-500 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-300">No activity logs found</p>
                    <p className="text-xs text-slate-500 mt-1">Try broadening your filter criteria or date range.</p>
                  </td>
                </tr>
              ) : (
                displayedLogs.map((log) => {
                  const dateObj = new Date(log.timestamp);
                  const timeFormatted = dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
                  const dateFormatted = dateObj.toLocaleDateString();

                  return (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                      {/* 1. Timestamp */}
                      <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                        <div className="font-bold text-slate-200">{timeFormatted}</div>
                        <div className="text-[10px] text-slate-500">{dateFormatted}</div>
                      </td>

                      {/* 2. Actor */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-sans font-bold text-slate-200">{log.actorName}</div>
                        <div className="text-[10px] text-slate-400">{log.actorEmail}</div>
                        {log.actorTrack && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                            {log.actorTrack}
                          </span>
                        )}
                      </td>

                      {/* 3. Event Type Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border ${getActionBadgeClass(
                            log.actionType
                          )}`}
                        >
                          {log.actionType}
                        </span>
                      </td>

                      {/* 4. Action Summary */}
                      <td className="py-3.5 px-4 font-sans text-xs text-slate-300 max-w-md">
                        {log.actionType === "QUIZ_ATTEMPTED" && (
                          <span>
                            Attempted <strong className="text-white">{log.metadata?.quizTitle || "Quiz"}</strong>:{" "}
                            Score <span className="text-emerald-400 font-bold">{log.metadata?.score}/{log.metadata?.totalQuestions}</span> (
                            {log.metadata?.percentage}%) - {log.metadata?.passed ? "Passed" : "Needs Review"}
                          </span>
                        )}
                        {log.actionType === "QUIZ_GENERATED" && (
                          <span>
                            Synthesized <strong className="text-purple-300">{log.metadata?.questionsCount} MCQs</strong> from{" "}
                            <span className="text-white">{log.metadata?.sourceFileName || "Uploaded File"}</span> via{" "}
                            <span className="text-purple-400 font-mono text-[10px]">{log.metadata?.aiProvider}</span>
                          </span>
                        )}
                        {log.actionType === "UPLOAD_PROCESSED" && (
                          <span>
                            Uploaded <strong className="text-white">{log.metadata?.fileName}</strong> (
                            {log.metadata?.fileType}) • {log.metadata?.extractedLength} chars extracted
                            {log.metadata?.ocrUsed && <span className="text-amber-400 text-[10px]"> (OCR Engine)</span>}
                          </span>
                        )}
                        {log.actionType === "SCORE_CHANGED" && (
                          <span>
                            Skill level for <strong className="text-white">{log.metadata?.skillName}</strong> updated to{" "}
                            <span className="text-amber-300 font-bold">L{log.metadata?.newLevel}</span> ({log.metadata?.trigger})
                          </span>
                        )}
                        {log.actionType === "RECOMMENDATION_RECALCULATED" && (
                          <span>
                            Recalculated learning path for <strong className="text-white">{log.metadata?.trackName}</strong> (
                            {log.metadata?.stepsCount} sequential steps)
                          </span>
                        )}
                        {log.actionType === "AUTH_LOGIN" && (
                          <span>Authenticated into portal as {log.metadata?.role || "Learner"}</span>
                        )}
                        {log.actionType === "AUTH_REGISTER" && (
                          <span>New account enrolled: {log.metadata?.email}</span>
                        )}
                        {log.actionType === "TRACK_SELECTED" && (
                          <span>Selected career track: <strong className="text-white">{log.metadata?.trackName}</strong></span>
                        )}
                        {log.actionType === "SKILL_SELF_RATED" && (
                          <span>Updated self-assessment ratings for {log.metadata?.skillsCount} competencies</span>
                        )}
                      </td>

                      {/* 5. Raw Metadata Button */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => setInspectedLog(log)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-mono transition-colors border border-slate-700/60"
                        >
                          <Code className="h-3 w-3 text-amber-400" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-sans">
          <span>
            Page <strong className="text-white">{page}</strong> of <strong className="text-white">{totalPages}</strong> (
            {total} items)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* JSON Metadata Inspector Modal */}
      {inspectedLog && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Code className="h-5 w-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Event Telemetry Payload</h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 font-mono text-amber-300">
                  {inspectedLog.actionType}
                </span>
              </div>
              <button
                onClick={() => setInspectedLog(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="my-4 space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2 text-slate-400">
                <div>
                  <span className="font-semibold text-slate-300">Log ID:</span>{" "}
                  <span className="font-mono text-[11px] text-slate-400">{inspectedLog.id}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-300">Actor:</span> {inspectedLog.actorName} (
                  {inspectedLog.actorRole})
                </div>
                <div>
                  <span className="font-semibold text-slate-300">Timestamp:</span>{" "}
                  {new Date(inspectedLog.timestamp).toISOString()}
                </div>
                <div>
                  <span className="font-semibold text-slate-300">Target Track:</span>{" "}
                  {inspectedLog.actorTrack || "None"}
                </div>
              </div>

              <div className="mt-4">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Metadata JSON Payload
                </label>
                <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-[11px] overflow-x-auto max-h-72">
                  {JSON.stringify(inspectedLog.metadata, null, 2)}
                </pre>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setInspectedLog(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLogsPage;
