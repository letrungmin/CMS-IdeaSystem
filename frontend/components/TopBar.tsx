"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Bell, Lightbulb, LogOut } from "lucide-react";
import SubmitIdeaModal from "./SubmitIdeaModal";
import { useLanguage } from "./LanguageProvider";
import { useAuth } from "./AuthProvider";

export default function TopBar() {
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [userRole, setUserRole] = useState("ROLE_STAFF");
  const [isMounted, setIsMounted] = useState(false);

  const { t } = useLanguage();
  const { logout } = useAuth();

  useEffect(() => {
    setIsMounted(true);
    const role = localStorage.getItem("user_role");
    if (role) {
      setUserRole(role);
    }
  }, []);

  if (!isMounted) return null;

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "ROLE_ADMIN": return "System Admin";
      case "ROLE_QA_MANAGER": return "QA Manager";
      case "ROLE_QA_COORDINATOR": return "QA Coordinator";
      case "ROLE_STAFF": return "Staff Member";
      default: return "User";
    }
  };

  const canSubmitIdea = userRole === "ROLE_STUDENT" || userRole === "ROLE_STAFF";

  return (
    <>
      <header className="h-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 sm:px-10 flex items-center justify-between sticky top-0 z-30 transition-colors duration-300 shadow-sm dark:shadow-md">
        
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder={t("common.search")} 
              className="w-full h-11 pl-11 pr-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-full text-sm font-medium outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-5 ml-auto">
          
          {canSubmitIdea && (
            <button 
              onClick={() => setIsSubmitModalOpen(true)}
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 dark:shadow-none active:scale-95 border border-blue-500"
            >
              <Lightbulb className="w-4 h-4" /> 
              <span>{t("topbar.submit_idea")}</span>
            </button>
          )}

          <button 
            onClick={() => alert("Notification panel is under construction!")}
            title={t("topbar.notifications")}
            className="relative p-2.5 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
          </button>

          <div className="w-px h-8 bg-slate-200 dark:bg-slate-800 hidden sm:block transition-colors duration-300"></div>

          <Link 
            href="/profile"
            className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all text-left group cursor-pointer"
          >
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm shadow-sm transition-transform group-hover:scale-105 border
              ${userRole === "ROLE_ADMIN" ? "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/50" : 
                userRole === "ROLE_QA_MANAGER" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50" :
                userRole === "ROLE_QA_COORDINATOR" ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-800/50" :
                "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/50"}`}
            >
              U
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{t("topbar.my_profile")}</p>
              <p className={`text-[10px] font-black uppercase tracking-widest leading-tight mt-0.5
                ${userRole === "ROLE_ADMIN" ? "text-rose-500 dark:text-rose-400" : 
                  userRole === "ROLE_QA_MANAGER" ? "text-emerald-500 dark:text-emerald-400" :
                  userRole === "ROLE_QA_COORDINATOR" ? "text-violet-500 dark:text-violet-400" :
                  "text-blue-500 dark:text-blue-400"}`}
              >
                {getRoleDisplayName(userRole)}
              </p>
            </div>
          </Link>

          <button 
            onClick={logout}
            title="Log Out"
            className="p-2.5 text-rose-500 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-full transition-colors ml-1"
          >
            <LogOut className="w-5 h-5" />
          </button>
          
        </div>
      </header>

      <SubmitIdeaModal isOpen={isSubmitModalOpen} onClose={() => setIsSubmitModalOpen(false)} />
    </>
  );
}