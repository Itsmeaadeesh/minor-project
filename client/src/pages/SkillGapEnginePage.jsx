import React, { useState } from "react";
import { usePlatform } from "../context/PlatformContext.jsx";
import {
  COMPETENCIES,
  TARGET_ROLES,
  COMPETENCY_CATEGORIES,
} from "../data/mockData.js";
import {
  GitCompare,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Layers,
} from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

export default function SkillGapEnginePage() {
  const {
    currentUser,
    userCompetencies,
    targetRoleId,
    setTargetRoleId,
    currentTargetRole,
    setActiveTab,
  } = usePlatform();

  const [selectedCategory, setSelectedCategory] = useState("ALL");

  // Prepare chart data
  const gapData = COMPETENCIES.map((comp) => {
    const current = userCompetencies[comp.id] || 1;
    const required = currentTargetRole.requiredCompetencies[comp.id] || 3;
    const gap = current - required; // negative means gap

    return {
      id: comp.id,
      code: comp.code,
      name: comp.name,
      category: comp.category,
      current,
      required,
      gap,
      gapAbsolute: Math.max(0, required - current),
    };
  });

  const filteredData =
    selectedCategory === "ALL"
      ? gapData
      : gapData.filter((d) => d.category === selectedCategory);

  // Radar chart data - taking top 8 key competencies for readability
  const radarData = gapData.slice(0, 8).map((d) => ({
    subject: d.name.length > 18 ? d.code : d.name,
    current: d.current,
    required: d.required,
    fullMark: 5,
  }));

  const totalGaps = gapData.filter((d) => d.gap < 0).length;
  const criticalGaps = gapData.filter((d) => d.gap <= -2).length;

  return (
    <div className="space-y-6">
      {/* Header & Target Role Selector */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-800 uppercase tracking-wider">
            <GitCompare className="w-4 h-4" />
            <span>Target Role Competency Comparison</span>
          </div>
          <h2 className="text-xl font-bold text-[#0B3D91] font-serif-gov mt-0.5">
            Skill-Gap Analysis Engine
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Compare verified proficiency against target role benchmarks to identify promotion readiness.
          </p>
        </div>

        {/* Target Role Dropdown */}
        <div className="flex items-center space-x-2 bg-blue-50 p-2 rounded-lg border border-blue-200">
          <span className="text-xs font-bold text-gray-700">Target Role:</span>
          <select
            value={targetRoleId}
            onChange={(e) => setTargetRoleId(e.target.value)}
            className="bg-white border border-gray-300 text-xs rounded px-2.5 py-1.5 font-bold text-[#0B3D91] focus:ring-1 focus:ring-blue-600 focus:outline-none cursor-pointer"
          >
            {TARGET_ROLES.map((role) => (
              <option key={role.id} value={role.id}>
                {role.title} ({role.cadre.split(" ")[0]})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Target Role Overview Box */}
      <div className="bg-[#07265D] text-white p-4 rounded-lg shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] text-amber-300 font-bold uppercase tracking-wider">
            Target Role Specification
          </div>
          <h3 className="text-base font-bold font-serif-gov text-white mt-0.5">
            {currentTargetRole.title}
          </h3>
          <p className="text-xs text-gray-300 mt-1 max-w-2xl leading-relaxed">
            {currentTargetRole.description}
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs flex-shrink-0">
          <div className="bg-[#0B3D91] px-3 py-2 rounded border border-blue-700 text-center">
            <div className="text-amber-400 font-extrabold text-lg">{totalGaps}</div>
            <div className="text-[10px] text-gray-300">Total Gaps</div>
          </div>
          <div className="bg-[#0B3D91] px-3 py-2 rounded border border-blue-700 text-center">
            <div className="text-red-400 font-extrabold text-lg">{criticalGaps}</div>
            <div className="text-[10px] text-gray-300">Critical (&gt;=2 Levels)</div>
          </div>
        </div>
      </div>

      {/* Visualizations: Radar Chart & Grouped Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-2">
            <h3 className="text-sm font-bold text-[#0B3D91] font-serif-gov">
              Competency Radar Overlay
            </h3>
            <span className="text-[10px] text-gray-500">Current (Blue) vs Target (Amber)</span>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#E5E7EB" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#374151", fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fontSize: 9 }} />
                <Radar
                  name="Current Verified Level"
                  dataKey="current"
                  stroke="#0B3D91"
                  fill="#0B3D91"
                  fillOpacity={0.4}
                />
                <Radar
                  name="Required Target Level"
                  dataKey="required"
                  stroke="#FF9933"
                  fill="#FF9933"
                  fillOpacity={0.25}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grouped Bar Chart */}
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-2">
            <h3 className="text-sm font-bold text-[#0B3D91] font-serif-gov">
              Comparative Level Gap Distribution
            </h3>
            <span className="text-[10px] text-gray-500">Scale: Levels 1 - 5</span>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={gapData.slice(0, 7)}
                margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis
                  dataKey="code"
                  angle={-30}
                  textAnchor="end"
                  tick={{ fontSize: 10, fill: "#4B5563" }}
                />
                <YAxis domain={[0, 5]} tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ fontSize: "11px", borderRadius: "6px", border: "1px solid #CBD5E1" }}
                />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="current" name="Current Level" fill="#0B3D91" radius={[2, 2, 0, 0]} />
                <Bar dataKey="required" name="Required Level" fill="#FF9933" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Skill Gap Table */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-gray-200 gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-[#0B3D91] font-serif-gov">
              Detailed Gap Matrix & Action Plan
            </h3>
            <p className="text-xs text-gray-500">
              Granular breakdown of each competency against {currentTargetRole.title} requirements
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => setSelectedCategory("ALL")}
              className={`px-2.5 py-1 text-[11px] rounded font-semibold transition-colors ${
                selectedCategory === "ALL"
                  ? "bg-[#0B3D91] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Domains
            </button>
            {Object.values(COMPETENCY_CATEGORIES).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 text-[11px] rounded font-semibold transition-colors ${
                  selectedCategory === cat
                    ? "bg-[#0B3D91] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Official Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-gray-200">
            <thead className="bg-[#07265D] text-white uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="py-2.5 px-3 border-b border-gray-300">Code</th>
                <th className="py-2.5 px-3 border-b border-gray-300">Competency Name</th>
                <th className="py-2.5 px-3 border-b border-gray-300">Domain</th>
                <th className="py-2.5 px-3 border-b border-gray-300 text-center">Current</th>
                <th className="py-2.5 px-3 border-b border-gray-300 text-center">Required</th>
                <th className="py-2.5 px-3 border-b border-gray-300 text-center">Gap Delta</th>
                <th className="py-2.5 px-3 border-b border-gray-300">Urgency Status</th>
                <th className="py-2.5 px-3 border-b border-gray-300 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.map((row) => {
                const isGap = row.gap < 0;
                const isCritical = row.gap <= -2;

                return (
                  <tr key={row.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-gray-700">
                      {row.code}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-gray-900">
                      {row.name}
                    </td>
                    <td className="py-2.5 px-3 text-gray-600">
                      {row.category}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-blue-950">
                      Level {row.current}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-amber-700">
                      Level {row.required}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`font-mono font-extrabold px-2 py-0.5 rounded text-[11px] ${
                          isCritical
                            ? "bg-red-100 text-red-800"
                            : isGap
                            ? "bg-amber-100 text-amber-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {row.gap > 0 ? `+${row.gap}` : row.gap}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      {isCritical ? (
                        <span className="text-[10px] bg-red-600 text-white font-bold px-2 py-0.5 rounded">
                          Critical Deficit
                        </span>
                      ) : isGap ? (
                        <span className="text-[10px] bg-amber-500 text-black font-bold px-2 py-0.5 rounded">
                          Moderate Gap
                        </span>
                      ) : (
                        <span className="text-[10px] bg-green-600 text-white font-bold px-2 py-0.5 rounded">
                          Satisfied
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {isGap ? (
                        <button
                          onClick={() => setActiveTab("recommendations")}
                          className="bg-[#0B3D91] hover:bg-[#07265D] text-white px-2.5 py-1 rounded text-[11px] font-semibold transition-colors inline-flex items-center space-x-1"
                        >
                          <span>Bridge Gap</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ) : (
                        <span className="text-gray-400 text-[11px]">Aligned</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
