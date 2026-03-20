import React from "react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      {/* 1. SIDEBAR ON THE LEFT */}
      <Sidebar />
      
      {/* 2. MAIN CONTENT AREA */}
      <div className="flex flex-col flex-1 overflow-hidden relative">
        {/* TOPBAR ON TOP */}
        <TopBar />
        
        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar relative z-0">
          {children}
        </main>
      </div>
    </div>
  );
}