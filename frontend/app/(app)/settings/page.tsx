"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
// 🔥 NHẬP PHÁP BẢO NGÔN NGỮ
import { useLanguage } from "@/components/LanguageProvider";
import {
  User, Bell, Lock, Eye, Globe, Palette,
  Save, ShieldCheck, Mail, Smartphone, Heart, Moon, Sun, Monitor
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const { theme, setTheme } = useTheme();

  // 🔥 GỌI THÔNG DỊCH VIÊN
  const { locale, setLocale, t } = useLanguage();

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return <div className="p-20 text-center animate-pulse font-bold text-slate-400">Loading settings...</div>;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-12 transition-colors duration-300">

      {/* HEADER - DÙNG HÀM t() ĐỂ DỊCH */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{t("settings.title")}</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your account preferences and security settings.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">

        {/* LEFT NAV */}
        <div className="w-full lg:w-64 space-y-1 shrink-0">
          {[
            { id: "general", label: t("settings.general"), icon: <Globe className="w-4 h-4" /> },
            { id: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4" /> },
            { id: "privacy", label: "Privacy", icon: <Eye className="w-4 h-4" /> },
            { id: "security", label: "Security", icon: <Lock className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id
                  ? "bg-slate-900 dark:bg-blue-600 text-white shadow-lg"
                  : "text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800"
                }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* RIGHT CONTENT */}
        <div className="flex-1 space-y-6">
          {activeTab === "general" && (
            <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                <h3 className="font-bold text-slate-800 dark:text-white">General Preferences</h3>
              </div>
              <div className="p-6 space-y-8">

                {/* 🔥 Ô CHỌN NGÔN NGỮ ĐÃ ĐƯỢC THÔNG MẠCH */}
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t("settings.language")}</label>
                  <select
                    value={locale}
                    onChange={(e) => setLocale(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium outline-none focus:border-blue-500 text-slate-700 dark:text-slate-200 transition-all cursor-pointer"
                  >
                    <option value="en">English (US)</option>
                    <option value="vi">Tiếng Việt</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t("settings.theme_mode")}</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button onClick={() => setTheme("light")} className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 font-bold text-sm transition-all ${theme === 'light' ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400"}`}>
                      <Sun className="w-5 h-5" /> {t("settings.light")}
                    </button>
                    <button onClick={() => setTheme("dark")} className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 font-bold text-sm transition-all ${theme === 'dark' ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400"}`}>
                      <Moon className="w-5 h-5" /> {t("settings.dark")}
                    </button>
                    <button onClick={() => setTheme("system")} className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 font-bold text-sm transition-all ${theme === 'system' ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400"}`}>
                      <Monitor className="w-5 h-5" /> {t("settings.system")}
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button className="px-6 py-2.5 text-sm font-bold text-slate-500 dark:text-slate-400">{t("common.cancel")}</button>
            <button className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 dark:shadow-none active:scale-95">
              <Save className="w-4 h-4" /> {t("common.save")}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}