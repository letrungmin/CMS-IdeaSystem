"use client";

<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, Lightbulb, BarChart3, Settings, ShieldAlert,
  Building2, Menu, LayoutDashboard, CheckSquare,
  Tags, Users, CalendarDays, Shield
} from "lucide-react";
=======
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Lightbulb, BarChart3, Settings, ShieldAlert, User as UserIcon, Building2, Menu } from "lucide-react";
>>>>>>> ce7d26faf57dbd960db18dedb1323adf3e65d957

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
<<<<<<< HEAD
  const [userRole, setUserRole] = useState<string>("ROLE_STAFF");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const storedRole = localStorage.getItem("user_role");
    if (storedRole) {
      setUserRole(storedRole);
    }
  }, []);

  // 1. MENU FOR STAFF / STUDENTS
  const STAFF_MENU = [
    { name: "Home Feed", icon: <Home className="w-5 h-5" />, path: "/home" },
=======

  const menuItems = [
    { name: "Home Feed", icon: <Home className="w-5 h-5" />, path: "/home" },
    { name: "My Profile", icon: <UserIcon className="w-5 h-5" />, path: "/profile" },
>>>>>>> ce7d26faf57dbd960db18dedb1323adf3e65d957
    { name: "My Ideas", icon: <Lightbulb className="w-5 h-5" />, path: "/my-ideas" },
    { name: "Departments", icon: <Building2 className="w-5 h-5" />, path: "/departments" },
    { name: "Analytics", icon: <BarChart3 className="w-5 h-5" />, path: "/analytics" },
    { name: "System Settings", icon: <Settings className="w-5 h-5" />, path: "/settings" },
  ];

<<<<<<< HEAD
  // 2. MENU FOR QA COORDINATOR (Department Level)
  const QA_COORDINATOR_MENU = [
    { name: "Dept Dashboard", icon: <LayoutDashboard className="w-5 h-5" />, path: "/dept-dashboard" },
    { name: "Home Feed", icon: <Home className="w-5 h-5" />, path: "/home" },
    { name: "Department Staff", icon: <Users className="w-5 h-5" />, path: "/qa-staff" },
    { name: "System Settings", icon: <Settings className="w-5 h-5" />, path: "/settings" },
  ];

  // 3. MENU FOR QA MANAGER (University Level)
  const QA_MANAGER_MENU = [
    { name: "Global Dashboard", icon: <LayoutDashboard className="w-5 h-5" />, path: "/qa-dashboard" },
    { name: "Approval Queue", icon: <CheckSquare className="w-5 h-5" />, path: "/qa-queue" },
    { name: "Manage Categories", icon: <Tags className="w-5 h-5" />, path: "/qa-categories" },
    { name: "User Directory", icon: <Users className="w-5 h-5" />, path: "/qa-staff" },
    { name: "System Settings", icon: <Settings className="w-5 h-5" />, path: "/settings" },
  ];

  // 4. MENU FOR ADMINISTRATORS (System Level)
  const ADMIN_MENU = [
    { name: "Academic Years", icon: <CalendarDays className="w-5 h-5" />, path: "/admin-academic-years" },
    { name: "Departments", icon: <Building2 className="w-5 h-5" />, path: "/admin-departments" },
    { name: "Account Manager", icon: <Shield className="w-5 h-5" />, path: "/admin-accounts" },
    { name: "System Settings", icon: <Settings className="w-5 h-5" />, path: "/settings" },
  ];

  // --- ROLE LOGIC & THEMING ---
  let menuItems = STAFF_MENU;
  let activeColor = "bg-blue-600 shadow-blue-900/20";
  let avatarColor = "bg-gradient-to-br from-blue-500 to-indigo-600";
  let avatarText = "S";
  let roleTitle = "UniIdeas";
  let shieldColor = "text-blue-400";

  if (userRole === "ROLE_QA_COORDINATOR") {
    menuItems = QA_COORDINATOR_MENU;
    activeColor = "bg-violet-600 shadow-violet-900/20";
    avatarColor = "bg-gradient-to-br from-violet-500 to-purple-700";
    avatarText = "QC";
    roleTitle = "Dept Portal";
    shieldColor = "text-violet-400";
  } else if (userRole === "ROLE_QA_MANAGER") {
    menuItems = QA_MANAGER_MENU;
    activeColor = "bg-emerald-600 shadow-emerald-900/20";
    avatarColor = "bg-gradient-to-br from-emerald-500 to-teal-700";
    avatarText = "QA";
    roleTitle = "QA Portal";
    shieldColor = "text-emerald-400";
  } else if (userRole === "ROLE_ADMIN") {
    menuItems = ADMIN_MENU;
    activeColor = "bg-rose-600 shadow-rose-900/20";
    avatarColor = "bg-gradient-to-br from-rose-500 to-red-700";
    avatarText = "AD";
    roleTitle = "Admin Console";
    shieldColor = "text-rose-400";
  }

  if (!isMounted) return null;

  return (
    <aside className={`flex flex-col h-screen bg-slate-900 text-slate-300 shrink-0 shadow-xl z-50 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}>

      {/* BRAND HEADER */}
      <div className={`h-20 flex items-center justify-between border-b border-slate-800 bg-slate-950/50 transition-all ${isCollapsed ? 'px-0 justify-center' : 'px-4'}`}>
        {!isCollapsed && (
          <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
            <div className={`w-9 h-9 shrink-0 rounded-xl flex items-center justify-center font-black text-white shadow-lg ${avatarColor}`}>
              {avatarText}
            </div>
            <span className="font-extrabold text-white text-lg tracking-tight animate-in fade-in duration-300">
              {roleTitle}
            </span>
          </div>
        )}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className={`p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors flex items-center justify-center ${isCollapsed ? 'mx-auto' : ''}`}>
=======
  return (
    <aside className={`flex flex-col h-screen bg-slate-900 text-slate-300 shrink-0 shadow-xl z-50 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}>
      
      {/* Brand Header & Toggle Button */}
      <div className={`h-16 flex items-center justify-between border-b border-slate-800 bg-slate-950/50 transition-all ${isCollapsed ? 'px-0 justify-center' : 'px-4'}`}>
        {!isCollapsed && (
          <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
            <div className="w-8 h-8 shrink-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg">U</div>
            <span className="font-extrabold text-white text-lg tracking-tight animate-in fade-in duration-300">
              UniIdeas
            </span>
          </div>
        )}
        
        {/* Toggle Button Moved to Top */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors flex items-center justify-center ${isCollapsed ? 'mx-auto' : ''}`}
        >
>>>>>>> ce7d26faf57dbd960db18dedb1323adf3e65d957
          <Menu className="w-5 h-5" />
        </button>
      </div>

<<<<<<< HEAD
      {/* NAVIGATION MENU */}
      <nav className="flex-1 overflow-y-auto py-6 space-y-2 custom-scrollbar px-3">
        {!isCollapsed && (
          <p className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 animate-in fade-in">
            {userRole === "ROLE_ADMIN" ? "System Core" : (userRole === "ROLE_QA_MANAGER" ? "University Level" : (userRole === "ROLE_QA_COORDINATOR" ? "Department Level" : "Main Menu"))}
          </p>
        )}

        {menuItems.map((item) => {
          const isActive = pathname === item.path || pathname?.startsWith(item.path + '/');

          return (
            <Link key={item.path} href={item.path} title={isCollapsed ? item.name : undefined}>
              <div className={`flex items-center rounded-xl transition-all duration-200 group cursor-pointer h-12
                ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'}
                ${isActive ? `${activeColor} text-white shadow-md` : "hover:bg-slate-800 hover:text-white font-medium"}
              `}>
                <div className={`shrink-0 ${isActive ? "text-white" : "text-slate-400 group-hover:text-white"}`}>
                  {item.icon}
                </div>
                {!isCollapsed && (
                  <span className={`animate-in fade-in duration-200 whitespace-nowrap text-sm ${isActive ? "font-bold" : ""}`}>{item.name}</span>
=======
      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-6 space-y-2 custom-scrollbar px-3">
        {!isCollapsed && (
          <p className="px-3 text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 animate-in fade-in">Menu</p>
        )}
        
        {menuItems.map((item) => {
          const isActive = pathname === item.path || pathname?.startsWith(item.path + '/');
          
          return (
            <Link key={item.path} href={item.path} title={isCollapsed ? item.name : undefined}>
              <div className={`flex items-center rounded-xl transition-all duration-200 group cursor-pointer h-11
                ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'}
                ${isActive 
                  ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-900/20" 
                  : "hover:bg-slate-800 hover:text-white font-medium"}
              `}>
                <div className={`shrink-0 ${isActive ? "text-white" : "text-slate-400 group-hover:text-blue-400"}`}>
                  {item.icon}
                </div>
                
                {!isCollapsed && (
                  <span className="animate-in fade-in duration-200 whitespace-nowrap">{item.name}</span>
                )}
                
                {!isCollapsed && isActive && (
                  <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full shrink-0"></div>
>>>>>>> ce7d26faf57dbd960db18dedb1323adf3e65d957
                )}
              </div>
            </Link>
          );
        })}
      </nav>

<<<<<<< HEAD
      {/* FOOTER */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/30 flex flex-col gap-4">
        {!isCollapsed ? (
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 animate-in fade-in">
            <ShieldAlert className={`w-5 h-5 shrink-0 ${shieldColor}`} />
            <div className="text-xs whitespace-nowrap overflow-hidden">
              <p className="text-white font-bold truncate">{roleTitle} Active</p>
              <p className="text-slate-400 truncate">System Secure v2.0</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center" title="System Secure">
            <ShieldAlert className={`w-6 h-6 ${shieldColor}`} />
=======
      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/30 flex flex-col gap-4">
        {!isCollapsed ? (
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50 animate-in fade-in">
            <ShieldAlert className="w-5 h-5 shrink-0 text-emerald-400" />
            <div className="text-xs whitespace-nowrap overflow-hidden">
              <p className="text-white font-bold truncate">System Secure</p>
              <p className="text-slate-400 truncate">v2.0.4 • Active</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <ShieldAlert className="w-6 h-6 text-emerald-400" title="System Secure v2.0.4" />
>>>>>>> ce7d26faf57dbd960db18dedb1323adf3e65d957
          </div>
        )}
      </div>
    </aside>
  );
}