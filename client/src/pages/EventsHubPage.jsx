import React from "react";
import { usePlatform } from "../context/PlatformContext.jsx";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Users,
  Video,
  ExternalLink,
  Award,
} from "lucide-react";

export default function EventsHubPage() {
  const { eventsList, toggleEventRSVP } = usePlatform();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-900 uppercase tracking-wider">
            <Calendar className="w-4 h-4 text-amber-500" />
            <span>National Academy Academic Calendar</span>
          </div>
          <h2 className="text-xl font-bold text-[#0B3D91] font-serif-gov mt-0.5">
            NSSTA Events, Workshops & Symposia
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Official conferences, technical webinars, and residential symposiums organized by the National Statistical Systems Training Academy.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs bg-blue-50 text-blue-900 border border-blue-200 px-3 py-1.5 rounded-lg font-bold">
            Campus: NSSTA Greater Noida (NCR)
          </span>
        </div>
      </div>

      {/* Events Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {eventsList.map((evt) => (
          <div
            key={evt.id}
            className={`bg-white rounded-lg border shadow-xs p-5 flex flex-col justify-between transition-all ${
              evt.isRSVP
                ? "border-green-400 bg-green-50/20"
                : "border-gray-200 hover:border-blue-300"
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200">
                  {evt.type}
                </span>
                <span className="text-[10px] font-semibold text-gray-500 flex items-center space-x-1">
                  <Video className="w-3.5 h-3.5 text-blue-600" />
                  <span>{evt.mode}</span>
                </span>
              </div>

              <h3 className="text-sm font-bold text-gray-900 font-serif-gov leading-snug">
                {evt.title}
              </h3>
              <div className="text-[11px] text-[#0B3D91] font-semibold mt-1">
                Organizer: {evt.organizer}
              </div>

              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                {evt.description}
              </p>

              {/* Event Metadata */}
              <div className="mt-4 pt-3 border-t border-gray-100 space-y-1.5 text-xs text-gray-600">
                <div className="flex items-center space-x-2 text-[11px]">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  <span className="font-bold text-gray-800">{evt.date}</span>
                  <span>•</span>
                  <span>{evt.time}</span>
                </div>
                <div className="flex items-center space-x-2 text-[11px]">
                  <Award className="w-3.5 h-3.5 text-blue-700" />
                  <span>Lead Faculty: <strong>{evt.speaker}</strong></span>
                </div>
                <div className="flex items-center space-x-2 text-[11px]">
                  <Users className="w-3.5 h-3.5 text-gray-500" />
                  <span>{evt.registeredCount} Officials Confirmed (Capacity: {evt.maxCapacity})</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {evt.tags.map((tag, tIdx) => (
                  <span key={tIdx} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* RSVP Button */}
            <div className="mt-5 pt-3 border-t border-gray-200">
              <button
                onClick={() => toggleEventRSVP(evt.id)}
                className={`w-full py-2 px-3 rounded text-xs font-bold transition-colors flex items-center justify-center space-x-1.5 ${
                  evt.isRSVP
                    ? "bg-green-100 hover:bg-red-50 text-green-800 hover:text-red-800 border border-green-300 hover:border-red-300"
                    : "bg-[#0B3D91] hover:bg-[#07265D] text-white shadow-xs"
                }`}
              >
                {evt.isRSVP ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-green-700" />
                    <span>Attending (Calendar Invite Queued)</span>
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4 text-amber-300" />
                    <span>RSVP / Register for Session</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
