import React, { useState } from "react";
import { usePlatform } from "../context/PlatformContext.jsx";
import {
  MessageSquare,
  ThumbsUp,
  Send,
  Sparkles,
  Filter,
  CheckCircle2,
  Award,
  User,
  PlusCircle,
  X,
} from "lucide-react";

export default function DiscussHubPage() {
  const {
    discussions,
    addDiscussionReply,
    addDiscussionThread,
    upvoteDiscussion,
    role,
    currentUser,
  } = usePlatform();

  const [selectedDivision, setSelectedDivision] = useState("ALL");
  const [replyInputs, setReplyInputs] = useState({});
  const [isCreatingThread, setIsCreatingThread] = useState(false);
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [newThreadContent, setNewThreadContent] = useState("");
  const [newThreadDivision, setNewThreadDivision] = useState("Survey Design & Research Division (SDRD)");

  const divisions = [
    "ALL",
    "Field Operations Division (FOD)",
    "Survey Design & Research Division (SDRD)",
    "National Accounts Division (NAD)",
    "Price Statistics Division (PSD)",
    "Data Quality Assurance Division (DQAD)",
  ];

  const filteredDiscussions =
    selectedDivision === "ALL"
      ? discussions
      : discussions.filter((d) => d.division.includes(selectedDivision.split(" ")[0]));

  const handleReplyChange = (threadId, val) => {
    setReplyInputs({ ...replyInputs, [threadId]: val });
  };

  const handlePostReply = (threadId) => {
    const text = replyInputs[threadId];
    if (!text || !text.trim()) return;
    addDiscussionReply(threadId, text);
    setReplyInputs({ ...replyInputs, [threadId]: "" });
  };

  const handleCreateThread = (e) => {
    e.preventDefault();
    if (!newThreadTitle.trim() || !newThreadContent.trim()) return;

    addDiscussionThread({
      title: newThreadTitle,
      content: newThreadContent,
      division: newThreadDivision,
      tags: [newThreadDivision.split(" ")[0], "Statistical Query"],
    });

    setNewThreadTitle("");
    setNewThreadContent("");
    setIsCreatingThread(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-900 uppercase tracking-wider">
            <MessageSquare className="w-4 h-4 text-amber-500" />
            <span>Peer Learning & Technical Exchange</span>
          </div>
          <h2 className="text-xl font-bold text-[#0B3D91] font-serif-gov mt-0.5">
            MoSPI Discuss Hub
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Collaborative inquiry forum connecting field investigators, statisticians, and NSSTA faculty across India.
          </p>
        </div>

        <button
          onClick={() => setIsCreatingThread(!isCreatingThread)}
          className="bg-[#0B3D91] hover:bg-[#07265D] text-white text-xs font-bold py-2 px-3.5 rounded transition-colors flex items-center space-x-1.5 shadow-xs"
        >
          <PlusCircle className="w-3.5 h-3.5 text-amber-300" />
          <span>Ask Statistical Question</span>
        </button>
      </div>

      {/* New Question Form Modal / Dropdown */}
      {isCreatingThread && (
        <div className="bg-white p-5 rounded-lg border-2 border-[#0B3D91] shadow-md animate-in slide-in-from-top-3">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-3">
            <h3 className="text-sm font-bold text-[#0B3D91] font-serif-gov">
              Post Technical Inquiry to MoSPI Cadre
            </h3>
            <button
              onClick={() => setIsCreatingThread(false)}
              className="text-gray-400 hover:text-gray-700 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleCreateThread} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Target Division</label>
              <select
                value={newThreadDivision}
                onChange={(e) => setNewThreadDivision(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-1.5 focus:outline-none"
              >
                <option value="Survey Design & Research Division (SDRD)">Survey Design & Research Division (SDRD)</option>
                <option value="National Accounts Division (NAD)">National Accounts Division (NAD)</option>
                <option value="Field Operations Division (FOD)">Field Operations Division (FOD)</option>
                <option value="Price Statistics Division (PSD)">Price Statistics Division (PSD)</option>
                <option value="Data Quality Assurance Division (DQAD)">Data Quality Assurance Division (DQAD)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Question Subject</label>
              <input
                type="text"
                value={newThreadTitle}
                onChange={(e) => setNewThreadTitle(e.target.value)}
                placeholder="e.g. Guidance on UFS frame substitution during urban flooding..."
                className="w-full border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-600"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Detailed Context & Methodological Issue</label>
              <textarea
                value={newThreadContent}
                onChange={(e) => setNewThreadContent(e.target.value)}
                placeholder="Describe the survey manual clause or practical constraint..."
                rows={3}
                className="w-full border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-600"
                required
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreatingThread(false)}
                className="px-3 py-1.5 border rounded text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#0B3D91] hover:bg-[#07265D] text-white px-4 py-1.5 rounded font-bold transition-colors"
              >
                Publish Question
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Tabs by Division */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        {divisions.map((div) => {
          const isActive = selectedDivision === div;
          return (
            <button
              key={div}
              onClick={() => setSelectedDivision(div)}
              className={`px-3 py-1.5 rounded-full font-semibold transition-colors whitespace-nowrap border ${
                isActive
                  ? "bg-[#0B3D91] text-white border-[#0B3D91]"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {div === "ALL" ? "All Divisions" : div.split("(")[0]}
            </button>
          );
        })}
      </div>

      {/* Threads List */}
      <div className="space-y-4">
        {filteredDiscussions.map((thread) => (
          <div
            key={thread.id}
            className="bg-white rounded-lg border border-gray-200 shadow-xs p-5 hover:border-blue-300 transition-colors"
          >
            {/* Thread Header */}
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-[#07265D] text-white flex items-center justify-center font-bold text-xs">
                  {thread.authorAvatar}
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900">{thread.authorName}</div>
                  <div className="text-[10px] text-gray-500">
                    {thread.authorCadre} • {thread.division} • {thread.postedDate}
                  </div>
                </div>
              </div>

              {/* Upvote Counter */}
              <button
                onClick={() => upvoteDiscussion(thread.id)}
                className="flex items-center space-x-1 px-2.5 py-1 rounded bg-gray-50 hover:bg-blue-50 border border-gray-200 text-xs font-bold text-blue-900 transition-colors"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{thread.upvotes}</span>
              </button>
            </div>

            {/* Title & Body */}
            <h3 className="text-sm font-bold text-[#0B3D91] font-serif-gov mb-1.5">
              {thread.title}
            </h3>
            <p className="text-xs text-gray-700 leading-relaxed mb-3">
              {thread.content}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {thread.tags.map((t, idx) => (
                <span key={idx} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                  #{t}
                </span>
              ))}
            </div>

            {/* Replies Stream */}
            {thread.replies.length > 0 && (
              <div className="space-y-3 pt-3 border-t border-gray-100 pl-4 border-l-2 border-l-blue-200">
                {thread.replies.map((rep) => (
                  <div key={rep.id} className="bg-gray-50/70 p-3 rounded border border-gray-200 text-xs">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-bold text-gray-900">{rep.authorName}</span>
                      {rep.isFaculty && (
                        <span className="text-[9px] bg-amber-400 text-blue-950 font-extrabold px-1.5 py-0.2 rounded border border-amber-500">
                          NSSTA Faculty SME
                        </span>
                      )}
                      <span className="text-[10px] text-gray-400">{rep.postedDate}</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{rep.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Reply Input Box */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center space-x-2">
              <input
                type="text"
                value={replyInputs[thread.id] || ""}
                onChange={(e) => handleReplyChange(thread.id, e.target.value)}
                placeholder={
                  role === "trainer"
                    ? "Reply as NSSTA Faculty Expert..."
                    : "Add your official perspective or field experience..."
                }
                className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none"
              />
              <button
                onClick={() => handlePostReply(thread.id)}
                className="bg-[#0B3D91] hover:bg-[#07265D] text-white px-3.5 py-1.5 rounded text-xs font-bold transition-colors flex items-center space-x-1"
              >
                <Send className="w-3 h-3" />
                <span>Reply</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
