import React, { useState } from "react";
import { usePlatform } from "../context/PlatformContext.jsx";
import { COMPETENCY_CATEGORIES, COMPETENCIES } from "../data/mockData.js";
import {
  UserCheck,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  Shield,
  Edit3,
  BarChart2,
  Award,
  Layers,
  Check
} from "lucide-react";
import SkillGapEnginePage from "./SkillGapEnginePage.jsx";

export default function CompetencyProfilePage() {
  const {
    currentUser,
    userCompetencies,
    updateLearnerProfile,
    hubSubTab,
    setHubSubTab
  } = usePlatform();

  // Internal tab: 'profile' | 'skillgap' | 'edit'
  const [activeTab, setActiveTab] = useState(hubSubTab === "skillgap" ? "skillgap" : "profile");

  const [formData, setFormData] = useState({
    name: currentUser.name || "Aadeesh Sharma",
    designation: currentUser.role || "Junior Statistical Officer (JSO)",
    cadre: currentUser.cadre || "Subordinate Statistical Service (SSS)",
    department: currentUser.department || "Survey Design and Research Division (SDRD)",
    location: currentUser.location || "Kolkata, West Bengal",
    experienceYears: currentUser.experienceYears || 4.5,
    qualification: currentUser.qualification || "M.Sc. in Statistics (University of Calcutta)",
    selfRatings: {
      "comp-stat-1": userCompetencies["comp-stat-1"] || 3,
      "comp-stat-2": userCompetencies["comp-stat-2"] || 2,
      "comp-stat-3": userCompetencies["comp-stat-3"] || 2,
      "comp-tech-1": userCompetencies["comp-tech-1"] || 2,
      "comp-tech-2": userCompetencies["comp-tech-2"] || 2,
      "comp-tech-3": userCompetencies["comp-tech-3"] || 2,
      "comp-tech-4": userCompetencies["comp-tech-4"] || 1,
      "comp-tech-5": userCompetencies["comp-tech-5"] || 1,
      "comp-gov-1": userCompetencies["comp-gov-1"] || 2,
    },
    focusSkills: currentUser.focusSkills || [
      "Python Survey Automation",
      "National Accounts Rebasing & GVA",
      "Geospatial & Remote Sensing Analytics"
    ]
  });

  const availableSkills = [
    "Python Survey Automation",
    "National Accounts Rebasing & GVA",
    "Geospatial & Remote Sensing Analytics",
    "Machine Learning for Imputation",
    "Big Data & High-Frequency Indicators",
    "Price Index & CPI Automation",
    "DPDP Act & Microdata Anonymization",
    "R for Small Area Estimation"
  ];

  const [isUpdating, setIsUpdating] = useState(false);

  const toggleFocusSkill = (skill) => {
    setFormData((prev) => {
      const exists = prev.focusSkills.includes(skill);
      return {
        ...prev,
        focusSkills: exists ? prev.focusSkills.filter((s) => s !== skill) : [...prev.focusSkills, skill]
      };
    });
  };

  const handleRatingChange = (compId, val) => {
    setFormData((prev) => ({
      ...prev,
      selfRatings: {
        ...prev.selfRatings,
        [compId]: Number(val)
      }
    }));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsUpdating(true);

    setTimeout(() => {
      updateLearnerProfile(formData);
      setIsUpdating(false);
      setActiveTab("profile");
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#0B3D91] uppercase tracking-wider">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Mission Karmayogi • FRAC Competency Hub</span>
          </div>
          <h2 className="text-xl font-bold text-[#0B3D91] font-serif-gov mt-0.5">
            Officer Competency Intelligence & Calibration
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Framework for Roles, Activities, and Competencies (FRAC) verified ratings, gap analysis, and profile maintenance.
          </p>
        </div>

        {/* Sub-Tab Navigation */}
        <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-lg border border-gray-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeTab === "profile"
                ? "bg-[#0B3D91] text-white shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Competency Profile</span>
          </button>

          <button
            onClick={() => setActiveTab("skillgap")}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeTab === "skillgap"
                ? "bg-[#0B3D91] text-white shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Skill-Gap Engine</span>
          </button>

          <button
            onClick={() => setActiveTab("edit")}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeTab === "edit"
                ? "bg-[#0B3D91] text-white shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit My Profile</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: COMPETENCY PROFILE & VERIFIED MATRIX */}
      {activeTab === "profile" && (
        <div className="space-y-6">
          {/* Officer Identity Card */}
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-full bg-[#0B3D91] text-white flex items-center justify-center text-lg font-bold border-2 border-amber-400 shadow-sm">
                {currentUser.avatar || "AS"}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-bold text-gray-900">{currentUser.name}</h3>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-300">
                    FRAC Verified
                  </span>
                </div>
                <div className="text-xs text-gray-600 font-medium">
                  {currentUser.role} • {currentUser.cadre}
                </div>
                <div className="text-[11px] text-gray-500 mt-0.5">
                  {currentUser.department} ({currentUser.location})
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTab("edit")}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold px-3.5 py-2 rounded-lg transition-colors flex items-center space-x-1.5 border border-gray-300 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Update Inputs</span>
              </button>
              <button
                onClick={() => setActiveTab("skillgap")}
                className="bg-[#0B3D91] hover:bg-[#07265D] text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-colors flex items-center space-x-1.5 shadow-xs cursor-pointer"
              >
                <BarChart2 className="w-3.5 h-3.5 text-amber-300" />
                <span>View Skill Gaps</span>
              </button>
            </div>
          </div>

          {/* 4-Domain Competency List */}
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#0B3D91] font-serif-gov">
                  Verified Skill Matrix across 4 PS Domains
                </h3>
                <p className="text-[11px] text-gray-500">
                  Proficiency ratings (Level 1: Beginner to Level 5: Expert) calibrated against official MoSPI standards
                </p>
              </div>
              <span className="text-[10px] bg-blue-50 text-blue-900 font-mono font-bold px-2 py-1 rounded border border-blue-200">
                19 Competencies Tracked
              </span>
            </div>

            <div className="space-y-4">
              {Object.values(COMPETENCY_CATEGORIES).map((catName) => {
                const catComps = COMPETENCIES.filter((c) => c.category === catName);
                return (
                  <div key={catName} className="border border-gray-200 rounded-lg p-3.5 bg-gray-50/50">
                    <div className="font-bold text-xs text-gray-800 uppercase tracking-wider mb-2.5 flex items-center justify-between">
                      <span>{catName} Domain</span>
                      <span className="text-[10px] font-normal text-gray-500">
                        {catComps.length} Competencies
                      </span>
                    </div>

                    <div className="space-y-2">
                      {catComps.map((comp) => {
                        const level = userCompetencies[comp.id] || 1;
                        return (
                          <div
                            key={comp.id}
                            className="bg-white p-3 rounded-lg border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-xs"
                          >
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <span className="text-[10px] font-mono bg-blue-50 text-blue-900 px-1.5 py-0.2 rounded border border-blue-200 font-bold">
                                  {comp.code}
                                </span>
                                <span className="text-xs font-bold text-gray-900">{comp.name}</span>
                              </div>
                              <p className="text-[11px] text-gray-500 mt-1">
                                {comp.levelDescriptions[level]}
                              </p>
                            </div>

                            <div className="flex items-center space-x-3 self-end sm:self-center">
                              <span className="text-[11px] font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                                Level {level} / 5
                              </span>
                              <div className="w-24 bg-gray-200 h-2 rounded-full overflow-hidden">
                                <div
                                  className="bg-[#0B3D91] h-full rounded-full transition-all"
                                  style={{ width: `${(level / 5) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: SKILL GAP ENGINE */}
      {activeTab === "skillgap" && <SkillGapEnginePage />}

      {/* VIEW 3: EDIT MY PROFILE & FOCUS SKILLS */}
      {activeTab === "edit" && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-xs space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-base font-bold text-[#0B3D91] font-serif-gov">
              Edit Competency Inputs & Priority Learning Focus
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Updating your designation, qualifications, or focus skills visibly recomputes your baseline competencies and AI recommendation scores!
            </p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Official Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Designation</label>
                <select
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-lg bg-white focus:ring-1 focus:ring-blue-600"
                >
                  <option value="Junior Statistical Officer (JSO)">Junior Statistical Officer (JSO)</option>
                  <option value="Statistical Investigator Gr-II">Statistical Investigator Gr-II</option>
                  <option value="Senior Statistical Officer (SSO)">Senior Statistical Officer (SSO)</option>
                  <option value="Assistant Director (ISS)">Assistant Director (ISS)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Cadre Classification</label>
                <select
                  value={formData.cadre}
                  onChange={(e) => setFormData({ ...formData, cadre: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-lg bg-white focus:ring-1 focus:ring-blue-600"
                >
                  <option value="Subordinate Statistical Service (SSS)">Subordinate Statistical Service (SSS)</option>
                  <option value="Indian Statistical Service (ISS)">Indian Statistical Service (ISS)</option>
                  <option value="Non-Cadre Statistical Staff">Non-Cadre Statistical Staff</option>
                  <option value="IT & Systems Cadre">IT & Systems Cadre</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Department / Division</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-lg bg-white focus:ring-1 focus:ring-blue-600"
                >
                  <option value="Survey Design and Research Division (SDRD)">Survey Design and Research Division (SDRD)</option>
                  <option value="National Accounts Division (NAD)">National Accounts Division (NAD)</option>
                  <option value="Price Statistics Division (PSD)">Price Statistics Division (PSD)</option>
                  <option value="Field Operations Division (FOD)">Field Operations Division (FOD)</option>
                  <option value="Data Quality Assurance Division (DQAD)">Data Quality Assurance Division (DQAD)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Current Posting Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Years of Service</label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.experienceYears}
                  onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* Focus Skills Selection */}
            <div className="pt-2 border-t border-gray-100">
              <label className="block font-bold text-gray-800 uppercase tracking-wider mb-2">
                ★ Priority Focus Skills (Drives Semantic Match % in Catalogue & Recommendations):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {availableSkills.map((skill) => {
                  const isSelected = formData.focusSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleFocusSkill(skill)}
                      className={`p-3 rounded-lg border text-left text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? "bg-blue-50 border-[#0B3D91] text-[#0B3D91] shadow-xs"
                          : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <span>{skill}</span>
                      {isSelected ? (
                        <CheckCircle2 className="w-4 h-4 text-[#0B3D91] flex-shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setActiveTab("profile")}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-4 py-2 rounded-lg cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isUpdating}
                className="bg-[#0B3D91] hover:bg-[#07265D] text-white font-bold px-6 py-2.5 rounded-lg flex items-center space-x-2 transition-all shadow-xs cursor-pointer"
              >
                {isUpdating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Recalibrating Competencies...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Save & Recalibrate Recommendations</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
