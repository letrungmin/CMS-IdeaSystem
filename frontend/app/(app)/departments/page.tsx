"use client";

import React, { useState } from "react";
import { Search, Users, Lightbulb, ArrowRight, Building2, TrendingUp } from "lucide-react";
import Link from "next/link";

// Mock Data for Departments
const DEPARTMENTS_DATA = [
  { id: "it", name: "Information Technology", description: "Software development, AI research, and infrastructure improvements.", totalIdeas: 142, activeStudents: 85, color: "bg-blue-500" },
  { id: "biz", name: "Business Management", description: "Entrepreneurship, marketing strategies, and campus economy ideas.", totalIdeas: 98, activeStudents: 64, color: "bg-emerald-500" },
  { id: "design", name: "Graphic & Digital Design", description: "Campus aesthetics, UI/UX improvements, and creative workshops.", totalIdeas: 76, activeStudents: 42, color: "bg-rose-500" },
  { id: "media", name: "Media & Communications", description: "Student radio, events broadcasting, and social media presence.", totalIdeas: 54, activeStudents: 31, color: "bg-amber-500" },
  { id: "health", name: "Health & Wellbeing", description: "Mental health support, sports facilities, and cafeteria nutrition.", totalIdeas: 112, activeStudents: 92, color: "bg-violet-500" },
  { id: "law", name: "Law & Governance", description: "Student council regulations, ethics, and campus policy suggestions.", totalIdeas: 23, activeStudents: 15, color: "bg-slate-500" },
];

export default function DepartmentsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDepts = DEPARTMENTS_DATA.filter(dept => 
    dept.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 pb-12">
      
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold border border-indigo-100">
            <Building2 className="w-4 h-4" /> UNIVERSITY FACULTIES
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Explore Departments</h1>
          <p className="text-slate-500 text-sm max-w-lg leading-relaxed">
            Discover innovative ideas from different departments across the campus. Join the conversation and collaborate with peers from other faculties.
          </p>
        </div>

        {/* Search Bar for Departments */}
        <div className="relative w-full md:w-80 z-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text"
            placeholder="Search faculty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-sm font-medium"
          />
        </div>
      </div>

      {/* 2. TOP PERFORMING WIDGET (Optional) */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
            <TrendingUp className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Trending Faculty</h3>
            <p className="text-slate-400 text-sm">Most active department this month</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
            <div className="text-center">
                <p className="text-2xl font-black text-blue-400">IT</p>
                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Dept</p>
            </div>
            <div className="w-px h-10 bg-white/10"></div>
            <div className="text-center">
                <p className="text-2xl font-black text-white">142</p>
                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Ideas</p>
            </div>
            <Link href="/home?dept=it" className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition-all shadow-lg shadow-blue-900/50">
                <ArrowRight className="w-5 h-5" />
            </Link>
        </div>
      </div>

      {/* 3. DEPARTMENTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDepts.map((dept) => (
          <div key={dept.id} className="group bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
            <div>
              {/* Dept Icon/Color Tag */}
              <div className={`w-12 h-12 ${dept.color} rounded-2xl mb-5 shadow-lg flex items-center justify-center text-white`}>
                <Building2 className="w-6 h-6" />
              </div>
              
              <h2 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                {dept.name}
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                {dept.description}
              </p>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                    <div className="flex items-center gap-2 text-slate-600">
                        <Lightbulb className="w-4 h-4 text-amber-500" />
                        <span className="text-xs font-bold">{dept.totalIdeas} Ideas</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                        <Users className="w-4 h-4 text-blue-500" />
                        <span className="text-xs font-bold">{dept.activeStudents} Active</span>
                    </div>
                </div>

                <Link href={`/home?dept=${dept.id}`} className="flex items-center justify-center gap-2 w-full py-3 bg-slate-50 text-slate-700 rounded-xl text-sm font-bold group-hover:bg-blue-600 group-hover:text-white transition-all">
                    View Ideas <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
            </div>
          </div>
        ))}
      </div>

      {/* 4. FOOTER INFO */}
      <div className="text-center py-6 border-t border-slate-200">
        <p className="text-slate-400 text-xs font-medium">© 2026 Greenwich University. Cross-department collaboration enabled.</p>
      </div>

    </div>
  );
}