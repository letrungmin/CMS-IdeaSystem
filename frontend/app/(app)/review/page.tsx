"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";

interface Attachment {
  fileName: string;
  url: string;
  type: string;
}

interface Idea {
  id: number;
  title: string;
  content: string;
  anonymous: boolean;
  authorName: string;
  departmentName: string;
  categories: string[];
  createdAt: string;
  status: string;
  attachments?: Attachment[];
}

const formatTime = (dateString: string) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString('en-GB', { 
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
  });
};

export default function IdeaReviewPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [idea, setIdea] = useState<Idea | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [processingAction, setProcessingAction] = useState<"approve" | "reject" | null>(null);
  const [rejectFeedback, setRejectFeedback] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [userRole, setUserRole] = useState("ROLE_STAFF");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const initFetch = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        window.location.href = `/?redirect=/ideas/${id}`;
        return;
      }
      
      setUserRole(localStorage.getItem("user_role") || "ROLE_STAFF");

      try {
        const response = await fetch(`http://localhost:9999/api/v1/idea/${id}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Idea not found or access denied.");
        
        const data = await response.json();
        setIdea(data.result || data);
      } catch (err: any) {
        setErrorMsg(err.message);
      } finally {
        setIsFetching(false);
      }
    };
    
    if (id) initFetch();
  }, [id]);

  const handleAction = async (type: "approve" | "reject") => {
    setProcessingAction(type);
    setErrorMsg(null);
    try {
      const token = localStorage.getItem("accessToken");
      const endpoint = type === "approve" ? `approve/${id}` : `reject/${id}`;
      const body = type === "reject" ? JSON.stringify({ feedback: rejectFeedback }) : null;

      const res = await fetch(`http://localhost:9999/api/v1/ideas/review/${endpoint}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body
      });

      if (!res.ok) throw new Error("Failed to process the review action.");
      
      setIdea(prev => prev ? { ...prev, status: type === "approve" ? "APPROVED" : "REJECTED" } : null);
      setShowRejectInput(false);
    } catch (e: any) {
      setErrorMsg(e.message);
    } finally {
      setProcessingAction(null);
    }
  };

  if (isFetching) {
    return <div className="min-h-screen flex items-center justify-center font-black uppercase text-blue-500 tracking-widest bg-slate-950">Securely Loading Payload...</div>;
  }

  if (errorMsg && !idea) {
    return <div className="min-h-screen flex items-center justify-center font-black uppercase text-red-500 tracking-widest bg-slate-950">{errorMsg}</div>;
  }

  if (!idea) return null;

  const isPending = idea.status === "PENDING";
  const canReview = userRole === "ROLE_QA_MANAGER" && isPending;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-8">
      
      <div className="w-full max-w-3xl flex justify-between items-center mb-6 px-2">
        <button onClick={() => window.location.href = "/home"} className="text-xs font-black text-slate-400 hover:text-white transition-colors uppercase tracking-widest">
          Return to Dashboard
        </button>
        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${isPending ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : idea.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
          STATUS: {idea.status}
        </span>
      </div>

      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-800">
        
        <div className="p-10 border-b border-slate-800">
          <div className="flex gap-3 text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4">
            <span>ID: {idea.id}</span>
            <span>•</span>
            <span>{idea.categories?.[0] || "General"}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-4">{idea.title}</h1>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-bold text-slate-400 uppercase tracking-tight">
            <span>BY: {idea.anonymous ? "Anonymous" : idea.authorName}</span>
            <span>DEPT: {idea.departmentName}</span>
            <span>SUBMITTED: {formatTime(idea.createdAt)}</span>
          </div>
        </div>

        <div className="p-10 space-y-8 bg-slate-900/50">
          <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap font-medium">
            {idea.content}
          </div>

          {idea.attachments && idea.attachments.length > 0 && (
            <div className="pt-6 border-t border-slate-800">
              <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-4">Attached Documents</p>
              <div className="flex flex-wrap gap-3">
                {idea.attachments.map((file, idx) => (
                  <a key={idx} href={`http://localhost:9999${file.url}`} target="_blank" rel="noreferrer" className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-slate-300 hover:border-blue-500 hover:text-white transition-all">
                    {file.fileName}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {errorMsg && idea && (
          <div className="px-10 py-4 bg-red-950/30 border-y border-red-900/50 text-center">
            <span className="text-xs font-black text-red-400 uppercase tracking-widest">{errorMsg}</span>
          </div>
        )}

        {canReview && (
          <div className="p-10 bg-slate-900 border-t border-slate-800">
            {!showRejectInput ? (
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => handleAction("approve")} disabled={!!processingAction} className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl text-xs uppercase tracking-widest transition-all disabled:opacity-50">
                  {processingAction === "approve" ? "Processing..." : "Approve Initiative"}
                </button>
                <button onClick={() => setShowRejectInput(true)} disabled={!!processingAction} className="flex-1 py-4 bg-slate-800 hover:bg-red-900/50 text-white hover:text-red-400 font-black rounded-2xl text-xs uppercase tracking-widest transition-all border border-slate-700 hover:border-red-500/50 disabled:opacity-50">
                  Reject
                </button>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                <label className="block text-[10px] font-black text-red-400 uppercase tracking-widest">Reason for Rejection *</label>
                <textarea required value={rejectFeedback} onChange={(e) => setRejectFeedback(e.target.value)} placeholder="Provide specific feedback for the author..." className="w-full p-5 bg-slate-950 border border-slate-800 rounded-2xl outline-none focus:border-red-500/50 text-sm h-32 resize-none text-slate-300" />
                <div className="flex gap-4">
                  <button onClick={() => setShowRejectInput(false)} disabled={processingAction === "reject"} className="px-8 py-4 font-black text-slate-500 uppercase tracking-widest text-xs hover:text-white transition-colors">
                    Cancel
                  </button>
                  <button onClick={() => handleAction("reject")} disabled={!rejectFeedback || processingAction === "reject"} className="flex-1 py-4 bg-red-600 hover:bg-red-500 text-white font-black rounded-2xl text-xs uppercase tracking-widest transition-all disabled:opacity-50">
                    {processingAction === "reject" ? "Processing..." : "Confirm Rejection"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        
      </div>
    </div>
  );
}