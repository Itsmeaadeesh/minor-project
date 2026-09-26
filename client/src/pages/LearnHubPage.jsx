import React, { useState } from "react";
import { usePlatform } from "../context/PlatformContext.jsx";
import {
  IGOT_COURSES,
  TPAC_PROGRAMMES,
  COMPETENCY_CATEGORIES,
} from "../data/mockData.js";
import {
  BookOpen,
  Calendar,
  Code,
  FileCheck2,
  Sparkles,
  Search,
  CheckCircle,
  Clock,
  Users,
  Building,
  ArrowRight,
  MapPin,
} from "lucide-react";
import VirtualLabsPage from "./VirtualLabsPage.jsx";

export default function LearnHubPage() {
  const {
    hubSubTab,
    setHubSubTab,
    enrolledCourses,
    enrollInCourse,
    tpacNominations,
    nominateForTPAC,
    publishedAssessments,
    setActiveQuizModal,
    language,
    currentTargetRole,
    currentUser,
  } = usePlatform();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedLevel, setSelectedLevel] = useState("ALL");

  const filteredCourses = IGOT_COURSES.filter((course) => {
    const courseTitle = language === "HI" && course.titleHi ? course.titleHi : course.title;
    const matchesSearch =
      courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.provider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "ALL" || course.category === selectedCategory;
    const matchesLevel =
      selectedLevel === "ALL" || course.level === selectedLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  const subTabs = [
    { id: "roadmap", label: language === "HI" ? "मेरी अध्ययन कार्ययोजना" : "My Learning Roadmap", icon: Sparkles },
    { id: "catalogue", label: language === "HI" ? "iGOT पाठ्यक्रम सूची" : "iGOT Course Catalogue", icon: BookOpen },
    { id: "tpac", label: language === "HI" ? "NSSTA टीपीएसी कार्यक्रम" : "NSSTA TPAC Programmes", icon: Calendar, badge: "In-Person" },
    { id: "labs", label: language === "HI" ? "वर्चुअल सांख्यिकी लैब" : "Virtual Labs", icon: Code, badge: "Hands-on" },
    { id: "assessments", label: language === "HI" ? "अनुकूली मूल्यांकन" : "Adaptive Assessments", icon: FileCheck2 },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#0B3D91] via-[#07265D] to-indigo-950 text-white rounded-lg p-6 shadow-sm border border-blue-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-amber-300 uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              <span>iGOT Karmayogi Bharat • Learn Hub</span>
            </div>
            <h1 className="text-2xl font-bold font-serif-gov mt-1 text-white">
              {language === "HI" ? "अध्ययन केंद्र (Learn Hub)" : "Official Learning & Capability Hub"}
            </h1>
            <p className="text-xs text-blue-200 mt-1 max-w-2xl leading-relaxed">
              Explore national accredited courses, in-person NSSTA TPAC programmes, interactive cloud data sandboxes, and AI-driven adaptive diagnostics.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="bg-white/10 backdrop-blur-xs border border-white/20 px-3 py-2 rounded-lg text-center">
              <div className="text-lg font-bold text-amber-300">
                {Object.keys(enrolledCourses).length}
              </div>
              <div className="text-[10px] text-blue-200 uppercase font-semibold">
                Enrolled
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-xs border border-white/20 px-3 py-2 rounded-lg text-center">
              <div className="text-lg font-bold text-emerald-300">
                {Object.keys(tpacNominations).length}
              </div>
              <div className="text-[10px] text-blue-200 uppercase font-semibold">
                TPAC Applied
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-blue-800/80">
          {subTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = hubSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setHubSubTab(tab.id)}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-amber-400 text-black shadow-sm font-bold"
                    : "bg-blue-900/60 hover:bg-blue-800 text-gray-200"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                      isActive ? "bg-black/20 text-black" : "bg-amber-400/30 text-amber-200"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {hubSubTab === "roadmap" && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-[#0B3D91] font-serif-gov">
                  My Active iGOT Enrolments & Progress
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Your ongoing official training modules tracked via Karmayogi Bharat API.
                </p>
              </div>
              <button
                onClick={() => setHubSubTab("catalogue")}
                className="text-xs text-blue-700 font-bold hover:underline flex items-center space-x-1"
              >
                <span>Browse All Modules</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(enrolledCourses).map(([courseId, enrollment]) => {
                const course = IGOT_COURSES.find((c) => c.id === courseId);
                if (!course) return null;
                const isCompleted = enrollment.status === "completed";

                return (
                  <div
                    key={courseId}
                    className="border border-gray-200 rounded-lg p-4 bg-gray-50/50 flex flex-col justify-between hover:border-blue-500 transition-colors"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-2xl">{course.thumbnail}</span>
                        <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-900 px-1.5 py-0.5 rounded border border-blue-200">
                          {course.code}
                        </span>
                      </div>
                      <h3 className="text-xs font-bold text-gray-900 mt-2 line-clamp-2">
                        {language === "HI" && course.titleHi ? course.titleHi : course.title}
                      </h3>
                      <p className="text-[11px] text-gray-500 mt-1">
                        {course.provider} • {course.durationHours} Hours
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between text-[11px] text-gray-600 font-semibold mb-1">
                        <span>{isCompleted ? "Completed" : "In Progress"}</span>
                        <span>{enrollment.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            isCompleted ? "bg-emerald-600" : "bg-[#0B3D91]"
                          }`}
                          style={{ width: `${enrollment.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center space-x-1.5 text-xs font-semibold text-amber-600 uppercase">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Semantic Skill Engine Recommendations</span>
                </div>
                <h2 className="text-base font-bold text-gray-900 font-serif-gov mt-0.5">
                  Curated Roadmap for {currentTargetRole.title}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Matched via Semantic Cosine Similarity against your current role profile and critical gaps.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {IGOT_COURSES.slice(0, 5).map((course, idx) => {
                const isEnrolled = !!enrolledCourses[course.id];
                
                // Calculate dynamic semantic match based on user's focus skills
                const userFocus = (currentUser?.focusSkills || ["survey design", "python", "national accounts"]).map(s => s.toLowerCase());
                const courseTags = (course.semanticTags || []).map(t => t.toLowerCase());
                const matchCount = courseTags.filter(t => userFocus.some(f => t.includes(f) || f.includes(t))).length;
                
                let dynamicScore = course.semanticScore || (88 + (idx * 2) % 10);
                if (matchCount > 0) {
                  dynamicScore = Math.min(99, 90 + matchCount * 3);
                }

                return (
                  <div
                    key={course.id}
                    className="p-4 rounded-lg border border-gray-200 hover:border-blue-400 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
                  >
                    <div className="flex items-start space-x-3.5">
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-[#0B3D91] font-bold text-xs flex items-center justify-center border border-blue-200 flex-shrink-0 mt-0.5">
                        0{idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center flex-wrap gap-2">
                          <span className="text-xs font-bold text-gray-900">
                            {language === "HI" && course.titleHi ? course.titleHi : course.title}
                          </span>
                          <span className="text-[10px] font-mono bg-blue-50 text-blue-900 px-1.5 py-0.2 rounded border border-blue-200">
                            {course.code}
                          </span>
                          <span className="text-[10px] font-bold bg-amber-50 text-amber-800 px-1.5 py-0.2 rounded border border-amber-300">
                            ★ Semantic Match: {dynamicScore}%
                          </span>
                          {matchCount > 0 && (
                            <span className="text-[9px] font-bold bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded border border-emerald-300">
                              Matches Your Priority Focus
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          {course.provider} • {course.level} • {course.durationHours} Hours • Addresses {(course.competenciesTied || []).join(", ")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 flex-shrink-0">
                      {isEnrolled ? (
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded border border-emerald-200 flex items-center space-x-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Enrolled</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => enrollInCourse(course.id)}
                          className="bg-[#0B3D91] hover:bg-[#07265D] text-white text-xs font-bold px-3.5 py-1.5 rounded transition-colors flex items-center space-x-1"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                          <span>Enroll</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {hubSubTab === "catalogue" && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={language === "HI" ? "खोजें (शीर्षक, कोड, प्रदाता)..." : "Search title, code, or provider..."}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded px-2.5 py-2 font-medium bg-white text-gray-700 focus:outline-none"
              >
                <option value="ALL">All Categories</option>
                {Object.values(COMPETENCY_CATEGORIES).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="border border-gray-300 rounded px-2.5 py-2 font-medium bg-white text-gray-700 focus:outline-none"
              >
                <option value="ALL">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCourses.map((course) => {
              const isEnrolled = !!enrolledCourses[course.id];
              const isCompleted = enrolledCourses[course.id]?.status === "completed";
              const progress = enrolledCourses[course.id]?.progress || 0;
              const displayTitle = language === "HI" && course.titleHi ? course.titleHi : course.title;
              const displayDesc = language === "HI" && course.descHi ? course.descHi : course.description;

              return (
                <div
                  key={course.id}
                  className="bg-white rounded-lg border border-gray-200 shadow-xs hover:border-[#0B3D91] transition-all flex flex-col justify-between overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-2xl">{course.thumbnail}</span>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-900 px-1.5 py-0.5 rounded border border-blue-200">
                          {course.code}
                        </span>
                        <span className="text-[10px] text-gray-500 font-semibold mt-0.5">
                          {course.level}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-xs font-bold text-gray-900 line-clamp-2 leading-snug">
                      {displayTitle}
                    </h3>
                    <div className="text-[11px] text-blue-900 font-semibold mt-1">
                      {course.provider}
                    </div>

                    {course.semanticScore && (
                      <div className="mt-2 inline-flex items-center space-x-1 text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded">
                        <span>★ Semantic Match:</span>
                        <span className="text-amber-700 font-extrabold">{course.semanticScore}%</span>
                      </div>
                    )}

                    <p className="text-[11px] text-gray-600 mt-2 line-clamp-3 leading-relaxed">
                      {displayDesc}
                    </p>

                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span>{course.durationHours} Hours</span>
                      </span>
                      <span className="text-amber-600 font-bold">
                        ★ {course.rating} ({course.enrolledCount})
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                    {isCompleted ? (
                      <div className="w-full bg-emerald-100 text-emerald-800 text-xs font-bold py-1.5 rounded text-center border border-emerald-300 flex items-center justify-center space-x-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Completed (100%)</span>
                      </div>
                    ) : isEnrolled ? (
                      <div>
                        <div className="flex items-center justify-between text-[10px] text-gray-600 font-semibold mb-1">
                          <span>Enrolled</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-600 h-full rounded-full"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => enrollInCourse(course.id)}
                        className="w-full bg-[#0B3D91] hover:bg-[#07265D] text-white text-xs font-bold py-2 rounded transition-colors flex items-center justify-center space-x-1 shadow-xs"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                        <span>Enroll on iGOT</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {hubSubTab === "tpac" && (
        <div className="space-y-6">
          <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-4 flex items-start space-x-3">
            <Building className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-950">
              <strong className="font-bold">National Statistical Systems Training Academy (NSSTA) — Training Programme Advisory Committee (TPAC)</strong>
              <p className="mt-0.5 text-amber-900 leading-relaxed">
                Official calendar of residential/in-person and executive immersion workshops held at NSSTA Campus (Greater Noida) and regional partner institutes. Nominations require division head endorsement.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {TPAC_PROGRAMMES.map((prog) => {
              const isNominated = !!tpacNominations[prog.id];
              return (
                <div
                  key={prog.id}
                  className="bg-white rounded-lg border border-gray-200 shadow-xs hover:border-[#0B3D91] transition-all p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
                        {prog.code}
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {prog.seatsAvailable} Seats Left
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-[#0B3D91] font-serif-gov mt-2">
                      {prog.title}
                    </h3>
                    <div className="text-xs text-gray-500 mt-1">
                      {prog.targetAudience}
                    </div>

                    <p className="text-xs text-gray-600 mt-2.5 leading-relaxed">
                      {prog.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-gray-100 space-y-1.5 text-xs text-gray-500">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-3.5 h-3.5 text-blue-800" />
                        <span><strong>Dates:</strong> {prog.dates} ({prog.duration})</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-3.5 h-3.5 text-red-700" />
                        <span><strong>Venue:</strong> {prog.venue}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-3.5 h-3.5 text-purple-700" />
                        <span><strong>Course Director:</strong> {prog.coordinator}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-gray-200">
                    {isNominated ? (
                      <div className="bg-blue-50 text-blue-900 border border-blue-200 text-xs font-bold py-2 rounded text-center flex items-center justify-center space-x-1">
                        <CheckCircle className="w-4 h-4 text-blue-700" />
                        <span>Nomination Submitted & Pending Approval</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => nominateForTPAC(prog.id)}
                        className="w-full bg-[#0B3D91] hover:bg-[#07265D] text-white text-xs font-bold py-2 rounded transition-colors flex items-center justify-center space-x-1"
                      >
                        <Calendar className="w-3.5 h-3.5 text-amber-300" />
                        <span>Submit Official Nomination</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {hubSubTab === "labs" && <VirtualLabsPage />}

      {hubSubTab === "assessments" && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#0B3D91] font-serif-gov">
                  Adaptive Competency Diagnostics & Tests
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Computerized Adaptive Testing (CAT): Difficulty branches automatically (+1 / -1) based on real-time answer streaks. Passing elevates your live competency score.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
              {publishedAssessments.map((assessment) => (
                <div
                  key={assessment.id}
                  className="bg-white rounded-lg border border-gray-200 p-5 flex flex-col justify-between hover:border-blue-600 transition-all shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-300">
                        {assessment.topic}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">
                        ⏱ {assessment.timeLimitMinutes} mins
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-gray-900 leading-snug">
                      {assessment.title}
                    </h3>
                    <p className="text-[11px] text-gray-500 mt-1">
                      Author: <strong>{assessment.author}</strong> • {assessment.attemptsCount} Attempts
                    </p>

                    <div className="mt-3 text-[11px] text-gray-600 bg-blue-50/60 p-2.5 rounded border border-blue-100">
                      <div>🎯 Passing Threshold: <strong>{assessment.passingScore}%</strong></div>
                      <div className="mt-0.5 text-blue-800">⚡ Real-Time Adaptive Branching Enabled</div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => setActiveQuizModal({ isOpen: true, assessment })}
                      className="w-full bg-[#0B3D91] hover:bg-[#07265D] text-white text-xs font-bold py-2 rounded transition-colors flex items-center justify-center space-x-1"
                    >
                      <FileCheck2 className="w-3.5 h-3.5 text-amber-300" />
                      <span>Start Adaptive Diagnostic</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
