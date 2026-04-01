"use client";

import React from "react";
import { 
  BarChart3, PieChart, TrendingUp, Users, 
  Download, Calendar, ArrowUpRight, ArrowDownRight 
} from "lucide-react";
// 🔥 Gọi Thông dịch viên
import { useLanguage } from "@/components/LanguageProvider";

export default function AnalyticsPage() {
  const { t } = useLanguage();

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-12 transition-colors duration-300">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{t("analytics.title")}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{t("analytics.desc")}</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 dark:bg-blue-600 text-white font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-blue-700 transition-all shadow-lg dark:shadow-none">
          <Download className="w-4 h-4" /> {t("analytics.export")}
        </button>
      </div>

      {/* 1. KEY STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t("analytics.total_ideas"), value: "482", trend: "+12%", up: true, icon: <TrendingUp className="text-blue-600 dark:text-blue-400" /> },
          { label: t("analytics.active_users"), value: "1,205", trend: "+5%", up: true, icon: <Users className="text-indigo-600 dark:text-indigo-400" /> },
          { label: t("analytics.avg_reactions"), value: "24", trend: "-2%", up: false, icon: <BarChart3 className="text-rose-600 dark:text-rose-400" /> },
          { label: t("analytics.days_left"), value: "45", trend: "Season 2026", up: true, icon: <Calendar className="text-emerald-600 dark:text-emerald-400" /> },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg transition-colors duration-300">{stat.icon}</div>
              <div className={`flex items-center text-xs font-bold ${stat.up ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.trend}
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</p>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* 2. MAIN CHARTS AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Ideas per Department */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <PieChart className="w-5 h-5 text-blue-500" /> {t("analytics.ideas_per_dept")}
            </h3>
            <select className="text-xs font-bold bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 outline-none p-1 rounded transition-colors duration-300">
              <option>{t("analytics.last_30_days")}</option>
              <option>{t("analytics.this_year")}</option>
            </select>
          </div>
          
          <div className="space-y-4">
            {[
              { label: "IT Dept", value: 85, color: "bg-blue-500" },
              { label: "Business", value: 62, color: "bg-indigo-500" },
              { label: "Design", value: 45, color: "bg-rose-500" },
              { label: "Health", value: 30, color: "bg-emerald-500" },
            ].map((bar, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-600 dark:text-slate-300">{bar.label}</span>
                  <span className="text-slate-900 dark:text-white">{bar.value}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden transition-colors duration-300">
                  <div className={`h-full ${bar.color} rounded-full`} style={{ width: `${bar.value}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Anonymous vs Identified */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col transition-colors duration-300">
          <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-8">
            <Users className="w-5 h-5 text-indigo-500" /> {t("analytics.participation_privacy")}
          </h3>
          <div className="flex-1 flex items-center justify-center">
            <div className="relative w-40 h-40">
              <div className="w-full h-full rounded-full border-[16px] border-slate-100 dark:border-slate-800 transition-colors duration-300" style={{ 
                background: 'conic-gradient(#4f46e5 0% 65%, transparent 65% 100%)',
                maskImage: 'radial-gradient(transparent 55%, black 56%)',
                WebkitMaskImage: 'radial-gradient(transparent 55%, black 56%)'
              }}></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-slate-800 dark:text-white">65%</span>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">{t("analytics.public")}</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-6 mt-6">
             <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                <div className="w-3 h-3 bg-indigo-600 rounded-sm"></div> {t("analytics.identified")}
             </div>
             <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                <div className="w-3 h-3 bg-slate-200 dark:bg-slate-700 rounded-sm transition-colors duration-300"></div> {t("analytics.anonymous")}
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}