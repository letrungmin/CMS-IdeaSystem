"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createPortal } from "react-dom";
import { X, Clock, ShieldAlert, FileText, Download, Image as ImageIcon, Video, User, Lock } from "lucide-react";

interface Attachment {
  id?: number;
  fileName: string;
  url: string;
  type?: string;
}

interface Idea {
  id: number;
  title: string;
  excerpt: string;
  isAnonymous: boolean;
  author: string;
  authorAvatar?: string;
  department: string;
  category: string;
  submittedAt: string;
  status: string;
  images?: string[];
  attachments?: Attachment[];
}

const formatDateDetail = (dateString: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const toTitleCase = (str: string) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
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

function QAQueueContent() {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isFetching, setIsFetching] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [rejectFeedback, setRejectFeedback] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);

  // === ĐẠO BÙA FINAL CLOSURE DATE (ĐÃ XÓA CACHE) ===
  const [isPastFinalClosure, setIsPastFinalClosure] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkClosureStatus = async () => {
      try {
        let token = localStorage.getItem("accessToken") || "";
        if (!token) {
          const userStorage = localStorage.getItem("user");
          if (userStorage) {
            token = JSON.parse(userStorage).accessToken || "";
          }
        }

        // CẤM CACHE KHI KIỂM TRA GIỜ
        const response = await fetch("http://localhost:9999/api/v1/academic-years", {
          headers: { 
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            ...(token ? { "Authorization": `Bearer ${token}` } : {}) 
          }
        });

        if (response.ok) {
          const data = await response.json();
          const yearsList = Array.isArray(data.result) ? data.result : (data.result?.content || []);
          const activeYear = yearsList.find((y: any) => y.active === true || y.isActive === true);
          
          if (activeYear && activeYear.finalClosureDate) {
            let closureTime = new Date(activeYear.finalClosureDate).getTime();
            if (activeYear.finalClosureDate.includes("T00:00:00")) closureTime += (24 * 60 * 60 * 1000) - 1000;
            const isClosed = new Date().getTime() > closureTime;
            setIsPastFinalClosure(isClosed);
          } else if (!activeYear) {
            setIsPastFinalClosure(true);
          }
        }
      } catch (e) {
        console.error("Lỗi kiểm tra giờ:", e);
      }
    };
    checkClosureStatus();
  }, []);
  // ====================================

  const fetchIdeas = async () => {
    setIsFetching(true);
    try {
      const token = localStorage.getItem("accessToken");
      const timestamp = new Date().getTime();
      let endpoint = "idea/all_status";
      if (activeTab === "PENDING") endpoint = "idea/pending";
      if (activeTab === "APPROVED") endpoint = "idea";
      if (activeTab === "REJECTED") endpoint = "idea/reject";

      const response = await fetch(`http://localhost:9999/api/v1/${endpoint}?_t=${timestamp}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Fetch failed");
      
      const data = await response.json();
      let rawList: any[] = [];
      let fetchedTotal = 0;

      if (data.result) {
        if (Array.isArray(data.result)) {
          rawList = data.result;
          fetchedTotal = rawList.length;
        } else {
          rawList = data.result.content || [data.result];
          fetchedTotal = data.result.totalElements ?? rawList.length;
        }
      } else {
        rawList = Array.isArray(data) ? data : (data.content || [data]);
        fetchedTotal = data.totalElements ?? rawList.length;
      }
      
      setTotalCount(fetchedTotal);
      setIdeas(rawList.map((item: any) => ({
        id: item.id || Math.random(),
        title: item.title || "Untitled",
        excerpt: item.content || "",
        isAnonymous: item.anonymous || false,
        author: item.authorName || "Unknown",
        authorAvatar: item.authorAvatar || "",
        department: item.departmentName || "No Department",
        category: item.categories?.length > 0 ? item.categories[0] : "General",
        submittedAt: formatDateDetail(item.createdAt),
        status: item.status || "PENDING",
        images: item.images || [],
        attachments: item.attachments || []
      })));
    } catch (err) {
      setIdeas([]); 
      setTotalCount(0);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => { fetchIdeas(); }, [activeTab]);

  useEffect(() => {
    const reviewId = searchParams.get("reviewId");
    if (reviewId) {
      const fetchSingleIdea = async () => {
        try {
          const token = localStorage.getItem("accessToken");
          const response = await fetch(`http://localhost:9999/api/v1/idea/${reviewId}`, {
            headers: { "Authorization": `Bearer ${token}` }
          });
          if (response.ok) {
            const data = await response.json();
            const item = data.result || data;
            setSelectedIdea({
              id: item.id || Number(reviewId),
              title: item.title || "Untitled",
              excerpt: item.content || "",
              isAnonymous: item.anonymous || false,
              author: item.authorName || "Unknown",
              authorAvatar: item.authorAvatar || "",
              department: item.departmentName || "No Department",
              category: item.categories?.length > 0 ? item.categories[0] : "General",
              submittedAt: formatDateDetail(item.createdAt),
              status: item.status || "PENDING",
              images: item.images || [],
              attachments: item.attachments || []
            });
            setIsReviewModalOpen(true);
          }
        } catch (e) {}
      };
      fetchSingleIdea();
    }
  }, [searchParams]);

  const handleApprove = async (id: number) => {
    if (isPastFinalClosure) {
      alert("Hệ thống đã khóa sổ! Không thể duyệt thêm Idea.");
      return;
    }
    setProcessingId(id);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`http://localhost:9999/api/v1/ideas/review/approve/${id}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Approval failed");

      if (activeTab === "PENDING") {
        setIdeas(prev => prev.filter(idea => idea.id !== id));
        setTotalCount(prev => Math.max(0, prev - 1));
      } else {
        setIdeas(prev => prev.map(idea => idea.id === id ? { ...idea, status: "APPROVED" } : idea));
      }
      if (selectedIdea?.id === id) setSelectedIdea(prev => prev ? { ...prev, status: "APPROVED" } : null);
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  const openRejectModal = (id: number) => {
    if (isPastFinalClosure) {
      alert("Hệ thống đã khóa sổ! Không thể thao tác.");
      return;
    }
    setRejectingId(id);
    setRejectFeedback("");
    setError(null);
    setIsRejectModalOpen(true);
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingId || isPastFinalClosure) return;
    setProcessingId(rejectingId);
    setError(null);

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`http://localhost:9999/api/v1/ideas/review/reject/${rejectingId}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ feedback: rejectFeedback }) 
      });
      if (!response.ok) throw new Error("Rejection failed");

      if (activeTab === "PENDING") {
        setIdeas(prev => prev.filter(idea => idea.id !== rejectingId));
        setTotalCount(prev => Math.max(0, prev - 1));
      } else {
        setIdeas(prev => prev.map(idea => idea.id === rejectingId ? { ...idea, status: "REJECTED" } : idea));
      }
      if (selectedIdea?.id === rejectingId) setSelectedIdea(prev => prev ? { ...prev, status: "REJECTED" } : null);
      setIsRejectModalOpen(false);
    } catch (err: any) {
      setError(`Error: ${err.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  const filteredIdeas = ideas.filter(idea => 
    (idea.title && idea.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (idea.department && idea.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (idea.category && idea.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const videoAttachments = selectedIdea?.attachments?.filter((doc: any) => doc?.type?.toUpperCase().includes('VIDEO') || doc?.url?.match(/\.(mp4|webm|ogg|mov)$/i)) || [];
  const docAttachments = selectedIdea?.attachments?.filter((doc: any) => !videoAttachments.includes(doc)) || [];
  const images = selectedIdea?.images || [];

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-12 transition-colors bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden border border-blue-900/30">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full -mr-32 -mt-32 blur-[80px] opacity-40"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold mb-4 backdrop-blur-md uppercase tracking-wider">
              QA Manager
            </div>
            <h1 className="text-3xl font-black tracking-tight mb-2">Quality Assurance Dashboard</h1>
            <p className="text-slate-400 text-sm max-w-lg">Review and manage ideas submitted by staff members.</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-center min-w-[120px]">
              <p className="text-3xl font-black text-white">{totalCount}</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{toTitleCase(activeTab)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto custom-scrollbar">
        {["ALL", "PENDING", "APPROVED", "REJECTED"].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === tab ? "border-blue-500 text-blue-600 dark:text-blue-400" : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"}`}>
            {toTitleCase(tab)} Ideas
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-3 sticky top-0 z-30 transition-colors">
        <div className="relative flex-1">
          <input type="text" placeholder="Search by title, department, or category..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-blue-500 text-slate-900 dark:text-white placeholder-slate-400 transition-colors" />
        </div>
        <div className="flex flex-wrap gap-3">
          <select className="h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 outline-none focus:border-blue-500 cursor-pointer">
            <option>All Departments</option>
            <option>IT Department</option>
            <option>Business Management</option>
          </select>
          <button className="h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold text-sm">
            Filter
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {isFetching ? (
          <div className="flex justify-center py-20 font-bold text-blue-500">LOADING DATA...</div>
        ) : filteredIdeas.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">No Ideas Found</h3>
            <p className="text-slate-500 text-sm mt-2">There are currently no ideas matching this criteria.</p>
          </div>
        ) : (
          filteredIdeas.map((idea) => (
            <div key={idea.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md flex flex-col lg:flex-row gap-6 group">
              <div className="flex-1 flex gap-5">
                <div className={`hidden sm:flex flex-col items-center justify-center w-16 h-16 rounded-xl shrink-0 border ${
                  idea.status === "PENDING" ? "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800/50" :
                  idea.status === "APPROVED" ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/50" :
                  "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-100 dark:border-red-800/50"
                }`}>
                  <span className="text-[10px] font-black uppercase text-center break-words w-full px-1">{toTitleCase(idea.status)}</span>
                </div>
                
                <div className="space-y-2 w-full">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-black text-slate-400">ID: {idea.id}</span>
                    <span className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></span>
                    <span className="font-bold text-slate-600 dark:text-slate-300">{idea.category || "General"}</span>
                    <span className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></span>
                    <span className={`font-bold px-2 py-0.5 rounded-md ${idea.isAnonymous ? 'bg-slate-100 dark:bg-slate-800 text-slate-500' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'}`}>
                      {idea.isAnonymous ? "Anonymous" : (idea.author || "Unknown")} • {idea.department || "No Dept"}
                    </span>
                    <span className="text-slate-400 ml-auto">{idea.submittedAt}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {idea.title || "Untitled Idea"}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-2">{idea.excerpt || "No description provided."}</p>
                </div>
              </div>

              <div className="flex flex-row lg:flex-col items-center justify-end gap-2 shrink-0 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 pt-4 lg:pt-0 lg:pl-6">
                {idea.status === "PENDING" && (
                  isPastFinalClosure ? (
                    <div className="flex-1 lg:flex-none w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl text-xs font-black text-center border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1 uppercase tracking-widest cursor-not-allowed">
                      <Lock className="w-3 h-3"/> SYSTEM LOCKED
                    </div>
                  ) : (
                    <>
                      <button onClick={() => handleApprove(idea.id)} disabled={processingId === idea.id} className="flex-1 lg:flex-none w-full px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500 dark:hover:bg-emerald-600 hover:text-white border border-emerald-200 dark:border-emerald-800/50 rounded-xl text-sm font-bold disabled:opacity-50 uppercase">
                        {processingId === idea.id ? "PROCESSING" : "APPROVE"}
                      </button>
                      <button onClick={() => openRejectModal(idea.id)} disabled={processingId === idea.id} className="flex-1 lg:flex-none w-full px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-500 dark:hover:bg-red-600 hover:text-white border border-red-200 dark:border-red-800/50 rounded-xl text-sm font-bold disabled:opacity-50 uppercase">
                        {processingId === idea.id ? "PROCESSING" : "REJECT"}
                      </button>
                    </>
                  )
                )}
                {idea.status === "APPROVED" && <div className="flex-1 lg:flex-none w-full px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-sm font-black text-center border border-emerald-200 dark:border-emerald-800/30 uppercase">{toTitleCase(idea.status)}</div>}
                {idea.status === "REJECTED" && <div className="flex-1 lg:flex-none w-full px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-black text-center border border-red-200 dark:border-red-800/30 uppercase">{toTitleCase(idea.status)}</div>}
                <button 
                  onClick={() => {
                    fetch(`http://localhost:9999/api/v1/idea/${idea.id}`, { headers: { "Authorization": `Bearer ${localStorage.getItem("accessToken")}` } })
                      .then(res => res.json())
                      .then(data => { 
                         const fullIdea = data.result || data;
                         setSelectedIdea({ 
                           ...idea, 
                           images: fullIdea.images || [], 
                           attachments: fullIdea.attachments || [] 
                         }); 
                         setIsReviewModalOpen(true); 
                      })
                      .catch(() => { setSelectedIdea(idea); setIsReviewModalOpen(true); });
                  }}
                  className="w-full lg:w-10 h-10 flex items-center justify-center font-bold text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white rounded-xl transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700 uppercase"
                >
                  VIEW
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {mounted && isReviewModalOpen && selectedIdea && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsReviewModalOpen(false)}>
          <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 border border-transparent dark:border-slate-800 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setIsReviewModalOpen(false)} className="absolute top-4 right-4 z-10 p-2 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 rounded-full transition-colors backdrop-blur-sm shadow-md">
              <X className="w-5 h-5" />
            </button>

            <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar relative">
              <div className="flex items-center justify-between mb-6 pr-10">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 border border-blue-200 rounded-full text-xs font-bold uppercase tracking-wide truncate max-w-[70%]">
                  {selectedIdea.category}
                </span>
                <span className="text-sm font-bold text-slate-400">ID: {selectedIdea.id}</span>
              </div>

              <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-6 leading-tight">{selectedIdea.title}</h1>

              <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 mb-8">
                {selectedIdea.isAnonymous ? (
                  <div className="w-10 h-10 bg-slate-800 dark:bg-slate-700 text-slate-300 dark:text-slate-400 flex items-center justify-center rounded-full shadow-sm shrink-0"><ShieldAlert className="w-5 h-5" /></div>
                ) : (
                  <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm shrink-0 bg-slate-200 flex items-center justify-center">
                    {selectedIdea.authorAvatar && !selectedIdea.authorAvatar.includes("default") ? (
                      <img src={getFullFileUrl(selectedIdea.authorAvatar)} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                )}
                <div className="overflow-hidden">
                  <h3 className="font-bold text-slate-800 dark:text-white truncate">{selectedIdea.isAnonymous ? "Anonymous" : selectedIdea.author}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5"><Clock className="w-3 h-3 shrink-0" /> {selectedIdea.submittedAt}</p>
                </div>
              </div>

              <div className="text-slate-700 dark:text-slate-300 leading-relaxed text-[15px] whitespace-pre-wrap mb-8">
                {selectedIdea.excerpt}
              </div>

              {(videoAttachments.length > 0 || images.length > 0 || docAttachments.length > 0) && (
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                  {videoAttachments.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2"><Video className="w-4 h-4 text-purple-500" /> Attached Videos</h4>
                      <div className="flex flex-col gap-4">
                        {videoAttachments.map((vid: any, idx: number) => (
                            <div key={`vid-${idx}`} className="relative w-full max-w-md rounded-xl overflow-hidden bg-black aspect-video border border-slate-200 dark:border-slate-700 group">
                              <video controls className="w-full h-full object-contain" controlsList="nodownload"><source src={getFullFileUrl(vid?.url || vid)} /></video>
                              <a href={getFullFileUrl(vid?.url || vid)} download target="_blank" rel="noopener noreferrer" className="absolute top-2 right-2 bg-slate-900/80 hover:bg-black text-white text-[10px] font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity uppercase z-10 backdrop-blur-sm flex items-center gap-1"><Download className="w-3 h-3"/> DOWNLOAD</a>
                            </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {images.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2"><ImageIcon className="w-4 h-4 text-slate-500 dark:text-slate-400" /> Attached Images</h4>
                      <div className="flex flex-col gap-4">
                        {images.map((imgStr: string, idx: number) => {
                          const imgUrl = getFullFileUrl(imgStr);
                          return (
                            <div key={`img-${idx}`} className="relative w-full max-w-md group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 aspect-video cursor-zoom-in" onClick={(e) => { e.stopPropagation(); setFullScreenImage(imgUrl); }}>
                              <img src={imgUrl} alt="Attached Image" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                              <a href={imgUrl} download target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="absolute top-2 right-2 bg-slate-900/80 hover:bg-black text-white text-[10px] font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity uppercase z-10 backdrop-blur-sm flex items-center gap-1"><Download className="w-3 h-3"/> DOWNLOAD</a>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {docAttachments.length > 0 && (
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2"><FileText className="w-4 h-4 text-slate-500 dark:text-slate-400" /> Attached Documents</h4>
                      <div className="flex flex-col gap-3">
                        {docAttachments.map((doc: any, idx: number) => {
                          const fUrl = getFullFileUrl(doc.url);
                          let dName = doc.fileName || doc.url.split('/').pop() || `File_${idx + 1}`;
                          dName = dName.replace(/^(?:\/?api\/v[0-9]\/?)?(?:files\/(?:pdf|document|other|image|video)\/?)?/i, '');
                          dName = dName.replace(/_\d{10,}\./, '.'); 

                          return (
                            <a key={`doc-${idx}`} href={fUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-blue-300 transition-colors w-full max-w-md group">
                              <div className="flex items-center gap-3 overflow-hidden">
                                <div className="w-10 h-10 bg-rose-100 dark:bg-rose-900/30 text-rose-500 dark:text-rose-400 rounded-lg flex items-center justify-center shrink-0"><FileText className="w-5 h-5" /></div>
                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{dName}</span>
                              </div>
                              <Download className="w-4 h-4 text-slate-400 group-hover:text-blue-600 shrink-0" />
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-100 dark:border-slate-800 shrink-0 flex gap-4 bg-white dark:bg-slate-900 rounded-b-3xl">
              {selectedIdea.status === "PENDING" ? (
                isPastFinalClosure ? (
                  <div className="w-full py-3 bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold flex flex-col items-center justify-center gap-1 uppercase tracking-widest cursor-not-allowed">
                     <Lock className="w-5 h-5 mb-1" />
                     SYSTEM LOCKED
                     <span className="text-[10px] lowercase tracking-normal font-normal">Final closure date has passed</span>
                  </div>
                ) : (
                  <>
                    <button onClick={() => { handleApprove(selectedIdea.id); setIsReviewModalOpen(false); }} disabled={processingId === selectedIdea.id} className="flex-1 py-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 rounded-xl text-sm font-bold uppercase transition-colors hover:bg-emerald-100 dark:hover:bg-emerald-900/40">
                      APPROVE
                    </button>
                    <button onClick={() => { setIsReviewModalOpen(false); openRejectModal(selectedIdea.id); }} className="flex-1 py-3 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/50 rounded-xl text-sm font-bold uppercase transition-colors hover:bg-rose-100 dark:hover:bg-rose-900/40">
                      REJECT
                    </button>
                  </>
                )
              ) : (
                <div className="flex-1 py-3 bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 rounded-xl text-sm font-black text-center uppercase tracking-widest border border-slate-200 dark:border-slate-700">
                  {toTitleCase(selectedIdea.status)}
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {mounted && isRejectModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsRejectModalOpen(false)}>
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Reject Idea</h3>
              <button onClick={() => setIsRejectModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full font-bold text-xs uppercase transition-colors"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleRejectSubmit} className="p-6 space-y-5">
              {error && <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"><p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p></div>}
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Reason for Rejection (Feedback)</label>
                <textarea required rows={4} value={rejectFeedback} onChange={(e) => setRejectFeedback(e.target.value)} placeholder="Provide constructive feedback..." className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-red-500 text-slate-800 dark:text-white resize-none shadow-inner text-sm" />
              </div>
              <div className="pt-2 flex items-center justify-end gap-3">
                <button type="button" onClick={() => setIsRejectModalOpen(false)} className="px-5 py-2.5 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-sm uppercase transition-colors">Cancel</button>
                <button type="submit" disabled={processingId === rejectingId} className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md disabled:opacity-70 text-sm uppercase transition-colors">Confirm Reject</button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {mounted && fullScreenImage && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setFullScreenImage(null)}>
          <button className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors" onClick={(e) => { e.stopPropagation(); setFullScreenImage(null); }}><X className="w-6 h-6" /></button>
          <img src={fullScreenImage} alt="Full Screen View" className="max-w-full max-h-[90vh] object-contain rounded-md shadow-2xl animate-in zoom-in-95 duration-200 select-none" onClick={(e) => e.stopPropagation()} />
        </div>,
        document.body
      )}
    </div>
  );
}

export default function QAQueuePage() {
  return (
    <Suspense fallback={<div className="p-10 font-bold text-center text-blue-500">LOADING DATA...</div>}>
      <QAQueueContent />
    </Suspense>
  );
}