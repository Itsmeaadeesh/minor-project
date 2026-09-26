import React from "react";
import { usePlatform } from "../context/PlatformContext.jsx";
import { TARGET_ROLES, COMPETENCIES } from "../data/mockData.js";
import {
  TrendingUp,
  Award,
  ChevronRight,
  Shield,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  AlertTriangle,
  GraduationCap,
} from "lucide-react";

export default function CareerHubPage() {
  const { currentUser, userCompetencies, targetRoleId, setTargetRoleId, setActiveHub, setHubSubTab } = usePlatform();

  const careerLadder = [
    { title: "Statistical Investigator Gr-II", cadre: "Non-Cadre / Subordinate", minExp: "Entry level (0 - 2 yrs)", focus: "Primary CAPI data collection & field listing" },
    { title: "Junior Statistical Officer (JSO)", cadre: "Subordinate Statistical Service (SSS)", minExp: "2 - 5 yrs service", focus: "Multi-stage survey validation, PLFS microdata scrutiny" },
    { title: "Senior Statistical Officer (SSO)", cadre: "Subordinate Statistical Service (SSS)", minExp: "5 - 8 yrs service", focus: "Supervisory scrutiny, CPI commodity indices, ASI reconciliation" },
    { title: "Assistant Director (ISS)", cadre: "Indian Statistical Service (Group A)", minExp: "Direct Recruit / 5+ yrs SSS", focus: "Sub-division management, macro indicator coordination" },
    { title: "Deputy Director (NAD / ESD)", cadre: "Indian Statistical Service (Group A)", minExp: "5+ yrs ISS", focus: "National accounts rebase, GVA compilation, IIP governance" },
    { title: "Joint Director / Director", cadre: "Indian Statistical Service (Group A)", minExp: "10+ yrs ISS", focus: "Executive statistical leadership, international UNSD representation" }
  ];

  const handleSelectTarget = (rId) => {
    setTargetRoleId(rId);
    setActiveHub("competency");
    setHubSubTab("skillgap");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-900 uppercase tracking-wider">
            <Briefcase className="w-4 h-4 text-amber-500" />
            <span>Mission Karmayogi Career Progression</span>
          </div>
          <h2 className="text-xl font-bold text-[#0B3D91] font-serif-gov mt-0.5">
            MoSPI Official Career Pathways & FRAC Benchmarks
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Transparent civil service promotion criteria, cadre progression ladders, and target competency requirements.
          </p>
        </div>

        <div className="text-xs bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1.5 rounded-lg font-bold">
          Cadre: {currentUser.cadre}
        </div>
      </div>

      {/* Career Ladder View */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs">
        <h3 className="text-base font-bold text-[#0B3D91] font-serif-gov mb-3">
          Statistical Cadre Hierarchy & Progression Stages
        </h3>
        <p className="text-xs text-gray-500 mb-6">
          Officers advance through verified proficiency ratings in statistical methodology, leadership, and digital governance.
        </p>

        <div className="relative border-l-2 border-blue-200 ml-4 pl-6 space-y-6">
          {careerLadder.map((step, idx) => {
            const isCurrent = currentUser.role.includes(step.title.split(" ")[0]);

            return (
              <div key={idx} className="relative group">
                {/* Stage Indicator Dot */}
                <div
                  className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 ${
                    isCurrent
                      ? "bg-amber-400 border-[#0B3D91] ring-4 ring-amber-100"
                      : "bg-white border-blue-500"
                  }`}
                ></div>

                <div
                  className={`p-4 rounded-lg border transition-all ${
                    isCurrent
                      ? "bg-blue-50/80 border-[#0B3D91] shadow-xs"
                      : "bg-gray-50/60 border-gray-200 hover:bg-white"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-xs font-bold text-gray-900">{step.title}</h4>
                      {isCurrent && (
                        <span className="text-[10px] bg-green-100 text-green-800 font-bold px-2 py-0.2 rounded border border-green-300">
                          Current Role
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-gray-500 font-semibold">{step.minExp}</span>
                  </div>

                  <div className="text-[11px] text-blue-900 font-medium mt-1">{step.cadre}</div>
                  <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">{step.focus}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Target Roles Exploratory Cards */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs">
        <h3 className="text-base font-bold text-[#0B3D91] font-serif-gov mb-2">
          Explore Target Aspirational Benchmarks
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          Select any benchmark role to compute your competency delta and inspect recommended courses:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TARGET_ROLES.map((role) => (
            <div
              key={role.id}
              className="border border-gray-200 rounded-lg p-4 bg-gray-50/40 hover:bg-white hover:border-[#0B3D91] transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {role.cadre.split(" ")[0]}
                </span>
                <h4 className="text-xs font-bold text-gray-900 mt-2 font-serif-gov">
                  {role.title}
                </h4>
                <div className="text-[11px] text-gray-500 mt-0.5">
                  Dept: {role.department}
                </div>
                <p className="text-xs text-gray-600 mt-2 line-clamp-3 leading-relaxed">
                  {role.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-200">
                <button
                  onClick={() => handleSelectTarget(role.id)}
                  className="w-full bg-[#0B3D91] hover:bg-[#07265D] text-white text-xs font-bold py-2 rounded transition-colors flex items-center justify-center space-x-1 shadow-xs"
                >
                  <span>Select as Target & View Gaps</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
