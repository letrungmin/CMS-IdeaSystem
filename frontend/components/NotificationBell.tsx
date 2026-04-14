"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bell, Heart, MessageSquare, AlertCircle, Info } from "lucide-react";
import { useRouter } from "next/navigation";

// Define the interface based on your Spring Boot NotificationEntity
interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: string;
  read: boolean; // Spring Boot boolean is usually serialized as 'read'
  createdAt: string;
  idea?: { id: number }; // Nested IdeaEntity object from backend
}

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Configuration (Change this if your backend runs on a different port/URL)
  const API_BASE_URL = "http://localhost:9999/api/v1/mail/in-app";

  // --- 1. UTILITIES ---
  const timeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "LIKE":
        return <Heart className="w-4 h-4 text-rose-500 fill-current" />;
      case "COMMENT":
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case "APPROVE":
        return <AlertCircle className="w-4 h-4 text-emerald-500" />;
      case "REJECT":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Info className="w-4 h-4 text-slate-500" />;
    }
  };

  // --- 2. FETCH DATA (POLLING) ---
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token"); // Adjust if you use cookies/session
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const data = await res.json();
      
      if (data.result) {
        setNotifications(data.result);
        setUnreadCount(data.result.filter((n: NotificationItem) => !n.read).length);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  // Setup click outside and polling
  useEffect(() => {
    // Initial fetch
    fetchNotifications();

    // Poll every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);

    // Click outside handler
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      clearInterval(interval);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // --- 3. INTERACTIONS ---
  const handleNotificationClick = async (notif: NotificationItem) => {
    setIsOpen(false);

    // Mark as read in backend if it's currently unread
    if (!notif.read) {
      try {
        await fetch(`${API_BASE_URL}/${notif.id}/read`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        
        // Optimistically update UI without waiting for next polling cycle
        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (error) {
        console.error("Failed to mark as read:", error);
      }
    }

    // Redirect to the specific idea page
    if (notif.idea && notif.idea.id) {
      router.push(`/ideas/${notif.idea.id}`);
    }
  };

  const handleMarkAllAsRead = () => {
    // Optional: You can create a backend API to mark all as read
    // For now, it just closes the dropdown and clears the badge optimistically
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setIsOpen(false);
  };

  // --- RENDER ---
  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2.5 rounded-full transition-colors focus:outline-none ${
          isOpen ? "bg-blue-50 text-blue-600" : "text-slate-500 hover:bg-slate-100"
        }`}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in slide-in-from-top-4 fade-in duration-200">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
            <h3 className="font-extrabold text-slate-800 text-lg">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllAsRead}
                className="text-xs text-blue-600 font-bold hover:text-blue-700 transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
            {notifications.length > 0 ? (
              <div className="flex flex-col">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 ${
                      !notif.read ? "bg-blue-50/20" : ""
                    }`}
                  >
                    <div className="mt-0.5 shrink-0 bg-white p-1.5 rounded-full shadow-sm border border-slate-100">
                      {getNotificationIcon(notif.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-700 leading-snug">
                        <span className="font-bold text-slate-900 block mb-0.5">
                          {notif.title}
                        </span>
                        {notif.message}
                      </p>
                      <span className="text-xs text-slate-400 font-medium mt-1.5 block">
                        {timeAgo(notif.createdAt)}
                      </span>
                    </div>
                    {!notif.read && (
                      <div className="w-2.5 h-2.5 bg-blue-500 rounded-full mt-2 shrink-0"></div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 text-sm">
                No new notifications
              </div>
            )}
          </div>

          <div className="p-3 border-t border-slate-100 text-center bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors">
            <button 
              onClick={() => router.push('/notifications')}
              className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors"
            >
              View all activities
            </button>
          </div>
        </div>
      )}
    </div>
  );
}