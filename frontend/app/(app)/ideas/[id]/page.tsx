"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { Loader2, CheckCircle, XCircle, FileText, User, Calendar, ArrowLeft } from "lucide-react";

interface IdeaDetail {
  id: string;
  title: string;
  content: string;
  authorName: string;
  departmentName: string;
  createdAt: string;
}

export default function IdeaReviewPage() {
  const params = useParams();
  const router = useRouter();
  const { logout } = useAuth();
  
  const id = params.id as string;

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  const [idea, setIdea] = useState<IdeaDetail | null>(null);
  const [isLoadingIdea, setIsLoadingIdea] = useState(false);
  
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("accessToken");
      const role = localStorage.getItem("user_role");

      if (!token || role !== "ROLE_QA_MANAGER") {
        logout(); 
      } else {
        setIsAuthorized(true);
      }
      setIsCheckingAuth(false);
    };

    checkAuth();
  }, [logout]);

  const getToken = () => localStorage.getItem("accessToken") || "";

  const handleViewIdea = async () => {
    setIsLoadingIdea(true);
    setError(null);
    try {
      const token = getToken();
      const response = await fetch(`http://localhost:9999/api/v1/idea/${id}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error("Failed to fetch idea details.");

      const data = await response.json();
      const ideaData = data.result || data;

      setIdea({
        id: ideaData.id,
        title: ideaData.title || "Untitled",
        content: ideaData.content || "No content provided.",
        authorName: ideaData.authorName || "Anonymous",
        departmentName: ideaData.departmentName || "General",
        createdAt: ideaData.createdAt ? new Date(ideaData.createdAt).toLocaleDateString() : "Unknown date"
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoadingIdea(false);
    }
  };

  const handleApprove = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const token = getToken();
      const response = await fetch(`http://localhost:9999/api/v1/ideas/review/approve/${id}`, {
        method: "PUT", 
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error("Failed to approve idea.");
      
      router.push("/qa-queue");
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!feedback.trim()) {
      setError("Feedback is required to reject an idea.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const token = getToken();
      const response = await fetch(`http://localhost:9999/api/v1/ideas/review/reject/${id}`, {
        method: "PUT", 
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ feedback })
      });

      if (!response.ok) throw new Error("Failed to reject idea.");
      
      router.push("/qa-queue");
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!isAuthorized) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-10 transition-colors">
      <div className="max-w-4xl mx-auto">
        
        <button 
          onClick={() => router.push("/qa-queue")}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-8 font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Queue
        </button>

        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-800 font-medium">
            {error}
          </div>
        )}

        {!idea ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-full flex items-center justify-center mb-6">
              <FileText className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Review Requested</h2>
            <p className="text-slate-500 mb-8 max-w-md">
              You have been requested to review Idea #{id}. Click the button below to fetch the full details securely.
            </p>
            <button
              onClick={handleViewIdea}
              disabled={isLoadingIdea}
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-70"
            >
              {isLoadingIdea ? <Loader2 className="w-5 h-5 animate-spin" /> : <Eye className="w-5 h-5" />}
              {isLoadingIdea ? "Fetching Data..." : "View Idea Details"}
            </button>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-8 md:p-10 border-b border-slate-200 dark:border-slate-800">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg uppercase tracking-wider">
                  ID: {idea.id}
                </span>
                <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-lg uppercase tracking-wider">
                  {idea.departmentName}
                </span>
              </div>
              
              <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
                {idea.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" /> {idea.authorName}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> {idea.createdAt}
                </div>
              </div>
            </div>

            <div className="p-8 md:p-10 bg-slate-50/50 dark:bg-slate-900/50">
              <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Idea Content</h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {idea.content}
              </p>
            </div>

            <div className="p-8 md:p-10 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              {!showRejectForm ? (
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <button
                    onClick={handleApprove}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto flex-1 px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                    Approve Idea
                  </button>
                  <button
                    onClick={() => setShowRejectForm(true)}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto flex-1 px-6 py-4 bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/30 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    <XCircle className="w-5 h-5" />
                    Reject Idea
                  </button>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                    Reason for Rejection (Required)
                  </label>
                  <textarea
                    value={feedback}
                    onChange={(e) => {
                      setFeedback(e.target.value);
                      setError(null);
                    }}
                    placeholder="Provide detailed feedback on why this idea is being rejected..."
                    className="w-full min-h-[120px] p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-rose-500 dark:focus:border-rose-500 resize-y text-slate-700 dark:text-slate-200"
                  />
                  <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                    <button
                      onClick={handleReject}
                      disabled={isSubmitting || !feedback.trim()}
                      className="w-full sm:w-auto flex-1 px-6 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <XCircle className="w-5 h-5" />}
                      Submit Rejection
                    </button>
                    <button
                      onClick={() => {
                        setShowRejectForm(false);
                        setFeedback("");
                        setError(null);
                      }}
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-xl transition-all flex items-center justify-center disabled:opacity-70"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}