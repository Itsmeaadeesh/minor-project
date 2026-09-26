import React, { useState } from "react";
import { usePlatform } from "../context/PlatformContext.js";
import { api } from "../services/api.js";
import {
  Sparkles,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  PlayCircle,
  Clock,
  Layers,
  FileSearch
} from "lucide-react";
import { Quiz } from "../types/index.js";

export const AIQuizStudioPage: React.FC = () => {
  const { tracks, startQuiz, addToast, refreshDashboardData } = usePlatform();

  const [file, setFile] = useState<File | null>(null);
  const [selectedTrackId, setSelectedTrackId] = useState<string>("");
  const [selectedSkillId, setSelectedSkillId] = useState<string>("");
  const [quizTitle, setQuizTitle] = useState<string>("");
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusStep, setStatusStep] = useState<string>("");
  const [generatedQuiz, setGeneratedQuiz] = useState<Quiz | null>(null);
  const [isScannedPdf, setIsScannedPdf] = useState<boolean>(false);

  // Available skills based on selected track
  const activeTrack = tracks.find((t) => t.id === selectedTrackId) || tracks[0];
  const availableSkills = activeTrack?.requirements?.map((r) => r.skill) || [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      if (!quizTitle) {
        setQuizTitle(selected.name.replace(/\.[^/.]+$/, "") + " Quiz");
      }
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      addToast("Please select a PDF, DOCX, or PPTX file to upload.", "warning");
      return;
    }

    setLoading(true);
    setGeneratedQuiz(null);
    setStatusStep("Uploading document to storage...");

    const formData = new FormData();
    formData.append("document", file);
    if (selectedTrackId) formData.append("trackId", selectedTrackId);
    if (selectedSkillId) formData.append("skillId", selectedSkillId);
    if (quizTitle) formData.append("title", quizTitle);
    formData.append("numQuestions", String(numQuestions));

    try {
      setTimeout(() => setStatusStep("Extracting text & running Tesseract OCR if scanned..."), 1200);
      setTimeout(() => setStatusStep("Prompting Google Gemini (gemini-1.5-flash) with structured JSON schema..."), 3000);
      setTimeout(() => setStatusStep("Validating questions with Zod schema & saving to database..."), 5000);

      const result = await api.generateQuizFromFile(formData);
      setGeneratedQuiz(result.quiz);
      setIsScannedPdf(result.isScannedPdf);
      addToast("AI Quiz synthesized and validated successfully!", "success");
      await refreshDashboardData();
    } catch (err: any) {
      console.error("AI Quiz generation failed:", err);
      addToast(err.message || "Failed to generate AI quiz.", "error");
    } finally {
      setLoading(false);
      setStatusStep("");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-5xl mx-auto">
      {/* Studio Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-extrabold uppercase tracking-wider mb-3">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>Google Gemini 1.5/2.0 Flash + Tesseract OCR</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            AI Quiz & Assessment Synthesis Studio
          </h2>
          <p className="text-xs sm:text-sm text-indigo-200 mt-2 leading-relaxed">
            Upload any syllabus, lecture note, or textbook chapter in PDF, DOCX, or PPTX format. Our backend pipeline extracts clean text, executes OCR on scanned diagrams, and leverages Google Gemini to output verified pedagogical MCQs.
          </p>
        </div>
      </div>

      {/* Upload and Generation Form */}
      <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-slate-200 dark:border-gray-800 shadow-sm">
        <form onSubmit={handleGenerate} className="space-y-6">
          {/* File Drag and Drop Zone */}
          <div>
            <label className="block text-xs font-extrabold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
              1. Upload Study Material (PDF, DOCX, PPTX, TXT)
            </label>
            <div className="relative border-2 border-dashed border-slate-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-3xl p-8 text-center bg-slate-50/50 dark:bg-gray-850/50 transition-colors">
              <input
                type="file"
                accept=".pdf,.docx,.doc,.pptx,.txt"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center pointer-events-none">
                <div className="h-14 w-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
                  <UploadCloud className="h-7 w-7" />
                </div>
                {file ? (
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                    <FileText className="h-4 w-4" />
                    <span>{file.name}</span>
                    <span className="text-xs text-gray-400 font-normal">
                      ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                    </span>
                  </div>
                ) : (
                  <>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                      Click to browse or drop your document here
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Supports scanned PDFs with automated Tesseract OCR extraction
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Configuration Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Track Selector */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                Target Track
              </label>
              <select
                value={selectedTrackId}
                onChange={(e) => {
                  setSelectedTrackId(e.target.value);
                  setSelectedSkillId("");
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 text-xs font-medium text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Track (Optional)</option>
                {tracks.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Skill Selector */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                Target Skill Calibration
              </label>
              <select
                value={selectedSkillId}
                onChange={(e) => setSelectedSkillId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 text-xs font-medium text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Skill</option>
                {availableSkills.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Question Count */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                Questions to Synthesize
              </label>
              <select
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 text-xs font-medium text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value={3}>3 Questions (Express)</option>
                <option value={5}>5 Questions (Standard Diagnostic)</option>
                <option value={10}>10 Questions (Comprehensive)</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!file || loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{statusStep || "Processing with AI..."}</span>
              </div>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Synthesize Verified MCQ Assessment via Gemini</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Generated Quiz Preview Card */}
      {generatedQuiz && (
        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-emerald-200 dark:border-emerald-900/60 shadow-xl space-y-6 animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-gray-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Synthesized & Validated
                </span>
                {isScannedPdf && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center gap-1">
                    <FileSearch className="h-3 w-3" />
                    <span>Scanned PDF OCR Applied</span>
                  </span>
                )}
              </div>
              <h3 className="text-lg font-black text-gray-900 dark:text-white mt-1.5">
                {generatedQuiz.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {generatedQuiz.questions?.length || 0} questions generated from{" "}
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  {generatedQuiz.sourceFilename}
                </span>
              </p>
            </div>

            <button
              onClick={() => startQuiz(generatedQuiz.id)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all self-start sm:self-center"
            >
              <PlayCircle className="h-4 w-4" />
              <span>Attempt This Quiz Now</span>
            </button>
          </div>

          {/* Questions Preview */}
          <div className="space-y-4">
            {generatedQuiz.questions?.map((q, idx) => (
              <div
                key={q.id || idx}
                className="p-5 rounded-2xl border border-slate-200 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-850/50 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                    Q{idx + 1}: {q.question}
                  </h4>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 capitalize">
                    {q.difficulty}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {q.options.map((opt, optIdx) => (
                    <div
                      key={optIdx}
                      className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                        q.correct_option === optIdx
                          ? "border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold"
                          : "border-slate-200 dark:border-gray-800 text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      <span className="w-5 font-bold">({String.fromCharCode(65 + optIdx)})</span>
                      <span>{opt}</span>
                    </div>
                  ))}
                </div>

                {q.explanation && (
                  <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 text-[11px] text-gray-700 dark:text-gray-300">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      Pedagogical Rationale:{" "}
                    </span>
                    {q.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIQuizStudioPage;
