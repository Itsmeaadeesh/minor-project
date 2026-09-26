import React, { useState, useEffect } from "react";
import { usePlatform } from "../context/PlatformContext.js";
import { api } from "../services/api.js";
import {
  X,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  Award,
  Zap,
  RotateCcw
} from "lucide-react";
import { Quiz, QuizAttemptResult } from "../types/index.js";

export const QuizTakingModal: React.FC = () => {
  const { activeQuizId, closeQuiz, refreshDashboardData, addToast } = usePlatform();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [result, setResult] = useState<QuizAttemptResult | null>(null);

  // Load quiz on open
  useEffect(() => {
    if (!activeQuizId) {
      setQuiz(null);
      setResult(null);
      setAnswers({});
      setCurrentIndex(0);
      return;
    }

    setLoading(true);
    api
      .getQuizById(activeQuizId, "take")
      .then((data) => {
        setQuiz(data);
      })
      .catch((err) => {
        addToast(err.message || "Failed to load quiz", "error");
        closeQuiz();
      })
      .finally(() => setLoading(false));
  }, [activeQuizId, addToast, closeQuiz]);

  if (!activeQuizId) return null;

  const currentQuestion = quiz?.questions ? quiz.questions[currentIndex] : null;
  const totalQuestions = quiz?.questions?.length || 0;
  const answeredCount = Object.keys(answers).length;

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;
    setSubmitting(true);
    try {
      const res = await api.submitQuizAttempt(quiz.id, answers);
      setResult(res);
      addToast(`Assessment complete! Score: ${res.score}/${res.totalQuestions}`, "success");
      await refreshDashboardData();
    } catch (err: any) {
      addToast(err.message || "Failed to submit assessment", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 max-w-3xl w-full rounded-3xl border border-slate-200 dark:border-gray-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-gray-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 uppercase tracking-wider">
                {quiz?.skill?.name || "Skill Assessment"}
              </span>
              <span className="text-xs text-gray-400">
                {quiz?.timeLimitMinutes} Minute Limit
              </span>
            </div>
            <h3 className="text-base font-black text-gray-900 dark:text-white mt-1">
              {quiz?.title || "Assessment"}
            </h3>
          </div>

          <button
            onClick={closeQuiz}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {loading && (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <div className="h-8 w-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-semibold text-gray-400">Loading assessment questions...</p>
            </div>
          )}

          {/* Test Taking State */}
          {!loading && !result && currentQuestion && (
            <div className="space-y-6">
              {/* Progress stepper */}
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-gray-500 dark:text-gray-400">
                  Question {currentIndex + 1} of {totalQuestions}
                </span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                  {answeredCount}/{totalQuestions} Answered
                </span>
              </div>

              <div className="w-full bg-slate-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
                />
              </div>

              {/* Question Text */}
              <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-gray-850/80 border border-slate-100 dark:border-gray-800">
                <h4 className="text-base font-extrabold text-gray-900 dark:text-white leading-relaxed">
                  {currentQuestion.question}
                </h4>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((opt, optIdx) => {
                  const isSelected = answers[currentQuestion.id] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(currentQuestion.id, optIdx)}
                      className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/60 text-indigo-950 dark:text-indigo-100 font-bold ring-2 ring-indigo-500/20 shadow-sm"
                          : "border-slate-200 dark:border-gray-800 hover:border-indigo-300 dark:hover:border-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`h-6 w-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                            isSelected
                              ? "bg-indigo-600 text-white"
                              : "bg-slate-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {isSelected && <CheckCircle2 className="h-4 w-4 text-indigo-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Results State */}
          {!loading && result && (
            <div className="space-y-6 animate-in zoom-in-95 duration-200">
              {/* Score Banner */}
              <div
                className={`p-6 rounded-3xl border text-center ${
                  result.passed
                    ? "bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900"
                    : "bg-amber-50/50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900"
                }`}
              >
                <div className="inline-flex p-3 rounded-2xl bg-white dark:bg-gray-900 shadow-sm mb-3">
                  <Award
                    className={`h-8 w-8 ${
                      result.passed ? "text-emerald-500" : "text-amber-500"
                    }`}
                  />
                </div>
                <h4 className="text-2xl font-black text-gray-900 dark:text-white">
                  {result.percentage}% Score
                </h4>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1">
                  You scored {result.score} out of {result.totalQuestions} questions correctly.
                </p>

                {/* Level Up Notification */}
                {result.updatedSkillLevel && (
                  <div className="mt-4 p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 inline-flex items-center gap-2 text-xs text-indigo-900 dark:text-indigo-200 font-bold">
                    <Zap className="h-4 w-4 text-amber-500 fill-amber-500" />
                    <span>
                      {result.updatedSkillLevel.skill?.name || "Skill"} Level updated to{" "}
                      <strong>Level {result.updatedSkillLevel.level}</strong>!
                    </span>
                  </div>
                )}
              </div>

              {/* Per-Question Pedagogy Review */}
              <div className="space-y-4">
                <h5 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider">
                  Detailed Answer Key & Pedagogy Explanations
                </h5>

                {result.questionsReview.map((q, idx) => (
                  <div
                    key={q.questionId}
                    className={`p-4 rounded-2xl border text-xs space-y-2.5 ${
                      q.isCorrect
                        ? "border-emerald-200 dark:border-emerald-950 bg-emerald-50/20"
                        : "border-red-200 dark:border-red-950 bg-red-50/20"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-gray-900 dark:text-white">
                        Q{idx + 1}: {q.question}
                      </span>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded ${
                          q.isCorrect
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                        }`}
                      >
                        {q.isCorrect ? "CORRECT ✓" : "INCORRECT ✗"}
                      </span>
                    </div>

                    <div className="space-y-1">
                      {q.options.map((opt, optIdx) => {
                        const isCorrect = q.correctOption === optIdx;
                        const isChosen = q.selectedOption === optIdx;

                        return (
                          <div
                            key={optIdx}
                            className={`p-2 rounded-lg flex items-center justify-between text-xs ${
                              isCorrect
                                ? "bg-emerald-100/70 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-200 font-bold"
                                : isChosen
                                ? "bg-red-100/70 dark:bg-red-900/40 text-red-900 dark:text-red-200 font-semibold"
                                : "text-gray-500"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-bold">
                                ({String.fromCharCode(65 + optIdx)})
                              </span>
                              <span>{opt}</span>
                            </div>
                            {isCorrect && (
                              <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300">
                                Correct Option
                              </span>
                            )}
                            {isChosen && !isCorrect && (
                              <span className="text-[10px] uppercase font-bold text-red-700 dark:text-red-300">
                                Your Choice
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {q.explanation && (
                      <div className="p-3 rounded-xl bg-slate-100 dark:bg-gray-800 text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed">
                        <strong className="text-indigo-600 dark:text-indigo-400">
                          Explanation:{" "}
                        </strong>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-6 border-t border-slate-100 dark:border-gray-800 flex items-center justify-between">
          {!result ? (
            <>
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => prev - 1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-40"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-2">
                {currentIndex < totalQuestions - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentIndex((prev) => prev + 1)}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={handleSubmit}
                    className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
                  >
                    {submitting ? (
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Submit & Score Instant Telemetry</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </>
          ) : (
            <button
              onClick={closeQuiz}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all"
            >
              Done & Return to Learning Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizTakingModal;
