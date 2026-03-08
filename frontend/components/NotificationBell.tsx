"use client";

import React, { useState } from "react";
import { Bell, MessageSquare, ThumbsUp, AlertCircle, CheckCircle2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const MOCK_NOTIFICATIONS = [
  { id: "n1", type: "COMMENT", title: "New Comment", message: "Thanh Thai commented on your idea.", time: "5 mins ago", isRead: false },
  { id: "n2", type: "REACTION", title: "New Upvote", message: "Someone upvoted your idea.", time: "2 hours ago", isRead: false }
];

export default function NotificationBell() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const markAllAsRead = () => setNotifications(notifications.map(n => ({ ...n, isRead: true })));

  const getIconForType = (type: string) => {
    switch (type) {
      case "COMMENT": return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case "REACTION": return <ThumbsUp className="w-4 h-4 text-green-500" />;
      default: return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-100">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          )}
        </Button>
      </PopoverTrigger>
      {/* FIXED: bg-white and z-50 to prevent transparency issues */}
      <PopoverContent className="w-80 p-0 mr-4 mt-2 border-slate-200 shadow-xl rounded-xl bg-white z-50" align="end">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-slate-900">Notifications</h4>
            {unreadCount > 0 && <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-xs px-1.5 rounded-md">{unreadCount} new</Badge>}
          </div>
          {unreadCount > 0 && <button onClick={markAllAsRead} className="text-xs font-medium text-blue-600 hover:underline">Mark all as read</button>}
        </div>
        <ScrollArea className="h-[300px]">
          {notifications.map((notification) => (
            <div key={notification.id} className={`flex items-start gap-3 p-4 border-b border-slate-50 cursor-pointer ${!notification.isRead ? 'bg-blue-50/30' : 'bg-white'}`}>
              <div className="mt-1 bg-white border border-slate-100 shadow-sm p-2 rounded-full flex-shrink-0">{getIconForType(notification.type)}</div>
              <div className="flex-1 space-y-1">
                <p className={`text-sm ${!notification.isRead ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'}`}>{notification.title}</p>
                <p className="text-xs text-slate-500 line-clamp-2">{notification.message}</p>
                <p className="text-[11px] font-medium text-slate-400 pt-1">{notification.time}</p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}