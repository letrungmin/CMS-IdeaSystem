"use client";

import React, { useState } from "react";
import { MessageSquare, Eye, Paperclip, User, Clock, ShieldAlert, PlayCircle, X, ThumbsUp } from "lucide-react";
import { useLanguage } from "./LanguageProvider";

// --- INTERFACES ---
export interface AttachmentType {
  fileName?: string;
  url?: string;
  type?: string;
}

export interface IdeaType {
  id: string | number;
  title: string;
  content: string;
  categoryName: string;
  authorName: string;
  createdAt: string;
  isAnonymous: boolean;
  reactions?: {
    LIKE: number;
    LOVE: number;
    HAHA: number;
    WOW: number;
    SAD: number;
    ANGRY: number;
  };
  userReaction?: "LIKE" | "LOVE" | "HAHA" | "WOW" | "SAD" | "ANGRY" | null;
  commentsCount: number;
  viewsCount: number;
  hasAttachments: boolean;
  attachments?: AttachmentType[];
  images?: any[]; 
}

interface IdeaCardProps {
  idea: IdeaType;
  onClick?: () => void;
}

// ==========================================
// 🔥 FIX LỖI TÀNG HÌNH: CẤP ID MÀU ĐỘC LẬP CHO TỪNG ICON
// ==========================================
const ReactionIcon = ({ type, className = "" }: { type: string, className?: string }) => {
  const uid = React.useId(); // Sinh ID ngẫu nhiên chống trùng lặp màu
  const gid = `grad-${type}-${uid}`.replace(/:/g, ""); // Dọn dẹp ID cho an toàn

  switch (type) {
    case "LIKE":
      return (
        <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="50" fill={`url(#${gid})`}/>
          <path d="M26.25 43.75V81.25H36.25V43.75H26.25ZM78.75 48.75C78.75 46 76.5 43.75 73.75 43.75H57.8875L60.2875 32.225L60.3625 31.425C60.3625 30.3875 59.9375 29.4375 59.25 28.75L56.5 26.25L41.375 41.375C39.5 43.25 38.75 45.875 38.75 48.75V73.75C38.75 77.8875 42.1125 81.25 46.25 81.25H66.25C69.3625 81.25 72.0375 79.4125 73.2 76.625L78.4125 64.45C78.6375 63.85 78.75 63.2 78.75 62.5V48.75Z" fill="white" filter="drop-shadow(0px 2px 2px rgba(0,0,0,0.2))"/>
          <defs>
            <linearGradient id={gid} x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3B82F6"/>
              <stop offset="1" stopColor="#1D4ED8"/>
            </linearGradient>
          </defs>
        </svg>
      );
    case "LOVE":
      return (
        <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="50" fill={`url(#${gid})`}/>
          <path d="M50 86.875L43.875 81.3C22 61.4625 7.5 48.275 7.5 32.5C7.5 19.3125 17.8125 8.75 31.25 8.75C38.8625 8.75 46.1625 12.3 50 17.9125C53.8375 12.3 61.1375 8.75 68.75 8.75C82.1875 8.75 92.5 19.3125 92.5 32.5C92.5 48.275 78 61.4625 56.125 81.3125L50 86.875Z" fill="white" filter="drop-shadow(0px 2px 2px rgba(0,0,0,0.2))"/>
          <defs>
            <linearGradient id={gid} x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F43F5E"/>
              <stop offset="1" stopColor="#BE123C"/>
            </linearGradient>
          </defs>
        </svg>
      );
    case "HAHA":
      return (
        <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="50" fill={`url(#${gid})`}/>
          <path d="M30 40 Q35 30 40 40" fill="none" stroke="#78350F" strokeWidth="6" strokeLinecap="round"/>
          <path d="M60 40 Q65 30 70 40" fill="none" stroke="#78350F" strokeWidth="6" strokeLinecap="round"/>
          <path d="M25 55 Q50 90 75 55 Z" fill="#78350F"/>
          <path d="M35 55 Q50 80 65 55 Z" fill="#EF4444"/>
          <path d="M35 55 Q50 65 65 55 Z" fill="white"/>
          <defs>
            <linearGradient id={gid} x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FDE047"/>
              <stop offset="1" stopColor="#F59E0B"/>
            </linearGradient>
          </defs>
        </svg>
      );
    case "WOW":
      return (
        <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="50" fill={`url(#${gid})`}/>
          <circle cx="35" cy="40" r="6" fill="#78350F"/>
          <circle cx="65" cy="40" r="6" fill="#78350F"/>
          <ellipse cx="50" cy="65" rx="12" ry="18" fill="#78350F"/>
          <defs>
            <linearGradient id={gid} x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FDE047"/>
              <stop offset="1" stopColor="#F59E0B"/>
            </linearGradient>
          </defs>
        </svg>
      );
    case "SAD":
      return (
        <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="50" fill={`url(#${gid})`}/>
          <path d="M30 45 Q35 35 40 45" fill="none" stroke="#78350F" strokeWidth="6" strokeLinecap="round"/>
          <path d="M60 45 Q65 35 70 45" fill="none" stroke="#78350F" strokeWidth="6" strokeLinecap="round"/>
          <path d="M35 70 Q50 55 65 70" fill="none" stroke="#78350F" strokeWidth="6" strokeLinecap="round"/>
          <circle cx="35" cy="50" r="3" fill="#60A5FA"/>
          <defs>
            <linearGradient id={gid} x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FDE047"/>
              <stop offset="1" stopColor="#F59E0B"/>
            </linearGradient>
          </defs>
        </svg>
      );
    case "ANGRY":
      return (
        <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="50" fill={`url(#${gid})`}/>
          <path d="M25 35 L45 45" fill="none" stroke="#450A0A" strokeWidth="6" strokeLinecap="round"/>
          <path d="M75 35 L55 45" fill="none" stroke="#450A0A" strokeWidth="6" strokeLinecap="round"/>
          <circle cx="35" cy="50" r="6" fill="#450A0A"/>
          <circle cx="65" cy="50" r="6" fill="#450A0A"/>
          <path d="M35 75 Q50 65 65 75" fill="none" stroke="#450A0A" strokeWidth="6" strokeLinecap="round"/>
          <defs>
            <linearGradient id={gid} x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FB923C"/>
              <stop offset="0.4" stopColor="#EF4444"/>
              <stop offset="1" stopColor="#991B1B"/>
            </linearGradient>
          </defs>
        </svg>
      );
    default:
      return null;
  }
};

const REACTION_EMOJIS = {
  LIKE: { color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/30" },
  LOVE: { color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-900/30" },
  HAHA: { color: "text-amber-600 dark:text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/30" },
  WOW: { color: "text-amber-600 dark:text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/30" },
  SAD: { color: "text-amber-600 dark:text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/30" },
  ANGRY: { color: "text-red-600 dark:text-red-500", bg: "bg-red-50 dark:bg-red-900/30" },
};

export default function IdeaCard({ idea, onClick }: IdeaCardProps) {
  const { t } = useLanguage();
  
  const [playingVideoIdx, setPlayingVideoIdx] = useState<number | null>(null);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);

  const [currentReaction, setCurrentReaction] = useState(
    idea?.userReaction || null
  );
  
  const [reactionCounts, setReactionCounts] = useState({
    LIKE: idea?.reactions?.LIKE || 0,
    LOVE: idea?.reactions?.LOVE || 0,
    HAHA: idea?.reactions?.HAHA || 0,
    WOW: idea?.reactions?.WOW || 0,
    SAD: idea?.reactions?.SAD || 0,
    ANGRY: idea?.reactions?.ANGRY || 0,
  });

  if (!idea) return null;

  const totalReactions = Object.values(reactionCounts).reduce((a, b) => a + b, 0);

  const getFullFileUrl = (source?: any) => {
    if (!source) return ""; 
    let relativeUrl = "";
    if (typeof source === "string") {
      relativeUrl = source;
    } else if (source && typeof source === "object") {
      if (Array.isArray(source)) {
          if (source.length > 0) relativeUrl = typeof source[0] === 'string' ? source[0] : source[0].url;
      } else {
          relativeUrl = source.url || "";
      }
    }
    if (!relativeUrl) return ""; 
    if (relativeUrl.startsWith("http")) return relativeUrl;
    const safeRelativeUrl = relativeUrl.startsWith('/') ? relativeUrl : `/${relativeUrl}`;
    return `http://localhost:9999${safeRelativeUrl}`;
  };

  const isVideoFile = (doc: any) => {
    const url = typeof doc === "string" ? doc : doc.url;
    const type = doc.type || "";
    return (url && url.match(/\.(mp4|webm|ogg|mov|mkv|avi)$/i)) || type.toUpperCase().includes('VIDEO');
  };

  const videoAttachments = idea.attachments?.filter(doc => isVideoFile(doc)) || [];
  const docAttachments = idea.attachments?.filter(doc => !isVideoFile(doc)) || [];

  const handleReact = async (e: React.MouseEvent, type: keyof typeof REACTION_EMOJIS) => {
    e.stopPropagation(); 
    
    const previousReaction = currentReaction;
    const previousCounts = { ...reactionCounts };

    setReactionCounts((prev) => {
      const newCounts = { ...prev };
      if (currentReaction && currentReaction !== type) {
        newCounts[currentReaction as keyof typeof REACTION_EMOJIS] = Math.max(0, newCounts[currentReaction as keyof typeof REACTION_EMOJIS] - 1);
      }
      if (currentReaction === type) {
        newCounts[type] = Math.max(0, newCounts[type] - 1);
        setCurrentReaction(null);
      } else {
        newCounts[type] += 1;
        setCurrentReaction(type);
      }
      return newCounts;
    });

    try {
      let token = "";
      const userStorage = localStorage.getItem("user");
      if (userStorage) {
        try {
          const userObj = JSON.parse(userStorage);
          token = userObj.accessToken || "";
        } catch (parseError) {
          console.error("❌ Lỗi format rương user");
        }
      }

      const response = await fetch(`http://localhost:9999/api/v1/reactions/idea`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          ideaId: idea.id,
          type: type 
        })
      });

      if (response.ok) {
        const data = await response.json();
        const apiData = data.result || data;

        if (apiData && apiData.counts !== undefined) {
          setReactionCounts({
            LIKE: apiData.counts.LIKE || 0,
            LOVE: apiData.counts.LOVE || 0,
            HAHA: apiData.counts.HAHA || 0,
            WOW: apiData.counts.WOW || 0,
            SAD: apiData.counts.SAD || 0,
            ANGRY: apiData.counts.ANGRY || 0,
          });
          setCurrentReaction(
            apiData.myReaction === "NONE" || !apiData.myReaction ? null : apiData.myReaction
          );
        }
      } else {
        const errorText = await response.text();
        if (errorText.includes("period has ended")) {
          alert("Thời gian thả tim cho ý tưởng này đã kết thúc!");
        }
        setCurrentReaction(previousReaction);
        setReactionCounts(previousCounts);
      }
    } catch (error) {
      setCurrentReaction(previousReaction);
      setReactionCounts(previousCounts);
    }
  };

  const topReactions = Object.entries(reactionCounts)
    .filter(([_, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([type]) => type);

  return (
    <>
      <div 
        onClick={onClick}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group cursor-pointer flex flex-col h-full relative"
      >
        <div className="px-6 pt-6 pb-3 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${idea.isAnonymous ? 'bg-slate-800 dark:bg-slate-700' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
              {idea.isAnonymous ? <ShieldAlert className="w-6 h-6 text-slate-300 dark:text-slate-400" /> : <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
            </div>
            <div>
              <h4 className={`font-bold text-base ${idea.isAnonymous ? 'text-slate-800 dark:text-slate-300' : 'text-slate-900 dark:text-white'}`}>
                {idea.isAnonymous ? t("common.anonymous") : idea.authorName}
              </h4>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {idea.createdAt}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {idea.viewsCount} {t("ideacard.views")}</span>
              </div>
            </div>
          </div>
          <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/50 text-[11px] font-bold rounded-full uppercase tracking-wider text-right max-w-[45%] truncate" title={idea.categoryName}>
            {idea.categoryName}
          </span>
        </div>

        <div className="px-6 py-2 relative flex-1">
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-tight">
            {idea.title}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed mb-4 text-sm">{idea.content}</p>
          
          {videoAttachments.length > 0 && (
            <div className={`grid gap-2 mb-4 ${videoAttachments.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
              {videoAttachments.slice(0, 2).map((vid, idx) => {
                const videoUrl = getFullFileUrl(vid);
                const isPlaying = playingVideoIdx === idx; 
                return (
                  <div key={`vid-${idx}`} className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-black aspect-video group/vid" onClick={(e) => e.stopPropagation()}>
                    {isPlaying ? (
                      <video src={videoUrl} controls autoPlay className="w-full h-full object-contain bg-black" controlsList="nodownload" />
                    ) : (
                      <div className="w-full h-full cursor-pointer" onClick={(e) => { e.stopPropagation(); setPlayingVideoIdx(idx); }}>
                        <video src={`${videoUrl}#t=0.1`} className="w-full h-full object-cover opacity-80 group-hover/vid:opacity-100 transition-opacity duration-500" preload="metadata" muted playsInline />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <PlayCircle className="w-12 h-12 text-white/90 drop-shadow-lg group-hover/vid:scale-110 transition-transform duration-300" strokeWidth={1.5} />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {idea.images && idea.images.length > 0 && (
            <div className={`mt-4 mb-4 grid gap-2 ${idea.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
              {idea.images.slice(0, 2).map((imgData, idx) => {
                const imgUrl = getFullFileUrl(imgData);
                return (
                  <div key={`img-${idx}`} onClick={(e) => { e.stopPropagation(); setFullScreenImage(imgUrl); }} className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 aspect-video group/img cursor-zoom-in">
                    <img src={imgUrl} alt="Attached image" className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105" />
                  </div>
                );
              })}
            </div>
          )}

          {docAttachments.length > 0 && (
            <div className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 w-fit px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors shadow-inner">
              <Paperclip className="w-4 h-4 text-blue-500" /> {docAttachments.length} {t("ideacard.docs_attached")}
            </div>
          )}
        </div>

        <div className="px-6 py-4 mt-auto border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between gap-6 overflow-visible transition-colors">
          
          <div className="relative group/reaction flex items-center">
            
            <div className="absolute bottom-full left-0 mb-3 hidden group-hover/reaction:flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] rounded-full px-3 py-2 animate-in fade-in slide-in-from-bottom-4 z-[100] transition-colors duration-300 after:content-[''] after:absolute after:-bottom-5 after:left-0 after:w-full after:h-8">
              {(Object.keys(REACTION_EMOJIS) as Array<keyof typeof REACTION_EMOJIS>).map((type) => (
                <button
                  key={type}
                  onClick={(e) => handleReact(e, type as keyof typeof REACTION_EMOJIS)}
                  className="hover:scale-125 hover:-translate-y-2.5 transition-all duration-200 origin-bottom rounded-full p-0.5"
                  title={type}
                >
                  <ReactionIcon type={type} className="w-10 h-10 drop-shadow-md" />
                </button>
              ))}
            </div>

            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleReact(e, currentReaction ? (currentReaction as keyof typeof REACTION_EMOJIS) : "LIKE");
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all shadow-sm ${
                currentReaction 
                  ? REACTION_EMOJIS[currentReaction as keyof typeof REACTION_EMOJIS].bg + " " + REACTION_EMOJIS[currentReaction as keyof typeof REACTION_EMOJIS].color 
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm"
              }`}
            >
              <div className="flex items-center">
                {totalReactions > 0 ? (
                  topReactions.map((type, idx) => (
                    <ReactionIcon 
                      key={idx} 
                      type={type} 
                      className={`w-[22px] h-[22px] rounded-full ring-2 ring-white dark:ring-slate-900 shadow-sm z-10 ${idx > 0 ? '-ml-1.5' : ''}`} 
                    />
                  ))
                ) : (
                  <ThumbsUp className="w-4 h-4 opacity-70" />
                )}
              </div>
              <span className={currentReaction ? "" : "opacity-80"}>
                {totalReactions > 0 ? totalReactions : "React"}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium text-sm ml-auto">
            <MessageSquare className="w-4 h-4" />
            <span>{idea.commentsCount} {t("ideacard.comments")}</span>
          </div>
        </div>
      </div>

      {fullScreenImage && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={(e) => { e.stopPropagation(); setFullScreenImage(null); }}>
          <button className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors" onClick={(e) => { e.stopPropagation(); setFullScreenImage(null); }}><X className="w-6 h-6" /></button>
          <img src={fullScreenImage} alt="Full Screen View" className="max-w-full max-h-[90vh] object-contain rounded-md shadow-2xl animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </>
  );
}