import React, { useState } from "react";
import { usePlatform } from "../../context/PlatformContext.js";
import { History, Award, CheckCircle2, XCircle, Clock, X, HelpCircle, ArrowRight } from "lucide-react";
import { QuestionReviewItem } from "../../types/index.js";

export const QuizHistoryPage: React.FC = () => {
  const { quizAttempts } = usePlatform();
  const [selectedReview, setSelectedReview] = useState<{
    quizTitle: string;
    score: number;
    total: number;
    percentage: number;
    passed: boolean;
    answers: QuestionReviewItem[];
  } | null>(null);

  const handleOpenReview = (attempt: any) => {
    let parsedAnswers: QuestionReviewItem[] = [];
    try {
      parsedAnswers = typeof attempt.answers === "string" ? JSON.parse(attempt.answers) : attempt.answers || [];
    } catch {
      parsedAnswers = [];
    }

    setSelectedReview({
      quizTitle: attempt.quiz?.title || "Assessment",
      score: attempt.score,
      total: attempt.totalQuestions,
      percentage: attempt.percentage,
      passed: attempt.passed,
      answers: parsedAnswers
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-gray-800 pb-5">
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <History className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <span>Quiz & Assessment History</span>
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Review past examination scores, performance metrics, and detailed question explanations.
          </p>
        </div>
        <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold self-start sm:self-auto">
          {quizAttempts.length} Completed Attempts
        </span>
      </div>

      {quizAttempts.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 p-12 rounded-3xl border border-slate-200 dark:border-gray-800 text-center space-y-3">
          <Award className="h-8 w-8 text-gray-400 mx-auto" />
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">No Assessment History Found</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Take a baseline assessment or synthesize a quiz with the AI Quiz Studio to record your diagnostic history.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizAttempts.map((attempt) => {
            const dateObj = new Date(attempt.attemptedAt);
            const formattedDate = dateObj.toLocaleDateString();
            const formattedTime = dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

            return (
              <div
                key={attempt.id}
                className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-sm flex flex-col justify-between space-y-4 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        attempt.passed
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                          : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400 border-red-200 dark:border-red-800"
                      }`}
                    >
                      {attempt.passed ? "PASSED" : "REVIEW REQUIRED"}
                    </span>
                    <span className="text-[10px] text-gray-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formattedDate} {formattedTime}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mt-3">
                    {attempt.quiz?.title || "Skill Assessment"}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {attempt.quiz?.skill?.name || "Technical Competency"} • {attempt.quiz?.track?.name || "General Track"}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-gray-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 block">Score Achieved</span>
                    <span className="text-base font-black text-gray-900 dark:text-white">
                      {attempt.score}/{attempt.totalQuestions}{" "}
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                        ({attempt.percentage}%)
                      </span>
                    </span>
                  </div>

                  <button
                    onClick={() => handleOpenReview(attempt)}
                    className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold transition-colors"
                  >
                    Review Answers
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Answer Review Modal */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-gray-800">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  {selectedReview.quizTitle}
                </h3>
                <p className="text-xs text-gray-400">
                  Detailed question breakdown with correct answers and explanations
                </p>
              </div>
              <button
                onClick={() => setSelectedReview(null)}
                className="p-1 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-gray-850 flex items-center justify-between text-xs">
              <span className="font-semibold text-gray-600 dark:text-gray-300">Examination Outcome:</span>
              <span className="font-extrabold text-sm text-gray-900 dark:text-white">
                {selectedReview.score}/{selectedReview.total} ({selectedReview.percentage}%)
              </span>
            </div>

            {/* Questions breakdown list */}
            <div className="space-y-4">
              {selectedReview.answers.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border text-xs space-y-2.5 ${
                    item.isCorrect
                      ? "border-emerald-200 dark:border-emerald-950 bg-emerald-50/20 dark:bg-emerald-950/10"
                      : "border-red-200 dark:border-red-950 bg-red-50/20 dark:bg-red-950/10"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-gray-900 dark:text-white">
                      Q{idx + 1}: {item.question}
                    </span>
                    {item.isCorrect ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                    )}
                  </div>

                  <div className="space-y-1 font-mono text-[11px]">
                    {item.options.map((opt, optIdx) => {
                      const isCorrectAnswer = optIdx === item.correctOption;
                      const isSelected = optIdx === item.selectedOption;

                      return (
                        <div
                          key={optIdx}
                          className={`p-2 rounded-lg font-sans text-xs ${
                            isCorrectAnswer
                              ? "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-500/30"
                              : isSelected
                              ? "bg-red-500/15 text-red-800 dark:text-red-300 font-semibold border border-red-500/30 line-through"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          <span className="font-mono mr-1.5 font-bold">
                            {String.fromCharCode(65 + optIdx)}.
                          </span>
                          {opt}
                        </div>
                      );
                    })}
                  </div>

                  {item.explanation && (
                    <div className="p-3 rounded-xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 text-[11px] text-gray-600 dark:text-gray-300">
                      <span className="font-bold text-indigo-600 dark:text-indigo-400 block mb-0.5">
                        Pedagogical Rationale:
                      </span>
                      {item.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedReview(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold"
              >
                Close Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizHistoryPage;
