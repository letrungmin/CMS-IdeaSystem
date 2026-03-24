"use client";

import React from "react";
import { 
  Building2, Users, Lightbulb, TrendingUp, 
  Mail, BellRing, Clock, CheckCircle2, MessageSquare
} from "lucide-react";

export default function DeptDashboardPage() {
  
  // Mock Data: Scoped strictly to ONE Department (e.g., IT Department)
  const deptStats = {
    name: "IT Department",
    totalStaff: 45,
    participatingStaff: 28,
    totalIdeas: 84,
    totalComments: 215,
    participationRate: "62%"
  };

  const recentDeptIdeas = [
    { id: "ID-101", title: "Upgrade Lab Computers to 32GB RAM", author: "Trung Min", comments: 12, thumbsUp: 45, time: "2 hours ago" },
    { id: "ID-102", title: "Free GitHub Copilot for IT Staff", author: "Alex Nguyen", comments: 8, thumbsUp: 30, time: "5 hours ago" },
    { id: "ID-103", title: "More ergonomic chairs in Room 302", author: "David Tran", comments: 3, thumbsUp: 15, time: "1 day ago" },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-12">
      
      {/* 1. HEADER (Violet Theme for QA Coordinator) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden border border-violet-900/30">
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600 rounded-full -mr-32 -mt-32 blur-[80px] opacity-40"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-black uppercase tracking-widest mb-4 backdrop-blur-md">
            <Building2 className="w-4 h-4" /> Department Coordinator
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-2">{deptStats.name} Hub</h1>
          <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
            Monitor idea submissions from your department staff. Ensure everyone participates and follows university guidelines.
          </p>
        </div>
        
        {/* ENCOURAGE STAFF BUTTON (As required by spec) */}
        <button className="relative z-10 flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-violet-900/50 hover:-translate-y-1 shrink-0">
          <BellRing className="w-5 h-5" /> Encourage Staff
        </button>
      </div>

      {/* 2. DEPARTMENT STATS (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-violet-50 flex items-center justify-center shrink-0">
            <Users className="w-7 h-7 text-violet-600" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">{deptStats.totalStaff}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">Total Staff</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-7 h-7 text-emerald-600" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">{deptStats.participatingStaff}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">Participating</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
            <Lightbulb className="w-7 h-7 text-amber-600" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">{deptStats.totalIdeas}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">Ideas Submitted</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-violet-600 to-purple-800 p-5 rounded-2xl border border-violet-700 shadow-lg flex items-center gap-4 text-white">
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center shrink-0 backdrop-blur-md">
            <TrendingUp className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-2xl font-black text-white">{deptStats.participationRate}</p>
            <p className="text-xs font-bold text-violet-200 uppercase tracking-wider mt-0.5">Participation Rate</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 3. RECENT IDEAS FROM THIS DEPARTMENT */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Clock className="w-5 h-5 text-violet-500" /> Recent Submissions
            </h3>
            <button className="text-sm font-bold text-violet-600 hover:text-violet-700">View All</button>
          </div>

          <div className="space-y-4">
            {recentDeptIdeas.map((idea, index) => (
              <div key={index} className="p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-violet-50 hover:border-violet-100 transition-colors group cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-800 group-hover:text-violet-700 transition-colors">{idea.title}</h4>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap ml-4">{idea.time}</span>
                </div>
                <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                  <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-slate-400" /> {idea.author}</span>
                  <span className="flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5 text-blue-400" /> {idea.comments}</span>
                  <span className="flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> +{idea.thumbsUp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. QUICK ACTIONS & ALERTS */}
        <div className="space-y-6">
          <div className="bg-violet-50 rounded-3xl border border-violet-100 p-6">
            <h3 className="font-bold text-violet-900 flex items-center gap-2 mb-4">
              <Mail className="w-5 h-5 text-violet-600" /> Coordinator Duties
            </h3>
            <p className="text-sm text-violet-700 mb-6 leading-relaxed">
              Your department is currently at <strong>{deptStats.participationRate}</strong> participation. You have <strong>17 staff members</strong> who haven't submitted any ideas yet.
            </p>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-violet-700 font-bold rounded-xl border border-violet-200 hover:bg-violet-600 hover:text-white hover:border-violet-600 transition-all shadow-sm">
              <Mail className="w-4 h-4" /> Send Reminder Email
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}