import React, { useState, useEffect } from "react";
import { api } from "../../services/api.js";
import { Quiz } from "../../types/index.js";
import { usePlatform } from "../../context/PlatformContext.js";
import { Sparkles, Trash2, Eye, FileText, CheckCircle2, Clock, HelpCircle } from "lucide-react";

export const AdminQuizManagementPage: React.FC = () => {
  const { startQuiz, addToast } = usePlatform();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const data = await api.listQuizzes();
      setQuizzes(data);
    } catch (err: any) {
      addToast(err.message || "Failed to load quizzes", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleDelete = async (quizId: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this quiz assessment?")) return;
    try {
      await api.deleteQuiz(quizId);
      addToast("Quiz deleted successfully.", "info");
      fetchQuizzes();
    } catch (err: any) {
      addToast(err.message || "Failed to delete quiz", "error");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-400" />
            <span>Quiz & Assessment Repository</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage baseline diagnostics and AI-synthesized quizzes derived from uploaded syllabus and research documents.
          </p>
        </div>
        <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-bold self-start sm:self-auto">
          {quizzes.length} Quizzes Deployed
        </span>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Quiz Title & Origin</th>
                <th className="py-3.5 px-4">Track</th>
                <th className="py-3.5 px-4">Competency</th>
                <th className="py-3.5 px-4">Classification</th>
                <th className="py-3.5 px-4">MCQ Count</th>
                <th className="py-3.5 px-4">Duration</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400 font-sans">
                    <div className="inline-block h-6 w-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-2" />
                    <p className="text-xs">Loading quiz assessments...</p>
                  </td>
                </tr>
              ) : quizzes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400 font-sans">
                    <p className="text-sm font-bold text-slate-300">No quizzes available in repository</p>
                  </td>
                </tr>
              ) : (
                quizzes.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-sans font-bold text-slate-200">{q.title}</div>
                      {q.sourceFilename && (
                        <div className="text-[10px] text-purple-400 flex items-center gap-1 font-sans">
                          <FileText className="h-3 w-3" />
                          <span>Derived from: {q.sourceFilename}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-sans text-xs text-slate-300">
                      {q.track?.name || "General"}
                    </td>
                    <td className="py-3.5 px-4 font-sans text-xs text-slate-300">
                      {q.skill?.name || "Cross-disciplinary"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                          q.isBaseline
                            ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/30"
                            : "bg-purple-500/15 text-purple-300 border-purple-500/30"
                        }`}
                      >
                        {q.isBaseline ? "Baseline" : "AI Generated"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-300">
                      {q._count?.questions || q.questions?.length || 0} questions
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-xs">
                      {q.timeLimitMinutes} mins
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => startQuiz(q.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/15 text-indigo-300 hover:bg-indigo-500/25 border border-indigo-500/30 text-xs font-bold font-sans transition-colors"
                      >
                        <Eye className="h-3 w-3" />
                        <span>Preview</span>
                      </button>
                      {!q.isBaseline && (
                        <button
                          onClick={() => handleDelete(q.id)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-red-500/15 text-red-300 hover:bg-red-500/25 border border-red-500/30 text-xs font-bold font-sans transition-colors"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminQuizManagementPage;
