"use client";

import React, { useState } from "react";
import { Clock, Filter, ArrowUpDown, TrendingUp } from "lucide-react";
import IdeaCard, { IdeaCardProps } from "@/components/IdeaCard";
import IdeaDetailModal from "@/components/IdeaDetailModal";

const DUMMY_IDEAS: IdeaCardProps[] = [
  {
    id: "1",
    authorName: "Trung Min",
    authorInitials: "TM",
    timeAgo: "2 hours ago",
    category: "IT Infrastructure",
    title: "Upgrade the Greenwich Campus Wi-Fi",
    description: "We need dedicated bandwidth for the library and lab rooms. The current connection drops frequently during peak hours, severely affecting online exams, research, and daily study activities.",
    reactions: { like: 45, love: 22, wow: 5, haha: 0, sad: 1, angry: 0, dislike: 2 },
    currentUserReaction: 'love', 
    commentsCount: 15,
    viewsCount: 342,
    isAnonymous: false,
  },
  {
    id: "2",
    authorName: "Anonymous Student",
    authorInitials: "AS",
    timeAgo: "5 hours ago",
    category: "Student Services",
    title: "More vegetarian options in the cafeteria",
    description: "Adding a dedicated salad bar and more plant-based protein options would greatly benefit students with specific dietary restrictions and promote a healthier lifestyle on campus.",
    reactions: { like: 80, love: 12, wow: 0, haha: 4, sad: 0, angry: 0, dislike: 1 },
    currentUserReaction: null,
    commentsCount: 32,
    viewsCount: 890,
    isAnonymous: true,
  },
  {
    id: "3",
    authorName: "Alex Nguyen",
    authorInitials: "AN",
    timeAgo: "1 day ago",
    category: "Campus Facilities",
    title: "24/7 Study Spaces during Exam Weeks",
    description: "The library currently closes at 9 PM. During final exam weeks, we desperately need safe, well-lit spaces on campus that remain open 24/7 for late-night study sessions.",
    reactions: { like: 120, love: 50, wow: 10, haha: 0, sad: 5, angry: 2, dislike: 0 },
    currentUserReaction: 'like',
    commentsCount: 45,
    viewsCount: 1205,
    isAnonymous: false,
  },
  {
    id: "4",
    authorName: "Sarah Le",
    authorInitials: "SL",
    timeAgo: "2 days ago",
    category: "Mental Health Support",
    title: "Weekly Therapy Dogs on Campus",
    description: "Mental health is crucial. Bringing trained therapy dogs to the student lounge once a week can significantly reduce stress and anxiety among the student body.",
    reactions: { like: 40, love: 150, wow: 30, haha: 5, sad: 0, angry: 0, dislike: 0 },
    currentUserReaction: 'love',
    commentsCount: 89,
    viewsCount: 2300,
    isAnonymous: false,
  }
];

export default function HomeFeed() {
  const [selectedIdea, setSelectedIdea] = useState<IdeaCardProps | null>(null);

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full h-full relative">
      
      {/* ---------- LEFT COLUMN: Main Feed ---------- */}
      <div className="flex-1 space-y-6">
        
        {/* 1. BIG TAG BANNER with BLURRED VIDEO BACKGROUND */}
        <div className="relative h-60 w-full rounded-2xl p-8 text-white shadow-2xl overflow-hidden group shrink-0">
          <video autoPlay loop muted playsInline className="absolute inset-0 z-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105">
            <source src="/login-bg.mp4" type="video/mp4" />
            <div className="absolute inset-0 bg-violet-900"></div>
          </video>
          <div className="absolute inset-0 z-10 bg-black/30 backdrop-blur-[6px] transition-all duration-500 group-hover:backdrop-blur-[3px]"></div>
          
          <div className="relative z-20 h-full flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-400/20 text-violet-100 text-xs font-bold border border-violet-100/30 mb-4 shadow-inner">
                <span className="animate-pulse w-2 h-2 bg-emerald-400 rounded-full"></span>
                ACTIVE PORTAL
              </div>
              <h1 className="text-4xl font-extrabold mb-2 tracking-tighter drop-shadow-lg leading-tight">Academic Year 2025-2026</h1>
              <p className="text-white/80 max-w-xl text-sm leading-relaxed drop-shadow-md">
                Your voice matters. Share your innovative ideas to improve our campus facilities, academic programs, and student life.
              </p>
            </div>
            
            <div className="flex justify-end mt-auto pt-2">
              <div className="inline-flex items-center bg-white/10 backdrop-blur-md rounded-full px-4 py-2 text-sm font-semibold border border-white/20 shadow-md transition-all duration-300 hover:scale-105 hover:bg-violet-600/80 cursor-default">
                <Clock className="w-4 h-4 mr-2 text-violet-200" />
                Submission closes in <strong className="text-white ml-1.5 drop-shadow-md">45 days</strong>
              </div>
            </div>
          </div>
        </div>

        {/* 2. FILTER & SORT BAR (Sticky Behavior) */}
        <div className="bg-white/90 backdrop-blur-md rounded-xl border border-slate-200 p-2 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-0 z-30 transition-all">
          
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto custom-scrollbar pb-1 sm:pb-0">
            <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-700 text-sm font-semibold rounded-lg hover:bg-blue-100 transition-colors whitespace-nowrap">
              <Filter className="w-4 h-4" /> All Categories
            </button>
            <button className="px-4 py-2 bg-transparent text-slate-500 text-sm font-medium rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap">
              My Department
            </button>
            <button className="px-4 py-2 bg-transparent text-slate-500 text-sm font-medium rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap">
              Trending
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto px-2 sm:px-0 border-t sm:border-t-0 border-slate-100 pt-2 sm:pt-0 shrink-0">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sort By:</span>
            <div className="relative w-full sm:w-44">
              <select className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-sm font-semibold rounded-lg pl-3 pr-8 py-2 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 cursor-pointer transition-all">
                <option value="latest">Latest First</option>
                <option value="popular">Most Upvotes</option>
                <option value="discussed">Most Discussed</option>
              </select>
              <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 3. IDEA FEED */}
        <div className="space-y-4">
          {DUMMY_IDEAS.map((idea) => (
            <div key={idea.id} onClick={() => setSelectedIdea(idea)} className="cursor-pointer">
              <IdeaCard {...idea} />
            </div>
          ))}
        </div>
        
        {/* Load More Button */}
        <div className="pt-4 pb-12 flex justify-center">
          <button className="px-6 py-2.5 bg-white border border-slate-200 text-blue-600 font-semibold text-sm rounded-full hover:bg-blue-50 hover:border-blue-200 transition-all shadow-sm">
            Load More Ideas
          </button>
        </div>
      </div>

      {/* ---------- RIGHT COLUMN: Sidebar Widgets ---------- */}
      {/* THE FIX: Added lg:sticky lg:top-0 h-fit to glue the ENTIRE right column to the top */}
      <div className="w-full lg:w-80 space-y-6 shrink-0 lg:sticky lg:top-0 h-fit">
        
        {/* Widget 1: Top Categories (Removed individual sticky behavior) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-5">Top Categories</h3>
          <ul className="space-y-3.5">
            {[
              { name: "IT Infrastructure", count: 42 },
              { name: "Curriculum Enhancement", count: 28 },
              { name: "Student Services", count: 56 },
              { name: "Campus Facilities", count: 19 },
              { name: "Mental Health Support", count: 34 },
            ].map((cat, idx) => (
              <li key={idx}>
                <button className="w-full text-left text-sm font-semibold text-slate-700 hover:text-blue-600 flex justify-between items-center group transition-colors">
                  {cat.name}
                  <span className="bg-slate-100 text-slate-500 text-xs font-bold py-1 px-2.5 rounded-lg group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">{cat.count}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Widget 2: Trending Ideas (Removed individual sticky behavior) */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border border-blue-100 p-6 shadow-sm">
          <h3 className="text-xs font-extrabold text-indigo-800 uppercase tracking-widest mb-5 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" /> Trending This Week
          </h3>
          <div className="space-y-4">
            <div className="group cursor-pointer">
              <h4 className="font-bold text-sm text-slate-800 group-hover:text-blue-600 line-clamp-2 transition-colors">Weekly Therapy Dogs on Campus</h4>
              <p className="text-xs text-slate-500 mt-1">225 reactions • 89 comments</p>
            </div>
            <div className="h-px bg-blue-100/50 w-full"></div>
            <div className="group cursor-pointer">
              <h4 className="font-bold text-sm text-slate-800 group-hover:text-blue-600 line-clamp-2 transition-colors">24/7 Study Spaces during Exam Weeks</h4>
              <p className="text-xs text-slate-500 mt-1">187 reactions • 45 comments</p>
            </div>
            <div className="h-px bg-blue-100/50 w-full"></div>
            <div className="group cursor-pointer">
              <h4 className="font-bold text-sm text-slate-800 group-hover:text-blue-600 line-clamp-2 transition-colors">More vegetarian options in the cafeteria</h4>
              <p className="text-xs text-slate-500 mt-1">97 reactions • 32 comments</p>
            </div>
          </div>
        </div>

      </div>

      {/* MODAL */}
      <IdeaDetailModal 
        idea={selectedIdea} 
        isOpen={selectedIdea !== null} 
        onClose={() => setSelectedIdea(null)} 
      />

    </div>
  );
}