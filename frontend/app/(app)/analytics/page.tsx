"use client";

import React from "react";
import { 
  BarChart3, PieChart, TrendingUp, Users, 
  Download, Calendar, ArrowUpRight, ArrowDownRight 
} from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 pb-12">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Analytics</h1>
          <p className="text-slate-500 text-sm">Real-time data insights across all departments.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg">
          <Download className="w-4 h-4" /> Export Report (CSV)
        </button>
      </div>

      {/* 1. KEY STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Ideas", value: "482", trend: "+12%", up: true, icon: <TrendingUp className="text-blue-600" /> },
          { label: "Active Users", value: "1,205", trend: "+5%", up: true, icon: <Users className="text-indigo-600" /> },
          { label: "Avg. Reactions", value: "24", trend: "-2%", up: false, icon: <BarChart3 className="text-rose-600" /> },
          { label: "Days Left", value: "45", trend: "Season 2026", up: true, icon: <Calendar className="text-emerald-600" /> },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-slate-50 rounded-lg">{stat.icon}</div>
              <div className={`flex items-center text-xs font-bold ${stat.up ? 'text-emerald-600' : 'text-rose-600'}`}>
                {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.trend}
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900">{stat.value}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* 2. MAIN CHARTS AREA (Visual Mockups) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Ideas per Department */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-blue-500" /> Ideas per Department
            </h3>
            <select className="text-xs font-bold bg-slate-50 border-none outline-none p-1 rounded">
              <option>Last 30 Days</option>
              <option>This Year</option>
            </select>
          </div>
          
          {/* Mock Bar Chart */}
          <div className="space-y-4">
            {[
              { label: "IT Dept", value: 85, color: "bg-blue-500" },
              { label: "Business", value: 62, color: "bg-indigo-500" },
              { label: "Design", value: 45, color: "bg-rose-500" },
              { label: "Health", value: 30, color: "bg-emerald-500" },
            ].map((bar, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-600">{bar.label}</span>
                  <span className="text-slate-900">{bar.value}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${bar.color} rounded-full`} style={{ width: `${bar.value}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Anonymous vs Identified */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-8">
            <Users className="w-5 h-5 text-indigo-500" /> Participation Privacy
          </h3>
          <div className="flex-1 flex items-center justify-center">
            <div className="relative w-40 h-40">
              {/* Fake Donut Chart using CSS Conic Gradient */}
              <div className="w-full h-full rounded-full border-[16px] border-slate-100" style={{ 
                background: 'conic-gradient(#4f46e5 0% 65%, #e2e8f0 65% 100%)',
                maskImage: 'radial-gradient(transparent 55%, black 56%)',
                WebkitMaskImage: 'radial-gradient(transparent 55%, black 56%)'
              }}></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-slate-800">65%</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Public</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-6 mt-6">
             <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                <div className="w-3 h-3 bg-indigo-600 rounded-sm"></div> Identified
             </div>
             <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                <div className="w-3 h-3 bg-slate-200 rounded-sm"></div> Anonymous
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}