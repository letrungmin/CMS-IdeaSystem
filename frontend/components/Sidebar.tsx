"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Lightbulb, BarChart3, Settings, ShieldAlert, User as UserIcon, Building2, Menu } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { name: "Home Feed", icon: <Home className="w-5 h-5" />, path: "/home" },
    { name: "My Profile", icon: <UserIcon className="w-5 h-5" />, path: "/profile" },
    { name: "My Ideas", icon: <Lightbulb className="w-5 h-5" />, path: "/my-ideas" },
    { name: "Departments", icon: <Building2 className="w-5 h-5" />, path: "/departments" },
    { name: "Analytics", icon: <BarChart3 className="w-5 h-5" />, path: "/analytics" },
    { name: "System Settings", icon: <Settings className="w-5 h-5" />, path: "/settings" },
  ];

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
          <Menu className="w-5 h-5" />
        </button>
      </div>

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
                )}
              </div>
            </Link>
          );
        })}
      </nav>

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
          </div>
        )}
      </div>
    </aside>
  );
}