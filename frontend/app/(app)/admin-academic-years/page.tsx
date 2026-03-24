"use client";

import React, { useState } from "react";
import { 
  ShieldAlert, Calendar, Plus, Edit, 
  Trash2, AlertCircle, CheckCircle2, Clock,
  CalendarDays, Settings
} from "lucide-react";

// Mock Data for Academic Years
const ACADEMIC_YEARS = [
  {
    id: "AY-2026",
    name: "Academic Year 2025 - 2026",
    startDate: "2025-09-01",
    endDate: "2026-08-31",
    ideaClosureDate: "2026-04-15",
    finalClosureDate: "2026-04-30",
    status: "active" // Only ONE can be active
  },
  {
    id: "AY-2027",
    name: "Academic Year 2026 - 2027",
    startDate: "2026-09-01",
    endDate: "2027-08-31",
    ideaClosureDate: "2027-04-15",
    finalClosureDate: "2027-04-30",
    status: "upcoming"
  },
  {
    id: "AY-2025",
    name: "Academic Year 2024 - 2025",
    startDate: "2024-09-01",
    endDate: "2025-08-31",
    ideaClosureDate: "2025-04-15",
    finalClosureDate: "2025-04-30",
    status: "past"
  }
];

export default function AdminAcademicYearsPage() {
  const [years, setYears] = useState(ACADEMIC_YEARS);

  // Get the currently active year
  const activeYear = years.find(y => y.status === "active");

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 pb-12">
      
      {/* 1. ADMIN HEADER (Red/Rose Theme to signify Danger/Admin level) */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden border border-rose-900/30">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600 rounded-full -mr-32 -mt-32 blur-[80px] opacity-30"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-black uppercase tracking-widest mb-4 backdrop-blur-md">
              <ShieldAlert className="w-4 h-4" /> System Administrator
            </div>
            <h1 className="text-3xl font-black tracking-tight mb-2">Academic Years & Deadlines</h1>
            <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
              Configure the university's academic cycles. Setting the <strong>Idea Closure Date</strong> prevents new submissions, while the <strong>Final Closure Date</strong> disables all commenting and reacting.
            </p>
          </div>
          <button className="relative z-10 flex items-center justify-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-rose-900/50 hover:-translate-y-1 shrink-0">
            <Plus className="w-5 h-5" /> Create New Year
          </button>
        </div>
      </div>

      {/* 2. ACTIVE YEAR HIGHLIGHT CARD */}
      {activeYear && (
        <div className="bg-gradient-to-br from-white to-rose-50 p-1 rounded-3xl shadow-lg border border-rose-100">
          <div className="bg-white rounded-[1.4rem] p-6 lg:p-8 flex flex-col lg:flex-row gap-8 items-center relative overflow-hidden">
            
            {/* Left side: Big Icon & Title */}
            <div className="flex items-center gap-6 w-full lg:w-1/3 shrink-0 lg:border-r border-slate-100 pr-6">
              <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 shadow-inner">
                <CalendarDays className="w-8 h-8" />
              </div>
              <div>
                <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span> Currently Active
                </p>
                <h2 className="text-2xl font-black text-slate-800 leading-tight">{activeYear.name}</h2>
              </div>
            </div>

            {/* Right side: Deadlines */}
            <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <p className="text-xs font-bold text-slate-500 flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-amber-500" /> New Ideas Closure Date
                </p>
                <p className="text-xl font-black text-slate-900">{activeYear.ideaClosureDate}</p>
                <p className="text-xs text-slate-400 mt-1">System blocks new idea submissions.</p>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 border-l-4 border-l-rose-500">
                <p className="text-xs font-bold text-slate-500 flex items-center gap-2 mb-2">
                  <ShieldAlert className="w-4 h-4 text-rose-500" /> Final System Closure
                </p>
                <p className="text-xl font-black text-slate-900">{activeYear.finalClosureDate}</p>
                <p className="text-xs text-slate-400 mt-1">Comments & Reactions disabled. Data frozen.</p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 3. ALL ACADEMIC YEARS TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-400" /> System Cycles History
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Academic Year</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Duration</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {years.map((year) => (
                <tr key={year.id} className="hover:bg-slate-50/50 transition-colors">
                  
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{year.name}</p>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">ID: {year.id}</p>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span>{year.startDate}</span>
                      <span className="text-slate-300">→</span>
                      <span>{year.endDate}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    {year.status === "active" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest border border-rose-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Active
                      </span>
                    )}
                    {year.status === "upcoming" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest border border-blue-100">
                        <Clock className="w-3 h-3" /> Upcoming
                      </span>
                    )}
                    {year.status === "past" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest border border-slate-200">
                        <CheckCircle2 className="w-3 h-3" /> Concluded
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Dates">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        className={`p-2 rounded-lg transition-colors ${year.status === 'active' ? 'text-slate-300 cursor-not-allowed' : 'text-slate-400 hover:text-red-600 hover:bg-red-50'}`}
                        disabled={year.status === 'active'}
                        title={year.status === 'active' ? "Cannot delete active year" : "Delete"}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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