import React, { useState } from "react";
import { usePlatform } from "../context/PlatformContext.jsx";
import {
  GraduationCap,
  Shield,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Award,
  Layers,
  Sparkles
} from "lucide-react";

export default function TrainerOnboardingPage() {
  const { currentUser, completeTrainerOnboarding } = usePlatform();

  const [formData, setFormData] = useState({
    name: currentUser.name || "Prof. S. R. Mukhopadhyay",
    facultyId: "NSSTA-FAC-2015-1102",
    role: "Course Director & Senior Faculty",
    department: "NSSTA Faculty Council, Greater Noida",
    qualification: "Ph.D. in Econometrics & Statistical Sampling (ISI)",
    experienceYears: 14.0,
    subjectAreas: [
      "Advanced Survey Sampling & Estimation",
      "National Accounts & GVA Compilation",
      "Python & Data Science for Civil Servants"
    ]
  });

  const subjectOptions = [
    "Advanced Survey Sampling & Estimation",
    "National Accounts & GVA Compilation",
    "Python & Data Science for Civil Servants",
    "Price Statistics & CPI Index Numbers",
    "Geospatial & Remote Sensing with QGIS",
    "Economic Census & Enterprise Surveys",
    "Data Protection & DPDP Act 2023 Compliance"
  ];

  const toggleSubject = (subj) => {
    setFormData((prev) => {
      const exists = prev.subjectAreas.includes(subj);
      return {
        ...prev,
        subjectAreas: exists ? prev.subjectAreas.filter((s) => s !== subj) : [...prev.subjectAreas, subj]
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    completeTrainerOnboarding(formData);
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-2 text-xs font-bold text-[#0B3D91] uppercase tracking-wider">
            <Shield className="w-4 h-4 text-purple-600" />
            <span>NSSTA Faculty Portal • Mission Karmayogi</span>
          </div>
          <h1 className="text-2xl font-bold font-serif-gov text-gray-900 mt-1">
            Faculty & Course Director Onboarding
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Verify your pedagogical credentials and subject expertise areas before accessing the NSSTA AI Content Studio.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-xs border border-gray-200 p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Faculty Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-600"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">NSSTA Faculty ID</label>
              <input
                type="text"
                required
                value={formData.facultyId}
                onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-600 font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Academic Designation</label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-600"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Academy / Division</label>
              <input
                type="text"
                required
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-600"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Highest Academic Qualification</label>
              <input
                type="text"
                required
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-600"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Years of Teaching / Research</label>
              <input
                type="number"
                step="1"
                value={formData.experienceYears}
                onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-600"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100">
            <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
              Subject Expertise & Course Authoring Areas:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {subjectOptions.map((subj) => {
                const isSelected = formData.subjectAreas.includes(subj);
                return (
                  <button
                    key={subj}
                    type="button"
                    onClick={() => toggleSubject(subj)}
                    className={`p-3 rounded-lg border text-left text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? "bg-purple-50 border-purple-600 text-purple-900 shadow-xs"
                        : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <span>{subj}</span>
                    {isSelected ? (
                      <CheckCircle2 className="w-4 h-4 text-purple-700 flex-shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="bg-[#0B3D91] hover:bg-[#07265D] text-white text-xs font-bold px-8 py-3 rounded-lg flex items-center space-x-2 transition-all shadow-md cursor-pointer"
            >
              <span>Complete Faculty Onboarding & Enter Studio</span>
              <ArrowRight className="w-4 h-4 text-amber-300" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
