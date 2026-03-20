"use client";

import React, { useState } from "react";
import { X, Clock, MessageSquare, Eye, Send, Share2, AlertTriangle, ThumbsUp, Heart, Sparkles } from "lucide-react";
import { IdeaCardProps, REACTION_TYPES } from "./IdeaCard";

interface IdeaDetailModalProps {
  idea: IdeaCardProps | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function IdeaDetailModal({ idea, isOpen, onClose }: IdeaDetailModalProps) {
  const [commentText, setCommentText] = useState("");

  if (!isOpen || !idea) return null;

  if (typeof window !== "undefined") document.body.style.overflow = "hidden";
  const handleClose = () => {
    document.body.style.overflow = "unset";
    onClose();
  };

  const totalReactions = Object.values(idea.reactions).reduce((a, b) => a + b, 0);
  const activeReaction = REACTION_TYPES.find(r => r.id === idea.currentUserReaction);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={handleClose}></div>

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col md:flex-row overflow-hidden animate-in zoom-in-95 duration-200">
        
        <button onClick={handleClose} className="absolute top-4 right-4 z-10 p-2 bg-slate-100/80 hover:bg-slate-200 rounded-full text-slate-500 transition-colors backdrop-blur-sm">
          <X className="w-5 h-5" />
        </button>

        {/* LEFT COLUMN: Main Idea */}
        <div className="w-full md:w-[60%] h-full flex flex-col border-r border-slate-200 bg-white">
          <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar relative">
            <div className="flex items-center justify-between mb-6">
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full border uppercase tracking-wider ${idea.isAnonymous ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-blue-50 text-blue-600 border-blue-100"}`}>
                {idea.category}
              </span>
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                <Eye className="w-4 h-4" /> {idea.viewsCount + 1} views
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-6 leading-tight">{idea.title}</h1>

            <div className="flex items-center gap-4 mb-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
              {idea.isAnonymous ? (
                <div className="w-12 h-12 bg-slate-200 text-2xl flex items-center justify-center rounded-full shadow-sm">
                  <span className="text-2xl">🕵️</span>
                </div>
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-sm">{idea.authorInitials}</div>
              )}
              <div>
                <h3 className="font-bold text-slate-800">{idea.authorName}</h3>
                <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5"><Clock className="w-3.5 h-3.5" /> Posted {idea.timeAgo}</p>
              </div>
            </div>

            <div className="prose prose-slate max-w-none mb-8">
              <p className="text-slate-700 leading-relaxed text-[15px]">{idea.description}</p>
            </div>
            
            {/* Top Reactions Summary with Colored Icons */}
            <div className="flex items-center justify-between py-3 border-b border-slate-100 text-sm text-slate-500 font-medium">
               <div className="flex items-center gap-2">
                  <div className="flex -space-x-1 mr-1">
                    <div className="w-5 h-5 bg-blue-50 rounded-full p-0.5 border border-white z-30"><ThumbsUp className="w-full h-full text-blue-500"/></div>
                    <div className="w-5 h-5 bg-rose-50 rounded-full p-0.5 border border-white z-20"><Heart className="w-full h-full text-rose-500 fill-current"/></div>
                    <div className="w-5 h-5 bg-amber-50 rounded-full p-0.5 border border-white z-10"><Sparkles className="w-full h-full text-amber-500"/></div>
                  </div> 
                  <span>{totalReactions} Reactions</span>
               </div>
               <div>{idea.commentsCount} Comments</div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="p-4 md:p-6 bg-white flex items-center justify-between shrink-0 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)] z-20">
            <div className="flex gap-2 relative group/reaction">
              <button className={`flex items-center gap-2 px-6 py-2.5 rounded-xl border transition-all font-bold text-sm shadow-sm
                ${activeReaction ? `border-transparent ${activeReaction.bgColor} ${activeReaction.color}` : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'}
              `}>
                {activeReaction ? <div className="w-5 h-5">{activeReaction.icon}</div> : <ThumbsUp className="w-5 h-5" />} 
                <span>{activeReaction ? activeReaction.label : 'React'}</span>
              </button>

              {/* THE FIX: Invisible Bridge (pb-3) */}
              <div className="absolute bottom-full left-0 pb-3 hidden group-hover/reaction:block z-50">
                <div className="bg-white shadow-xl border border-slate-100 rounded-full px-3 py-2 flex gap-2 animate-in slide-in-from-bottom-2 fade-in">
                  {REACTION_TYPES.map((reaction) => (
                    <button key={reaction.id} className="w-10 h-10 p-1.5 hover:scale-125 hover:-translate-y-2 transition-all duration-200 origin-bottom flex items-center justify-center">
                      {reaction.icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-500 transition-all shadow-sm"><Share2 className="w-5 h-5" /></button>
              <button className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-red-50 hover:text-red-500 text-slate-500 transition-all shadow-sm"><AlertTriangle className="w-5 h-5" /></button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Comments Section */}
        <div className="w-full md:w-[40%] h-full flex flex-col bg-slate-50">
          <div className="p-5 border-b border-slate-200 bg-white shrink-0 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-800 text-lg">Comments</h3>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
            
            {/* Comment Item 1 */}
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold shrink-0">QA</div>
              <div className="flex-1">
                <div className="bg-white p-3.5 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm relative">
                  <span className="font-semibold text-sm text-slate-800 block mb-1">QA Coordinator</span>
                  <p className="text-sm text-slate-600">This is a great initiative. I will forward this to the Facilities Management team.</p>
                  
                  {/* Mini Reaction Counter */}
                  <div className="absolute -bottom-2 -right-2 bg-white border border-slate-100 shadow-sm rounded-full px-1.5 py-0.5 flex items-center gap-0.5">
                    <Heart className="w-3 h-3 text-rose-500 fill-current" />
                    <ThumbsUp className="w-3 h-3 text-blue-500" />
                    <span className="text-slate-500 text-[10px] font-bold ml-0.5">4</span>
                  </div>
                </div>
                {/* Comment Actions */}
                <div className="flex items-center gap-3 px-2 mt-1.5 text-xs font-bold text-slate-500 relative group/cmt-reaction w-max">
                  <button className="hover:text-blue-600 py-1">Like</button>
                  <button className="hover:text-blue-600 py-1">Reply</button>
                  <span className="font-medium text-[10px] text-slate-400 py-1">1 hour ago</span>

                  {/* THE FIX: Comment Hover Popover Bridge (pb-1) */}
                  <div className="absolute bottom-full left-0 pb-1 hidden group-hover/cmt-reaction:block z-10">
                    <div className="bg-white shadow-lg border border-slate-100 rounded-full px-1.5 py-1 flex gap-1 animate-in zoom-in-95 duration-100">
                      {REACTION_TYPES.map(r => <button key={r.id} className="w-5 h-5 p-0.5 hover:scale-125 transition-transform">{r.icon}</button>)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Comment Item 2 */}
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold shrink-0">SV</div>
              <div className="flex-1">
                <div className="bg-white p-3.5 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm">
                  <span className="font-semibold text-sm text-slate-800 block mb-1">Student Voicer</span>
                  <p className="text-sm text-slate-600">Totally agree! I always lose connection in Room 302.</p>
                </div>
                <div className="flex items-center gap-3 px-2 mt-1.5 text-xs font-bold text-slate-500 relative group/cmt-reaction w-max">
                  <button className="text-blue-600 py-1">Like</button>
                  <button className="hover:text-blue-600 py-1">Reply</button>
                  <span className="font-medium text-[10px] text-slate-400 py-1">30 mins ago</span>
                  
                  {/* THE FIX: Comment Hover Popover Bridge (pb-1) */}
                  <div className="absolute bottom-full left-0 pb-1 hidden group-hover/cmt-reaction:block z-10">
                    <div className="bg-white shadow-lg border border-slate-100 rounded-full px-1.5 py-1 flex gap-1 animate-in zoom-in-95 duration-100">
                      {REACTION_TYPES.map(r => <button key={r.id} className="w-5 h-5 p-0.5 hover:scale-125 transition-transform">{r.icon}</button>)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="p-4 bg-white border-t border-slate-200 shrink-0">
            <div className="flex items-start gap-2 bg-slate-50 border border-slate-200 p-2 rounded-xl focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <textarea rows={2} placeholder="Write a comment..." value={commentText} onChange={(e) => setCommentText(e.target.value)} className="flex-1 bg-transparent text-sm p-2 outline-none resize-none"></textarea>
              <button disabled={!commentText.trim()} className="p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors shrink-0 mt-auto"><Send className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}