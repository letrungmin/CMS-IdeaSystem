"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, Search, Filter, Mail, MoreVertical, 
  CheckCircle2, Building2, Loader2, AlertCircle, 
  BellRing, X, Send 
} from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export default function QaStaffDirectoryPage() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  
  // --- STATE DỮ LIỆU TỪ API ---
  const [staffs, setStaffs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- STATE CHO MODAL ENCOURAGE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [encourageMessage, setEncourageMessage] = useState("We noticed you haven't submitted any ideas recently. Please contribute to our department's growth! Ban account đó nhaaaaaa!");
  const [isSending, setIsSending] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [modalSuccess, setModalSuccess] = useState<string | null>(null);

  const getAuthHeader = () => {
    const token = localStorage.getItem("accessToken");
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };
  };

  const fetchStaffs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:9999/api/v1/auth/qa-manager/users", {
        headers: getAuthHeader()
      });

      if (!response.ok) {
        throw new Error(`System Error: ${response.status}`);
      }

      const data = await response.json();
      
      const rawList = data.result?.content || data.result || data.content || data || [];
      const usersList = Array.isArray(rawList) ? rawList : [];
      
      // BỘ LỌC THÉP: Chỉ lấy những User có Role là "ROLE_STAFF" hoặc "STAFF"
      const onlyStaffs = usersList.filter((user: any) => {
        if (!user.roles || !Array.isArray(user.roles)) return false;
        return user.roles.some((role: string) => role === "ROLE_STAFF" || role === "STAFF");
      });

      setStaffs(onlyStaffs);
    } catch (err: any) {
      setError(err.message || "Failed to load staff directory.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffs();
  }, []);

  // --- HÀM XỬ LÝ GỬI EMAIL ENCOURAGE ---
  const handleSendEncourage = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setModalError(null);
    setModalSuccess(null);

    if (!encourageMessage.trim()) {
      setModalError("Message cannot be empty.");
      setIsSending(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:9999/api/v1/mail/encourage/my-department", {
        method: "POST",
        headers: getAuthHeader(),
        body: JSON.stringify({ message: encourageMessage })
      });

      if (!response.ok) {
        throw new Error("Failed to send encourage emails. Please try again.");
      }

      setModalSuccess("Encouragement emails have been dispatched successfully to all department staff!");
      
      // Tự động đóng Modal sau 2 giây
      setTimeout(() => {
        setIsModalOpen(false);
        setModalSuccess(null);
        // Reset lại message mặc định nếu muốn
      }, 2000);

    } catch (err: any) {
      setModalError(err.message || "An error occurred while sending emails.");
    } finally {
      setIsSending(false);
    }
  };

  // Lọc danh sách theo từ khóa tìm kiếm
  const filteredStaffs = staffs.filter(staff => 
    (staff.username || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
    (staff.email || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-12 transition-colors relative">
      
      {/* HEADER */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-colors">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold border border-blue-100 dark:border-blue-800/50 mb-4">
            <Users className="w-4 h-4" /> USER MANAGEMENT
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
            Staff Directory
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-lg">
            Monitor staff accounts, view their department affiliations, and track their contributions to the platform.
          </p>
        </div>
        
        {/* NÚT ENCOURAGE VÀ KHỐI THỐNG KÊ */}
        <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-500/30 hover:-translate-y-1"
          >
            <BellRing className="w-5 h-5 animate-pulse" /> Encourage Dept Staff
          </button>
          
          <div className="w-full sm:w-auto flex items-center justify-center gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 transition-colors">
            <div className="px-4 py-1 text-center">
              <p className="text-2xl font-black text-slate-800 dark:text-white">
                {isLoading ? "-" : staffs.length}
              </p>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">
                TOTAL STAFF
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-3 transition-colors">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
          <input 
            type="text" 
            placeholder="Search by staff name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 pl-12 pr-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-blue-500 dark:focus:border-blue-500 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <select className="h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 outline-none focus:border-blue-500 transition-colors cursor-pointer">
            <option>All Departments</option>
            <option>IT Department</option>
            <option>Business Department</option>
            <option>HR Department</option>
          </select>
          <button className="h-12 px-6 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-2 font-bold text-sm shrink-0">
            <Filter className="w-4 h-4" /> Sort
          </button>
        </div>
      </div>

      {/* TABLE DATA */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <div className="overflow-x-auto custom-scrollbar relative min-h-[300px]">
          
          {isLoading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-slate-900/80 z-10 text-slate-400">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
              <p className="font-bold text-sm tracking-widest uppercase animate-pulse">Loading Staff Data...</p>
            </div>
          ) : error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-slate-900 z-10 p-6 text-center">
              <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
              <p className="font-bold text-red-600 dark:text-red-400 text-lg mb-2">ERROR FETCHING DATA</p>
              <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md">{error}</p>
            </div>
          ) : filteredStaffs.length === 0 ? (
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-slate-900 z-10 text-slate-400">
              <p className="font-bold text-sm tracking-widest uppercase">NO STAFF FOUND</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 transition-colors">
                  <th className="px-6 py-4 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">STAFF MEMBER</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">DEPARTMENT</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">STATUS</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">CONTRIBUTIONS</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredStaffs.map((staff) => (
                  <tr key={staff.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {staff.avatarUrl && !staff.avatarUrl.includes("default") ? (
                           <img 
                              src={`http://localhost:9999${staff.avatarUrl}`} 
                              alt="Avatar" 
                              className="w-10 h-10 rounded-full object-cover shadow-sm border border-slate-200 dark:border-slate-700"
                              onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${staff.username}`; }}
                           />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                            {staff.username ? staff.username.charAt(0).toUpperCase() : "U"}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer">
                            {staff.username}
                          </p>
                          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                            <Mail className="w-3 h-3" /> {staff.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                        <Building2 className="w-4 h-4 text-slate-400 dark:text-slate-500" /> 
                        {staff.departmentName || "Unassigned"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-100 dark:border-emerald-800/50">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-800 text-blue-700 dark:text-blue-400 font-black text-sm rounded-lg border border-slate-200 dark:border-slate-700">
                        {staff.approvedIdeaCount !== undefined ? staff.approvedIdeaCount : (staff.ideaCount || 0)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-slate-400 dark:text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Pagination Footer */}
        {!isLoading && !error && filteredStaffs.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row items-center justify-between text-sm transition-colors gap-4">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Showing {filteredStaffs.length} out of {staffs.length} staff members
            </span>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Previous</button>
              <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Next</button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================== */}
      {/* MODAL: SEND ENCOURAGEMENT EMAIL            */}
      {/* ========================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative">
            
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                <BellRing className="w-5 h-5 text-blue-500" /> Encourage Department
              </h3>
              <button 
                onClick={() => !isSending && setIsModalOpen(false)} 
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSendEncourage} className="p-6 space-y-5">
              
              {/* Cảnh báo / Thông báo lỗi */}
              {modalError && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-bold flex items-start gap-2 border border-red-100 dark:border-red-800/50">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>{modalError}</p>
                </div>
              )}

              {/* Thông báo thành công */}
              {modalSuccess && (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-sm font-bold flex items-center gap-2 border border-emerald-100 dark:border-emerald-800/50">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <p>{modalSuccess}</p>
                </div>
              )}

              <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30 mb-4">
                <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">
                  This action will send a mass email to <strong>all staff members</strong> within your currently assigned department.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-widest">Custom Message *</label>
                <textarea 
                  value={encourageMessage} 
                  onChange={(e) => {
                    setEncourageMessage(e.target.value);
                    setModalError(null);
                    setModalSuccess(null);
                  }} 
                  required
                  rows={4}
                  placeholder="Enter your encouraging message here..."
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-blue-500 text-slate-800 dark:text-white font-medium resize-none transition-colors"
                />
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
                  disabled={isSending} 
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md flex items-center gap-2 disabled:opacity-70"
                >
                  {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {isSending ? "Dispatching..." : "Send Mass Email"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}