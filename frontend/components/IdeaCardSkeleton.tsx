"use client";

import React from "react";

export default function IdeaCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm animate-pulse flex flex-col pointer-events-none">
      
      {/* Skeleton Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3 w-full">
          <div className="w-10 h-10 bg-slate-200 rounded-full shrink-0"></div>
          <div className="space-y-2 w-full max-w-[200px]">
            <div className="h-4 bg-slate-200 rounded-md w-3/4"></div>
            <div className="h-3 bg-slate-200 rounded-md w-1/2"></div>
          </div>
        </div>
        <div className="h-6 w-24 bg-slate-200 rounded-full shrink-0"></div>
      </div>
      
      {/* Skeleton Content */}
      <div className="space-y-3 mb-6">
        <div className="h-6 bg-slate-200 rounded-md w-4/5"></div>
        <div className="h-4 bg-slate-200 rounded-md w-full"></div>
        <div className="h-4 bg-slate-200 rounded-md w-5/6"></div>
      </div>

      {/* Skeleton Footer */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="flex gap-2">
          <div className="h-9 w-24 bg-slate-200 rounded-lg"></div>
          <div className="h-9 w-28 bg-slate-200 rounded-lg hidden sm:block"></div>
        </div>
        <div className="h-5 w-16 bg-slate-200 rounded-md"></div>
      </div>
      
    </div>
  );
}