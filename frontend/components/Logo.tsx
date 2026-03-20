"use client";

import React from "react";
import { Lightbulb, Shield } from "lucide-react";

interface LogoProps {
  className?: string;
  showText?: boolean;
  darkTheme?: boolean;
}

export default function Logo({ className = "h-8", showText = true, darkTheme = false }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      
      {/* ICON AREA: Shield + Lightbulb */}
      <div className="relative flex-shrink-0 group cursor-pointer">
        {/* Shield Icon (Background) */}
        <Shield 
          className={`w-9 h-9 transition-all duration-300 group-hover:scale-105 ${
            darkTheme ? "text-slate-700" : "text-slate-200"
          }`} 
          strokeWidth={1.5}
        />
        
        {/* Lightbulb Icon (Foreground - "Protected Idea") */}
        <Lightbulb 
          className={`w-5 h-5 absolute top-2 left-2 transition-transform duration-300 group-hover:rotate-12 ${
            darkTheme ? "text-blue-400" : "text-blue-600"
          }`} 
          strokeWidth={2.5}
        />
        
        {/* Sparkle Effect (Innovation touch) */}
        <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 rounded-full animate-pulse blur-[1px]"></div>
      </div>

      {/* TEXT AREA: "UniIdeas CMS" */}
      {showText && (
        <div className={`flex flex-col justify-center ${darkTheme ? "text-white" : "text-slate-900"}`}>
          <span className="font-extrabold text-xl tracking-tighter leading-none">
            UniIdeas
          </span>
          <span className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${
            darkTheme ? "text-slate-400" : "text-slate-500"
          }`}>
            Enterprise
          </span>
        </div>
      )}
    </div>
  );
}