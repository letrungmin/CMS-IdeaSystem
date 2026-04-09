"use client";

import React, { useState, useEffect } from "react";
import { 
  Building2, Users, Lightbulb, TrendingUp, 
  Mail, BellRing, Clock, CheckCircle2, MessageSquare,
  X, Loader2, AlertCircle, Send
} from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export default function DeptDashboardPage() {
  const { t } = useLanguage();
  
  // --- MOCK DATA (Giữ nguyên vì chưa có API cho Stats) ---
  const deptStats = {
    name: "IT Department",
    totalStaff: 45,
    participatingStaff: 28,
    totalIdeas: 84,
    totalComments: 215,
    participationRate: "62%"
  };
  const missingStaff = deptStats.totalStaff - deptStats.participatingStaff;
  const recentDeptIdeas = [
    { id: "ID-101", title: "Upgrade Lab Computers to 32GB RAM", author: "Trung Min", comments: 12, thumbsUp: 45, time: "2 hours ago" },
    { id: "ID-102", title: "Free GitHub Copilot for IT Staff", author: "Alex Nguyen", comments: 8, thumbsUp: 30, time: "5 hours ago" },
    { id: "ID-103", title: "More ergonomic chairs in Room 302", author: "David Tran", comments: 3, thumbsUp: 15, time: "1 day ago" },
  ];

  // --- ENCOURAGE MODAL STATES ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [departments, setDepartments] = useState<any[]>([]);
  const [isLoadingDepts, setIsLoadingDepts] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [modalSuccess, setModalSuccess] = useState<string | null>(null);

  // Form Data State
  const [formData, setFormData] = useState({
    departmentId: "",
    message: "We noticed you haven't submitted any ideas yet. Please contribute to our department's growth!"
  });

  const getAuthHeader = () => {
    const token = localStorage.getItem("accessToken");
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };
  };

  // FETCH DEPARTMENTS KHI MỞ MODAL
  useEffect(() => {
    if (isModalOpen && departments.length === 0) {
      fetchDepartments();
    }
  }, [isModalOpen]);

  const fetchDepartments = async () => {
    setIsLoadingDepts(true);
    try {
      const response = await fetch("http://localhost:9999/api/v1/departments", { headers: getAuthHeader() });
      if (response.ok) {
        const data = await response.json();
        if (data.code === 1000 && Array.isArray(data.result)) {
          setDepartments(data.result);
          // Tự động chọn Department đầu tiên nếu có
          if (data.result.length > 0) {
            setFormData(prev => ({ ...prev, departmentId: data.result[0].id.toString() }));
          }
        }
      }
    } catch (err) {
      console.error("Failed to load departments", err);
    } finally {
      setIsLoadingDepts(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setModalError(null);
    setModalSuccess(null);
  };

  // XỬ LÝ GỬI EMAIL ENCOURAGE
  const handleSendEncourage = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setModalError(null);
    setModalSuccess(null);

    if (!formData.departmentId) {
      setModalError("Please select a department.");
      setIsSending(false);
      return;
    }
    if (!formData.message.trim()) {
      setModalError("Message cannot be empty.");
      setIsSending(false);
      return;
    }

    try {
      const payload = {
        departmentId: parseInt(formData.departmentId),
        message: formData.message
      };

      const response = await fetch("http://localhost:9999/api/v1/mail/encourage", {
        method: "POST",
        headers: getAuthHeader(),
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Failed to send encourage emails.");
      }

      setModalSuccess("Encouragement emails have been dispatched successfully!");
      // Tự động đóng sau 2 giây
      setTimeout(() => {
        setIsModalOpen(false);
        setModalSuccess(null);
      }, 2000);

    } catch (err: any) {
      setModalError(err.message || "An error occurred while sending emails.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-12 transition-colors">
      
      {/* 1. HEADER (Violet Theme) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden border border-violet-900/30">
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600 rounded-full -mr-32 -mt-32 blur-[80px] opacity-40"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-black uppercase tracking-widest mb-4 backdrop-blur-md">
            <Building2 className="w-4 h-4" /> {t("dept_dashboard.badge") || "DEPARTMENT DASHBOARD"}
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-2">{(t("dept_dashboard.hub") || "{dept} Hub").replace("{dept}", deptStats.name)}</h1>
          <p className="text-slate-400 text-sm max-w-xl leading-relaxed">{t("dept_dashboard.desc") || "Monitor departmental idea contributions and encourage staff participation."}</p>
        </div>
        
        {/* NÚT MỞ MODAL */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="relative z-10 flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-violet-900/50 hover:-translate-y-1 shrink-0"
        >
          <BellRing className="w-5 h-5" /> {t("dept_dashboard.encourage") || "Encourage Staff"}
        </button>
      </div>

      {/* 2. DEPARTMENT STATS (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* [GIỮ NGUYÊN CODE KPI CŨ] */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-colors">
          <div className="w-14 h-14 rounded-full bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center shrink-0">
            <Users className="w-7 h-7 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{deptStats.totalStaff}</p>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-0.5">{t("dept_dashboard.total_staff") || "TOTAL STAFF"}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-colors">
          <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{deptStats.participatingStaff}</p>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-0.5">{t("dept_dashboard.participating") || "PARTICIPATING"}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-colors">
          <div className="w-14 h-14 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
            <Lightbulb className="w-7 h-7 text-amber-600 dark:text-amber-500" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{deptStats.totalIdeas}</p>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-0.5">{t("dept_dashboard.ideas_submitted") || "IDEAS SUBMITTED"}</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-violet-600 to-purple-800 dark:from-violet-700 dark:to-purple-900 p-5 rounded-2xl border border-violet-700 dark:border-violet-800 shadow-lg flex items-center gap-4 text-white transition-colors">
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center shrink-0 backdrop-blur-md">
            <TrendingUp className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-2xl font-black text-white">{deptStats.participationRate}</p>
            <p className="text-xs font-bold text-violet-200 uppercase tracking-wider mt-0.5">{t("dept_dashboard.participation_rate") || "PARTICIPATION RATE"}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3. RECENT IDEAS */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm transition-colors">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-violet-500 dark:text-violet-400" /> {t("dept_dashboard.recent_submissions") || "Recent Submissions"}
            </h3>
            <button className="text-sm font-bold text-violet-600 dark:text-violet-400 hover:text-violet-700">{t("dept_dashboard.view_all") || "View All"}</button>
          </div>

          <div className="space-y-4">
            {recentDeptIdeas.map((idea, index) => (
              <div key={index} className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:border-violet-100 dark:hover:border-violet-800/50 transition-colors group cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-800 dark:text-white group-hover:text-violet-700 dark:group-hover:text-violet-400 transition-colors">{idea.title}</h4>
                  <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest whitespace-nowrap ml-4">{idea.time}</span>
                </div>
                <div className="flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {idea.author}</span>
                  <span className="flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5 text-blue-400" /> {idea.comments}</span>
                  <span className="flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> +{idea.thumbsUp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. QUICK ACTIONS & ALERTS */}
        <div className="space-y-6">
          <div className="bg-violet-50 dark:bg-violet-900/20 rounded-3xl border border-violet-100 dark:border-violet-800/50 p-6 transition-colors">
            <h3 className="font-bold text-violet-900 dark:text-violet-300 flex items-center gap-2 mb-4">
              <Mail className="w-5 h-5 text-violet-600 dark:text-violet-400" /> {t("dept_dashboard.coord_duties") || "Coordinator Duties"}
            </h3>
            <p className="text-sm text-violet-700 dark:text-violet-400 mb-6 leading-relaxed">
              Your department's participation rate is <strong>{deptStats.participationRate}</strong>. There are still <strong>{missingStaff}</strong> staff members who haven't submitted ideas.
            </p>
            {/* NÚT MỞ MODAL (Thứ 2) */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 text-violet-700 dark:text-violet-400 font-bold rounded-xl border border-violet-200 dark:border-violet-800 hover:bg-violet-600 dark:hover:bg-violet-600 hover:text-white dark:hover:text-white hover:border-violet-600 transition-all shadow-sm"
            >
              <Mail className="w-4 h-4" /> {t("dept_dashboard.send_reminder") || "Send Mass Reminder"}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* MODAL: SEND ENCOURAGEMENT EMAIL            */}
      {/* ========================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative">
            
            {/* Loading Overlay when fetching departments */}
            {isLoadingDepts && (
              <div className="absolute inset-0 z-10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 text-violet-500 animate-spin mb-2" />
                <p className="text-xs font-bold text-violet-600 uppercase tracking-widest">Loading Departments...</p>
              </div>
            )}

            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                <BellRing className="w-5 h-5 text-violet-500" /> Encourage Staff
              </h3>
              <button 
                onClick={() => !isSending && setIsModalOpen(false)} 
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSendEncourage} className="p-6 space-y-5">
              
              {/* Error Message */}
              {modalError && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-bold flex items-start gap-2 border border-red-100 dark:border-red-800/50">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>{modalError}</p>
                </div>
              )}

              {/* Success Message */}
              {modalSuccess && (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-sm font-bold flex items-center gap-2 border border-emerald-100 dark:border-emerald-800/50">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <p>{modalSuccess}</p>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-widest">Target Department *</label>
                <select 
                  name="departmentId" 
                  value={formData.departmentId} 
                  onChange={handleInputChange} 
                  required
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-violet-500 text-slate-800 dark:text-white font-medium"
                >
                  <option value="" disabled>Select a department</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-widest">Custom Message *</label>
                <textarea 
                  name="message" 
                  value={formData.message} 
                  onChange={handleInputChange} 
                  required
                  rows={4}
                  placeholder="Enter your encouraging message here..."
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-violet-500 text-slate-800 dark:text-white font-medium resize-none"
                />
                <p className="text-xs text-slate-500 mt-2">This message will be sent to all staff members in the selected department who have 0 ideas submitted.</p>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  disabled={isSending}
                  className="px-5 py-2.5 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSending || isLoadingDepts} 
                  className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-all shadow-md flex items-center gap-2 disabled:opacity-70"
                >
                  {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {isSending ? "Sending Emails..." : "Dispatch Emails"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}