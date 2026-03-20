"use client";

import React, { useState } from "react";
import { 
  User as UserIcon, Mail, Building2, MapPin, Calendar, 
  Lightbulb, Heart, MessageSquare, Award, Settings, 
  Bookmark, Activity, Edit3
} from "lucide-react";
import IdeaCard, { IdeaCardProps } from "@/components/IdeaCard";

// DUMMY DATA FOR PROFILE
const USER_PROFILE = {
  name: "Trung Min",
  initials: "TM",
  role: "Student",
  department: "Information Technology",
  studentId: "GCC200123",
  email: "trung.min@greenwich.edu.vn",
  location: "Ho Chi Minh Campus",
  joinDate: "September 2023",
  stats: {
    ideas: 12,
    totalReactions: 458,
    comments: 89,
    awards: 2
  }
};

// DUMMY DATA FOR USER'S IDEAS
const MY_IDEAS: IdeaCardProps[] = [
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
    id: "5",
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
  }
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("ideas");

  return (
    <div className="w-full h-full max-w-6xl mx-auto space-y-6">
      
      {/* 1. HEADER / COVER SECTION */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative">
        {/* Cover Photo */}
        <div className="h-40 sm:h-48 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 relative">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
          
          <button className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
            <Edit3 className="w-4 h-4" /> Edit Cover
          </button>
        </div>

        {/* Profile Info Bar */}
        <div className="px-6 sm:px-10 pb-6 relative">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-4">
            
            {/* Avatar & Name - THE FIX IS HERE */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-5 w-full">
              {/* Negative margin (-mt-16) ONLY applied to the Avatar container */}
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white p-1.5 rounded-2xl shadow-lg relative shrink-0 -mt-12 sm:-mt-16 z-10">
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-4xl font-extrabold shadow-inner">
                  {USER_PROFILE.initials}
                </div>
                <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              
              {/* Text Info - No negative margin, perfectly aligned */}
              <div className="pb-1 sm:pb-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{USER_PROFILE.name}</h1>
                <p className="text-slate-500 font-medium mt-0.5">{USER_PROFILE.role} • {USER_PROFILE.studentId}</p>
              </div>
            </div>

            {/* Edit Profile Button */}
            <button className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors shadow-sm flex items-center gap-2 shrink-0 sm:mb-2">
              <Settings className="w-4 h-4" /> Edit Profile
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* 2. LEFT COLUMN: About & Stats */}
        <div className="w-full lg:w-80 space-y-6 shrink-0 lg:sticky lg:top-0 h-fit">
          
          {/* About Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-blue-600" /> About
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3 text-slate-600">
                <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-medium">{USER_PROFILE.department}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-medium truncate">{USER_PROFILE.email}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-medium">{USER_PROFILE.location}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-medium">Joined {USER_PROFILE.joinDate}</span>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" /> Impact Stats
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-center">
                <Lightbulb className="w-5 h-5 text-amber-500 mb-2" />
                <span className="text-2xl font-black text-slate-800">{USER_PROFILE.stats.ideas}</span>
                <span className="text-xs text-slate-500 font-medium">Ideas</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-center">
                <Heart className="w-5 h-5 text-rose-500 mb-2" />
                <span className="text-2xl font-black text-slate-800">{USER_PROFILE.stats.totalReactions}</span>
                <span className="text-xs text-slate-500 font-medium">Reactions</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-center">
                <MessageSquare className="w-5 h-5 text-blue-500 mb-2" />
                <span className="text-2xl font-black text-slate-800">{USER_PROFILE.stats.comments}</span>
                <span className="text-xs text-slate-500 font-medium">Comments</span>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-100 flex flex-col items-center justify-center text-center shadow-sm">
                <Award className="w-5 h-5 text-orange-500 mb-2" />
                <span className="text-2xl font-black text-orange-700">{USER_PROFILE.stats.awards}</span>
                <span className="text-xs text-orange-600 font-bold">Awards</span>
              </div>
            </div>
          </div>

        </div>

        {/* 3. RIGHT COLUMN: Tabs & Feed */}
        <div className="flex-1 space-y-6">
          
          {/* Custom Tabs */}
          <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-sm flex overflow-x-auto custom-scrollbar sticky top-0 z-20">
            <button 
              onClick={() => setActiveTab("ideas")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === "ideas" ? "bg-blue-50 text-blue-600 shadow-sm" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"}`}
            >
              <Lightbulb className="w-4 h-4" /> My Ideas
            </button>
            <button 
              onClick={() => setActiveTab("bookmarks")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === "bookmarks" ? "bg-blue-50 text-blue-600 shadow-sm" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"}`}
            >
              <Bookmark className="w-4 h-4" /> Saved
            </button>
            <button 
              onClick={() => setActiveTab("activities")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === "activities" ? "bg-blue-50 text-blue-600 shadow-sm" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"}`}
            >
              <Activity className="w-4 h-4" /> Activity Log
            </button>
          </div>

          {/* Tab Content */}
          <div className="space-y-4">
            {activeTab === "ideas" && (
              <>
                <div className="flex items-center justify-between px-2 mb-2">
                  <h2 className="font-extrabold text-slate-800 text-lg">My Submissions</h2>
                  <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full">{MY_IDEAS.length} Ideas</span>
                </div>
                {MY_IDEAS.map((idea) => (
                  <IdeaCard key={idea.id} {...idea} />
                ))}
              </>
            )}

            {activeTab === "bookmarks" && (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 flex flex-col items-center justify-center text-center shadow-sm w-full py-20">
                <Bookmark className="w-12 h-12 text-slate-300 mb-4" />
                <h3 className="text-xl font-extrabold text-slate-800 mb-2">No saved ideas yet</h3>
                <p className="text-slate-500 text-sm max-w-sm mb-6">Ideas you bookmark will appear here for quick access later.</p>
              </div>
            )}

            {activeTab === "activities" && (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 flex flex-col items-center justify-center text-center shadow-sm w-full py-20">
                <Activity className="w-12 h-12 text-slate-300 mb-4" />
                <h3 className="text-xl font-extrabold text-slate-800 mb-2">Activity log is empty</h3>
                <p className="text-slate-500 text-sm max-w-sm mb-6">Your interactions, likes, and comments will be recorded here.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}