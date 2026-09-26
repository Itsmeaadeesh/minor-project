import React, { useState } from "react";
import { usePlatform } from "../context/PlatformContext.js";
import {
  BookOpen,
  Search,
  Filter,
  Clock,
  Star,
  ExternalLink,
  Tag,
  CheckCircle2
} from "lucide-react";

export const CourseCataloguePage: React.FC = () => {
  const { courses, tracks, addToast } = usePlatform();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedTrackId, setSelectedTrackId] = useState<string>("all");
  const [enrolledIds, setEnrolledIds] = useState<Set<string>>(new Set());

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.skill?.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDifficulty =
      selectedDifficulty === "all" ||
      c.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

    const matchesTrack = selectedTrackId === "all" || c.trackId === selectedTrackId;

    return matchesSearch && matchesDifficulty && matchesTrack;
  });

  const handleEnroll = (courseId: string, courseTitle: string) => {
    setEnrolledIds((prev) => new Set([...prev, courseId]));
    addToast(`Enrolled in "${courseTitle}"! Access course material anytime.`, "success");
  };

  const getDifficultyBadge = (diff: string) => {
    switch (diff?.toLowerCase()) {
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
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-6xl mx-auto">
      {/* Header & Filter Controls */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-slate-200 dark:border-gray-800 shadow-sm space-y-4">
        <div>
          <h2 className="text-lg font-black text-gray-900 dark:text-white">
            Curated Course Directory
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Explore industry-aligned courses tagged by skill ID and difficulty level to bridge targeted competencies.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search Input */}
          <div className="relative sm:col-span-1">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title or skill..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 text-xs font-medium text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Difficulty Filter */}
          <div>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 text-xs font-medium text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Difficulty Levels</option>
              <option value="foundational">Foundational</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          {/* Track Filter */}
          <div>
            <select
              value={selectedTrackId}
              onChange={(e) => setSelectedTrackId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 text-xs font-medium text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Tracks</option>
              {tracks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCourses.map((course) => {
          const isEnrolled = enrolledIds.has(course.id);

          return (
            <div
              key={course.id}
              className="p-5 rounded-3xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm flex flex-col justify-between gap-4 hover:border-indigo-400 hover:shadow-md transition-all group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  {getDifficultyBadge(course.difficulty)}
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                    {course.skill?.name || "Skill"}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {course.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                  {course.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-gray-800/80 flex items-center justify-between text-[11px] text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {course.durationHours} Hours
                  </span>
                  <span className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="h-3.5 w-3.5 fill-amber-500" />
                    {course.rating}
                  </span>
                  <span>{course.provider}</span>
                </div>
              </div>

              <button
                onClick={() => handleEnroll(course.id, course.title)}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  isEnrolled
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                }`}
              >
                {isEnrolled ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Enrolled (In Progress)</span>
                  </>
                ) : (
                  <span>Enroll in Course</span>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-3xl border border-slate-200 dark:border-gray-800">
          <p className="text-sm text-gray-400">No courses match your filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default CourseCataloguePage;
