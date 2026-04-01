"use client";

import React, { useState } from "react";
import { 
  ShieldAlert, Calendar, Plus, Edit, 
  Trash2, AlertCircle, CheckCircle2, Clock,
  CalendarDays, Settings
} from "lucide-react";
// 🔥 Gọi Thông dịch viên
import { useLanguage } from "@/components/LanguageProvider";

// Mock Data for Academic Years
const ACADEMIC_YEARS = [
  { id: "AY-2026", name: "Academic Year 2025 - 2026", startDate: "2025-09-01", endDate: "2026-08-31", ideaClosureDate: "2026-04-15", finalClosureDate: "2026-04-30", status: "active" },
  { id: "AY-2027", name: "Academic Year 2026 - 2027", startDate: "2026-09-01", endDate: "2027-08-31", ideaClosureDate: "2027-04-15", finalClosureDate: "2027-04-30", status: "upcoming" },
  { id: "AY-2025", name: "Academic Year 2024 - 2025", startDate: "2024-09-01", endDate: "2025-08-31", ideaClosureDate: "2025-04-15", finalClosureDate: "2025-04-30", status: "past" }
];

export default function AdminAcademicYearsPage() {
  const { t } = useLanguage();
  const [years, setYears] = useState(ACADEMIC_YEARS);
  const activeYear = years.find(y => y.status === "active");

  return (
    // THAY ĐỔI: max-w-6xl -> w-full px-4 sm:px-6 lg:px-8
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-12 transition-colors duration-300">
      
      {/* 1. ADMIN HEADER (Red/Rose Theme) */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden border border-rose-900/30">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600 rounded-full -mr-32 -mt-32 blur-[80px] opacity-30"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-black uppercase tracking-widest mb-4 backdrop-blur-md">
              <ShieldAlert className="w-4 h-4" /> {t("admin_years.role_badge")}
            </div>
            <h1 className="text-3xl font-black tracking-tight mb-2">{t("admin_years.title")}</h1>
            <p className="text-slate-400 text-sm max-w-xl leading-relaxed whitespace-pre-line" dangerouslySetInnerHTML={{ __html: t("admin_years.desc") }}></p>
          </div>
          <button className="relative z-10 flex items-center justify-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-rose-900/50 hover:-translate-y-1 shrink-0">
            <Plus className="w-5 h-5" /> {t("admin_years.create_new")}
          </button>
        </div>
      </div>

      {/* 2. ACTIVE YEAR HIGHLIGHT CARD */}
      {activeYear && (
        <div className="bg-gradient-to-br from-white to-rose-50 dark:from-slate-900 dark:to-rose-900/10 p-1 rounded-3xl shadow-lg border border-rose-100 dark:border-rose-900/30 transition-colors">
          <div className="bg-white dark:bg-slate-900 rounded-[1.4rem] p-6 lg:p-8 flex flex-col lg:flex-row gap-8 items-center relative overflow-hidden transition-colors">
            
            <div className="flex items-center gap-6 w-full lg:w-1/3 shrink-0 lg:border-r border-slate-100 dark:border-slate-800 pr-6">
              <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 shadow-inner">
                <CalendarDays className="w-8 h-8" />
              </div>
              <div>
                <p className="text-[10px] font-black text-rose-500 dark:text-rose-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span> {t("admin_years.currently_active")}
                </p>
                <h2 className="text-2xl font-black text-slate-800 dark:text-white leading-tight">{activeYear.name}</h2>
              </div>
            </div>

            <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 transition-colors">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-amber-500" /> {t("admin_years.idea_closure")}
                </p>
                <p className="text-xl font-black text-slate-900 dark:text-white">{activeYear.ideaClosureDate}</p>
                <p className="text-xs text-slate-400 mt-1">{t("admin_years.idea_closure_desc")}</p>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 border-l-4 border-l-rose-500 dark:border-l-rose-500 transition-colors">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2 mb-2">
                  <ShieldAlert className="w-4 h-4 text-rose-500" /> {t("admin_years.final_closure")}
                </p>
                <p className="text-xl font-black text-slate-900 dark:text-white">{activeYear.finalClosureDate}</p>
                <p className="text-xs text-slate-400 mt-1">{t("admin_years.final_closure_desc")}</p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 3. ALL ACADEMIC YEARS TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
          <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-400 dark:text-slate-500" /> {t("admin_years.table_title")}
          </h3>
        </div>
        
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 transition-colors">
                <th className="px-6 py-4 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t("admin_years.th_year")}</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t("admin_years.th_duration")}</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t("admin_years.th_status")}</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">{t("admin_years.th_actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {years.map((year) => (
                <tr key={year.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900 dark:text-white">{year.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">ID: {year.id}</p>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 font-medium">
                      <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                      <span>{year.startDate}</span>
                      <span className="text-slate-300 dark:text-slate-600">→</span>
                      <span>{year.endDate}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    {year.status === "active" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-[10px] font-black uppercase tracking-widest border border-rose-100 dark:border-rose-800/50">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> {t("admin_years.status_active")}
                      </span>
                    )}
                    {year.status === "upcoming" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-100 dark:border-blue-800/50">
                        <Clock className="w-3 h-3" /> {t("admin_years.status_upcoming")}
                      </span>
                    )}
                    {year.status === "past" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest border border-slate-200 dark:border-slate-700">
                        <CheckCircle2 className="w-3 h-3" /> {t("admin_years.status_concluded")}
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors" title={t("admin_years.btn_edit")}>
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        className={`p-2 rounded-lg transition-colors ${year.status === 'active' ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed' : 'text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30'}`}
                        disabled={year.status === 'active'}
                        title={year.status === 'active' ? t("admin_years.err_delete_active") : t("admin_years.btn_delete")}
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