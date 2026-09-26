import React, { useState } from "react";
import { usePlatform } from "../context/PlatformContext.jsx";
import { MOCK_PROFILES, MOCK_ORG_ANALYTICS } from "../data/mockData.js";
import {
  FileSpreadsheet,
  Download,
  FileText,
  Printer,
  Calendar,
  Building,
  CheckCircle2,
  Share2,
} from "lucide-react";

export default function ReportsPage() {
  const { addToast } = usePlatform();
  const [selectedQuarter, setSelectedQuarter] = useState("Q2 (Jul - Sep 2026)");
  const [filterCadre, setFilterCadre] = useState("ALL");

  const handleExportPDF = () => {
    addToast(
      "Generating Official PDF Report",
      "Compiling MoSPI Parliamentary Standing Committee Statistical Training Audit (PDF)... Download initiated.",
      "success"
    );
  };

  const handleExportExcel = () => {
    addToast(
      "Exporting to Excel (XLSX)",
      "Generating National Cadre Competency Matrix 2026 spreadsheet... File ready.",
      "success"
    );
  };

  const filteredProfiles =
    filterCadre === "ALL"
      ? MOCK_PROFILES
      : MOCK_PROFILES.filter((p) => p.cadre.includes(filterCadre));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-900 uppercase tracking-wider">
            <FileSpreadsheet className="w-4 h-4 text-amber-500" />
            <span>Official Reporting & Compliance Desk</span>
          </div>
          <h2 className="text-xl font-bold text-[#0B3D91] font-serif-gov mt-0.5">
            MoSPI Executive Competency Reports & Audits
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Generate printable gazette-style reports for Ministry reviews, Parliamentary questions, and NSSTA accreditation.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportPDF}
            className="bg-[#0B3D91] hover:bg-[#07265D] text-white text-xs font-bold py-2 px-3.5 rounded transition-colors flex items-center space-x-1.5 shadow-xs"
          >
            <FileText className="w-3.5 h-3.5 text-amber-300" />
            <span>Export Official PDF</span>
          </button>
          <button
            onClick={handleExportExcel}
            className="bg-green-700 hover:bg-green-800 text-white text-xs font-bold py-2 px-3.5 rounded transition-colors flex items-center space-x-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* Filter Ribbon */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3">
          <span className="font-bold text-gray-700">Audit Period:</span>
          <select
            value={selectedQuarter}
            onChange={(e) => setSelectedQuarter(e.target.value)}
            className="border border-gray-300 rounded px-2.5 py-1.5 bg-white font-medium text-gray-800 focus:outline-none"
          >
            <option value="Q1 (Apr - Jun 2026)">Q1 (Apr - Jun 2026)</option>
            <option value="Q2 (Jul - Sep 2026)">Q2 (Jul - Sep 2026)</option>
            <option value="Q3 (Oct - Dec 2026)">Q3 (Oct - Dec 2026)</option>
            <option value="Annual Audit 2025-26">Annual Audit 2025-26</option>
          </select>
        </div>

        <div className="flex items-center space-x-3">
          <span className="font-bold text-gray-700">Filter Cadre:</span>
          <select
            value={filterCadre}
            onChange={(e) => setFilterCadre(e.target.value)}
            className="border border-gray-300 rounded px-2.5 py-1.5 bg-white font-medium text-gray-800 focus:outline-none"
          >
            <option value="ALL">All Cadres</option>
            <option value="SSS">Subordinate Statistical Service (SSS)</option>
            <option value="ISS">Indian Statistical Service (ISS)</option>
            <option value="Non-Cadre">Field / Non-Cadre</option>
          </select>
        </div>
      </div>

      {/* Official Summary Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-xs p-5">
        <div className="text-center pb-4 border-b border-gray-200 mb-4">
          <div className="text-xs font-bold text-gray-600 uppercase tracking-widest font-serif-gov">
            Government of India • Ministry of Statistics and Programme Implementation
          </div>
          <h3 className="text-lg font-bold text-[#0B3D91] font-serif-gov mt-1">
            Statistical Systems Capacity Building & Learning Progress Report
          </h3>
          <div className="text-[11px] text-gray-500 mt-0.5">
            Evaluation Period: {selectedQuarter} • Prepared under National Training Policy Guidelines
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-gray-200">
            <thead className="bg-[#07265D] text-white uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="py-2.5 px-3 border-b border-gray-300">Karmayogi ID</th>
                <th className="py-2.5 px-3 border-b border-gray-300">Officer Name</th>
                <th className="py-2.5 px-3 border-b border-gray-300">Designation</th>
                <th className="py-2.5 px-3 border-b border-gray-300">Division</th>
                <th className="py-2.5 px-3 border-b border-gray-300 text-center">Training Hours</th>
                <th className="py-2.5 px-3 border-b border-gray-300 text-center">Completed Courses</th>
                <th className="py-2.5 px-3 border-b border-gray-300 text-center">Passed Tests</th>
                <th className="py-2.5 px-3 border-b border-gray-300 text-center">Compliance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProfiles.map((p) => {
                const isCompliant = p.learningStats.hoursCompleted >= 30;

                return (
                  <tr key={p.id} className="hover:bg-blue-50/40">
                    <td className="py-2.5 px-3 font-mono text-gray-600 text-[11px]">
                      {p.karmayogiId}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-gray-900">{p.name}</td>
                    <td className="py-2.5 px-3 text-gray-700">{p.role}</td>
                    <td className="py-2.5 px-3 text-gray-600 truncate max-w-[180px]">
                      {p.department.split("(")[0]}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-blue-900">
                      {p.learningStats.hoursCompleted} hrs
                    </td>
                    <td className="py-2.5 px-3 text-center font-semibold text-gray-800">
                      {p.learningStats.coursesCompleted}
                    </td>
                    <td className="py-2.5 px-3 text-center font-semibold text-gray-800">
                      {p.learningStats.assessmentsPassed}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {isCompliant ? (
                        <span className="text-[10px] bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded border border-green-300">
                          Target Achieved
                        </span>
                      ) : (
                        <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-300">
                          In Progress
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Notes for Report */}
        <div className="mt-4 pt-3 border-t border-gray-200 text-[11px] text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Data Source: NSSTA Greater Noida Academic Registry & iGOT Karmayogi Bharat Hub.
          </div>
          <div className="font-bold text-gray-700">
            Sign-off: Director General (Training), MoSPI
          </div>
        </div>
      </div>
    </div>
  );
}
