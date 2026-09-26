import React, { useState } from "react";
import { usePlatform } from "../context/PlatformContext.jsx";
import { MOCK_OFFICIALS_DIRECTORY } from "../data/mockData.js";
import {
  Users,
  Search,
  UserPlus,
  UserCheck,
  Building2,
  MapPin,
  Mail,
  Shield,
  Filter,
} from "lucide-react";

export default function NetworkHubPage() {
  const { myNetwork, toggleNetworkConnection, currentUser } = usePlatform();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("ALL");
  const [selectedCadre, setSelectedCadre] = useState("ALL");

  const filteredOfficials = MOCK_OFFICIALS_DIRECTORY.filter((off) => {
    const matchesSearch =
      off.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      off.division.toLowerCase().includes(searchTerm.toLowerCase()) ||
      off.expertise.some((e) => e.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesState = selectedState === "ALL" || off.state === selectedState;
    const matchesCadre = selectedCadre === "ALL" || off.cadre.includes(selectedCadre);

    return matchesSearch && matchesState && matchesCadre;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-900 uppercase tracking-wider">
            <Users className="w-4 h-4 text-amber-500" />
            <span>All-India Civil Service Peer Directory</span>
          </div>
          <h2 className="text-xl font-bold text-[#0B3D91] font-serif-gov mt-0.5">
            MoSPI Network Hub
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Connect with statistical officers across State Directorates of Economics & Statistics (DES) and Central divisions.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1.5 rounded-lg font-bold">
            My Network: <strong>{myNetwork.size}</strong> Peers Connected
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, expertise, or division..."
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-600 focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <select
            value={selectedCadre}
            onChange={(e) => setSelectedCadre(e.target.value)}
            className="border border-gray-300 rounded px-2.5 py-2 font-medium bg-white text-gray-700 focus:outline-none"
          >
            <option value="ALL">All Cadres</option>
            <option value="SSS">Subordinate Statistical Service (SSS)</option>
            <option value="ISS">Indian Statistical Service (ISS)</option>
            <option value="Non-Cadre">Non-Cadre</option>
          </select>

          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="border border-gray-300 rounded px-2.5 py-2 font-medium bg-white text-gray-700 focus:outline-none"
          >
            <option value="ALL">All States</option>
            <option value="Delhi">Delhi</option>
            <option value="West Bengal">West Bengal</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
          </select>
        </div>
      </div>

      {/* Officials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOfficials.map((off) => {
          const isConnected = myNetwork.has(off.id);

          return (
            <div
              key={off.id}
              className="bg-white rounded-lg border border-gray-200 shadow-xs p-4 flex flex-col justify-between hover:border-blue-300 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-11 h-11 rounded-full bg-[#07265D] text-white flex items-center justify-center font-bold text-sm border-2 border-amber-400">
                      {off.avatar}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-gray-900 leading-tight">
                        {off.name}
                      </h3>
                      <div className="text-[11px] text-[#0B3D91] font-semibold mt-0.5">
                        {off.designation}
                      </div>
                      <div className="text-[10px] text-gray-500">
                        {off.cadre.split(" ")[0]}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] bg-blue-50 text-blue-900 px-1.5 py-0.2 rounded border border-blue-200 font-medium">
                    {off.state}
                  </span>
                </div>

                <div className="text-xs text-gray-600 space-y-1 mb-3 pt-2 border-t border-gray-100">
                  <div className="flex items-center space-x-1 text-[11px]">
                    <Building2 className="w-3.5 h-3.5 text-gray-400" />
                    <span className="truncate">{off.division}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span>{off.location}</span>
                  </div>
                </div>

                {/* Expertise Badges */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {off.expertise.map((exp, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded"
                    >
                      {exp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Connect Button */}
              <div className="pt-3 border-t border-gray-100">
                <button
                  onClick={() => toggleNetworkConnection(off.id)}
                  className={`w-full py-1.5 px-3 rounded text-xs font-bold transition-colors flex items-center justify-center space-x-1.5 ${
                    isConnected
                      ? "bg-green-50 text-green-800 border border-green-300 hover:bg-red-50 hover:text-red-800 hover:border-red-300"
                      : "bg-[#0B3D91] hover:bg-[#07265D] text-white shadow-xs"
                  }`}
                >
                  {isConnected ? (
                    <>
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Connected</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5 text-amber-300" />
                      <span>Connect Official</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
