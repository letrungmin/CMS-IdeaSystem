"use client";

import React, { useState } from "react";
import { Lightbulb, Clock, CheckCircle2, XCircle, Filter } from "lucide-react";
import IdeaCard, { IdeaCardProps } from "@/components/IdeaCard";
import EmptyState from "@/components/EmptyState";

// Extending the interface for our specific My Ideas view
interface MyIdeaProps extends IdeaCardProps {
  status: "approved" | "pending" | "rejected";
}

const MY_IDEAS_DATA: MyIdeaProps[] = [
  {
    id: "1",
    authorName: "Trung Min",
    authorInitials: "TM",
    timeAgo: "2 days ago",
    category: "IT Infrastructure",
    title: "Upgrade the Greenwich Campus Wi-Fi",
    description: "We need dedicated bandwidth for the library and lab rooms. The current connection drops frequently during peak hours, severely affecting online exams, research, and daily study activities.",
    reactions: { like: 45, love: 22, wow: 5, haha: 0, sad: 1, angry: 0, dislike: 2 },
    currentUserReaction: 'love',
    commentsCount: 15,
    viewsCount: 342,
    isAnonymous: false,
    status: "approved",
  },
  {
    id: "2",
    authorName: "Trung Min",
    authorInitials: "TM",
    timeAgo: "1 week ago",
    category: "Curriculum Enhancement",
    title: "Introduce Cloud Computing (AWS/Azure) earlier in the syllabus",
    description: "Currently, we only touch upon Cloud technologies in our final year. Moving this to the second year would give students a massive advantage in finding internships.",
    reactions: { like: 112, love: 40, wow: 12, haha: 0, sad: 0, angry: 0, dislike: 1 },
    currentUserReaction: 'like',
    commentsCount: 28,
    viewsCount: 850,
    isAnonymous: false,
    status: "approved",
  },
  {
    id: "3",
    authorName: "Trung Min",
    authorInitials: "TM",
    timeAgo: "2 hours ago",
    category: "Campus Facilities",
    title: "Install more water dispensers in Block B",
    description: "There is currently only one water dispenser on the 3rd floor, which is always empty by noon. We need at least two on each floor to keep students hydrated.",
    reactions: { like: 5, love: 0, wow: 0, haha: 0, sad: 0, angry: 0, dislike: 0 },
    currentUserReaction: 'like',
    commentsCount: 2,
    viewsCount: 15,
    isAnonymous: false,
    status: "pending",
  }
];

export default function MyIdeasPage() {
  const [filter, setFilter] = useState<"all" | "approved" | "pending" | "rejected">("all");

  const filteredIdeas = MY_IDEAS_DATA.filter(idea => filter === "all" || idea.status === filter);

  // Stats for the top cards
  const stats = {
    total: MY_IDEAS_DATA.length,
    approved: MY_IDEAS_DATA.filter(i => i.status === "approved").length,
    pending: MY_IDEAS_DATA.filter(i => i.status === "pending").length,
    rejected: MY_IDEAS_DATA.filter(i => i.status === "rejected").length,
  };

  // Status Badge Component
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <div className="flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-extrabold uppercase shrink-0 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Approved
          </div>
        );
      case "pending":
        return (
          <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-[10px] font-extrabold uppercase shrink-0 border border-amber-200">
            <Clock className="w-3 h-3" /> Pending
          </div>
        );
      case "rejected":
        return (
          <div className="flex items-center gap-1 px-2.5 py-1 bg-red-100 text-red-800 rounded-full text-[10px] font-extrabold uppercase shrink-0 border border-red-200">
            <XCircle className="w-3 h-3" /> Rejected
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-20 relative">
      
      {/* 1. PAGE HEADER */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold border border-blue-100 mb-3">
          <Lightbulb className="w-4 h-4" /> MY SUBMISSIONS
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Track Your Ideas</h1>
        <p className="text-slate-500 text-sm max-w-xl leading-relaxed">
          Monitor the status of your submitted ideas. Ideas must be approved by the Quality Assurance Coordinator before they become visible to the rest of the university.
        </p>
      </div>

      {/* 2. STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-black text-slate-800">{stats.total}</span>
          <span className="text-xs text-slate-500 font-bold mt-1 uppercase tracking-wider">Total</span>
        </div>
        <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 shadow-sm flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-black text-emerald-700">{stats.approved}</span>
          <span className="text-xs text-emerald-600 font-bold mt-1 uppercase tracking-wider">Approved</span>
        </div>
        <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100 shadow-sm flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-black text-amber-700">{stats.pending}</span>
          <span className="text-xs text-amber-600 font-bold mt-1 uppercase tracking-wider">Pending</span>
        </div>
        <div className="bg-red-50 p-5 rounded-2xl border border-red-100 shadow-sm flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-black text-red-700">{stats.rejected}</span>
          <span className="text-xs text-red-600 font-bold mt-1 uppercase tracking-wider">Rejected</span>
        </div>
      </div>

      {/* 3. STICKY FILTER BAR
          THE FIX: Using negative top to offset the layout's padding (p-8 = 32px) 
          and adding a solid background with backdrop blur. */}
      <div className="sticky top-[-32px] z-40 bg-slate-50/95 backdrop-blur-md pt-8 pb-3 -mx-4 px-4 sm:-mx-8 sm:px-8">
        <div className="bg-white rounded-xl border border-slate-200 p-2 shadow-sm flex items-center gap-2 overflow-x-auto custom-scrollbar">
          <div className="pl-3 pr-2 border-r border-slate-200 flex items-center text-slate-400 shrink-0">
            <Filter className="w-4 h-4" />
          </div>
          <button 
            onClick={() => setFilter("all")}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${filter === "all" ? "bg-slate-800 text-white shadow-md" : "text-slate-600 hover:bg-slate-100"}`}
          >
            All Ideas
          </button>
          <button 
            onClick={() => setFilter("approved")}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${filter === "approved" ? "bg-emerald-600 text-white shadow-md shadow-emerald-200" : "text-slate-600 hover:bg-slate-100"}`}
          >
            Approved
          </button>
          <button 
            onClick={() => setFilter("pending")}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${filter === "pending" ? "bg-amber-500 text-white shadow-md shadow-amber-200" : "text-slate-600 hover:bg-slate-100"}`}
          >
            Pending Review
          </button>
          <button 
            onClick={() => setFilter("rejected")}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${filter === "rejected" ? "bg-red-500 text-white shadow-md shadow-red-200" : "text-slate-600 hover:bg-slate-100"}`}
          >
            Rejected
          </button>
        </div>
      </div>

      {/* 4. IDEAS LIST */}
      <div className="space-y-4">
        {filteredIdeas.length > 0 ? (
          filteredIdeas.map((idea) => (
            <IdeaCard 
              key={idea.id} 
              {...idea} 
              statusBadge={getStatusBadge(idea.status)} // Passing status to the left of category
            />
          ))
        ) : (
          <EmptyState 
            title={`No ${filter !== "all" ? filter : ""} ideas found`}
            description={filter === "all" ? "You haven't submitted any ideas yet." : `No ideas with status '${filter}'.`}
            onClearFilters={filter !== "all" ? () => setFilter("all") : undefined}
          />
        )}
      </div>

    </div>
  );
}