import React, { useState } from "react";
import { usePlatform } from "../context/PlatformContext.jsx";
import { VIRTUAL_LABS } from "../data/mockData.js";
import {
  Code2,
  Play,
  RotateCcw,
  CheckCircle2,
  Terminal,
  BookOpen,
  Sparkles,
  Layers,
  Cpu,
  RefreshCw,
} from "lucide-react";

export default function VirtualLabsPage() {
  const {
    activeLabId,
    setActiveLabId,
    labCode,
    setLabCode,
    labConsoleOutput,
    isLabRunning,
    runVirtualLabCode,
  } = usePlatform();

  const currentLab = VIRTUAL_LABS.find((l) => l.id === activeLabId) || VIRTUAL_LABS[0];

  const handleSelectLab = (lab) => {
    setActiveLabId(lab.id);
    setLabCode(lab.starterCode);
  };

  const handleResetCode = () => {
    setLabCode(currentLab.starterCode);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-900 uppercase tracking-wider">
            <Cpu className="w-4 h-4 text-amber-500" />
            <span>Interactive Practical Sandboxes</span>
          </div>
          <h2 className="text-xl font-bold text-[#0B3D91] font-serif-gov mt-0.5">
            MoSPI Official Statistics Virtual Labs
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Simulated cloud development environments for survey data cleaning, national accounts database queries, and geospatial boundary validation.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs bg-blue-50 text-blue-900 border border-blue-200 px-3 py-1.5 rounded-lg font-bold">
            Runtime: MeghRaj GovCloud (Sandboxed)
          </span>
        </div>
      </div>

      {/* Lab Tabs Ribbon */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {VIRTUAL_LABS.map((lab) => {
          const isActive = lab.id === currentLab.id;
          return (
            <button
              key={lab.id}
              onClick={() => handleSelectLab(lab)}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap border flex items-center space-x-2 ${
                isActive
                  ? "bg-[#0B3D91] text-white border-[#0B3D91] shadow-xs"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              <Code2 className={`w-3.5 h-3.5 ${isActive ? "text-amber-300" : "text-blue-900"}`} />
              <span>{lab.title.split(":")[0]}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-normal ${isActive ? "bg-blue-800 text-blue-100" : "bg-gray-100 text-gray-600"}`}>
                {lab.language.toUpperCase()}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main IDE Layout: Left Instructions & Objective, Right Editor & Console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Objective & Instructions */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-3">
              <span className="text-xs font-mono font-bold bg-blue-50 text-blue-900 px-2 py-0.5 rounded border border-blue-200">
                {currentLab.language.toUpperCase()}
              </span>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                Difficulty: {currentLab.difficulty}
              </span>
            </div>

            <h3 className="text-base font-bold text-gray-900 font-serif-gov mb-2">
              {currentLab.title}
            </h3>

            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              {currentLab.objective}
            </p>

            <div className="space-y-3 pt-3 border-t border-gray-200">
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center space-x-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-900" />
                <span>Laboratory Instructions:</span>
              </h4>
              <ul className="space-y-2 text-xs text-gray-700">
                {currentLab.instructions.map((inst, idx) => (
                  <li key={idx} className="flex items-start space-x-1.5">
                    <span className="text-blue-900 font-bold">•</span>
                    <span>{inst}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#07265D] to-[#0B3D91] text-white p-4 rounded-lg shadow-xs text-xs">
            <div className="flex items-center space-x-1.5 text-amber-400 font-bold mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Competency Bridging Impact</span>
            </div>
            <p className="text-gray-300 leading-relaxed text-[11px]">
              Executing and passing this virtual lab validates your operational capability in <strong>{currentLab.domain}</strong> and contributes directly toward higher proficiency ratings in official promotions.
            </p>
          </div>
        </div>

        {/* Right 2 Columns: Mock Code Editor & Execution Console */}
        <div className="lg:col-span-2 space-y-4">
          {/* Editor Container */}
          <div className="bg-[#1E1E1E] rounded-lg shadow-lg border border-gray-700 overflow-hidden">
            {/* Editor Toolbar */}
            <div className="bg-[#2D2D2D] px-4 py-2.5 flex items-center justify-between border-b border-gray-700 text-xs text-gray-300">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
                <span className="font-mono text-gray-300 ml-2 text-[11px]">
                  script.{currentLab.language === "python" ? "py" : currentLab.language}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleResetCode}
                  className="text-gray-400 hover:text-white px-2 py-1 rounded text-[11px] flex items-center space-x-1 hover:bg-gray-700 transition-colors"
                  title="Reset to starter code"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
                <button
                  onClick={() => runVirtualLabCode()}
                  disabled={isLabRunning}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold px-3 py-1 rounded text-xs flex items-center space-x-1.5 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {isLabRunning ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Executing...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Run Script</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Code Textarea */}
            <div className="p-4 bg-[#1E1E1E]">
              <textarea
                value={labCode}
                onChange={(e) => setLabCode(e.target.value)}
                rows={13}
                className="w-full bg-transparent font-mono text-xs text-gray-200 focus:outline-none resize-y leading-relaxed"
                spellCheck={false}
              />
            </div>
          </div>

          {/* Console Output Window */}
          <div className="bg-[#0F172A] rounded-lg border border-slate-700 shadow-xs overflow-hidden">
            <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center space-x-2 font-mono font-bold text-[11px]">
                <Terminal className="w-3.5 h-3.5 text-green-400" />
                <span>Simulation Terminal Output</span>
              </div>
              <span className="text-[10px] text-slate-400">Exit Code: 0 (Success)</span>
            </div>

            <div className="p-4 font-mono text-xs text-green-400 whitespace-pre-wrap leading-relaxed min-h-[120px] max-h-[220px] overflow-y-auto">
              {labConsoleOutput}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
