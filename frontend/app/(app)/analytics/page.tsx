"use client";

import React, { useState, useEffect } from "react";
import { 
  BarChart3, PieChart, TrendingUp, Users, 
  Download, Calendar, ArrowUpRight, Loader2, AlertCircle
} from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export default function AnalyticsPage() {
  const { t } = useLanguage();

  // --- STATES ---
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const [overview, setOverview] = useState({
    totalIdeas: 0,
    activeUsers: 0,
    avgReactions: 0,
    daysLeft: 0
  });

  const [departments, setDepartments] = useState<any[]>([]);
  
  const [privacy, setPrivacy] = useState({
    publicPercent: 0,
    anonymousPercent: 0
  });

  // --- COLOR PALETTE FOR DYNAMIC CHARTS ---
  const chartColors = [
    "bg-blue-500", "bg-indigo-500", "bg-rose-500", 
    "bg-emerald-500", "bg-amber-500", "bg-purple-500"
  ];

  const getAuthHeader = () => {
    const token = localStorage.getItem("accessToken");
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };
  };

  // --- FETCH ALL ANALYTICS DATA IN PARALLEL ---
  const fetchAnalytics = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const headers = getAuthHeader();
      const [resOverview, resDepts, resPrivacy] = await Promise.all([
        fetch("http://localhost:9999/api/v1/analytics/overview", { headers }),
        fetch("http://localhost:9999/api/v1/analytics/departments", { headers }),
        fetch("http://localhost:9999/api/v1/analytics/privacy", { headers })
      ]);

      if (!resOverview.ok || !resDepts.ok || !resPrivacy.ok) {
        throw new Error("Failed to fetch analytics data from server.");
      }

      const dataOverview = await resOverview.json();
      const dataDepts = await resDepts.json();
      const dataPrivacy = await resPrivacy.json();

      if (dataOverview.code === 1000) setOverview(dataOverview.result);
      if (dataDepts.code === 1000) setDepartments(dataDepts.result);
      if (dataPrivacy.code === 1000) setPrivacy(dataPrivacy.result);

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // --- EXPORT TO ZIP LOGIC ---
  const handleExportZip = async () => {
    setIsExporting(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("http://localhost:9999/api/v1/analytics/export/zip", {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!response.ok) throw new Error("Export failed");

      // Convert response to Blob and trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Unideas_Export_${new Date().getTime()}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error("Export Error:", err);
      alert("Failed to export ZIP file.");
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
        <p className="font-bold tracking-widest uppercase animate-pulse">Loading Analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Failed to load Dashboard</h2>
        <p className="text-slate-500">{error}</p>
        <button onClick={fetchAnalytics} className="mt-6 px-6 py-2 bg-slate-900 text-white rounded-lg font-bold">Try Again</button>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-12 transition-colors duration-300">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{t("analytics.title")}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{t("analytics.desc")}</p>
        </div>
        <button 
          onClick={handleExportZip}
          disabled={isExporting}
          className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 dark:bg-blue-600 text-white font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-blue-700 transition-all shadow-lg dark:shadow-none disabled:opacity-70"
        >
          {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} 
          {isExporting ? "Exporting..." : t("analytics.export")}
        </button>
      </div>

      {/* 1. KEY STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t("analytics.total_ideas"), value: overview.totalIdeas, icon: <TrendingUp className="text-blue-600 dark:text-blue-400" /> },
          { label: t("analytics.active_users"), value: overview.activeUsers, icon: <Users className="text-indigo-600 dark:text-indigo-400" /> },
          { label: t("analytics.avg_reactions"), value: overview.avgReactions?.toFixed(1), icon: <BarChart3 className="text-rose-600 dark:text-rose-400" /> },
          { label: t("analytics.days_left"), value: overview.daysLeft, icon: <Calendar className="text-emerald-600 dark:text-emerald-400" /> },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">{stat.icon}</div>
              <div className="flex items-center text-xs font-bold text-slate-400">
                <ArrowUpRight className="w-3 h-3" /> Live
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}</p>
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
          </div>
          
          <div className="space-y-5">
            {departments.length === 0 ? (
              <p className="text-sm font-bold text-slate-400 text-center py-8">No departmental data available.</p>
            ) : (
              departments.map((dept, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-600 dark:text-slate-300">{dept.department} <span className="text-slate-400 font-normal">({dept.total})</span></span>
                    <span className="text-slate-900 dark:text-white">{dept.percent.toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${chartColors[i % chartColors.length]} rounded-full`} 
                      style={{ width: `${Math.max(dept.percent, 1)}%` }} // Ensure at least 1% is visible if > 0
                    ></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Anonymous vs Identified Donut Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col transition-colors duration-300">
          <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-8">
            <Users className="w-5 h-5 text-indigo-500" /> {t("analytics.participation_privacy")}
          </h3>
          <div className="flex-1 flex items-center justify-center">
            <div className="relative w-48 h-48">
              {/* Dynamic Conic Gradient based on publicPercent */}
              <div className="w-full h-full rounded-full border-[16px] border-slate-100 dark:border-slate-800 transition-colors duration-300" style={{ 
                background: `conic-gradient(#4f46e5 0% ${privacy.publicPercent}%, transparent ${privacy.publicPercent}% 100%)`,
                maskImage: 'radial-gradient(transparent 55%, black 56%)',
                WebkitMaskImage: 'radial-gradient(transparent 55%, black 56%)'
              }}></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-800 dark:text-white">{privacy.publicPercent.toFixed(1)}%</span>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">{t("analytics.public")}</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center gap-6 mt-8">
             <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                <div className="w-3 h-3 bg-indigo-600 rounded-sm"></div> {t("analytics.identified")} ({privacy.publicPercent.toFixed(1)}%)
             </div>
             <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                <div className="w-3 h-3 bg-slate-200 dark:bg-slate-700 rounded-sm"></div> {t("analytics.anonymous")} ({privacy.anonymousPercent.toFixed(1)}%)
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}