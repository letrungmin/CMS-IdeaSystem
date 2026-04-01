"use client";

import React, { useState, useEffect } from "react";
import IdeaCard, { IdeaType } from "@/components/IdeaCard";
import IdeaDetailModal from "@/components/IdeaDetailModal";
import { Loader2, TrendingUp, Clock, Flame, PlusCircle, ShieldAlert, FileText, Settings } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { getRoleFromToken } from "@/utils/auth";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function HomeFeedPage() {
  const { t } = useLanguage();
  const router = useRouter();
  
  const [ideas, setIdeas] = useState<IdeaType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"latest" | "popular" | "viewed">("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  const [selectedIdea, setSelectedIdea] = useState<IdeaType | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Retrieve role directly from token
  const userRole = getRoleFromToken();

  const fetchIdeas = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token") || "";
      const timestamp = new Date().getTime();
      
      const response = await fetch(`http://localhost:9999/api/v1/idea?page=${currentPage - 1}&limit=5&sort=${sortBy}&_t=${timestamp}`, {
        headers: { 
          'Cache-Control': 'no-cache, no-store, must-revalidate', 
          'Pragma': 'no-cache',
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        }
      });

      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      const data = await response.json();
      
      const rawIdeas = data.content || data.result?.content || data;
      
      if (rawIdeas && Array.isArray(rawIdeas)) {
        const mappedIdeas: IdeaType[] = rawIdeas.map((beIdea: any) => {
          let formattedDate = "Unknown Date";
          if (beIdea.createdAt) {
            const dateObj = new Date(beIdea.createdAt);
            formattedDate = dateObj.toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' });
          }
          
          let displayCategory = beIdea.departmentName || "General";
          if (beIdea.categories && beIdea.categories.length > 0) {
            displayCategory = beIdea.categories.length > 1 ? `${beIdea.categories[0]} +${beIdea.categories.length - 1}` : beIdea.categories[0];
          }

          return {
            id: beIdea.id, 
            title: beIdea.title || "Untitled Idea", 
            content: beIdea.content || "No content provided.",
            categoryName: displayCategory, 
            authorName: beIdea.authorName || "Unknown User", 
            createdAt: formattedDate,
            isAnonymous: beIdea.anonymous || false, 
            
            reactions: {
              LIKE: beIdea.reactions?.LIKE || 0,
              LOVE: beIdea.reactions?.LOVE || 0,
              HAHA: beIdea.reactions?.HAHA || 0,
              WOW: beIdea.reactions?.WOW || 0,
              SAD: beIdea.reactions?.SAD || 0,
              ANGRY: beIdea.reactions?.ANGRY || 0,
            },
            userReaction: beIdea.userReaction || null,

            commentsCount: beIdea.commentCount || 0, 
            viewsCount: beIdea.viewCount || 0, 
            hasAttachments: (beIdea.attachments?.length > 0) || (beIdea.images?.length > 0),
            attachments: beIdea.attachments || [], 
            images: beIdea.images || []
          };
        });
        setIdeas(mappedIdeas);
        setTotalPages(data.totalPages || data.result?.totalPages || 1);
      } else {
        setIdeas([]); setTotalPages(1);
      }
    } catch (err) {
      console.error("Home Feed Fetch Error:", err);
      setIdeas([]); 
    } finally { 
      setIsLoading(false); 
    }
  };

  useEffect(() => { fetchIdeas(); }, [currentPage, sortBy, refreshKey]);

  // Role-based render functions
  const renderRoleSpecificBanner = () => {
    switch(userRole) {
      case "ROLE_QA_MANAGER":
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 mt-4">
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3 text-amber-800 dark:text-amber-500">
                <ShieldAlert className="w-6 h-6 shrink-0" />
                <p className="font-semibold text-sm">You have pending ideas waiting for approval in the QA Queue.</p>
              </div>
              <button 
                onClick={() => router.push("/qa-queue")}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-sm transition-all shadow-md whitespace-nowrap"
              >
                Go to QA Queue
              </button>
            </div>
          </div>
        );
      
      case "ROLE_ADMIN":
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 mt-4">
            <div className="bg-slate-900 dark:bg-slate-800 border border-slate-700 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3 text-white">
                <Settings className="w-6 h-6 text-blue-400 shrink-0" />
                <p className="font-semibold text-sm">Administrator Access Active. System running normally.</p>
              </div>
              <button 
                onClick={() => router.push("/admin/dashboard")}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition-all shadow-md whitespace-nowrap"
              >
                System Dashboard
              </button>
            </div>
          </div>
        );

      case "ROLE_QA_COORDINATOR":
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 mt-4">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3 text-emerald-800 dark:text-emerald-500">
                <FileText className="w-6 h-6 shrink-0" />
                <p className="font-semibold text-sm">Manage ideas and assign categories within your department.</p>
              </div>
              <button 
                onClick={() => router.push("/dept-dashboard")}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-all shadow-md whitespace-nowrap"
              >
                Department Dashboard
              </button>
            </div>
          </div>
        );
      
      default:
        // No special banner for staff or pending load
        return null;
    }
  };

  return (
    <div className="w-full pb-20 flex flex-col transition-colors duration-300 relative">
      
      {/* Sticky header bar */}
      <div className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">
              {t("home.title")}
            </h1>
          </div>
          
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl w-fit transition-colors shadow-inner">
            <button onClick={() => { setSortBy("latest"); setCurrentPage(1); }} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${sortBy === 'latest' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}>
              <Clock className="w-4 h-4" /> {t("home.latest")}
            </button>
            <button onClick={() => { setSortBy("popular"); setCurrentPage(1); }} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${sortBy === 'popular' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}>
              <TrendingUp className="w-4 h-4" /> {t("home.popular")}
            </button>
            <button onClick={() => { setSortBy("viewed"); setCurrentPage(1); }} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${sortBy === 'viewed' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}>
              <Flame className="w-4 h-4" /> {t("home.viewed")}
            </button>
          </div>
        </div>
      </div>

      {/* Render banner based on permissions */}
      {renderRoleSpecificBanner()}

      {/* Feed content */}
      <div className={`max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 space-y-6 ${userRole === "ROLE_STAFF" ? "mt-6" : ""}`}>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-600 dark:text-blue-400" />
            <p className="font-bold text-slate-500 dark:text-slate-400 animate-pulse">{t("home.loading_ideas")}</p>
          </div>
        ) : ideas.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <div className="text-6xl mb-6 drop-shadow-sm"></div>
            <p className="text-2xl font-black text-slate-800 dark:text-white mb-2">{t("home.no_ideas")}</p>
            <p className="text-slate-500 dark:text-slate-400">{t("home.be_first")}</p>
          </div>
        ) : (
          <>
            {ideas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} onClick={() => { setSelectedIdea(idea); setIsDetailModalOpen(true); }} />
            ))}
            
            <div className="flex items-center justify-between pt-8 border-t border-slate-200 dark:border-slate-800 mt-8 transition-colors">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                {t("common.previous")}
              </button>
              <span className="font-medium text-slate-500 dark:text-slate-400">
                {t("common.page_of").replace("{current}", currentPage.toString()).replace("{total}", totalPages.toString())}
              </span>
              <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)} className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                {t("common.next")}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Floating action button: Staff or default only */}
      {(userRole === "ROLE_STAFF" || userRole === null) && (
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/submit-idea")}
          className="fixed bottom-8 right-8 z-50 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-full shadow-[0_10px_30px_rgba(37,99,235,0.4)] font-bold text-lg border border-blue-400/30 group"
        >
          <PlusCircle className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
          <span className="hidden md:inline">Submit Idea</span>
        </motion.button>
      )}

      <IdeaDetailModal isOpen={isDetailModalOpen} idea={selectedIdea} onClose={() => setIsDetailModalOpen(false)} />
    </div>
  );
}