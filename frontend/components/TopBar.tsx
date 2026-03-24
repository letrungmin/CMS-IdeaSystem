"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Bell, Lightbulb } from "lucide-react";
import SubmitIdeaModal from "./SubmitIdeaModal";

export default function TopBar() {
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [userRole, setUserRole] = useState("ROLE_STAFF");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const role = localStorage.getItem("user_role");
    if (role) {
      setUserRole(role);
    }
  }, []);

  if (!isMounted) return null;

  // Render proper Display Name for TopBar
  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "ROLE_ADMIN": return "System Admin";
      case "ROLE_QA_MANAGER": return "QA Manager";
      case "ROLE_QA_COORDINATOR": return "QA Coordinator";
      case "ROLE_STUDENT": return "Student";
      case "ROLE_STAFF": return "Staff Member";
      default: return "User";
    }
  };

  // Only Staff and Students can submit ideas
  const canSubmitIdea = userRole === "ROLE_STUDENT" || userRole === "ROLE_STAFF";

  return (
    <>
      <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 sm:px-10 flex items-center justify-between sticky top-0 z-30 transition-all">
        
        {/* LEFT: Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search ideas, categories, or authors..." 
              className="w-full h-11 pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-full text-sm font-medium outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm"
            />
          </div>
        </div>

        {/* RIGHT: Actions & Profile */}
        <div className="flex items-center gap-3 sm:gap-5 ml-auto">
          
          {/* Submit Idea Button (Hidden for Admins and QA roles) */}
          {canSubmitIdea && (
            <button 
              onClick={() => setIsSubmitModalOpen(true)}
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95 border border-blue-500"
            >
              <Lightbulb className="w-4 h-4" /> 
              <span>Submit Idea</span>
            </button>
          )}

          {/* Notification Bell */}
          <button className="relative p-2.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
          </button>

          <div className="w-px h-8 bg-slate-200 hidden sm:block"></div>

          {/* USER PROFILE LINK (Navigates to /profile) */}
          <Link 
            href="/profile"
            className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all text-left group"
          >
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm shadow-sm transition-transform group-hover:scale-105
              ${userRole === "ROLE_ADMIN" ? "bg-rose-100 text-rose-700 border-rose-200" : 
                userRole === "ROLE_QA_MANAGER" ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
                userRole === "ROLE_QA_COORDINATOR" ? "bg-violet-100 text-violet-700 border-violet-200" :
                "bg-blue-100 text-blue-700 border-blue-200"} border`}
            >
              U
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">My Profile</p>
              <p className={`text-[10px] font-black uppercase tracking-widest leading-tight mt-0.5
                ${userRole === "ROLE_ADMIN" ? "text-rose-500" : 
                  userRole === "ROLE_QA_MANAGER" ? "text-emerald-500" :
                  userRole === "ROLE_QA_COORDINATOR" ? "text-violet-500" :
                  "text-blue-500"}`}
              >
                {getRoleDisplayName(userRole)}
              </p>
            </div>
          </Link>
          
        </div>
      </header>

      {/* SUBMIT IDEA MODAL */}
      <SubmitIdeaModal 
        isOpen={isSubmitModalOpen} 
        onClose={() => setIsSubmitModalOpen(false)} 
      />
    </>
  );
}