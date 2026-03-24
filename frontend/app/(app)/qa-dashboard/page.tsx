"use client";

import React from "react";
import { 
  Users, CheckCircle2, Clock, XCircle, TrendingUp, 
  BarChart3, Download, Building2, Lightbulb 
} from "lucide-react";

export default function QADashboardPage() {
  
  // Fake data for the dashboard
  const systemStats = {
    totalIdeas: 842,
    approved: 610,
    pending: 124,
    rejected: 108,
    activeUsers: 345,
    engagementRate: "78%"
  };

  const departmentStats = [
    { name: "IT Department", ideas: 320, color: "bg-blue-500", percentage: 85 },
    { name: "Business Management", ideas: 210, color: "bg-emerald-500", percentage: 65 },
    { name: "Graphic Design", ideas: 145, color: "bg-rose-500", percentage: 45 },
    { name: "Media & Communications", ideas: 98, color: "bg-amber-500", percentage: 30 },
    { name: "Health & Wellbeing", ideas: 69, color: "bg-violet-500", percentage: 20 },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-12">
      
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100 mb-3">
            <BarChart3 className="w-4 h-4" /> QA MANAGER DASHBOARD
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">System Overview</h1>
          <p className="text-slate-500 text-sm max-w-xl">
            Monitor university-wide idea submissions, approval rates, and department engagement in real-time.
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-md shrink-0">
          <Download className="w-4 h-4" /> Export CSV Report
        </button>
      </div>

      {/* 2. TOP METRICS (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Ideas */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
            <Lightbulb className="w-7 h-7 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">{systemStats.totalIdeas}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">Total Ideas</p>
          </div>
        </div>

        {/* Approved */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-7 h-7 text-emerald-600" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">{systemStats.approved}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">Approved</p>
          </div>
        </div>

        {/* Pending Queue */}
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 p-5 rounded-2xl border border-amber-600 shadow-lg flex items-center gap-4 text-white transform hover:-translate-y-1 transition-transform cursor-pointer">
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center shrink-0 backdrop-blur-md border border-white/30">
            <Clock className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-2xl font-black text-white">{systemStats.pending}</p>
            <p className="text-xs font-bold text-amber-100 uppercase tracking-wider mt-0.5">Pending Review</p>
          </div>
        </div>

        {/* Rejected */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center shrink-0">
            <XCircle className="w-7 h-7 text-red-600" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">{systemStats.rejected}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">Rejected</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 3. IDEAS BY DEPARTMENT (Horizontal Bar Chart) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-500" /> Ideas by Department
            </h3>
            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">Academic Year 2026</span>
          </div>

          <div className="space-y-6">
            {departmentStats.map((dept, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-bold text-slate-700">{dept.name}</span>
                  <span className="font-black text-slate-900">{dept.ideas} <span className="text-slate-400 font-medium text-xs">ideas</span></span>
                </div>
                {/* Custom Progress Bar */}
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${dept.color} rounded-full`} 
                    style={{ width: `${dept.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. QUICK INSIGHTS WIDGET */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl text-white">
            <h3 className="font-bold text-white flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-emerald-400" /> Platform Engagement
            </h3>
            
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/10 rounded-xl"><Users className="w-5 h-5 text-blue-400" /></div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Users</p>
                  <p className="text-xl font-black">{systemStats.activeUsers}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/10 rounded-xl"><BarChart3 className="w-5 h-5 text-rose-400" /></div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Engagement Rate</p>
                  <p className="text-xl font-black">{systemStats.engagementRate}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-slate-700">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Engagement rate is calculated based on comments and reactions relative to total unique logins this week.
                </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}