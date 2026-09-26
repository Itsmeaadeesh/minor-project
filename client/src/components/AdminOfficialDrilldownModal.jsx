import React from "react";
import { usePlatform } from "../context/PlatformContext.jsx";
import { COMPETENCIES } from "../data/mockData.js";
import {
  X,
  User,
  Shield,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";

export default function AdminOfficialDrilldownModal() {
  const { selectedOfficialForDrilldown, setSelectedOfficialForDrilldown } = usePlatform();

  if (!selectedOfficialForDrilldown) return null;
  const official = selectedOfficialForDrilldown;

  const comps = official.currentCompetencies || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl border-4 border-[#0B3D91] max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-[#07265D] text-white p-5 border-b-2 border-amber-500 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 text-[10px] uppercase font-bold text-amber-300 tracking-wider">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Administrative Oversight • Official Cadre Record</span>
            </div>
            <h2 className="text-xl font-bold font-serif-gov mt-0.5">
              {official.name}
            </h2>
            <p className="text-xs text-gray-300">
              {official.role} • {official.cadre} • {official.karmayogiId}
            </p>
          </div>

          <button
            onClick={() => setSelectedOfficialForDrilldown(null)}
            className="text-gray-300 hover:text-white p-1 rounded hover:bg-white/10 text-xs font-bold flex items-center space-x-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Read-Only Badge */}
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-2 flex items-center justify-between text-xs text-amber-900 font-semibold">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Administrative Read-Only Inspection Mode: Verified under MoSPI Competency Dictionary</span>
          </div>
          <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-amber-300 font-mono">
            ID: {official.id}
          </span>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-xs">
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-[10px] text-gray-500 uppercase font-bold">Division / Posting</div>
              <div className="font-bold text-gray-900 mt-1">{official.department}</div>
              <div className="text-gray-500 text-[11px]">{official.location}</div>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-[10px] text-gray-500 uppercase font-bold">Academic Background</div>
              <div className="font-bold text-gray-900 mt-1">{official.qualification}</div>
              <div className="text-gray-500 text-[11px]">{official.experienceYears} Years in Service</div>
            </div>

            <div className="p-3 bg-blue-50/70 rounded-lg border border-blue-200">
              <div className="text-[10px] text-blue-800 uppercase font-bold">Learning Performance</div>
              <div className="font-bold text-[#0B3D91] mt-1">
                {official.learningStats?.hoursCompleted || 40} Learning Hours
              </div>
              <div className="text-blue-700 text-[11px]">
                {official.learningStats?.karmayogiCredits || 380} Karmayogi Credits
              </div>
            </div>
          </div>

          {/* Competency Breakdown */}
          <div>
            <h3 className="text-sm font-bold text-[#0B3D91] uppercase tracking-wider mb-3 flex items-center space-x-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Verified FRAC Competency Ratings (Levels 1 to 5)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {COMPETENCIES.map((c) => {
                const lvl = comps[c.id] || 2;
                return (
                  <div key={c.id} className="p-3 rounded-lg border border-gray-200 bg-white flex items-center justify-between">
                    <div>
                      <div className="font-bold text-gray-900 text-xs">{c.name}</div>
                      <div className="text-[10px] text-gray-500 font-mono">{c.code}</div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs font-bold text-[#0B3D91] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        Level {lvl}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Priority Focus Skills if available */}
          {official.focusSkills && official.focusSkills.length > 0 && (
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-[10px] text-gray-500 uppercase font-bold mb-1.5">Official Selected Focus Areas</div>
              <div className="flex flex-wrap gap-1.5">
                {official.focusSkills.map((s) => (
                  <span key={s} className="bg-white text-blue-900 border border-blue-200 px-2 py-0.5 rounded text-[11px] font-semibold">
                    ★ {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-end">
          <button
            onClick={() => setSelectedOfficialForDrilldown(null)}
            className="bg-[#0B3D91] hover:bg-[#07265D] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            Close Officer Record
          </button>
        </div>
      </div>
    </div>
  );
}
