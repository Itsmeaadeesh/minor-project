import React, { useState } from "react";
import { usePlatform } from "../context/PlatformContext.jsx";
import {
  COMPETENCIES,
  IGOT_COURSES,
} from "../data/mockData.js";
import {
  Sparkles,
  BookOpen,
  CheckCircle,
  Clock,
  Award,
  ArrowRight,
  TrendingUp,
  Shield,
  Lightbulb,
} from "lucide-react";

export default function RecommendationsPage() {
  const {
    currentUser,
    userCompetencies,
    currentTargetRole,
    enrolledCourses,
    enrollInCourse,
    setActiveTab,
  } = usePlatform();

  const [filterUrgency, setFilterUrgency] = useState("ALL");

  // Rank courses based on user's gaps
  const scoredCourses = IGOT_COURSES.map((course) => {
    let maxGap = 0;
    let gapSkillName = "";
    let userLvl = 1;
    let reqLvl = 3;

    course.competenciesTied.forEach((cId) => {
      const uL = userCompetencies[cId] || 1;
      const rL = currentTargetRole.requiredCompetencies[cId] || 3;
      const diff = rL - uL; // positive means gap exists
      if (diff > maxGap) {
        maxGap = diff;
        const comp = COMPETENCIES.find((c) => c.id === cId);
        gapSkillName = comp?.name || "Statistical Methodology";
        userLvl = uL;
        reqLvl = rL;
      }
    });

    const isEnrolled = !!enrolledCourses[course.id];
    const isCompleted = enrolledCourses[course.id]?.status === "completed";

    // AI score calculation
    const relevanceScore = maxGap > 0 ? 80 + maxGap * 8 + (course.rating * 2) : 50 + (course.rating * 5);

    // Rule-based explainability reasoning
    let reasoning = "";
    if (maxGap >= 2) {
      reasoning = `High Priority: Your current verified level in ${gapSkillName} is Level ${userLvl}, while ${currentTargetRole.title} mandates Level ${reqLvl} (Deficit: -${maxGap}). Completing this accredited course bridges this critical gap.`;
    } else if (maxGap === 1) {
      reasoning = `Recommended: You have a moderate 1-level gap in ${gapSkillName} (Level ${userLvl} vs Level ${reqLvl} required). This course directly satisfies the competency baseline.`;
    } else {
      reasoning = `Continuous Upskilling: Although you meet baseline requirements for ${gapSkillName}, this course provides advanced operational mastery and earns 100+ Karmayogi credits.`;
    }

    return {
      ...course,
      maxGap,
      gapSkillName,
      userLvl,
      reqLvl,
      relevanceScore: Math.round(relevanceScore),
      reasoning,
      isEnrolled,
      isCompleted,
    };
  });

  // Sort by relevance score descending
  scoredCourses.sort((a, b) => b.relevanceScore - a.relevanceScore);

  const filtered = scoredCourses.filter((c) => {
    if (filterUrgency === "CRITICAL") return c.maxGap >= 2;
    if (filterUrgency === "MODERATE") return c.maxGap === 1;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-amber-700 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Deterministic AI Recommendation Engine</span>
          </div>
          <h2 className="text-xl font-bold text-[#0B3D91] font-serif-gov mt-0.5">
            Personalized iGOT Learning Recommendations
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Ranked and sequenced curriculum to bridge gaps identified for <strong>{currentTargetRole.title}</strong>
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-gray-500 font-medium">Filter Gap:</span>
          <button
            onClick={() => setFilterUrgency("ALL")}
            className={`px-2.5 py-1 rounded font-semibold transition-colors ${
              filterUrgency === "ALL" ? "bg-[#0B3D91] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All ({scoredCourses.length})
          </button>
          <button
            onClick={() => setFilterUrgency("CRITICAL")}
            className={`px-2.5 py-1 rounded font-semibold transition-colors ${
              filterUrgency === "CRITICAL" ? "bg-red-700 text-white" : "bg-red-50 text-red-700 hover:bg-red-100"
            }`}
          >
            Critical Gaps
          </button>
          <button
            onClick={() => setFilterUrgency("MODERATE")}
            className={`px-2.5 py-1 rounded font-semibold transition-colors ${
              filterUrgency === "MODERATE" ? "bg-amber-600 text-white" : "bg-amber-50 text-amber-700 hover:bg-amber-100"
            }`}
          >
            Moderate Gaps
          </button>
        </div>
      </div>

      {/* Course Recommendation Cards */}
      <div className="space-y-4">
        {filtered.map((course, index) => (
          <div
            key={course.id}
            className={`bg-white rounded-lg border transition-all hover:shadow-md p-5 ${
              course.maxGap >= 2
                ? "border-l-4 border-l-red-500 border-gray-200"
                : course.maxGap === 1
                ? "border-l-4 border-l-amber-500 border-gray-200"
                : "border-l-4 border-l-blue-500 border-gray-200"
            }`}
          >
            <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
              {/* Left Details */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="text-xs font-mono font-bold bg-blue-50 text-blue-900 px-1.5 py-0.5 rounded border border-blue-200">
                    {course.code}
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-700 font-semibold px-2 py-0.5 rounded">
                    {course.category}
                  </span>
                  <span className="text-xs bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-200">
                    Rank #{index + 1}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{course.durationHours} Hours</span>
                  </span>
                </div>

                <h3 className="text-base font-bold text-gray-950 font-serif-gov">
                  {course.title}
                </h3>
                <div className="text-xs text-gray-600 mt-0.5 font-medium">
                  Provided by: <strong className="text-blue-900">{course.provider}</strong> • Level: {course.level}
                </div>

                <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                  {course.description}
                </p>

                {/* Explainability Reasoning Card */}
                <div className="mt-3 bg-amber-50/70 border border-amber-200/90 rounded-lg p-3 text-xs flex items-start space-x-2.5">
                  <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-950">AI Recommendation Rationale: </span>
                    <span className="text-amber-900">{course.reasoning}</span>
                  </div>
                </div>

                {/* Curriculum Highlights */}
                <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] text-gray-600">
                  <span className="font-bold text-gray-500">Key Modules:</span>
                  {course.curriculum.slice(0, 3).map((mod, mIdx) => (
                    <span key={mIdx} className="bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                      {mod}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right CTA Box */}
              <div className="w-full lg:w-48 flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg border border-gray-200 flex-shrink-0">
                <div className="text-center mb-3">
                  <div className="text-[10px] uppercase font-bold text-gray-500">
                    AI Match Index
                  </div>
                  <div className="text-2xl font-extrabold text-[#0B3D91]">
                    {course.relevanceScore}%
                  </div>
                  <div className="text-[10px] text-amber-700 font-semibold">
                    ★ {course.rating} / 5.0 ({course.enrolledCount} enrolled)
                  </div>
                </div>

                {course.isCompleted ? (
                  <div className="w-full bg-green-100 text-green-800 text-xs font-bold py-2 rounded text-center border border-green-300 flex items-center justify-center space-x-1">
                    <CheckCircle className="w-4 h-4 text-green-700" />
                    <span>Completed</span>
                  </div>
                ) : course.isEnrolled ? (
                  <button
                    onClick={() => setActiveTab("dashboard")}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 rounded transition-colors"
                  >
                    Continue Course
                  </button>
                ) : (
                  <button
                    onClick={() => enrollInCourse(course.id)}
                    className="w-full bg-[#0B3D91] hover:bg-[#07265D] text-white text-xs font-bold py-2 rounded transition-colors shadow-sm flex items-center justify-center space-x-1"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                    <span>Enroll on iGOT</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
