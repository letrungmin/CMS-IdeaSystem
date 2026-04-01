"use client";

import React from "react";
import { 
  Building2, Users, Lightbulb, TrendingUp, 
  Mail, BellRing, Clock, CheckCircle2, MessageSquare
} from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export default function DeptDashboardPage() {
  const { t } = useLanguage();
  
  // Mock Data: Scoped strictly to ONE Department
  const deptStats = {
    name: "IT Department",
    totalStaff: 45,
    participatingStaff: 28,
    totalIdeas: 84,
    totalComments: 215,
    participationRate: "62%"
  };

  const missingStaff = deptStats.totalStaff - deptStats.participatingStaff;

  const recentDeptIdeas = [
    { id: "ID-101", title: "Upgrade Lab Computers to 32GB RAM", author: "Trung Min", comments: 12, thumbsUp: 45, time: "2 hours ago" },
    { id: "ID-102", title: "Free GitHub Copilot for IT Staff", author: "Alex Nguyen", comments: 8, thumbsUp: 30, time: "5 hours ago" },
    { id: "ID-103", title: "More ergonomic chairs in Room 302", author: "David Tran", comments: 3, thumbsUp: 15, time: "1 day ago" },
  ];

  return (
    // THAY ĐỔI: max-w-6xl -> w-full px-4 sm:px-6 lg:px-8
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-12 transition-colors">
      
      {/* 1. HEADER (Violet Theme) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden border border-violet-900/30">
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600 rounded-full -mr-32 -mt-32 blur-[80px] opacity-40"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-black uppercase tracking-widest mb-4 backdrop-blur-md">
            <Building2 className="w-4 h-4" /> {t("dept_dashboard.badge")}
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-2">{t("dept_dashboard.hub").replace("{dept}", deptStats.name)}</h1>
          <p className="text-slate-400 text-sm max-w-xl leading-relaxed">{t("dept_dashboard.desc")}</p>
        </div>
        
        <button className="relative z-10 flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-violet-900/50 hover:-translate-y-1 shrink-0">
          <BellRing className="w-5 h-5" /> {t("dept_dashboard.encourage")}
        </button>
      </div>

      {/* 2. DEPARTMENT STATS (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-colors">
          <div className="w-14 h-14 rounded-full bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center shrink-0">
            <Users className="w-7 h-7 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{deptStats.totalStaff}</p>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-0.5">{t("dept_dashboard.total_staff")}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-colors">
          <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{deptStats.participatingStaff}</p>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-0.5">{t("dept_dashboard.participating")}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-colors">
          <div className="w-14 h-14 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
            <Lightbulb className="w-7 h-7 text-amber-600 dark:text-amber-500" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{deptStats.totalIdeas}</p>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-0.5">{t("dept_dashboard.ideas_submitted")}</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-violet-600 to-purple-800 dark:from-violet-700 dark:to-purple-900 p-5 rounded-2xl border border-violet-700 dark:border-violet-800 shadow-lg flex items-center gap-4 text-white transition-colors">
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center shrink-0 backdrop-blur-md">
            <TrendingUp className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-2xl font-black text-white">{deptStats.participationRate}</p>
            <p className="text-xs font-bold text-violet-200 uppercase tracking-wider mt-0.5">{t("dept_dashboard.participation_rate")}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 3. RECENT IDEAS */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm transition-colors">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-violet-500 dark:text-violet-400" /> {t("dept_dashboard.recent_submissions")}
            </h3>
            <button className="text-sm font-bold text-violet-600 dark:text-violet-400 hover:text-violet-700">{t("dept_dashboard.view_all")}</button>
          </div>

          <div className="space-y-4">
            {recentDeptIdeas.map((idea, index) => (
              <div key={index} className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:border-violet-100 dark:hover:border-violet-800/50 transition-colors group cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-800 dark:text-white group-hover:text-violet-700 dark:group-hover:text-violet-400 transition-colors">{idea.title}</h4>
                  <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest whitespace-nowrap ml-4">{idea.time}</span>
                </div>
                <div className="flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {idea.author}</span>
                  <span className="flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5 text-blue-400" /> {idea.comments}</span>
                  <span className="flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> +{idea.thumbsUp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. QUICK ACTIONS & ALERTS */}
        <div className="space-y-6">
          <div className="bg-violet-50 dark:bg-violet-900/20 rounded-3xl border border-violet-100 dark:border-violet-800/50 p-6 transition-colors">
            <h3 className="font-bold text-violet-900 dark:text-violet-300 flex items-center gap-2 mb-4">
              <Mail className="w-5 h-5 text-violet-600 dark:text-violet-400" /> {t("dept_dashboard.coord_duties")}
            </h3>
            <p className="text-sm text-violet-700 dark:text-violet-400 mb-6 leading-relaxed" 
               dangerouslySetInnerHTML={{ __html: t("dept_dashboard.duty_msg").replace("{rate}", deptStats.participationRate).replace("{missing}", missingStaff.toString()) }} />
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 text-violet-700 dark:text-violet-400 font-bold rounded-xl border border-violet-200 dark:border-violet-800 hover:bg-violet-600 dark:hover:bg-violet-600 hover:text-white dark:hover:text-white hover:border-violet-600 transition-all shadow-sm">
              <Mail className="w-4 h-4" /> {t("dept_dashboard.send_reminder")}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}