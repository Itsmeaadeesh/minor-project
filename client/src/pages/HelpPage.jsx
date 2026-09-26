import React from "react";
import { usePlatform } from "../context/PlatformContext.jsx";
import {
  HelpCircle,
  Award,
  BookOpen,
  Sparkles,
  GitCompare,
  FileCheck2,
  CheckCircle,
  ExternalLink,
  Bot,
} from "lucide-react";

export default function HelpPage() {
  const { setActiveTab } = usePlatform();

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs">
        <div className="flex items-center space-x-2 text-xs font-semibold text-blue-900 uppercase tracking-wider">
          <HelpCircle className="w-4 h-4 text-amber-500" />
          <span>Platform Documentation & Hackathon Brief</span>
        </div>
        <h2 className="text-xl font-bold text-[#0B3D91] font-serif-gov mt-0.5">
          About Skill Setu (SIH 2026 - PS ID: SIH26101)
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          AI-Enabled Skill Intelligence & Learning Platform for Government of India Officials (MoSPI / NSSTA).
        </p>
      </div>

      {/* Problem Statement Card */}
      <div className="bg-[#07265D] text-white p-5 rounded-lg border-2 border-amber-500 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs bg-amber-400 text-blue-950 font-bold px-2 py-0.5 rounded">
            Smart India Hackathon 2026
          </span>
          <span className="text-xs text-amber-300 font-mono font-bold">PS ID: SIH26101</span>
        </div>
        <h3 className="text-base font-bold font-serif-gov mt-2 text-white">
          AI-Driven Skill Gap Analysis & Adaptive Learning Platform for Official Statistics Cadre
        </h3>
        <p className="text-xs text-gray-300 mt-2 leading-relaxed">
          The Ministry of Statistics and Programme Implementation (MoSPI) and National Statistical Systems Training Academy (NSSTA) mandate a comprehensive, AI-enabled competency intelligence architecture. Skill Setu addresses civil service capacity building through automated competency profiling, gap diagnosis against promotional benchmarks, explainable iGOT course recommendations, and in-situ AI assessment generation from ministry manuals.
        </p>
      </div>

      {/* Recommended Judge Click-Through Flow */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs">
        <h3 className="text-base font-bold text-[#0B3D91] font-serif-gov mb-3">
          Recommended Demonstration Workflow for Evaluators
        </h3>
        <p className="text-xs text-gray-600 mb-4">
          Judges can experience the entire end-to-end intelligent pipeline in 5 interactive steps:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-[#0B3D91]">Step 1: Dashboard</span>
              <p className="text-[11px] text-gray-600 mt-1">
                Inspect official profile, interactive competency heatmap, and priority gap cards.
              </p>
            </div>
            <button
              onClick={() => setActiveTab("dashboard")}
              className="mt-3 text-[11px] font-bold text-[#0B3D91] hover:underline"
            >
              Open Dashboard →
            </button>
          </div>

          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-[#0B3D91]">Step 2: Gap Engine</span>
              <p className="text-[11px] text-gray-600 mt-1">
                Select target role (e.g. Deputy Director) to view Radar and Bar charts.
              </p>
            </div>
            <button
              onClick={() => setActiveTab("skillgap")}
              className="mt-3 text-[11px] font-bold text-[#0B3D91] hover:underline"
            >
              Open Gap Engine →
            </button>
          </div>

          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-[#0B3D91]">Step 3: AI Recommendations</span>
              <p className="text-[11px] text-gray-600 mt-1">
                Review transparent rule-based explainability rationale and enroll in 1 click.
              </p>
            </div>
            <button
              onClick={() => setActiveTab("recommendations")}
              className="mt-3 text-[11px] font-bold text-[#0B3D91] hover:underline"
            >
              See Recommendations →
            </button>
          </div>

          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-[#0B3D91]">Step 4: AI Assessment</span>
              <p className="text-[11px] text-gray-600 mt-1">
                Take a diagnostic test, get instant explanations, and see your level increase!
              </p>
            </div>
            <button
              onClick={() => setActiveTab("assessments")}
              className="mt-3 text-[11px] font-bold text-[#0B3D91] hover:underline"
            >
              Take Assessment →
            </button>
          </div>

          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-[#0B3D91]">Step 5: Admin Analytics</span>
              <p className="text-[11px] text-gray-600 mt-1">
                Switch role to Admin (top bar) to review ministry-wide macro analytics.
              </p>
            </div>
            <button
              onClick={() => setActiveTab("admin")}
              className="mt-3 text-[11px] font-bold text-[#0B3D91] hover:underline"
            >
              Open Org Analytics →
            </button>
          </div>
        </div>
      </div>

      {/* Technical FAQ */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-[#0B3D91] font-serif-gov">
          Frequently Asked Technical Questions
        </h3>

        <div className="space-y-3 text-xs">
          <div className="border border-gray-200 rounded-lg p-3.5 bg-gray-50/50">
            <h4 className="font-bold text-gray-900 mb-1">
              Q: Are the AI features simulated or using cloud LLM APIs?
            </h4>
            <p className="text-gray-600 leading-relaxed">
              In accordance with hackathon instructions, all AI features (competency profiling, explainable recommendations, question item synthesis, and chat assistant) are simulated using realistic, deterministic rule-engines and simulated processing steppers. This guarantees zero latency, complete privacy, deterministic testability, and 100% offline availability for demonstrations.
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-3.5 bg-gray-50/50">
            <h4 className="font-bold text-gray-900 mb-1">
              Q: How is session state persisted?
            </h4>
            <p className="text-gray-600 leading-relaxed">
              All state is maintained in-memory using React Context (`PlatformContext.jsx`). Strictly zero `localStorage` or `sessionStorage` is utilized per the problem specification, guaranteeing fresh session starts while remaining fully interactive during active use.
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-3.5 bg-gray-50/50">
            <h4 className="font-bold text-gray-900 mb-1">
              Q: Does the visual theme adhere to Government of India Web Guidelines (GIGW)?
            </h4>
            <p className="text-gray-600 leading-relaxed">
              Yes. The visual theme implements official navy blue (`#0B3D91`), saffron accent (`#FF9933`), Ashoka Chakra blue, national emblem placeholder with "सत्यमेव जयते", standard serif headings (Georgia), clean sans body typography, "Skip to Main Content", bilingual toggle (EN/HI), and high-contrast / font-resize accessibility toggles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
