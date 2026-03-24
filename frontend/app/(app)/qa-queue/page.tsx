"use client";

import React, { useState } from "react";
import { 
  CheckCircle2, XCircle, Eye, Search, Filter, 
  Clock, AlertCircle, ShieldCheck, MoreVertical 
} from "lucide-react";

// Mock Data for QA Queue (Pending Ideas)
const PENDING_IDEAS = [
  {
    id: "REQ-001",
    author: "Trung Min",
    department: "IT Department",
    title: "Upgrade the Greenwich Campus Wi-Fi",
    excerpt: "We need dedicated bandwidth for the library and lab rooms. The current connection drops frequently...",
    submittedAt: "2 hours ago",
    category: "IT Infrastructure",
    status: "pending",
    isAnonymous: false,
  },
  {
    id: "REQ-002",
    author: "Hidden User",
    department: "Business Management",
    title: "More vegetarian options in the cafeteria",
    excerpt: "Adding a dedicated salad bar and more plant-based protein options would greatly benefit students...",
    submittedAt: "5 hours ago",
    category: "Student Services",
    status: "pending",
    isAnonymous: true,
  },
  {
    id: "REQ-003",
    author: "Alex Nguyen",
    department: "Graphic Design",
    title: "24/7 Study Spaces during Exam Weeks",
    excerpt: "The library currently closes at 9 PM. During final exam weeks, we desperately need safe, well-lit spaces...",
    submittedAt: "1 day ago",
    category: "Campus Facilities",
    status: "pending",
    isAnonymous: false,
  }
];

export default function QAQueuePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [ideas, setIdeas] = useState(PENDING_IDEAS);

  // Fake action handlers
  const handleApprove = (id: string) => {
    setIdeas(ideas.filter(idea => idea.id !== id));
    // Ở đây sau này sẽ gọi API: PUT /api/v1/ideas/{id}/approve
  };

  const handleReject = (id: string) => {
    setIdeas(ideas.filter(idea => idea.id !== id));
    // Ở đây sau này sẽ gọi API: PUT /api/v1/ideas/{id}/reject
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-12">
      
      {/* 1. HEADER & STATS */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full -mr-32 -mt-32 blur-[80px] opacity-50"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold mb-4 backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> QA Manager Portal
            </div>
            <h1 className="text-3xl font-black tracking-tight mb-2">Approval Queue</h1>
            <p className="text-slate-400 text-sm max-w-lg">
              Review and moderate student submissions. Ensure all ideas comply with university guidelines before publishing them to the main feed.
            </p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-center min-w-[120px]">
              <p className="text-3xl font-black text-white">{ideas.length}</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Pending</p>
            </div>
            <div className="bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20 p-4 rounded-2xl text-center min-w-[120px]">
              <p className="text-3xl font-black text-emerald-400">12</p>
              <p className="text-xs font-bold text-emerald-500/80 uppercase tracking-widest mt-1">Approved</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. FILTER & SEARCH BAR */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 sticky top-0 z-30">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by title, ID, or author..." 
            className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <select className="h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 outline-none focus:border-blue-500">
            <option>All Departments</option>
            <option>IT Department</option>
            <option>Business</option>
          </select>
          <button className="h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors flex items-center gap-2 font-bold text-sm">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      {/* 3. QUEUE LIST */}
      <div className="space-y-4">
        {ideas.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Queue is Empty!</h3>
            <p className="text-slate-500 text-sm mt-2">Awesome job! You have reviewed all pending submissions.</p>
          </div>
        ) : (
          ideas.map((idea) => (
            <div key={idea.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row gap-6 group">
              
              {/* Left Info */}
              <div className="flex-1 flex gap-5">
                <div className="hidden sm:flex flex-col items-center justify-center w-16 h-16 bg-amber-50 text-amber-600 rounded-xl shrink-0 border border-amber-100">
                  <Clock className="w-6 h-6 mb-1" />
                  <span className="text-[10px] font-black uppercase">Pending</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-black text-slate-400">{idea.id}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="font-bold text-slate-600">{idea.category}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className={`font-bold px-2 py-0.5 rounded-md ${idea.isAnonymous ? 'bg-slate-100 text-slate-500' : 'bg-blue-50 text-blue-600'}`}>
                      {idea.isAnonymous ? 'Anonymous' : idea.author} • {idea.department}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer">
                    {idea.title}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-2">{idea.excerpt}</p>
                </div>
              </div>

              {/* Right Actions */}
              <div className="flex flex-row lg:flex-col items-center justify-end gap-2 shrink-0 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6">
                <button className="flex-1 lg:flex-none w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-500 hover:text-white border border-emerald-200 hover:border-emerald-500 rounded-xl text-sm font-bold transition-all">
                  <CheckCircle2 className="w-4 h-4" /> Approve
                </button>
                <button className="flex-1 lg:flex-none w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-700 hover:bg-red-500 hover:text-white border border-red-200 hover:border-red-500 rounded-xl text-sm font-bold transition-all">
                  <XCircle className="w-4 h-4" /> Reject
                </button>
                <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-800 rounded-xl transition-colors border border-transparent hover:border-slate-200">
                  <Eye className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}