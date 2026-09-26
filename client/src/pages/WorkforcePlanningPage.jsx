import React, { useState } from "react";
import { usePlatform } from "../context/PlatformContext.jsx";
import {
  MOCK_ORG_ANALYTICS,
  COMPETENCIES,
} from "../data/mockData.js";
import {
  TrendingUp,
  Users,
  Building,
  Calendar,
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
  Download,
  Filter,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";

export default function WorkforcePlanningPage() {
  const { addToast } = usePlatform();
  const [selectedHorizon, setSelectedHorizon] = useState("2026-2029");
  const [selectedDivision, setSelectedDivision] = useState("ALL");

  // Predictive multi-year skill demand projections
  const demandProjections = [
    { year: "2026", pythonAI: 320, nationalAccounts: 580, dpdpGovernance: 410, sampleSurveys: 890 },
    { year: "2027", pythonAI: 650, nationalAccounts: 690, dpdpGovernance: 720, sampleSurveys: 860 },
    { year: "2028", pythonAI: 1100, nationalAccounts: 810, dpdpGovernance: 1050, sampleSurveys: 830 },
    { year: "2029", pythonAI: 1650, nationalAccounts: 940, dpdpGovernance: 1420, sampleSurveys: 800 },
  ];

  // Cadre capacity risk matrix
  const cadreRisks = [
    {
      cadre: "Junior Statistical Officer (JSO)",
      strength: 2840,
      retiringNext3Yrs: "14%",
      primaryNeed: "Python Automation & CAPI Field Validation",
      riskLevel: "Medium",
      urgency: "Immediate induction training needed",
    },
    {
      cadre: "Senior Statistical Officer (SSO)",
      strength: 1420,
      retiringNext3Yrs: "22%",
      primaryNeed: "SNA 2025 Framework & GVA Window Calculations",
      riskLevel: "High",
      urgency: "Critical institutional memory loss risk",
    },
    {
      cadre: "Assistant Director (AD)",
      strength: 610,
      retiringNext3Yrs: "31%",
      primaryNeed: "DPDP Data Governance & Strategic Survey Oversight",
      riskLevel: "High",
      urgency: "Mid-career executive development required",
    },
    {
      cadre: "Deputy Director (DD)",
      strength: 340,
      retiringNext3Yrs: "28%",
      primaryNeed: "AI Policy Integration & Multi-Source Synthesis",
      riskLevel: "Medium",
      urgency: "Leadership immersion at NSSTA",
    },
  ];

  const handleExportPlan = () => {
    addToast("Workforce Plan Exported", "Capacity building projection 2026-2029 downloaded as official advisory memo.", "success");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-900 uppercase tracking-wider">
            <TrendingUp className="w-4 h-4 text-amber-500" />
            <span>Ministry Leadership & Cadre Management</span>
          </div>
          <h1 className="text-xl font-bold text-[#0B3D91] font-serif-gov mt-0.5">
            Strategic Workforce & Capacity Building Projections (2026–2029)
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Predictive skill demand modeling aligned with MoSPI Vision 2030, Digital Personal Data Protection mandates, and SNA revisions.
          </p>
        </div>

        <button
          onClick={handleExportPlan}
          className="bg-[#0B3D91] hover:bg-[#07265D] text-white text-xs font-bold px-3.5 py-2 rounded transition-colors flex items-center space-x-1.5 shadow-xs"
        >
          <Download className="w-3.5 h-3.5 text-amber-300" />
          <span>Export 3-Year Plan (PDF)</span>
        </button>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total MoSPI Cadre Evaluated</div>
          <div className="text-2xl font-bold text-[#0B3D91] mt-1">5,210 Officers</div>
          <div className="text-xs text-emerald-700 font-semibold mt-1 flex items-center space-x-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>94.2% Registered on iGOT Karmayogi</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">High-Retirement Risk Cadres</div>
          <div className="text-2xl font-bold text-amber-600 mt-1">22.4% Cadre Loss</div>
          <div className="text-xs text-amber-800 font-medium mt-1">
            Over next 36 months in SSO / AD ranks
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Fastest Growing Skill Deficit</div>
          <div className="text-2xl font-bold text-red-600 mt-1">+415% Python / AI</div>
          <div className="text-xs text-red-700 font-medium mt-1">
            Surging demand in SDRD and NAD automation
          </div>
        </div>
      </div>

      {/* Chart: 4-Year Projected Skill Demand Growth */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-[#0B3D91] font-serif-gov">
              Projected Annual Skill Demand Trajectory (Officers Needed per Skill)
            </h2>
            <p className="text-xs text-gray-500">
              Forecasted training capacity requirements to fulfill MoSPI statistical automation mandates.
            </p>
          </div>
          <div className="text-xs font-mono font-bold bg-blue-50 text-blue-900 border border-blue-200 px-2 py-1 rounded">
            Model: NSSTA Capacity Forecaster v2.4
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={demandProjections}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="year" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderColor: "#cbd5e1",
                  fontSize: "12px",
                  borderRadius: "6px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
              <Area
                type="monotone"
                dataKey="pythonAI"
                name="Python & AI Microdata Pipelines"
                stroke="#0B3D91"
                fill="#0B3D91"
                fillOpacity={0.25}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="dpdpGovernance"
                name="DPDP Act & Data Privacy"
                stroke="#d97706"
                fill="#d97706"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="nationalAccounts"
                name="National Accounts & SNA 2025"
                stroke="#059669"
                fill="#059669"
                fillOpacity={0.15}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="sampleSurveys"
                name="Sample Survey Design (SDRD)"
                stroke="#6b7280"
                fill="#6b7280"
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cadre Succession & Risk Analysis Table */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs">
        <h2 className="text-sm font-bold text-[#0B3D91] font-serif-gov mb-1">
          Cadre Succession & Competency Depletion Risk Analysis
        </h2>
        <p className="text-xs text-gray-500 mb-4">
          Actionable priority map for NSSTA TPAC calendar allocation to prevent knowledge loss.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border border-gray-200">
            <thead className="bg-gray-50 text-gray-700 font-bold border-b border-gray-200">
              <tr>
                <th className="p-3">Cadre Level</th>
                <th className="p-3">Cadre Strength</th>
                <th className="p-3">Superannuation (3 Yrs)</th>
                <th className="p-3">Primary Competency Deficit</th>
                <th className="p-3">Risk Category</th>
                <th className="p-3">NSSTA Strategic Intervention</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {cadreRisks.map((cr, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="p-3 font-bold text-gray-900">{cr.cadre}</td>
                  <td className="p-3 font-mono">{cr.strength}</td>
                  <td className="p-3 font-mono text-amber-700 font-bold">{cr.retiringNext3Yrs}</td>
                  <td className="p-3 text-gray-700">{cr.primaryNeed}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        cr.riskLevel === "High"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      {cr.riskLevel}
                    </span>
                  </td>
                  <td className="p-3 text-gray-600 font-medium">{cr.urgency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
