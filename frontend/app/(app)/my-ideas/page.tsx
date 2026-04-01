"use client";

import React, { useState } from "react";
import { Lightbulb, Clock, CheckCircle2, XCircle, Filter } from "lucide-react";
import IdeaCard from "@/components/IdeaCard";
import EmptyState from "@/components/EmptyState";
import { useLanguage } from "@/components/LanguageProvider";

export default function MyIdeasPage() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<"all" | "approved" | "pending" | "rejected">("all");

  const getStatusBadge = (status: string) => {
    const styles: any = {
      approved: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50",
      pending: "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-800/50",
      rejected: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border-red-200 dark:border-red-800/50"
    };
    const icons: any = { approved: <CheckCircle2 className="w-3 h-3" />, pending: <Clock className="w-3 h-3" />, rejected: <XCircle className="w-3 h-3" /> };
    return (
      <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase shrink-0 border ${styles[status]}`}>
        {icons[status]} {t(`my_ideas.${status}`)}
      </div>
    );
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 space-y-6 py-8 pb-20 relative transition-colors duration-300">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-100 dark:border-blue-800/50 mb-3">
          <Lightbulb className="w-4 h-4" /> {t("my_ideas.badge")}
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">{t("my_ideas.title")}</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xl leading-relaxed">{t("my_ideas.desc")}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {["total", "approved", "pending", "rejected"].map((key) => (
          <div key={key} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center transition-colors">
            <span className="text-3xl font-black text-slate-800 dark:text-white">0</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-1 uppercase tracking-wider">{t(`my_ideas.${key}`)}</span>
          </div>
        ))}
      </div>

      <div className="sticky top-[-32px] z-40 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-md pt-8 pb-3 -mx-4 px-4 sm:-mx-8 sm:px-8">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-2 shadow-sm flex items-center gap-2 overflow-x-auto custom-scrollbar">
          <div className="pl-3 pr-2 border-r border-slate-200 dark:border-slate-700 flex items-center text-slate-400 dark:text-slate-500 shrink-0"><Filter className="w-4 h-4" /></div>
          <button onClick={() => setFilter("all")} className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all shrink-0 ${filter === "all" ? "bg-slate-800 dark:bg-blue-600 text-white shadow-md" : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"}`}>{t("my_ideas.all_filter")}</button>
          <button onClick={() => setFilter("approved")} className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all shrink-0 ${filter === "approved" ? "bg-emerald-600 text-white" : "text-slate-600 dark:text-slate-300 hover:bg-slate-100"}`}>{t("my_ideas.approved")}</button>
          <button onClick={() => setFilter("pending")} className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all shrink-0 ${filter === "pending" ? "bg-amber-500 text-white" : "text-slate-600 dark:text-slate-300 hover:bg-slate-100"}`}>{t("my_ideas.pending_filter")}</button>
          <button onClick={() => setFilter("rejected")} className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all shrink-0 ${filter === "rejected" ? "bg-red-500 text-white" : "text-slate-600 dark:text-slate-300 hover:bg-slate-100"}`}>{t("my_ideas.rejected")}</button>
        </div>
      </div>

      <div className="space-y-4">
        <EmptyState title={t("home.no_ideas")} description={t("my_ideas.desc")} />
      </div>
    </div>
  );
}