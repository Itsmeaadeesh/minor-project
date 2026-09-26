import React, { useState } from "react";
import { usePlatform } from "../context/PlatformContext.jsx";
import {
  ShieldAlert,
  Search,
  Filter,
  Download,
  Calendar,
  FileText,
  UserCheck,
  CheckCircle,
} from "lucide-react";

export default function AuditLogPage() {
  const { auditLogs, addToast } = usePlatform();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("ALL");
  const [selectedActionFilter, setSelectedActionFilter] = useState("ALL");

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ipAddress.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole =
      selectedRoleFilter === "ALL" || log.role.toUpperCase() === selectedRoleFilter.toUpperCase();
    const matchesAction =
      selectedActionFilter === "ALL" || log.action.includes(selectedActionFilter);
    return matchesSearch && matchesRole && matchesAction;
  });

  const handleExportCSV = () => {
    addToast("Audit Log Exported", "Downloaded tamper-evident compliance audit trail (CSV format).", "success");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-900 uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-purple-700" />
            <span>DPDP Act 2023 & MoSPI Administrative Security Standards</span>
          </div>
          <h1 className="text-xl font-bold text-[#0B3D91] font-serif-gov mt-0.5">
            System Audit Trail & Compliance Log
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Immutable chronological ledger recording all role switches, assessment publications, competency adjustments, and course enrolments.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="bg-[#0B3D91] hover:bg-[#07265D] text-white text-xs font-bold px-3.5 py-2 rounded transition-colors flex items-center space-x-1.5 shadow-xs"
        >
          <Download className="w-3.5 h-3.5 text-amber-300" />
          <span>Export Audit Log (CSV)</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search actor, action type, IP address, or details..."
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-600 focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <select
            value={selectedRoleFilter}
            onChange={(e) => setSelectedRoleFilter(e.target.value)}
            className="border border-gray-300 rounded px-2.5 py-2 font-medium bg-white text-gray-700 focus:outline-none"
          >
            <option value="ALL">All Roles</option>
            <option value="LEARNER">Learner</option>
            <option value="TRAINER">Trainer / Faculty</option>
            <option value="ADMIN">Admin</option>
          </select>

          <select
            value={selectedActionFilter}
            onChange={(e) => setSelectedActionFilter(e.target.value)}
            className="border border-gray-300 rounded px-2.5 py-2 font-medium bg-white text-gray-700 focus:outline-none"
          >
            <option value="ALL">All Actions</option>
            <option value="USER_">Logins & Profiles</option>
            <option value="COURSE_">Course Enrolments</option>
            <option value="ASSESSMENT_">Assessment Actions</option>
            <option value="COMPETENCY_">Competency Upgrades</option>
            <option value="TPAC_">TPAC Nominations</option>
            <option value="ROLE_">Role Elevations</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-gray-50 text-gray-700 font-bold border-b border-gray-200">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Actor & Karmayogi ID</th>
                <th className="p-3">Role</th>
                <th className="p-3">Action Tag</th>
                <th className="p-3">Event Description</th>
                <th className="p-3 font-mono">Source IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 font-mono text-[11px]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/80 transition-colors font-sans">
                  <td className="p-3 font-mono text-[11px] text-gray-500 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="p-3 font-medium text-gray-900">
                    {log.actor}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        log.role.toUpperCase() === "ADMIN"
                          ? "bg-purple-50 text-purple-800 border-purple-200"
                          : log.role.toUpperCase() === "TRAINER"
                          ? "bg-amber-50 text-amber-800 border-amber-200"
                          : "bg-blue-50 text-blue-800 border-blue-200"
                      }`}
                    >
                      {log.role}
                    </span>
                  </td>
                  <td className="p-3 font-mono font-bold text-gray-800 text-[10px]">
                    {log.action}
                  </td>
                  <td className="p-3 text-gray-600 max-w-md">
                    {log.details}
                  </td>
                  <td className="p-3 font-mono text-gray-400 text-[10px]">
                    {log.ipAddress}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
