import React from "react";
import { usePlatform } from "../context/PlatformContext.jsx";
import {
  ShieldCheck,
  User,
  Key,
  Lock,
  X,
  CheckCircle,
  Building,
  Award,
  Users,
  Layers,
  ArrowRight,
} from "lucide-react";

export default function ParichayLoginModal() {
  const { parichayModalOpen, setParichayModalOpen, role, switchRole, profiles, switchUser, addToast } = usePlatform();

  if (!parichayModalOpen) return null;

  const handleSelectRole = (newRole, defaultUserId) => {
    switchRole(newRole);
    if (defaultUserId) {
      switchUser(defaultUserId);
    }
    setParichayModalOpen(false);
    addToast(
      "Parichay SSO Authentication Verified",
      `Session established under Jan Parichay National Gateway (2FA Validated). Role: ${newRole.toUpperCase()}.`,
      "success"
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl border-4 border-[#0B3D91] max-w-xl w-full overflow-hidden">
        {/* Parichay Official Top Header */}
        <div className="bg-[#07265D] text-white p-5 border-b-2 border-amber-500 relative">
          <button
            onClick={() => setParichayModalOpen(false)}
            className="absolute top-3 right-3 text-gray-300 hover:text-white p-1 rounded hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center p-1.5 shadow-sm">
              <svg viewBox="0 0 100 120" className="w-8 h-10 text-[#0B3D91]" fill="currentColor">
                <path d="M 50,5 C 38,5 34,14 34,22 C 34,30 38,36 42,40 C 35,42 22,48 22,62 C 22,76 34,80 44,81 L 44,95 L 26,95 L 24,106 L 76,106 L 74,95 L 56,95 L 56,81 C 66,80 78,76 78,62 C 78,48 65,42 58,40 C 62,36 66,30 66,22 C 66,14 62,5 50,5 Z" fill="#0B3D91" />
              </svg>
            </div>
            <div>
              <div className="text-[10px] text-amber-300 uppercase font-bold tracking-widest">
                National Single Sign-On (NSSO)
              </div>
              <h3 className="text-xl font-bold font-serif-gov">
                जन परिचय <span className="text-amber-400">| Jan Parichay</span>
              </h3>
              <p className="text-xs text-gray-300">
                Single Sign-On Service for Government Officials (MoSPI / iGOT Karmayogi)
              </p>
            </div>
          </div>
        </div>

        {/* Stats Strip / Trust Indicators */}
        <div className="bg-blue-50/90 border-b border-blue-200 px-5 py-3 grid grid-cols-3 gap-2 text-center text-xs">
          <div>
            <div className="font-extrabold text-[#0B3D91] text-sm">5,430+</div>
            <div className="text-[10px] text-gray-600">Officials Onboarded</div>
          </div>
          <div>
            <div className="font-extrabold text-amber-600 text-sm">120+</div>
            <div className="text-[10px] text-gray-600">Accredited Modules</div>
          </div>
          <div>
            <div className="font-extrabold text-green-700 text-sm">28 States & UTs</div>
            <div className="text-[10px] text-gray-600">Covered in Matrix</div>
          </div>
        </div>

        {/* Modal Body: Role Selectors */}
        <div className="p-6 space-y-4 text-xs">
          <div className="text-gray-600 text-center mb-2">
            Select an authorized civil service persona to simulate GoI authentication:
          </div>

          {/* Persona 1: Learner */}
          <div
            onClick={() => handleSelectRole("learner", "user-001")}
            className={`p-3.5 rounded-lg border-2 cursor-pointer transition-all hover:border-[#0B3D91] flex items-center justify-between ${
              role === "learner" ? "border-[#0B3D91] bg-blue-50/60" : "border-gray-200 bg-white"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#0B3D91] text-white flex items-center justify-center font-bold text-sm">
                AS
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-gray-900 text-sm">Aadeesh Sharma</span>
                  <span className="text-[10px] bg-blue-100 text-blue-900 font-bold px-1.5 py-0.2 rounded">
                    LEARNER
                  </span>
                </div>
                <div className="text-gray-500 text-[11px]">
                  Junior Statistical Officer (JSO) • Subordinate Statistical Service (SSS)
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </div>

          {/* Persona 2: Trainer */}
          <div
            onClick={() => handleSelectRole("trainer", "user-005")}
            className={`p-3.5 rounded-lg border-2 cursor-pointer transition-all hover:border-amber-500 flex items-center justify-between ${
              role === "trainer" ? "border-amber-500 bg-amber-50/60" : "border-gray-200 bg-white"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-sm">
                VS
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-gray-900 text-sm">Dr. Vikramaditya Sengupta</span>
                  <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.2 rounded">
                    TRAINER
                  </span>
                </div>
                <div className="text-gray-500 text-[11px]">
                  Director, NSSTA Greater Noida • Assessment Author & Faculty Lead
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </div>

          {/* Persona 3: Admin */}
          <div
            onClick={() => handleSelectRole("admin", "user-003")}
            className={`p-3.5 rounded-lg border-2 cursor-pointer transition-all hover:border-purple-600 flex items-center justify-between ${
              role === "admin" ? "border-purple-600 bg-purple-50/60" : "border-gray-200 bg-white"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-purple-800 text-white flex items-center justify-center font-bold text-sm">
                RM
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-gray-900 text-sm">Rajesh Kumar Meena</span>
                  <span className="text-[10px] bg-purple-100 text-purple-900 font-bold px-1.5 py-0.2 rounded">
                    ADMIN
                  </span>
                </div>
                <div className="text-gray-500 text-[11px]">
                  Deputy Director, ESD • Indian Statistical Service (ISS) Leadership
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </div>

          <div className="pt-3 border-t border-gray-200 text-center text-[10px] text-gray-500 flex items-center justify-center space-x-1">
            <Lock className="w-3 h-3 text-green-600" />
            <span>NIC Certified Single Sign-On (Session maintained in-memory, no credentials cached).</span>
          </div>
        </div>
      </div>
    </div>
  );
}
