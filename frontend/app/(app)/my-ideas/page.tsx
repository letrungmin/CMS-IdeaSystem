"use client";

import React, { useState, useEffect } from "react";
import { Lightbulb, Clock, CheckCircle2, XCircle, Filter, Loader2, AlertCircle } from "lucide-react";
import IdeaCard from "@/components/IdeaCard";
import EmptyState from "@/components/EmptyState";
import { useLanguage } from "@/components/LanguageProvider";

export default function MyIdeasPage() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<"all" | "approved" | "pending" | "rejected">("all");

  // --- DATA STATES ---
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lưu trữ số lượng (totalElements) cho 4 ô thống kê phía trên
  const [stats, setStats] = useState({
    all: 0,
    approved: 0,
    pending: 0,
    rejected: 0
  });

  // Lưu trữ danh sách bài viết (content) cho từng tab
  const [lists, setLists] = useState({
    all: [] as any[],
    approved: [] as any[],
    pending: [] as any[],
    rejected: [] as any[]
  });

  const getAuthHeader = () => {
    const token = localStorage.getItem("accessToken");
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };
  };

  const fetchMyIdeas = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const headers = getAuthHeader();
      
      // Kỹ thuật gọi 4 API cùng lúc (Parallel Fetching) để tối ưu tốc độ
      const [resAll, resApproved, resPending, resRejected] = await Promise.all([
        fetch("http://localhost:9999/api/v1/idea/me", { headers }),
        fetch("http://localhost:9999/api/v1/idea/my/approved", { headers }),
        fetch("http://localhost:9999/api/v1/idea/my/pending", { headers }),
        fetch("http://localhost:9999/api/v1/idea/my/rejected", { headers })
      ]);

      if (!resAll.ok || !resApproved.ok || !resPending.ok || !resRejected.ok) {
        throw new Error("Failed to fetch ideas data from server.");
      }

      const dataAll = await resAll.json();
      const dataApproved = await resApproved.json();
      const dataPending = await resPending.json();
      const dataRejected = await resRejected.json();

      // Cập nhật số lượng (Lấy từ totalElements của API trả về)
      setStats({
        all: dataAll.result?.totalElements || 0,
        approved: dataApproved.result?.totalElements || 0,
        pending: dataPending.result?.totalElements || 0,
        rejected: dataRejected.result?.totalElements || 0
      });

      // Cập nhật mảng danh sách bài viết
      setLists({
        all: dataAll.result?.content || [],
        approved: dataApproved.result?.content || [],
        pending: dataPending.result?.content || [],
        rejected: dataRejected.result?.content || []
      });

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyIdeas();
  }, []);

  // Lấy ra danh sách hiện tại đang được chọn bởi Filter
  const activeList = lists[filter];

  if (isLoading) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
        <p className="font-bold tracking-widest uppercase animate-pulse">Loading Your Ideas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Failed to load ideas</h2>
        <p className="text-slate-500">{error}</p>
        <button onClick={fetchMyIdeas} className="mt-6 px-6 py-2 bg-slate-900 text-white rounded-lg font-bold">Try Again</button>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 space-y-6 py-8 pb-20 relative transition-colors duration-300">
      
      {/* HEADER */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-100 dark:border-blue-800/50 mb-3">
          <Lightbulb className="w-4 h-4" /> {t("my_ideas.badge")}
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">{t("my_ideas.title")}</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xl leading-relaxed">{t("my_ideas.desc")}</p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { key: "all", label: "total", value: stats.all },
          { key: "approved", label: "approved", value: stats.approved },
          { key: "pending", label: "pending", value: stats.pending },
          { key: "rejected", label: "rejected", value: stats.rejected }
        ].map((stat) => (
          <div key={stat.key} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center transition-colors">
            <span className="text-3xl font-black text-slate-800 dark:text-white">{stat.value}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-1 uppercase tracking-wider">
              {t(`my_ideas.${stat.label}`)}
            </span>
          </div>
        ))}
      </div>

      {/* TABS / FILTER BAR */}
      <div className="sticky top-[-32px] z-40 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-md pt-8 pb-3 -mx-4 px-4 sm:-mx-8 sm:px-8">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-2 shadow-sm flex items-center gap-2 overflow-x-auto custom-scrollbar">
          <div className="pl-3 pr-2 border-r border-slate-200 dark:border-slate-700 flex items-center text-slate-400 dark:text-slate-500 shrink-0">
            <Filter className="w-4 h-4" />
          </div>
          
          <button onClick={() => setFilter("all")} className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all shrink-0 ${filter === "all" ? "bg-slate-800 dark:bg-blue-600 text-white shadow-md" : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"}`}>
            {t("my_ideas.all_filter")}
          </button>
          
          <button onClick={() => setFilter("approved")} className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all shrink-0 ${filter === "approved" ? "bg-emerald-600 text-white" : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"}`}>
            {t("my_ideas.approved")}
          </button>
          
          <button onClick={() => setFilter("pending")} className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all shrink-0 ${filter === "pending" ? "bg-amber-500 text-white" : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"}`}>
            {t("my_ideas.pending_filter")}
          </button>
          
          <button onClick={() => setFilter("rejected")} className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all shrink-0 ${filter === "rejected" ? "bg-red-500 text-white" : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"}`}>
            {t("my_ideas.rejected")}
          </button>
        </div>
      </div>

      {/* IDEAS LIST OR EMPTY STATE */}
      <div className="space-y-4">
        {activeList.length === 0 ? (
          <EmptyState title={t("home.no_ideas")} description={t("my_ideas.desc")} />
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {activeList.map((idea: any) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}