"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bell, Heart, MessageSquare, AlertCircle } from "lucide-react";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const notifications = [
    { id: 1, type: "reaction", user: "QA Coordinator", action: "reacted to your idea", target: "Upgrade the Campus Wi-Fi", time: "10 mins ago", icon: <Heart className="w-4 h-4 text-rose-500 fill-current" />, unread: true },
    { id: 2, type: "comment", user: "Student Voicer", action: "commented on your idea", target: "Upgrade the Campus Wi-Fi", time: "1 hour ago", icon: <MessageSquare className="w-4 h-4 text-blue-500" />, unread: true },
    { id: 3, type: "system", user: "System", action: "Your idea was approved by", target: "Moderation Board", time: "1 day ago", icon: <AlertCircle className="w-4 h-4 text-emerald-500" />, unread: false },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      
      {/* Bell Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2.5 rounded-full transition-colors focus:outline-none ${isOpen ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-100'}`}
      >
        <Bell className="w-5 h-5" />
        <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in slide-in-from-top-4 fade-in duration-200">
          
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
            <h3 className="font-extrabold text-slate-800 text-lg">Notifications</h3>
            <button className="text-xs text-blue-600 font-bold hover:text-blue-700 transition-colors">Mark all as read</button>
          </div>
          
          <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
            {notifications.length > 0 ? (
              <div className="flex flex-col">
                {notifications.map((notif) => (
                  <div key={notif.id} className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 ${notif.unread ? "bg-blue-50/20" : ""}`}>
                    <div className="mt-0.5 shrink-0 bg-white p-1.5 rounded-full shadow-sm border border-slate-100">{notif.icon}</div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-700 leading-snug">
                        <span className="font-bold text-slate-900">{notif.user}</span> {notif.action} <span className="font-semibold text-slate-900">"{notif.target}"</span>
                      </p>
                      <span className="text-xs text-slate-400 font-medium mt-1.5 block">{notif.time}</span>
                    </div>
                    {notif.unread && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full mt-2 shrink-0"></div>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 text-sm">No new notifications</div>
            )}
          </div>
          
          <div className="p-3 border-t border-slate-100 text-center bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors">
            <button className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">View all activities</button>
          </div>
          
        </div>
      )}
    </div>
  );
}