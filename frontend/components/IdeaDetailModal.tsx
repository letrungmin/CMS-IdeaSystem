"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom"; 
import { 
  X, Clock, MessageSquare, Eye, Send, Share2, AlertTriangle, 
  ThumbsUp, ShieldAlert, FileText, Download, 
  Image as ImageIcon, Video, Shield, Loader2, MessageCircle, User 
} from "lucide-react";
import { IdeaType } from "./IdeaCard";
import { useLanguage } from "./LanguageProvider";

// --- INTERFACES ---
export interface CommentResponse {
  id: number;
  content: string;
  authorName: string;
  anonymous: boolean;
  createdAt: string;
  replyCount: number;
  reactions: Record<string, number>;
  totalReactions: number;
  myReaction: string;
  replies: CommentResponse[];
}

export interface IdeaDetailResponse {
  id: number;
  title: string;
  content: string;
  anonymous: boolean;
  authorId: number;
  authorName: string;
  authorAvatar: string;
  departmentName: string;
  academicYearName: string;
  viewCount: number;
  createdAt: string;
  categories: string[];
  reactions: Record<string, number>;
  totalReactions: number;
  myReaction: string | null;
  commentCount: number;
  images: string[];
  attachments: any[];
}

interface IdeaDetailModalProps {
  idea: IdeaType | null;
  isOpen: boolean;
  onClose: () => void;
}

// External URLs for reactions
const REACTION_EMOJIS = {
  LIKE: { icon: "https://raw.githubusercontent.com/corvasto/facebook-reactions-css/master/assets/like.svg", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/30" },
  LOVE: { icon: "https://raw.githubusercontent.com/corvasto/facebook-reactions-css/master/assets/love.svg", color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-900/30" },
  HAHA: { icon: "https://raw.githubusercontent.com/corvasto/facebook-reactions-css/master/assets/haha.svg", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/30" },
  WOW: { icon: "https://raw.githubusercontent.com/corvasto/facebook-reactions-css/master/assets/wow.svg", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/30" },
  SAD: { icon: "https://raw.githubusercontent.com/corvasto/facebook-reactions-css/master/assets/sad.svg", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/30" },
  ANGRY: { icon: "https://raw.githubusercontent.com/corvasto/facebook-reactions-css/master/assets/angry.svg", color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/30" },
};

const getToken = () => {
  try {
    const directToken = localStorage.getItem("accessToken");
    if (directToken) return directToken;
    const userStorage = localStorage.getItem("user");
    if (userStorage) {
      const userObj = JSON.parse(userStorage);
      return userObj.accessToken || "";
    }
  } catch (e) {
    console.error("Token error:", e);
  }
  return "";
};

const getFullFileUrl = (source?: string) => {
  if (!source) return ""; 
  if (source.startsWith("http")) return source;
  
  let safeRelativeUrl = source.startsWith('/') ? source : `/${source}`;
  if (safeRelativeUrl.startsWith('/files/')) {
    safeRelativeUrl = `/api/v1${safeRelativeUrl}`;
  }
  
  return `http://localhost:9999${safeRelativeUrl}`;
};

// ========================================================
// COMMENT ITEM COMPONENT
// ========================================================
const CommentItem = ({ 
  comment, 
  depth = 0, 
  onReplyClick 
}: { 
  comment: CommentResponse, 
  depth?: number,
  onReplyClick: (c: CommentResponse) => void 
}) => {
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState<CommentResponse[]>(comment.replies || []);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);
  
  const [currentReaction, setCurrentReaction] = useState<string | null>(
    comment.myReaction === "NONE" ? null : comment.myReaction
  );
  const [reactionMap, setReactionMap] = useState<Record<string, number>>(comment.reactions || {});
  const totalReactions = Object.values(reactionMap).reduce((a, b) => a + b, 0);

  const formattedDate = comment.createdAt ? new Date(comment.createdAt).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : "Just now";

  const fetchReplies = async () => {
    if (replies.length > 0) {
      setShowReplies(!showReplies);
      return;
    }
    setIsLoadingReplies(true);
    try {
      const token = getToken();
      const response = await fetch(`http://localhost:9999/api/v1/comments/${comment.id}/replies`, {
        headers: { ...(token ? { "Authorization": `Bearer ${token}` } : {}) }
      });
      if (response.ok) {
        const data = await response.json();
        setReplies(data.result || []);
        setShowReplies(true);
      }
    } catch (error) {
      console.error("Error fetching replies:", error);
    } finally {
      setIsLoadingReplies(false);
    }
  };

  const handleCommentReact = async (e: React.MouseEvent, type: string) => {
    e.stopPropagation();
    if (currentReaction === type) return;

    setReactionMap(prev => {
      const newCounts = { ...prev };
      if (currentReaction && currentReaction !== type) {
         newCounts[currentReaction] = Math.max(0, (newCounts[currentReaction] || 0) - 1);
      }
      newCounts[type] = (newCounts[type] || 0) + 1;
      return newCounts;
    });
    setCurrentReaction(type);

    try {
      const token = getToken();
      await fetch(`http://localhost:9999/api/v1/reactions/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          commentId: comment.id,
          type: type 
        })
      });
    } catch (error) {
      console.error("Error reacting to comment:", error);
    }
  };

  const topReactions = Object.entries(reactionMap)
    .filter(([_, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([type]) => REACTION_EMOJIS[type as keyof typeof REACTION_EMOJIS]?.icon)
    .filter(Boolean);

  return (
    <div className={`flex gap-3 ${depth > 0 ? "mt-4 relative before:absolute before:-left-5 before:top-0 before:w-px before:h-full before:bg-slate-200 dark:before:bg-slate-800" : "mt-6"}`}>
      
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-sm ${comment.anonymous ? "bg-slate-800 dark:bg-slate-700 text-slate-300" : "bg-gradient-to-br from-blue-500 to-indigo-600 text-white"}`}>
        {comment.anonymous ? <ShieldAlert className="w-4 h-4" /> : comment.authorName.substring(0, 2).toUpperCase()}
      </div>

      <div className="flex-1">
        <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-2xl rounded-tl-none border border-slate-200 dark:border-slate-700 shadow-sm relative group">
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-[13px] text-slate-800 dark:text-white">
              {comment.authorName}
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">{formattedDate}</span>
          </div>
          <p className="text-[14px] text-slate-700 dark:text-slate-300 leading-relaxed">{comment.content}</p>
          
          {totalReactions > 0 && (
             <div className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-1.5 py-0.5 flex items-center shadow-md">
               <div className="flex -space-x-1.5 mr-1">
                 {topReactions.map((iconUrl, idx) => (
                    <img key={idx} src={iconUrl} alt="react" className="w-4 h-4 object-contain rounded-full ring-1 ring-white dark:ring-slate-800 z-10" />
                 ))}
               </div>
               <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">{totalReactions}</span>
             </div>
          )}
        </div>

        <div className="flex items-center gap-4 mt-2 ml-2">
          <div className="relative group/creaction flex items-center">
            <div className="absolute bottom-full left-0 mb-1 hidden group-hover/creaction:flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg rounded-full px-2 py-1.5 animate-in fade-in slide-in-from-bottom-2 z-50 after:content-[''] after:absolute after:-bottom-4 after:left-0 after:w-full after:h-5">
              {(Object.keys(REACTION_EMOJIS) as Array<keyof typeof REACTION_EMOJIS>).map((type) => (
                <button key={type} onClick={(e) => handleCommentReact(e, type)} className="hover:scale-125 hover:-translate-y-1 transition-all duration-200 origin-bottom rounded-full p-0.5" title={type}>
                  <img src={REACTION_EMOJIS[type].icon} alt={type} className="w-6 h-6 object-contain drop-shadow-md" />
                </button>
              ))}
            </div>
            <button 
              onClick={(e) => handleCommentReact(e, currentReaction || "LIKE")}
              className={`text-[12px] font-bold transition-colors ${currentReaction ? REACTION_EMOJIS[currentReaction as keyof typeof REACTION_EMOJIS].color : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}
            >
              {currentReaction ? currentReaction.charAt(0) + currentReaction.slice(1).toLowerCase() : "Like"}
            </button>
          </div>

          <button onClick={() => onReplyClick(comment)} className="text-[12px] font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
            Reply
          </button>
        </div>

        {comment.replyCount > 0 && depth === 0 && (
          <button onClick={fetchReplies} disabled={isLoadingReplies} className="flex items-center gap-2 text-[12px] font-bold text-blue-600 dark:text-blue-400 mt-3 ml-2 hover:underline">
            {isLoadingReplies ? <Loader2 className="w-3 h-3 animate-spin" /> : <MessageCircle className="w-3 h-3" />}
            {showReplies ? "Hide replies" : `View ${comment.replyCount} replies`}
          </button>
        )}

        {showReplies && replies.length > 0 && (
          <div className="ml-5">
            {replies.map(reply => (
              <CommentItem key={reply.id} comment={reply} depth={depth + 1} onReplyClick={onReplyClick} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


// ========================================================
// MAIN MODAL
// ========================================================
export default function IdeaDetailModal({ idea, isOpen, onClose }: IdeaDetailModalProps) {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);

  const [ideaDetail, setIdeaDetail] = useState<IdeaDetailResponse | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(true);

  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  
  const [commentText, setCommentText] = useState("");
  const [isAnonymousComment, setIsAnonymousComment] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<CommentResponse | null>(null);

  useEffect(() => {
    setMounted(true);
    if (isOpen && idea) {
      document.body.style.overflow = "hidden";
      fetchIdeaDetail(); 
      fetchRootComments(); 
    } else {
      document.body.style.overflow = "unset";
      setIdeaDetail(null);
      setComments([]);
      setCommentText("");
      setReplyingTo(null);
      setIsAnonymousComment(false);
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen, idea]);

  const fetchIdeaDetail = async () => {
    if (!idea) return;
    setIsLoadingDetail(true);
    try {
      const token = getToken();
      const response = await fetch(`http://localhost:9999/api/v1/idea/${idea.id}`, {
        headers: { ...(token ? { "Authorization": `Bearer ${token}` } : {}) }
      });
      if (response.ok) {
        const data = await response.json();
        setIdeaDetail(data.result || data);
      }
    } catch (error) {
      console.error("Error fetching idea details:", error);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const fetchRootComments = async () => {
    if (!idea) return;
    setIsLoadingComments(true);
    try {
      const token = getToken();
      const response = await fetch(`http://localhost:9999/api/v1/comments/idea/${idea.id}?page=0&size=50&sort=newest`, {
        headers: { ...(token ? { "Authorization": `Bearer ${token}` } : {}) }
      });
      if (response.ok) {
        const data = await response.json();
        const content = data.result?.content || data.content || [];
        setComments(content);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleSendComment = async () => {
    if (!commentText.trim() || !idea) return;
    setIsSubmitting(true);
    try {
      const token = getToken();
      const payload = {
        ideaId: idea.id,
        content: commentText.trim(),
        anonymous: isAnonymousComment,
        parentId: replyingTo ? replyingTo.id : null 
      };

      const response = await fetch("http://localhost:9999/api/v1/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setCommentText("");
        setReplyingTo(null);
        setIsAnonymousComment(false);
        fetchRootComments();
      } else {
        const errText = await response.text();
        alert("Error posting comment: " + errText);
      }
    } catch (error) {
      console.error("Network error when posting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleIdeaReact = async (e: React.MouseEvent, type: string) => {
    e.stopPropagation(); 
    if (!ideaDetail) return;
    
    const previousReaction = ideaDetail.myReaction === "NONE" ? null : ideaDetail.myReaction;
    const previousCounts = { ...ideaDetail.reactions };

    setIdeaDetail(prev => {
      if (!prev) return prev;
      
      const newCounts = { ...prev.reactions };
      const currentReact = prev.myReaction === "NONE" ? null : prev.myReaction;

      if (currentReact && currentReact !== type) {
        newCounts[currentReact] = Math.max(0, (newCounts[currentReact] || 0) - 1);
      }

      if (currentReact === type) {
        newCounts[type] = Math.max(0, (newCounts[type] || 0) - 1);
        return { ...prev, reactions: newCounts, myReaction: null, totalReactions: prev.totalReactions - 1 };
      } else {
        newCounts[type] = (newCounts[type] || 0) + 1;
        return { ...prev, reactions: newCounts, myReaction: type, totalReactions: currentReact ? prev.totalReactions : prev.totalReactions + 1 };
      }
    });

    try {
      const token = getToken();
      const response = await fetch(`http://localhost:9999/api/v1/reactions/idea`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ ideaId: ideaDetail.id, type: type })
      });

      if (response.ok) {
        const data = await response.json();
        const apiData = data.result || data;
        if (apiData && apiData.counts) {
          setIdeaDetail(prev => prev ? { ...prev, reactions: apiData.counts, myReaction: apiData.myReaction === "NONE" ? null : apiData.myReaction, totalReactions: apiData.total } : prev);
        }
      } else {
        const errorText = await response.text();
        if (errorText.includes("period has ended")) {
           alert("Reaction period for this idea has ended!");
        }
        setIdeaDetail(prev => prev ? { ...prev, reactions: previousCounts, myReaction: previousReaction } : prev);
      }
    } catch (error) {
      setIdeaDetail(prev => prev ? { ...prev, reactions: previousCounts, myReaction: previousReaction } : prev);
    }
  };

  if (!isOpen || !idea || !mounted) return null;

  const handleClose = () => {
    document.body.style.overflow = "unset";
    onClose();
  };

  const displayData = ideaDetail || idea;
  
  let displayDate = "";
  if (displayData.createdAt) {
      const dateObj = new Date(displayData.createdAt);
      displayDate = dateObj.toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' });
  }

  const attachments = (displayData as any).attachments || [];
  const videoAttachments = attachments.filter((doc: any) => doc?.type?.toUpperCase().includes('VIDEO') || doc?.url?.match(/\.(mp4|webm|ogg|mov)$/i));
  const docAttachments = attachments.filter((doc: any) => !videoAttachments.includes(doc));
  const images = (displayData as any).images || [];

  const rawReaction = (displayData as any).myReaction;
  const currentReaction = rawReaction === "NONE" ? null : rawReaction;
  
  const reactionsMap = (displayData as any).reactions || {};
  const totalIdeaReactions = (displayData as any).totalReactions || 0;
  const topReactions = Object.entries(reactionsMap)
    .filter(([_, count]) => (count as number) > 0)
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .slice(0, 3)
    .map(([type]) => REACTION_EMOJIS[type as keyof typeof REACTION_EMOJIS]?.icon)
    .filter(Boolean);

  return createPortal(
    <>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
        
        <div className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={handleClose}></div>

        <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col md:flex-row overflow-hidden animate-in zoom-in-95 duration-200 border border-transparent dark:border-slate-800">
          
          <button onClick={handleClose} className="absolute top-4 right-4 z-10 p-2 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 rounded-full transition-colors backdrop-blur-sm shadow-md">
            <X className="w-5 h-5" />
          </button>

          <div className="w-full md:w-[60%] h-full flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            {isLoadingDetail ? (
              <div className="flex flex-col items-center justify-center h-full text-blue-500">
                  <Loader2 className="w-8 h-8 animate-spin mb-2" />
                  <p className="font-bold">Loading idea details...</p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar relative">
                  
                  <div className="flex items-center justify-between mb-6">
                    <span title={(displayData as any).departmentName || displayData.categoryName} className={`text-xs font-bold px-3 py-1.5 rounded-full border uppercase tracking-wider max-w-[70%] truncate ${displayData.isAnonymous || (displayData as any).anonymous ? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700" : "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/50"}`}>
                      {(displayData as any).departmentName || displayData.categoryName}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 dark:text-slate-500 shrink-0">
                      <Eye className="w-4 h-4" /> {(displayData as any).viewCount || 0} Views
                    </div>
                  </div>

                  <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight">{displayData.title}</h1>

                  <div className="flex items-center gap-4 mb-8 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    {displayData.isAnonymous || (displayData as any).anonymous ? (
                      <div className="w-12 h-12 bg-slate-800 dark:bg-slate-700 text-slate-300 dark:text-slate-400 flex items-center justify-center rounded-full shadow-sm shrink-0"><ShieldAlert className="w-6 h-6" /></div>
                    ) : (
                      <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm shrink-0 bg-slate-200 flex items-center justify-center">
                        {(displayData as any).authorAvatar && !(displayData as any).authorAvatar.includes("default") ? (
                          <img src={getFullFileUrl((displayData as any).authorAvatar)} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-6 h-6 text-slate-400" />
                        )}
                      </div>
                    )}
                    <div className="overflow-hidden">
                      <h3 className="font-bold text-slate-800 dark:text-white truncate">{displayData.isAnonymous || (displayData as any).anonymous ? "Anonymous" : displayData.authorName}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5"><Clock className="w-3.5 h-3.5 shrink-0" /> {displayDate}</p>
                    </div>
                  </div>

                  <div className="prose prose-slate dark:prose-invert max-w-none mb-8">
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[16px] whitespace-pre-wrap">{displayData.content}</p>
                  </div>

                  {(videoAttachments.length > 0 || images.length > 0 || docAttachments.length > 0) && (
                    <div className="mb-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                      {videoAttachments.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2"><Video className="w-4 h-4 text-purple-500" /> Attached Videos</h4>
                          <div className="flex flex-col gap-4">
                            {videoAttachments.map((vid: any, idx: number) => (
                                <div key={`vid-${idx}`} className="relative rounded-xl overflow-hidden bg-black aspect-video border border-slate-200 dark:border-slate-700 group">
                                  <video controls className="w-full h-full object-contain" controlsList="nodownload"><source src={getFullFileUrl(vid?.url || vid)} /></video>
                                </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {images.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2"><ImageIcon className="w-4 h-4 text-slate-500 dark:text-slate-400" /> Attached Images</h4>
                          <div className={`grid gap-3 ${images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                            {images.map((imgStr: string, idx: number) => {
                              const imgUrl = getFullFileUrl(imgStr);
                              return (
                                <div key={`img-${idx}`} className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 aspect-video cursor-zoom-in" onClick={(e) => { e.stopPropagation(); setFullScreenImage(imgUrl); }}>
                                  <img src={imgUrl} alt="Attached Image" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {docAttachments.length > 0 && (
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2"><FileText className="w-4 h-4 text-slate-500 dark:text-slate-400" /> Attached Documents</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {docAttachments.map((doc: any, idx: number) => (
                              <a key={`doc-${idx}`} href={getFullFileUrl(doc.url)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-blue-300 transition-colors group">
                                <div className="flex items-center gap-3 overflow-hidden">
                                  <div className="w-10 h-10 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg flex items-center justify-center shrink-0"><FileText className="w-5 h-5" /></div>
                                  <div className="flex flex-col truncate">
                                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{doc.fileName || "Document File"}</span>
                                  </div>
                                </div>
                                <Download className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-blue-600 shrink-0" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="p-4 md:p-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-20 flex items-center justify-between">
                  <div className="relative group/reaction flex items-center">
                    
                    <div className="absolute bottom-full left-0 mb-3 hidden group-hover/reaction:flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] rounded-full px-3 py-2 animate-in fade-in slide-in-from-bottom-4 z-[100] transition-colors duration-300 after:content-[''] after:absolute after:-bottom-5 after:left-0 after:w-full after:h-8">
                      {(Object.keys(REACTION_EMOJIS) as Array<keyof typeof REACTION_EMOJIS>).map((type) => (
                        <button
                          key={type}
                          onClick={(e) => handleIdeaReact(e, type)}
                          className="hover:scale-125 hover:-translate-y-2.5 transition-all duration-200 origin-bottom rounded-full p-0.5"
                          title={type}
                        >
                          <img src={REACTION_EMOJIS[type as keyof typeof REACTION_EMOJIS].icon} alt={type} className="w-10 h-10 object-contain drop-shadow-md" />
                        </button>
                      ))}
                    </div>

                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleIdeaReact(e, currentReaction || "LIKE");
                      }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all shadow-sm ${
                        currentReaction 
                          ? REACTION_EMOJIS[currentReaction as keyof typeof REACTION_EMOJIS].bg + " " + REACTION_EMOJIS[currentReaction as keyof typeof REACTION_EMOJIS].color 
                          : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm"
                      }`}
                    >
                      <div className="flex items-center">
                        {totalIdeaReactions > 0 ? (
                          topReactions.map((iconUrl, idx) => (
                            <img 
                              key={idx} 
                              src={iconUrl} 
                              alt="react" 
                              className={`w-[22px] h-[22px] object-contain rounded-full ring-2 ring-white dark:ring-slate-900 shadow-sm z-10 ${idx > 0 ? '-ml-1.5' : ''}`} 
                            />
                          ))
                        ) : (
                          <ThumbsUp className="w-4 h-4 opacity-70" />
                        )}
                      </div>
                      <span className={currentReaction ? "" : "opacity-80"}>
                        {totalIdeaReactions > 0 ? totalIdeaReactions : "React"}
                      </span>
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <button className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border hover:bg-slate-100 transition-all text-slate-500"><Share2 className="w-5 h-5" /></button>
                    <button className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border hover:bg-red-50 hover:text-red-500 transition-all text-slate-500"><AlertTriangle className="w-5 h-5" /></button>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="w-full md:w-[40%] h-full flex flex-col bg-slate-50 dark:bg-slate-950 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800">
            
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-bold text-slate-800 dark:text-white text-lg">Discussion ({(displayData as any).commentCount || 0})</h3>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
              {isLoadingComments ? (
                <div className="flex flex-col items-center justify-center h-full text-blue-500">
                  <Loader2 className="w-8 h-8 animate-spin mb-2" />
                  <p className="text-sm font-bold opacity-70">Loading comments...</p>
                </div>
              ) : comments.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full opacity-50 text-center">
                  <MessageCircle className="w-12 h-12 mb-3" />
                  <p className="font-bold">No comments yet.</p>
                  <p className="text-sm">Be the first to share your thoughts!</p>
                </div>
              ) : (
                <div className="space-y-4 pb-4">
                  {comments.map(comment => (
                    <CommentItem 
                      key={comment.id} 
                      comment={comment} 
                      onReplyClick={(c) => setReplyingTo(c)} 
                    />
                  ))}
                </div>
              )}
            </div>
            
            <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0 flex flex-col">
              
              {replyingTo && (
                <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-900/50 flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" /> 
                    Replying to <span className="text-slate-800 dark:text-white bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded shadow-sm">{replyingTo.authorName}</span>
                  </span>
                  <button onClick={() => setReplyingTo(null)} className="p-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full text-blue-600 dark:text-blue-400 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="p-4 flex flex-col gap-3">
                <div className="flex items-start gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-xl focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  <textarea 
                    rows={2} 
                    placeholder={replyingTo ? "Write a reply..." : "Write a comment..."} 
                    value={commentText} 
                    onChange={(e) => setCommentText(e.target.value)} 
                    disabled={isSubmitting}
                    className="flex-1 bg-transparent text-sm p-2 outline-none resize-none text-slate-900 dark:text-white"
                  ></textarea>
                  <button 
                    onClick={handleSendComment}
                    disabled={!commentText.trim() || isSubmitting} 
                    className="p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors shrink-0 mt-auto flex items-center justify-center h-10 w-10"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 ml-0.5" />}
                  </button>
                </div>

                <label className="flex items-center gap-2 cursor-pointer w-fit">
                  <input type="checkbox" checked={isAnonymousComment} onChange={(e) => setIsAnonymousComment(e.target.checked)} className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1 hover:text-slate-700 transition-colors">
                    <Shield className="w-3.5 h-3.5" /> Comment Anonymously
                  </span>
                </label>
              </div>
            </div>

          </div>
          
        </div>
      </div>

      {/* LIGHTBOX FOR FULL SCREEN IMAGES */}
      {fullScreenImage && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={(e) => { e.stopPropagation(); setFullScreenImage(null); }}>
          <button className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors" onClick={(e) => { e.stopPropagation(); setFullScreenImage(null); }}><X className="w-6 h-6" /></button>
          <img src={fullScreenImage} alt="Full Screen View" className="max-w-full max-h-[90vh] object-contain rounded-md shadow-2xl animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </>,
    document.body
  );
}