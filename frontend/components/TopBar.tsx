"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Lightbulb, LogOut } from "lucide-react";
import SubmitIdeaModal from "./SubmitIdeaModal";
import NotificationBell from "./NotificationBell"; // <-- Imported the new component
import { useLanguage } from "./LanguageProvider";
import { useAuth } from "./AuthProvider";

export default function TopBar() {
  const pathname = usePathname();
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [userRole, setUserRole] = useState("ROLE_STAFF");
  const [userName, setUserName] = useState("My Profile");
  const [isMounted, setIsMounted] = useState(false);
  const [isPastClosureDate, setIsPastClosureDate] = useState(false);

  const { t } = useLanguage();
  const { logout } = useAuth();

  useEffect(() => {
    setIsMounted(true);
    const role = localStorage.getItem("user_role");
    const name = localStorage.getItem("username");
    
    if (role) {
      setUserRole(role);
    }
    if (name) {
      setUserName(name);
    }

    checkAcademicYearStatus();
  }, [pathname]);

  const checkAcademicYearStatus = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      // Use the actual API to Get All Academic Years like Admin
      const response = await fetch("http://localhost:9999/api/v1/academic-years", {
        headers: { ...(token ? { "Authorization": `Bearer ${token}` } : {}) }
      });
      
      if (response.ok) {
        const data = await response.json();
        const yearsList = data.result || [];
        
        // Find the currently active year
        const activeYear = yearsList.find((y: any) => y.active === true);
        
        if (activeYear && activeYear.ideaClosureDate) {
          const closureTime = new Date(activeYear.ideaClosureDate).getTime();
          const now = new Date().getTime();
          if (now > closureTime) {
            setIsPastClosureDate(true);
          }
        }
      }
    } catch (e) {
      console.error("Failed to check academic year status", e);
    }
  };

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
              onClick={() => !isPastClosureDate && setIsSubmitModalOpen(true)}
              disabled={isPastClosureDate}
              title={isPastClosureDate ? "Submission period has ended" : ""}
              className={`hidden sm:flex items-center gap-2 px-5 py-2.5 font-bold rounded-full transition-all border 
                ${isPastClosureDate 
                  ? "bg-slate-200 text-slate-400 border-slate-200 cursor-not-allowed dark:bg-slate-800 dark:text-slate-500 dark:border-slate-700 shadow-none" 
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20 dark:shadow-none active:scale-95 border-blue-500"
                }`}
            >
              <Lightbulb className="w-4 h-4" /> 
              <span>{t("topbar.submit_idea")}</span>
            </button>
          )}

          {/* Integrated the interactive Notification Bell Component */}
          <NotificationBell />

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
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{userName}</p>
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