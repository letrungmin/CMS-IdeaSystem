"use client";

import React, { useState } from "react";
import { Search, Users, Lightbulb, ArrowRight, Building2, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

export default function DepartmentsPage() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-12 transition-colors duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 dark:bg-blue-900/20 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold border border-indigo-100 dark:border-indigo-800/50">
            <Building2 className="w-4 h-4" /> {t("departments.badge")}
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{t("departments.title")}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-lg leading-relaxed">{t("departments.desc")}</p>
        </div>

        <div className="relative w-full md:w-80 z-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
          <input 
            type="text"
            placeholder={t("departments.search_dept")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 pl-12 pr-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:border-blue-500 transition-all text-sm font-medium"
          />
        </div>
      </div>

      <div className="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20"><TrendingUp className="w-8 h-8 text-blue-400" /></div>
          <div>
            <h3 className="text-lg font-bold">{t("departments.trending")}</h3>
            <p className="text-slate-400 text-sm">{t("departments.trending_desc")}</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
            <div className="text-center"><p className="text-2xl font-black text-blue-400">IT</p><p className="text-[10px] uppercase font-bold text-slate-500">Dept</p></div>
            <div className="w-px h-10 bg-white/10"></div>
            <Link href="/home?dept=it" className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition-all shadow-lg"><ArrowRight className="w-5 h-5" /></Link>
        </div>
      </div>

      <div className="text-center py-6 border-t border-slate-200 dark:border-slate-800">
        <p className="text-slate-400 dark:text-slate-500 text-xs font-medium">© 2026 Greenwich University. Cross-department collaboration enabled.</p>
      </div>
    </div>
  );
}