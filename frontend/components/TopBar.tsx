"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, PlusCircle, User as UserIcon, LogOut } from "lucide-react";
import NotificationBell from "@/components/NotificationBell";
import SubmitIdeaModal from "@/components/SubmitIdeaModal"; 
import { Button } from "@/components/ui/button";
import Logo from "./Logo";

type RoleType = "ROLE_ADMIN" | "ROLE_QA_MANAGER" | "ROLE_QA_COORDINATOR" | "ROLE_STUDENT";

export default function TopBar() {
  const router = useRouter();
  const [currentRole, setCurrentRole] = useState<RoleType>("ROLE_STUDENT");

  useEffect(() => {
    const syncRole = () => {
      const savedRole = localStorage.getItem("user_role") as RoleType;
      if (savedRole) setCurrentRole(savedRole);
    };
    
    syncRole();
    window.addEventListener("roleChanged", syncRole);
    return () => window.removeEventListener("roleChanged", syncRole);
  }, []);

  const getPageTitle = () => {
    switch (currentRole) {
      case "ROLE_ADMIN": return "System Admin";
      case "ROLE_QA_MANAGER": return "Manager Dashboard";
      case "ROLE_QA_COORDINATOR": return "Dept Workspace";
      default: return "Home Feed";
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user_role");
    window.dispatchEvent(new Event("roleChanged"));
    router.push("/");
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 shrink-0 z-40 shadow-sm sticky top-0 gap-4">
      
      {/* 1. Page Title with Minimal Logo (Left) - Added shrink-0 to prevent squishing */}
      <div className="font-bold text-slate-800 text-lg hidden md:flex items-center gap-3 shrink-0">
        <Logo className="h-7" showText={false} />
        <span className="truncate whitespace-nowrap">{getPageTitle()}</span>
      </div>

      {/* 2. Search Bar (Middle) - Shifted left (justify-start) and reduced max-width (max-w-md) */}
      <div className="flex-1 flex justify-start px-2 md:px-6">
        {["ROLE_STUDENT", "ROLE_QA_COORDINATOR"].includes(currentRole) && (
          <div className="relative group w-full max-w-md">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder={currentRole === "ROLE_QA_COORDINATOR" ? "Search department ideas..." : "Search ideas..."}
              className="h-10 w-full rounded-full border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>
        )}
      </div>

      {/* 3. Actions & Tools (Right) - Added shrink-0 to protect buttons from being overlapped */}
      <div className="flex items-center justify-end gap-2 md:gap-3 shrink-0">
        <NotificationBell />

        {/* Profile Button */}
        <Link href="/profile">
          <Button variant="outline" className="hidden lg:flex rounded-full transition-colors hover:bg-slate-100 h-10 px-4 text-slate-600 border-slate-200">
            <UserIcon className="w-4 h-4 mr-2" /> My Profile
          </Button>
        </Link>

        {/* New Idea Button - ONLY FOR STUDENT */}
        {currentRole === "ROLE_STUDENT" && (
          <SubmitIdeaModal>
            <Button className="rounded-full bg-blue-600 hover:bg-blue-700 transition-transform hover:scale-105 shadow-md shadow-blue-200 h-10 px-4 text-white">
              <PlusCircle className="mr-2 h-4 w-4 hidden sm:block" /> 
              <span className="hidden sm:inline">New Idea</span>
              <PlusCircle className="h-4 w-4 sm:hidden" /> {/* Mobile view: icon only */}
            </Button>
          </SubmitIdeaModal>
        )}

        {/* LOGOUT BUTTON */}
        <button 
          onClick={handleLogout}
          title="Sign Out"
          className="flex items-center justify-center w-10 h-10 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all border border-transparent hover:border-red-100 ml-1"
        >
          <LogOut className="w-5 h-5" />
        </button>

      </div>
    </header>
  );
}