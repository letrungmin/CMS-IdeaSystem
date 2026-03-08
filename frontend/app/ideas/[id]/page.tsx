"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, ThumbsUp, ThumbsDown, Share2, 
  MoreHorizontal, Clock, Eye, Send, AlertCircle
} from "lucide-react";

// --- MOCK DATA DÀNH CHO TRANG CHI TIẾT ---
const MOCK_IDEA_DETAIL = {
  id: "idea-001",
  title: "Upgrade the Greenwich Campus Wi-Fi for CS students",
  content: `The current library Wi-Fi drops frequently when we are downloading large Docker images or pushing code to GitHub. We need a dedicated high-bandwidth network for the IT department to ensure seamless academic operations and project submissions.

  Currently, during peak hours (10 AM - 2 PM), the latency spikes to over 500ms, making it impossible to participate in online coding interviews or sync large databases for our cloud computing modules. 
  
  **Proposed Solution:**
  1. Install Wi-Fi 6 Access Points in the IT labs and Library designated tech areas.
  2. Create a separate SSID specifically for CS/IT students using student ID authentication.
  3. Allocate dedicated bandwidth during final project submission weeks.
  
  This investment will directly improve student productivity and satisfaction scores for the IT Department.`,
  categoryName: "IT Infrastructure",
  authorName: "Trung Min",
  isAnonymous: false,
  viewCount: 342,
  upvotes: 89,
  downvotes: 2,
  createdAt: "Oct 24, 2025 • 10:30 AM",
  status: "Under Review" // Trạng thái của bài viết
};

const MOCK_COMMENTS = [
  {
    id: "c1",
    authorName: "Thanh Thai",
    isAnonymous: false,
    content: "Totally agree! I lost my connection during a crucial AWS deployment yesterday. It's becoming a real blocker for our final year projects.",
    createdAt: "1 hour ago"
  },
  {
    id: "c2",
    authorName: "Anonymous Staff",
    isAnonymous: true,
    content: "The IT department is aware of this issue. We are currently evaluating vendors for a network upgrade next semester. Keep the feedback coming!",
    createdAt: "30 mins ago"
  }
];

export default function IdeaDetailPage() {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePostComment = () => {
    if (!comment.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setComment("");
      alert("Comment posted successfully!");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      
      {/* TOP NAVIGATION BAR */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/home" className="flex items-center text-slate-500 hover:text-blue-600 transition-colors group font-medium">
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Feed
          </Link>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-900 rounded-full">
              <Share2 className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-900 rounded-full">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* MAIN ARTICLE CONTENT */}
      <main className="max-w-3xl mx-auto px-4 pt-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Category & Status */}
        <div className="flex items-center gap-3 mb-6">
          <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100 px-3 py-1 text-sm">
            {MOCK_IDEA_DETAIL.categoryName}
          </Badge>
          <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 px-3 py-1 text-sm flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {MOCK_IDEA_DETAIL.status}
          </Badge>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-8">
          {MOCK_IDEA_DETAIL.title}
        </h1>

        {/* Author Info Row */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-8 mb-8">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 border-2 border-slate-100">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${MOCK_IDEA_DETAIL.authorName}`} />
              <AvatarFallback>TM</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-bold text-slate-900 text-lg">
                {MOCK_IDEA_DETAIL.isAnonymous ? "Anonymous" : MOCK_IDEA_DETAIL.authorName}
              </div>
              <div className="flex items-center text-sm text-slate-500 font-medium mt-0.5">
                <Clock className="w-4 h-4 mr-1.5" />
                {MOCK_IDEA_DETAIL.createdAt}
                <span className="mx-2">•</span>
                <Eye className="w-4 h-4 mr-1.5" />
                {MOCK_IDEA_DETAIL.viewCount} views
              </div>
            </div>
          </div>
        </div>

        {/* Body Text */}
        <article className="prose prose-slate prose-lg max-w-none mb-12 text-slate-700 leading-relaxed whitespace-pre-wrap">
          {MOCK_IDEA_DETAIL.content}
        </article>

        {/* Action Bar (Reactions) */}
        <div className="flex items-center gap-4 border-y border-slate-100 py-6 mb-12">
          <div className="flex items-center bg-slate-50 rounded-full p-1 border border-slate-200">
            <Button variant="ghost" className="rounded-full hover:bg-green-100 hover:text-green-700 text-slate-600 px-6 h-12">
              <ThumbsUp className="w-5 h-5 mr-2" />
              <span className="font-bold text-base">{MOCK_IDEA_DETAIL.upvotes}</span>
            </Button>
            <div className="w-[2px] h-6 bg-slate-200 mx-1"></div>
            <Button variant="ghost" className="rounded-full hover:bg-red-100 hover:text-red-700 text-slate-600 px-6 h-12">
              <ThumbsDown className="w-5 h-5 mr-2" />
              <span className="font-bold text-base">{MOCK_IDEA_DETAIL.downvotes}</span>
            </Button>
          </div>
        </div>

        {/* COMMENTS SECTION */}
        <section>
          <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
            Comments 
            <span className="text-slate-400 font-medium text-lg">({MOCK_COMMENTS.length})</span>
          </h3>

          {/* Add Comment Form */}
          <div className="flex gap-4 mb-10 bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <Avatar className="h-10 w-10 border border-slate-200 flex-shrink-0">
              <AvatarImage src="https://api.dicebear.com/7.x/initials/svg?seed=Me" />
              <AvatarFallback>ME</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <Textarea 
                placeholder="What are your thoughts on this idea?" 
                className="min-h-[100px] resize-y bg-white text-base focus-visible:ring-blue-500"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <div className="flex justify-end">
                <Button 
                  onClick={handlePostComment} 
                  disabled={!comment.trim() || isSubmitting}
                  className="bg-slate-900 hover:bg-blue-600 text-white rounded-full px-6 transition-colors"
                >
                  {isSubmitting ? "Posting..." : (
                    <>
                      Post Comment
                      <Send className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-8">
            {MOCK_COMMENTS.map((c) => (
              <div key={c.id} className="flex gap-4 group">
                <Avatar className="h-10 w-10 border border-slate-100 flex-shrink-0 mt-1">
                  <AvatarImage src={c.isAnonymous ? "" : `https://api.dicebear.com/7.x/initials/svg?seed=${c.authorName}`} />
                  <AvatarFallback>{c.isAnonymous ? "🕵️" : c.authorName.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-slate-50/50 border border-slate-100 rounded-2xl rounded-tl-none p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-slate-900">
                        {c.isAnonymous ? "Anonymous User" : c.authorName}
                      </span>
                      <span className="text-xs font-medium text-slate-400 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {c.createdAt}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed text-[15px]">
                      {c.content}
                    </p>
                  </div>
                  {/* Nút Reply giả định */}
                  <div className="flex gap-4 mt-2 ml-2">
                    <button className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">Reply</button>
                    <button className="text-xs font-semibold text-slate-500 hover:text-red-600 transition-colors">Report</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </section>
      </main>
    </div>
  );
}