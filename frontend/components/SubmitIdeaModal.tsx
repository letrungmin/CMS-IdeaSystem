"use client";

import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { X, UploadCloud, Shield, Loader2, FileText, Trash2, CheckCircle2, PartyPopper, Video, AlertTriangle, Lock } from "lucide-react";
import { useLanguage } from "./LanguageProvider";

interface SubmitIdeaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void; 
}

interface CategoryType {
  id: number;
  name: string;
}

export default function SubmitIdeaModal({ isOpen, onClose, onSuccess }: SubmitIdeaModalProps) {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">(""); 
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showTermsPopup, setShowTermsPopup] = useState(false);
  const [pendingTermsId, setPendingTermsId] = useState<number | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [isClosed, setIsClosed] = useState(false);

  const getToken = () => {
    try {
      const directToken = localStorage.getItem("accessToken");
      if (directToken) return directToken;
      const userStorage = localStorage.getItem("user");
      if (userStorage) {
        const userObj = JSON.parse(userStorage);
        return userObj.accessToken || "";
      }
    } catch (e) {}
    return "";
  };

  const fetchCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const token = getToken();
      const response = await fetch("http://localhost:9999/api/v1/categories/active", {
        headers: { 'Cache-Control': 'no-cache', ...(token ? { "Authorization": `Bearer ${token}` } : {}) }
      });
      if (response.ok) {
        const data = await response.json();
        const catList = Array.isArray(data) ? data : (data.content || data.result || []);
        setCategories(catList);
      }
    } catch (error) {
      setCategories([
        { id: 1, name: "IT Infrastructure" },
        { id: 2, name: "Campus Facilities" },
        { id: 3, name: "Curriculum Enhancement" }
      ]);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const checkAcademicYearStatus = async () => {
    try {
      const token = getToken();
      const response = await fetch("http://localhost:9999/api/v1/academic-years", {
        headers: { 'Cache-Control': 'no-cache', ...(token ? { "Authorization": `Bearer ${token}` } : {}) }
      });
      if (response.ok) {
        const data = await response.json();
        const yearsList = Array.isArray(data.result) ? data.result : (data.result?.content || []);
        const activeYear = yearsList.find((y: any) => y.active === true || y.isActive === true);
        
        if (activeYear && activeYear.ideaClosureDate) {
          let closureTime = new Date(activeYear.ideaClosureDate).getTime();
          
          if (activeYear.ideaClosureDate.includes("T00:00:00")) {
            closureTime += (24 * 60 * 60 * 1000) - 1000;
          }

          const now = new Date().getTime();
          if (now > closureTime) {
            setIsClosed(true);
          }
        }
      }
    } catch (error) {}
  };

  const initializeModal = async () => {
    setIsCheckingStatus(true);
    await Promise.all([fetchCategories(), checkAcademicYearStatus()]);
    setIsCheckingStatus(false);
  };

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTitle(""); setCategoryId(""); setContent("");
      setIsAnonymous(false); setFiles([]);
      setErrorMessage(""); setShowTermsPopup(false); setPendingTermsId(null); setIsSuccess(false); setIsClosed(false);
      initializeModal();
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (indexToRemove: number) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const executeSubmitIdea = async () => {
    try {
      const token = getToken();
      const formData = new FormData();
      const dataPayload = { title, content, anonymous: isAnonymous, categoryIds: [Number(categoryId)] };
      
      formData.append("data", new Blob([JSON.stringify(dataPayload)], { type: "application/json" }));
      files.forEach((file) => formData.append("image", file)); 

      const response = await fetch("http://localhost:9999/api/v1/idea/create", { 
        method: "POST",
        headers: { ...(token ? { "Authorization": `Bearer ${token}` } : {}) },
        body: formData 
      });
      
      const responseText = await response.text();
      let dataObj;
      try { dataObj = JSON.parse(responseText); } catch(e) {}

      if (!response.ok) {
        if (responseText.toLowerCase().includes("closure") || responseText.toLowerCase().includes("expired")) {
          setIsClosed(true); return;
        }
        throw new Error(dataObj?.message || dataObj?.error || `Server Error ${response.status}: Failed to process submission.`);
      }
      
      if (dataObj && dataObj.code && dataObj.code !== 1000) {
        throw new Error(dataObj.message || dataObj.error || "Submission rejected by server internal rules.");
      }
      
      setIsSuccess(true);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to submit idea.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptTerms = async () => {
    if (!pendingTermsId) return;
    setIsLoading(true); setErrorMessage("");
    try {
      const token = getToken();
      const response = await fetch("http://localhost:9999/api/v1/user/accept-terms", {
        method: "POST", 
        headers: { "Content-Type": "application/json", ...(token ? { "Authorization": `Bearer ${token}` } : {}) }, 
        body: JSON.stringify({ termsId: pendingTermsId }),
      });
      if (!response.ok) throw new Error("Failed to accept terms.");
      setShowTermsPopup(false);
      await executeSubmitIdea();
    } catch (error: any) {
      setErrorMessage(error.message); setIsLoading(false);
    }
  };

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setErrorMessage(""); 
    
    if (isClosed) {
      setErrorMessage("The deadline for submitting ideas has passed. Submissions are now closed.");
      return;
    }

    if (!title || !categoryId || !content) { setErrorMessage("Please fill in all required fields."); return; }
    setIsLoading(true);
    
    try {
      const token = getToken();
      const checkResponse = await fetch("http://localhost:9999/api/v1/user/me/terms-status", {
        headers: { "Content-Type": "application/json", ...(token ? { "Authorization": `Bearer ${token}` } : {}) }
      });
      
      const responseText = await checkResponse.text();
      let termData: any = null;
      try { termData = JSON.parse(responseText); } catch(err) {}

      // LOGIC VƯỢT RÀO: Nếu Backend chưa có Terms (Code 7002) hoặc API bị 404, Bypass và nộp luôn!
      if (!checkResponse.ok) {
        if (termData?.code === 7002 || checkResponse.status === 404) {
          await executeSubmitIdea();
          return;
        }
        throw new Error(termData?.message || "Could not verify Terms status.");
      }
      
      const actualData = termData?.result || termData;

      if (actualData && actualData.accepted === true) {
        await executeSubmitIdea();
      } else if (actualData && actualData.termsId) { 
        setPendingTermsId(actualData.termsId); 
        setShowTermsPopup(true); 
        setIsLoading(false); 
      } else {
        // Đề phòng API trả về OK nhưng không có dữ liệu terms
        await executeSubmitIdea();
      }
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to process request. Please try again.");
      setIsLoading(false);
    }
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 relative border border-transparent dark:border-slate-800">
        
        {isCheckingStatus ? (
          <div className="flex flex-col items-center justify-center p-20 text-blue-500">
            <Loader2 className="w-10 h-10 animate-spin mb-4" />
            <p className="font-bold uppercase tracking-widest text-sm">VERIFYING STATUS...</p>
          </div>
        ) : isClosed ? (
          <div className="flex flex-col items-center justify-center p-12 text-center animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <Lock className="w-12 h-12 text-rose-500" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white mb-3 uppercase tracking-tight">SUBMISSION CLOSED</h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 max-w-sm leading-relaxed">The deadline for submitting new ideas in the current academic year has passed.</p>
            <button onClick={onClose} className="px-8 py-3.5 font-bold text-white bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 rounded-xl shadow-md transition-all hover:-translate-y-1 w-full max-w-xs uppercase">CLOSE</button>
          </div>
        ) : isSuccess ? (
          <div className="flex flex-col items-center justify-center p-12 text-center animate-in zoom-in duration-500">
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 bg-green-100 dark:bg-green-900/40 rounded-full animate-ping opacity-75"></div>
              <div className="relative flex items-center justify-center w-24 h-24 bg-green-500 rounded-full shadow-lg shadow-green-200 dark:shadow-none animate-bounce">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white mb-3 flex items-center gap-2">Awesome! <PartyPopper className="w-8 h-8 text-yellow-500" /></h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 max-w-sm">Your idea has been successfully submitted to the system.</p>
            <button onClick={onClose} className="px-8 py-3.5 font-bold text-white bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 rounded-xl shadow-md transition-all hover:-translate-y-1 w-full max-w-xs">Done & Close</button>
          </div>
        ) : (
          <>
            {showTermsPopup && (
              <div className="absolute inset-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md flex flex-col items-center justify-center p-8 animate-in slide-in-from-bottom-4 duration-300">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-6 shadow-inner"><FileText className="w-8 h-8" /></div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Terms & Conditions</h3>
                <p className="text-slate-600 dark:text-slate-400 text-center mb-8 max-w-md leading-relaxed">Before submitting your idea, you must agree to the university's terms.</p>
                <div className="flex gap-4 w-full justify-center">
                  <button type="button" onClick={() => setShowTermsPopup(false)} disabled={isLoading} className="px-6 py-3 font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors disabled:opacity-50">Decline</button>
                  <button type="button" onClick={handleAcceptTerms} disabled={isLoading} className="px-6 py-3 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg flex items-center gap-2 transition-transform hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0">
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CheckCircle2 className="w-5 h-5" /> Accept & Continue</>}
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Submit a New Idea</h2>
              <button onClick={onClose} disabled={isLoading} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors disabled:opacity-50"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleInitialSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-6">
                
                {errorMessage && <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-xl font-medium flex items-center gap-2 border border-red-100 dark:border-red-800/50"><AlertTriangle className="w-4 h-4 shrink-0 mt-0.5"/> <span className="break-words">{errorMessage}</span></div>}

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Title <span className="text-red-500">*</span></label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} disabled={isLoading || isClosed} className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50 outline-none placeholder-slate-400 dark:placeholder-slate-500 disabled:bg-slate-50 dark:disabled:bg-slate-900 disabled:text-slate-500" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Category <span className="text-red-500">*</span></label>
                  <select 
                    value={categoryId} onChange={(e) => setCategoryId(e.target.value === "" ? "" : Number(e.target.value))} 
                    disabled={isLoading || isLoadingCategories || isClosed} 
                    className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50 outline-none disabled:bg-slate-50 dark:disabled:bg-slate-900 disabled:text-slate-500 font-medium"
                  >
                    <option value="">{isLoadingCategories ? "Loading categories..." : "Select a category..."}</option>
                    {categories.length > 0 ? categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>) : (
                      !isLoadingCategories && (<><option value="1">Industry Collaboration</option><option value="2">Community Engagement</option><option value="3">Sustainability & Green Campus</option><option value="4">Innovation & Entrepreneurship</option></>)
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Content <span className="text-red-500">*</span></label>
                  <textarea rows={5} value={content} onChange={(e) => setContent(e.target.value)} disabled={isLoading || isClosed} className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50 outline-none resize-none placeholder-slate-400 dark:placeholder-slate-500 disabled:bg-slate-50 dark:disabled:bg-slate-900 disabled:text-slate-500"></textarea>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Supporting Media</label>
                  <input type="file" multiple ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,.pdf,.doc,.docx,video/mp4,video/webm,video/quicktime" disabled={isClosed} />
                  <div onClick={() => !isClosed && fileInputRef.current?.click()} className={`mt-1 border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all ${isClosed ? 'border-slate-200 bg-slate-50 cursor-not-allowed opacity-60 dark:border-slate-800 dark:bg-slate-900' : 'border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer'}`}>
                    <UploadCloud className="w-8 h-8 text-blue-500 mb-2" />
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Click to attach files or videos</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Supports JPG, PNG, PDF, DOCX, MP4</p>
                  </div>

                  {files.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {files.map((file, idx) => {
                        const isVideo = file.type.startsWith("video/");
                        return (
                          <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                            <div className="flex items-center gap-2 overflow-hidden">
                              {isVideo ? <Video className="w-4 h-4 text-purple-500 shrink-0" /> : <FileText className="w-4 h-4 text-blue-500 shrink-0" />}
                              <span className="text-sm text-slate-600 dark:text-slate-300 truncate">{file.name}</span>
                            </div>
                            {!isClosed && <button type="button" onClick={() => removeFile(idx)} className="text-red-400 hover:text-red-600 p-1"><Trash2 className="w-4 h-4" /></button>}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <label className={`flex items-start gap-3 ${isClosed ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
                    <input type="checkbox" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} disabled={isLoading || isClosed} className="w-4 h-4 rounded mt-0.5" />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"><Shield className="w-4 h-4" /> Post Anonymously</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-end gap-3 rounded-b-2xl">
                <button type="button" onClick={onClose} disabled={isLoading} className="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl">Cancel</button>
                <button type="submit" disabled={isLoading || isClosed} className={`px-5 py-2.5 text-sm font-bold text-white rounded-xl shadow-md flex items-center gap-2 ${isClosed ? 'bg-slate-400 cursor-not-allowed shadow-none' : 'bg-blue-600 hover:bg-blue-700'}`}>
                  {isLoading && !showTermsPopup ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : "Submit Idea"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}