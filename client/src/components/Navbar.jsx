import React from "react";
import { usePlatform } from "../context/PlatformContext.jsx";
import {
  BookOpen,
  Award,
  Briefcase,
  MessagesSquare,
  Users,
  Calendar,
  Sparkles,
  BarChart3,
  TrendingUp,
  UserCheck,
  ShieldCheck,
  FileCheck2,
  Layers,
} from "lucide-react";

export default function Navbar() {
  const { activeHub, setActiveHub, role, language } = usePlatform();

  // 1. Learner Experience: The authentic iGOT Karmayogi SIX FUNCTIONAL HUBS
  const learnerHubs = [
    {
      id: "learn",
      label: language === "HI" ? "अध्ययन केंद्र" : "Learn Hub",
      icon: BookOpen,
      badge: "Core",
    },
    {
      id: "competency",
      label: language === "HI" ? "दक्षता केंद्र" : "Competency Hub",
      icon: Award,
    },
    {
      id: "career",
      label: language === "HI" ? "करियर केंद्र" : "Career Hub",
      icon: Briefcase,
    },
    {
      id: "discuss",
      label: language === "HI" ? "संवाद मंच" : "Discuss Hub",
      icon: MessagesSquare,
    },
    {
      id: "network",
      label: language === "HI" ? "सहकर्मी नेटवर्क" : "Network Hub",
      icon: Users,
    },
    {
      id: "events",
      label: language === "HI" ? "कार्यक्रम कैलेंडर" : "Events Hub",
      icon: Calendar,
    },
  ];

  // 2. Trainer Experience: Content Studio, Q-Bank, Manual Builder, Discuss as SME
  const trainerHubs = [
    {
      id: "trainer-studio",
      label: language === "HI" ? "कंटेंट एवं मूल्यांकन स्टूडियो" : "Trainer Studio",
      icon: Sparkles,
      badge: "GenAI",
    },
    {
      id: "learn",
      label: language === "HI" ? "पाठ्यक्रम कैटलॉग" : "iGOT Catalogue",
      icon: BookOpen,
    },
    {
      id: "discuss",
      label: language === "HI" ? "संवाद एवं विशेषज्ञ परामर्श" : "Discuss (Faculty SME)",
      icon: MessagesSquare,
    },
    {
      id: "network",
      label: language === "HI" ? "अधिकारी नेटवर्क" : "Officials Directory",
      icon: Users,
    },
  ];

  // 3. Admin Experience: Executive Analytics, Workforce Planning, Role Governance, Audit Log
  const adminHubs = [
    {
      id: "admin-analytics",
      label: language === "HI" ? "नेतृत्व एनालिटिक्स" : "Executive Analytics",
      icon: BarChart3,
    },
    {
      id: "admin-workforce",
      label: language === "HI" ? "कार्यबल नियोजन 2026-29" : "Workforce Planning (2026-29)",
      icon: TrendingUp,
      badge: "Forecast",
    },
    {
      id: "admin-roles",
      label: language === "HI" ? "उपयोगकर्ता एवं पद प्रबंधन" : "User & Role Management",
      icon: UserCheck,
    },
    {
      id: "admin-audit",
      label: language === "HI" ? "सुरक्षा एवं अनुपालन ऑडिट" : "Audit Log",
      icon: ShieldCheck,
      badge: "DPDP",
    },
    {
      id: "learn",
      label: language === "HI" ? "पाठ्यक्रम केंद्र" : "Learn Hub",
      icon: BookOpen,
    },
  ];

  const currentNavItems =
    role === "admin" ? adminHubs : role === "trainer" ? trainerHubs : learnerHubs;

  return (
    <nav className="bg-[#0B3D91] shadow-md border-b-2 border-amber-500 sticky top-0 z-30 select-none">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex items-center space-x-1 overflow-x-auto py-1 scrollbar-none">
          {currentNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeHub === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveHub(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2.5 rounded text-xs sm:text-[13px] font-medium transition-all whitespace-nowrap relative ${
                  isActive
                    ? "bg-[#07265D] text-amber-300 font-bold shadow-inner border-b-2 border-amber-400"
                    : "text-gray-100 hover:bg-blue-900 hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-amber-300" : "text-blue-200"}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider ${
                      isActive
                        ? "bg-amber-400 text-black"
                        : "bg-blue-800 text-amber-200 border border-blue-700"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
