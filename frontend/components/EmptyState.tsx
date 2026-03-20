"use client";

import React from "react";
import { SearchX } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  onClearFilters?: () => void;
}

export default function EmptyState({ 
  title = "No ideas found", 
  description = "We couldn't find any ideas matching your current filters. Try adjusting your search keywords or categories.",
  onClearFilters
}: EmptyStateProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-12 flex flex-col items-center justify-center text-center shadow-sm w-full py-20">
      <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-5 border-4 border-white shadow-sm">
        <SearchX className="w-10 h-10" />
      </div>
      <h3 className="text-xl font-extrabold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm max-w-sm mb-8 leading-relaxed">
        {description}
      </p>
      {onClearFilters && (
        <button 
          onClick={onClearFilters}
          className="px-6 py-2.5 bg-blue-50 text-blue-600 font-bold text-sm rounded-xl hover:bg-blue-100 hover:shadow-sm transition-all active:scale-95"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}