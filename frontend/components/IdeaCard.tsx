"use client";

import React from "react";
import { Clock, MessageSquare, Eye, Share2, ThumbsUp, ThumbsDown, Heart, Smile, Sparkles, Frown, Flame } from "lucide-react";

export const REACTION_TYPES = [
  { id: 'like', icon: <ThumbsUp className="w-full h-full text-blue-500" />, label: 'Like', color: 'text-blue-600', bgColor: 'bg-blue-50' },
  { id: 'love', icon: <Heart className="w-full h-full text-rose-500 fill-current" />, label: 'Love', color: 'text-rose-600', bgColor: 'bg-rose-50' },
  { id: 'haha', icon: <Smile className="w-full h-full text-yellow-500" />, label: 'Haha', color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
  { id: 'wow', icon: <Sparkles className="w-full h-full text-amber-500" />, label: 'Wow', color: 'text-amber-600', bgColor: 'bg-amber-50' },
  { id: 'sad', icon: <Frown className="w-full h-full text-sky-500" />, label: 'Sad', color: 'text-sky-600', bgColor: 'bg-sky-50' },
  { id: 'angry', icon: <Flame className="w-full h-full text-red-500 fill-current" />, label: 'Angry', color: 'text-red-600', bgColor: 'bg-red-50' },
  { id: 'dislike', icon: <ThumbsDown className="w-full h-full text-slate-500" />, label: 'Dislike', color: 'text-slate-600', bgColor: 'bg-slate-100' },
];

export interface IdeaCardProps {
  id: string;
  authorName: string;
  authorInitials: string;
  timeAgo: string;
  category: string;
  title: string;
  description: string;
  reactions: Record<string, number>; 
  currentUserReaction?: string | null; 
  commentsCount: number;
  viewsCount: number;
  isAnonymous: boolean;
  statusBadge?: React.ReactNode; // <--- ADDED THIS PROP
}

export default function IdeaCard({
  authorName, authorInitials, timeAgo, category, title, description, 
  reactions, currentUserReaction, commentsCount, viewsCount, isAnonymous, statusBadge
}: IdeaCardProps) {

  const totalReactions = Object.values(reactions).reduce((a, b) => a + b, 0);
  const topReactions = Object.entries(reactions)
    .filter(([_, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([id]) => REACTION_TYPES.find(r => r.id === id)?.icon);

  const activeReaction = REACTION_TYPES.find(r => r.id === currentUserReaction);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow group relative z-0">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          {isAnonymous ? (
            <div className="w-10 h-10 bg-slate-100 border border-slate-200 text-xl flex items-center justify-center rounded-full shadow-sm">
              <span className="text-2xl">🕵️</span>
            </div>
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center font-bold shadow-sm">{authorInitials}</div>
          )}
          <div>
            <h3 className="font-semibold text-slate-900 text-sm">{authorName}</h3>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3" /> {timeAgo}
            </p>
          </div>
        </div>
        
        {/* CATEGORY & STATUS BADGES */}
        <div className="flex items-center gap-2">
          {statusBadge}
          <span className={`text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${isAnonymous ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-blue-50 text-blue-600 border-blue-100"}`}>
            {category}
          </span>
        </div>
      </div>
      
      {/* Content */}
      <h2 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors cursor-pointer">{title}</h2>
      <p className="text-slate-600 mb-4 text-sm line-clamp-2 leading-relaxed">{description}</p>

      {/* Reaction Summaries */}
      {totalReactions > 0 && (
        <div className="flex items-center gap-2 mb-3 text-slate-500 text-xs font-medium px-1">
          <div className="flex -space-x-1.5">
            {topReactions.map((icon, idx) => (
              <span key={idx} className="w-5 h-5 bg-slate-50 border border-white rounded-full p-0.5 flex items-center justify-center shadow-sm z-10">
                {icon}
              </span>
            ))}
          </div>
          <span className="hover:underline cursor-pointer">{totalReactions}</span>
        </div>
      )}

      {/* Footer Actions */}
      <div className="flex items-center justify-between text-slate-500 border-t border-slate-100 pt-3 relative">
        <div className="flex gap-1 sm:gap-2 w-full">
          
          <div className="relative group/reaction">
            <button 
              className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg transition-colors text-sm font-semibold w-full sm:w-auto ${activeReaction ? activeReaction.color : 'text-slate-600 hover:bg-slate-100'}`}
              onClick={(e) => e.stopPropagation()}
            >
              {activeReaction ? (
                <div className="w-4 h-4">{activeReaction.icon}</div>
              ) : (
                <ThumbsUp className="w-4 h-4" />
              )}
              <span>{activeReaction ? activeReaction.label : 'React'}</span>
            </button>

            <div className="absolute bottom-full left-0 pb-2 hidden group-hover/reaction:block z-50">
              <div className="bg-white shadow-xl border border-slate-100 rounded-full px-2 py-1.5 flex gap-1.5 animate-in slide-in-from-bottom-2 fade-in duration-200">
                {REACTION_TYPES.map((reaction) => (
                  <button 
                    key={reaction.id}
                    onClick={(e) => e.stopPropagation()}
                    className="w-10 h-10 p-1.5 hover:scale-125 hover:-translate-y-2 transition-all duration-200 origin-bottom flex items-center justify-center relative group/tooltip"
                  >
                    {reaction.icon}
                    <span className="absolute -top-8 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded-full opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-opacity">
                      {reaction.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            
          </div>

          <button className="flex items-center justify-center gap-1.5 px-4 py-2 hover:bg-slate-100 rounded-lg transition-colors text-sm font-semibold text-slate-600 flex-1 sm:flex-none">
            <MessageSquare className="w-4 h-4" /> {commentsCount} <span className="hidden sm:inline">Comments</span>
          </button>
          
          <button className="flex items-center justify-center gap-1.5 px-4 py-2 hover:bg-slate-100 rounded-lg transition-colors text-sm font-semibold text-slate-600 hidden sm:flex">
            <Share2 className="w-4 h-4" /> Share
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-medium shrink-0 px-2">
          <Eye className="w-4 h-4" /> {viewsCount}
        </div>
      </div>
      
    </div>
  );
}