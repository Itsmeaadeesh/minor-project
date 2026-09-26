import React from "react";
import { Link } from "react-router-dom";
import { usePlatform } from "../../context/PlatformContext.js";
import {
  Route,
  CheckCircle2,
  Clock,
  Star,
  ExternalLink,
  GitCommit,
  Sparkles,
  ArrowRight,
  BookOpen
} from "lucide-react";

export const LearningPathPage: React.FC = () => {
  const { pathData, gapsData, startQuiz, quizzes } = usePlatform();

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case "foundational":
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            Foundational
          </span>
        );
      case "intermediate":
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            Intermediate
          </span>
        );
      case "advanced":
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            Advanced
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-gray-800 pb-5">
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <Route className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <span>Curated Linear Learning Roadmap</span>
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Ordered from foundational to advanced using prerequisite course chains. Completing courses unlocks downstream skills.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800">
            {pathData?.totalSteps || 0} Sequential Steps • ~{pathData?.estimatedHours || 0} Hours
          </span>
        </div>
      </div>

      {/* Target Track context banner */}
      {gapsData?.track && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent border border-indigo-200 dark:border-indigo-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
              TARGET CAREER TRACK
            </span>
            <h2 className="text-base font-bold text-gray-900 dark:text-white mt-0.5">
              {gapsData.track.name}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {gapsData.track.description}
            </p>
          </div>

          <div className="text-right flex-shrink-0">
            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
              {gapsData.readinessPercentage}%
            </div>
            <span className="text-[10px] text-gray-400 font-medium">Track Readiness</span>
          </div>
        </div>
      )}

      {/* Roadmap Timeline */}
      {!pathData || pathData.path.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 p-12 rounded-3xl border border-slate-200 dark:border-gray-800 text-center space-y-3">
          <BookOpen className="h-8 w-8 text-gray-400 mx-auto" />
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">No Learning Path Generated Yet</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Take a baseline assessment or update your skill self-ratings to trigger automatic path synthesis.
          </p>
          <Link
            to="/assessments"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-600/20"
          >
            <span>Go to Skill Assessments</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4 relative before:absolute before:inset-0 before:left-7 before:w-0.5 before:bg-slate-200 dark:before:bg-gray-800 before:hidden md:before:block">
          {pathData.path.map((course, idx) => {
            const matchingQuiz = quizzes.find((q) => q.skillId === course.taggedSkillId);

            return (
              <div
                key={course.id}
                className="relative bg-white dark:bg-gray-900 p-5 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                <div className="flex items-start gap-4">
                  {/* Step circle */}
                  <div className="h-10 w-10 rounded-2xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md shadow-indigo-600/20 z-10">
                    {course.stepNumber}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {course.title}
                      </h3>
                      {getDifficultyBadge(course.difficultyLevel)}
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                        {course.skillName}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                      {course.description}
                    </p>

                    {/* Prerequisite Indicator */}
                    {course.prerequisiteCourseTitle && (
                      <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 text-[11px] font-medium pt-0.5">
                        <GitCommit className="h-3.5 w-3.5 flex-shrink-0" />
                        <span>Prerequisite Completed: {course.prerequisiteCourseTitle}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-3 text-[11px] text-gray-400 pt-1">
                      <span>Provider: <strong className="text-gray-600 dark:text-gray-300">{course.provider}</strong></span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {course.durationHours} hrs
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="h-3 w-3 fill-amber-500" />
                        {course.rating}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action button */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  {course.sourceLink && (
                    <a
                      href={course.sourceLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-200 transition-colors flex items-center gap-1"
                    >
                      <span>Study Resource</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}

                  {matchingQuiz && (
                    <button
                      onClick={() => startQuiz(matchingQuiz.id)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-sm shadow-indigo-600/20"
                    >
                      <Sparkles className="h-3 w-3" />
                      <span>Take Diagnostic</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LearningPathPage;
