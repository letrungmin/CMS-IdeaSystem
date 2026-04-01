"use client";

import React from "react";
import { Users, CheckCircle2, Clock, XCircle, TrendingUp, BarChart3, Download, Building2, Lightbulb } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export default function QADashboardPage() {
  const { t } = useLanguage();
  
  const systemStats = { totalIdeas: 842, approved: 610, pending: 124, rejected: 108, activeUsers: 345, engagementRate: "78%" };
  const departmentStats = [
    { name: "IT Department", ideas: 320, color: "bg-blue-500", percentage: 85 },
    { name: "Business Management", ideas: 210, color: "bg-emerald-500", percentage: 65 },
    { name: "Graphic Design", ideas: 145, color: "bg-rose-500", percentage: 45 },
    { name: "Media & Communications", ideas: 98, color: "bg-amber-500", percentage: 30 },
    { name: "Health & Wellbeing", ideas: 69, color: "bg-violet-500", percentage: 20 },
  ];

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-12 transition-colors">
      
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-100 dark:border-emerald-800/50 mb-3">
            <BarChart3 className="w-4 h-4" /> {t("qa_dashboard.badge")}
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">{t("qa_dashboard.title")}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xl">{t("qa_dashboard.desc")}</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 dark:bg-blue-600 text-white font-bold rounded-xl transition-all shadow-md shrink-0">
          <Download className="w-4 h-4" /> {t("qa_dashboard.export")}
        </button>
      </div>

      {/* 2. TOP METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t("qa_dashboard.total_ideas"), value: systemStats.totalIdeas, icon: <Lightbulb className="w-7 h-7 text-blue-600 dark:text-blue-400" />, bg: "bg-blue-50 dark:bg-blue-900/30" },
          { label: t("qa_dashboard.approved"), value: systemStats.approved, icon: <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />, bg: "bg-emerald-50 dark:bg-emerald-900/30" },
          { label: t("qa_dashboard.rejected"), value: systemStats.rejected, icon: <XCircle className="w-7 h-7 text-red-600 dark:text-red-400" />, bg: "bg-red-50 dark:bg-red-900/30" },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-colors">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${stat.bg}`}>{stat.icon}</div>
            <div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</p>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-0.5">{stat.label}</p>
            </div>
          </div>
        ))}
        {/* Pending Queue Highlight */}
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-700 p-5 rounded-2xl border border-amber-600 dark:border-amber-800 shadow-lg flex items-center gap-4 text-white transform hover:-translate-y-1 transition-transform cursor-pointer">
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center shrink-0 backdrop-blur-md border border-white/30"><Clock className="w-7 h-7 text-white" /></div>
          <div>
            <p className="text-2xl font-black text-white">{systemStats.pending}</p>
            <p className="text-xs font-bold text-amber-100 uppercase tracking-wider mt-0.5">{t("qa_dashboard.pending")}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3. IDEAS BY DEPARTMENT */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm transition-colors">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2"><Building2 className="w-5 h-5 text-blue-500" /> {t("qa_dashboard.ideas_by_dept")}</h3>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">{t("qa_dashboard.academic_year")} 2026</span>
          </div>
          <div className="space-y-6">
            {departmentStats.map((dept, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-bold text-slate-700 dark:text-slate-300">{dept.name}</span>
                  <span className="font-black text-slate-900 dark:text-white">{dept.ideas} <span className="text-slate-400 dark:text-slate-500 font-medium text-xs">ideas</span></span>
                </div>
                <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden transition-colors">
                  <div className={`h-full ${dept.color} rounded-full`} style={{ width: `${dept.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. QUICK INSIGHTS WIDGET */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl text-white">
            <h3 className="font-bold text-white flex items-center gap-2 mb-6"><TrendingUp className="w-5 h-5 text-emerald-400" /> {t("qa_dashboard.engagement")}</h3>
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/10 rounded-xl"><Users className="w-5 h-5 text-blue-400" /></div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t("qa_dashboard.active_users")}</p>
                  <p className="text-xl font-black">{systemStats.activeUsers}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/10 rounded-xl"><BarChart3 className="w-5 h-5 text-rose-400" /></div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t("qa_dashboard.engagement_rate")}</p>
                  <p className="text-xl font-black">{systemStats.engagementRate}</p>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-slate-700">
                <p className="text-xs text-slate-400 leading-relaxed">{t("qa_dashboard.engagement_desc")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}