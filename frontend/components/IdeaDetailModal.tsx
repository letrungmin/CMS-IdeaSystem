"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp, ThumbsDown, Share2, MoreHorizontal, Clock, Eye, AlertCircle } from "lucide-react";
import { IdeaProps } from "./IdeaCard";

export default function IdeaDetailModal({ idea, children }: { idea: IdeaProps, children: React.ReactNode }) {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const displayName = idea.isAnonymous ? "Anonymous Student" : idea.authorName;
  const avatarInitials = idea.isAnonymous ? "🕵️" : idea.authorName.substring(0, 2).toUpperCase();

  const handlePostComment = () => {
    if (!comment.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => { setIsSubmitting(false); setComment(""); }, 1000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      {/* FIXED WIDTH FOR MODAL */}
      <DialogContent className="w-[95vw] sm:max-w-3xl md:max-w-4xl bg-white max-h-[90vh] overflow-y-auto p-0 gap-0">
        <div className="absolute top-3 right-12 flex gap-1 z-10">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 rounded-full"><Share2 className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 rounded-full"><MoreHorizontal className="h-4 w-4" /></Button>
        </div>
        <div className="p-8 sm:p-10">
          <div className="flex items-center gap-3 mb-6">
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100">{idea.categoryName}</Badge>
            <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Under Review</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-[1.2] mb-6">{idea.title}</h1>
          <div className="flex items-center gap-4 border-b border-slate-100 pb-6 mb-8">
            <Avatar className="h-12 w-12 border-2 border-slate-100">
              <AvatarImage src={idea.isAnonymous ? "" : `https://api.dicebear.com/7.x/initials/svg?seed=${idea.authorName}`} />
              <AvatarFallback className="bg-slate-100 text-slate-600 font-bold">{avatarInitials}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-bold text-slate-900 text-lg">{displayName}</div>
              <div className="flex items-center text-sm text-slate-500 mt-0.5"><Clock className="w-4 h-4 mr-1.5" /> {idea.createdAt} <span className="mx-2">•</span> <Eye className="w-4 h-4 mr-1.5" /> {idea.viewCount} views</div>
            </div>
          </div>
          <article className="prose prose-slate prose-lg max-w-none mb-10 text-slate-700 leading-relaxed whitespace-pre-wrap">{idea.content}</article>
          <section>
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">Comments <span className="text-slate-400">({idea.commentCount})</span></h3>
            <div className="flex gap-4 mb-8 bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <Avatar className="h-10 w-10"><AvatarFallback>ME</AvatarFallback></Avatar>
              <div className="flex-1 space-y-3">
                <Textarea placeholder="What are your thoughts?" className="min-h-[80px] bg-white" value={comment} onChange={(e) => setComment(e.target.value)} />
                <div className="flex justify-end"><Button onClick={handlePostComment} disabled={!comment.trim() || isSubmitting} className="bg-slate-900 hover:bg-blue-600 text-white rounded-full">{isSubmitting ? "Posting..." : "Post Comment"}</Button></div>
              </div>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}