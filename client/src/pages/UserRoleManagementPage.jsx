import React, { useState } from "react";
import { usePlatform } from "../context/PlatformContext.jsx";
import {
  Users,
  ShieldCheck,
  Edit2,
  Eye,
  CheckCircle,
  AlertTriangle,
  Search,
  Filter,
} from "lucide-react";

export default function UserRoleManagementPage() {
  const {
    profiles,
    changeUserRole,
    setSelectedOfficialForDrilldown,
    currentUser,
    addToast,
  } = usePlatform();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("ALL");

  // Confirmation Modal state
  const [modalState, setModalState] = useState({
    isOpen: false,
    user: null,
    newRole: "",
  });

  const filteredProfiles = profiles.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.karmayogiId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === "ALL" || p.department.includes(selectedDept);
    return matchesSearch && matchesDept;
  });

  const handleOpenRoleModal = (user) => {
    setModalState({
      isOpen: true,
      user,
      newRole: user.role,
    });
  };

  const handleConfirmRoleChange = () => {
    if (modalState.user && modalState.newRole) {
      changeUserRole(modalState.user.id, modalState.newRole);
      setModalState({ isOpen: false, user: null, newRole: "" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-900 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>MoSPI Administrative Console • Cadre Governance</span>
          </div>
          <h1 className="text-xl font-bold text-[#0B3D91] font-serif-gov mt-0.5">
            User Directory & Cadre Designation Management
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Administer civil servant access credentials, modify official designations with audit trails, and inspect individual learner roadmaps.
          </p>
        </div>

        <div className="text-xs bg-blue-50 text-blue-900 border border-blue-200 px-3 py-1.5 rounded-lg font-bold">
          {profiles.length} Verified SSO Personnel
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search official by name, ID, or rank..."
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-600 focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="border border-gray-300 rounded px-2.5 py-2 font-medium bg-white text-gray-700 focus:outline-none"
          >
            <option value="ALL">All MoSPI Divisions</option>
            <option value="SDRD">SDRD (Survey Design)</option>
            <option value="NAD">NAD (National Accounts)</option>
            <option value="Price">Price Statistics Division</option>
            <option value="DQAD">DQAD (Data Quality)</option>
            <option value="NSSTA">NSSTA Faculty</option>
          </select>
        </div>
      </div>

      {/* Official Directory Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-gray-50 text-gray-700 font-bold border-b border-gray-200">
              <tr>
                <th className="p-3.5">Official Name & Parichay ID</th>
                <th className="p-3.5">Cadre & Service</th>
                <th className="p-3.5">Current Designation</th>
                <th className="p-3.5">Division / State</th>
                <th className="p-3.5">Experience</th>
                <th className="p-3.5 text-center">Administrative Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProfiles.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="p-3.5">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-[#0B3D91] text-white flex items-center justify-center font-bold text-xs">
                        {p.avatar}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{p.name}</div>
                        <div className="text-[10px] font-mono text-gray-500">{p.karmayogiId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5 font-medium text-gray-700">{p.cadre}</td>
                  <td className="p-3.5">
                    <span className="font-semibold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {p.role}
                    </span>
                  </td>
                  <td className="p-3.5 text-gray-600">{p.department} ({p.location})</td>
                  <td className="p-3.5 font-mono">{p.experienceYears} Years</td>
                  <td className="p-3.5 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleOpenRoleModal(p)}
                        className="p-1.5 rounded hover:bg-blue-50 text-blue-700 border border-blue-200 flex items-center space-x-1 font-semibold text-[11px]"
                        title="Edit Role / Designation"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit Role</span>
                      </button>
                      <button
                        onClick={() => setSelectedOfficialForDrilldown(p)}
                        className="p-1.5 rounded hover:bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center space-x-1 font-semibold text-[11px]"
                        title="Inspect Official FRAC Profile"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect Profile</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal for Role Modification */}
      {modalState.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-5 border border-gray-200 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center space-x-3 text-amber-600">
              <AlertTriangle className="w-6 h-6 flex-shrink-0" />
              <h3 className="text-sm font-bold text-gray-900">
                Confirm Designation / Cadre Change
              </h3>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Modifying the official designation of <strong>{modalState.user?.name}</strong> will update their target competency profile and log an audit record under the MoSPI administrative registry.
            </p>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Select New Role / Rank</label>
              <select
                value={modalState.newRole}
                onChange={(e) => setModalState({ ...modalState, newRole: e.target.value })}
                className="w-full border border-gray-300 rounded p-2 text-xs font-medium"
              >
                <option value="Junior Statistical Officer (JSO)">Junior Statistical Officer (JSO)</option>
                <option value="Senior Statistical Officer (SSO)">Senior Statistical Officer (SSO)</option>
                <option value="Assistant Director (AD)">Assistant Director (AD)</option>
                <option value="Deputy Director (DD)">Deputy Director (DD)</option>
                <option value="Joint Director (JD)">Joint Director (JD)</option>
                <option value="NSSTA Faculty / Subject Matter Specialist">NSSTA Faculty / Subject Matter Specialist</option>
              </select>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-gray-200">
              <button
                onClick={() => setModalState({ isOpen: false, user: null, newRole: "" })}
                className="px-3.5 py-1.5 rounded text-xs text-gray-600 hover:bg-gray-100 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRoleChange}
                className="px-4 py-1.5 rounded text-xs bg-[#0B3D91] hover:bg-[#07265D] text-white font-bold transition-colors"
              >
                Confirm & Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
