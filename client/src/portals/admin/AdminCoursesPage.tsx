import React, { useState, useEffect } from "react";
import { api } from "../../services/api.js";
import { Course } from "../../types/index.js";
import { BookOpen, Link as LinkIcon, Star, Clock, GitCommit } from "lucide-react";

export const AdminCoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    api.getCourses()
      .then(setCourses)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getDifficultyBadge = (level: string) => {
    switch (level?.toLowerCase()) {
      case "foundational":
        return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
      case "intermediate":
        return "bg-indigo-500/15 text-indigo-300 border-indigo-500/30";
      case "advanced":
        return "bg-amber-500/15 text-amber-300 border-amber-500/30";
      default:
        return "bg-slate-700/40 text-slate-300 border-slate-600/40";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-emerald-400" />
            <span>Course Catalogue & Prerequisite Graph</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Curated modular courses mapped to target skills with ordered prerequisite course chains.
          </p>
        </div>
        <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-bold self-start sm:self-auto">
          {courses.length} Courses Catalogued
        </span>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Course Title & Description</th>
                <th className="py-3.5 px-4">Tagged Skill</th>
                <th className="py-3.5 px-4">Difficulty</th>
                <th className="py-3.5 px-4">Prerequisite Chain</th>
                <th className="py-3.5 px-4">Duration</th>
                <th className="py-3.5 px-4">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-400 font-sans">
                    <div className="inline-block h-6 w-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-2" />
                    <p className="text-xs">Loading course catalogue...</p>
                  </td>
                </tr>
              ) : courses.map((course) => (
                <tr key={course.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 max-w-sm">
                    <div className="font-sans font-bold text-slate-200">{course.title}</div>
                    <div className="text-[11px] text-slate-400 font-sans line-clamp-1 mt-0.5">
                      {course.description}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-sans text-xs text-slate-300">
                    {course.taggedSkill?.name || "General Skill"}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border ${getDifficultyBadge(course.difficultyLevel)}`}>
                      {course.difficultyLevel}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-sans text-xs">
                    {course.prerequisiteCourse ? (
                      <div className="flex items-center gap-1.5 text-amber-300 text-[11px]">
                        <GitCommit className="h-3.5 w-3.5 text-amber-400 flex-shrink-0" />
                        <span className="truncate max-w-[200px]" title={course.prerequisiteCourse.title}>
                          Requires: {course.prerequisiteCourse.title}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-mono">None (Foundational)</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 text-xs font-sans">
                    {course.durationHours} hrs
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="h-3 w-3 fill-amber-400" />
                      <span>{course.rating}</span>
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

export default AdminCoursesPage;
