import React from "react";
import { usePlatform } from "../context/PlatformContext.jsx";
import { Award, ArrowRight, CheckCircle2, Star, Sparkles, X } from "lucide-react";

export default function ScoreUpdateModal() {
  const { levelUpModal, setLevelUpModal, setActiveTab } = usePlatform();

  if (!levelUpModal.isOpen) return null;

  const handleClose = () => {
    setLevelUpModal({ ...levelUpModal, isOpen: false });
  };

  const handleGoToDashboard = () => {
    setLevelUpModal({ ...levelUpModal, isOpen: false });
    setActiveTab("dashboard");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-2xl border-4 border-[#0B3D91] max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Gov Emblem Banner */}
        <div className="bg-[#07265D] text-white p-5 text-center relative">
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 text-gray-300 hover:text-white p-1 rounded"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-flex items-center justify-center w-14 h-14 bg-amber-400 text-[#07265D] rounded-full shadow-lg mb-2">
            <Award className="w-8 h-8" />
          </div>
          <div className="text-xs font-semibold text-amber-300 uppercase tracking-widest">
            Official Competency Certification
          </div>
          <h3 className="text-xl font-bold font-serif-gov mt-1">
            Proficiency Level Upgraded!
          </h3>
          <p className="text-xs text-gray-300 mt-1">
            Verified under MoSPI Competency Evaluation Standards
          </p>
        </div>

        {/* Level Transition Visual */}
        <div className="p-6 text-center">
          <div className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wider">
            {levelUpModal.competencyCode}
          </div>
          <h4 className="text-lg font-bold text-gray-900 mb-6">
            {levelUpModal.skillName}
          </h4>

          <div className="flex items-center justify-center space-x-6 bg-blue-50/60 p-4 rounded-xl border border-blue-200 mb-6">
            {/* Old Level */}
            <div className="text-center">
              <div className="text-xs text-gray-500 font-medium">Previous</div>
              <div className="text-2xl font-bold text-gray-600 mt-1">
                Level {levelUpModal.oldLevel}
              </div>
              <span className="text-[10px] text-gray-400">Baseline</span>
            </div>

            <div className="flex flex-col items-center">
              <Sparkles className="w-5 h-5 text-amber-500 animate-bounce mb-1" />
              <ArrowRight className="w-6 h-6 text-[#0B3D91]" />
            </div>

            {/* New Level */}
            <div className="text-center">
              <div className="text-xs text-amber-700 font-bold uppercase tracking-wider">
                New Verified
              </div>
              <div className="text-3xl font-extrabold text-[#0B3D91] mt-0.5">
                Level {levelUpModal.newLevel}
              </div>
              <span className="text-[10px] bg-green-100 text-green-800 font-bold px-1.5 py-0.5 rounded border border-green-300">
                +1 Level Gained
              </span>
            </div>
          </div>

          {/* Credits & Recognition */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-left flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-amber-400 text-[#07265D] flex items-center justify-center font-bold">
              <Star className="w-4 h-4 fill-current" />
            </div>
            <div className="text-xs">
              <div className="font-bold text-amber-950">+150 iGOT Karmayogi Credits</div>
              <div className="text-amber-800 text-[11px]">
                Credited to your official Civil Service Training Record (KY-MOSPI).
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handleGoToDashboard}
              className="flex-1 bg-[#0B3D91] hover:bg-[#07265D] text-white py-2.5 px-4 rounded-lg font-bold text-xs shadow-md transition-colors flex items-center justify-center space-x-1.5"
            >
              <span>View Updated Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleClose}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 px-4 rounded-lg font-semibold text-xs transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
