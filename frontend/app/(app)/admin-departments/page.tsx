"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { Plus, Building2, User, Edit, Trash2, Loader2, AlertCircle, X } from "lucide-react";

export default function AdminDepartmentsPage() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  
  // State for Departments List
  const [departments, setDepartments] = useState<any[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // State for Create Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // State for QA Managers dropdown
  const [qaUsers, setQaUsers] = useState<any[]>([]);
  const [isLoadingQaUsers, setIsLoadingQaUsers] = useState(false);

  // Giữ nguyên qaCoordinatorId theo payload Postman yêu cầu
  const [formData, setFormData] = useState({
    name: "",
    qaCoordinatorId: "" 
  });

  const getAuthHeader = () => {
    const token = localStorage.getItem("accessToken");
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };
  };

  const fetchDepartments = async () => {
    setIsLoadingList(true);
    setFetchError(null);
    try {
      const response = await fetch("http://localhost:9999/api/v1/departments", { headers: getAuthHeader() });
      if (!response.ok) throw new Error(`API Error ${response.status}: Failed to load departments.`);
      
      const data = await response.json();
      const deptsList = data.result || data.content || data.data || data || [];
      setDepartments(Array.isArray(deptsList) ? deptsList : []);
    } catch (err: any) {
      setFetchError(err.message || "Failed to fetch departments from server.");
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (isModalOpen && qaUsers.length === 0) {
      fetchQaUsers();
    }
  }, [isModalOpen]);

  // THẦN ĐÃ SỬA LẠI HÀM NÀY: Dùng API mới và lấy data từ result.content
  const fetchQaUsers = async () => {
    setIsLoadingQaUsers(true);
    try {
      const response = await fetch("http://localhost:9999/api/v1/auth/qa-managers/available", { headers: getAuthHeader() });
      if (response.ok) {
        const data = await response.json();
        // Cấu trúc API mới trả về list user ở data.result.content
        if (data.code === 1000 && data.result && Array.isArray(data.result.content)) {
          setQaUsers(data.result.content);
        } else {
          setQaUsers([]);
        }
      }
    } catch (err) {
      console.error("Failed to load QA Managers", err);
    } finally {
      setIsLoadingQaUsers(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (submitError) setSubmitError(null);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    if (!formData.name.trim()) {
      setSubmitError("Department name cannot be empty.");
      setIsSubmitting(false);
      return;
    }

    try {
      const payload: any = {
        name: formData.name
      };

      if (formData.qaCoordinatorId && formData.qaCoordinatorId.trim() !== "") {
        payload.qaCoordinatorId = parseInt(formData.qaCoordinatorId);
      }

      const response = await fetch("http://localhost:9999/api/v1/departments", {
        method: "POST",
        headers: getAuthHeader(),
        body: JSON.stringify(payload)
      });

      const responseText = await response.text();
      let resData;
      try { resData = JSON.parse(responseText); } catch(e) {}

      if (!response.ok) {
        throw new Error(resData?.message || resData?.error || `Server Error ${response.status}: Failed to create department.`);
      }

      if (resData && resData.code && resData.code !== 1000) {
        throw new Error(resData.message || "Failed by server internal rule.");
      }

      setIsModalOpen(false);
      setFormData({ name: "", qaCoordinatorId: "" });
      fetchDepartments();

    } catch (err: any) {
      setSubmitError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-12 transition-colors duration-300">
      
      {/* HEADER */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden border border-rose-900/30">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600 rounded-full -mr-32 -mt-32 blur-[80px] opacity-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-black uppercase tracking-widest mb-4 backdrop-blur-md">
              <Building2 className="w-4 h-4" /> ADMINISTRATOR
            </div>
            <h1 className="text-3xl font-black tracking-tight mb-2">Departments Management</h1>
            <p className="text-slate-400 text-sm max-w-xl leading-relaxed">Create and manage university departments and assign QA Managers.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="relative z-10 flex items-center justify-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-rose-900/50 hover:-translate-y-1 shrink-0"
          >
            <Plus className="w-5 h-5" /> CREATE DEPARTMENT
          </button>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-3 transition-colors">
        <div className="relative flex-1">
          <input 
            type="text" 
            placeholder="Search departments..."
            className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-xl text-sm outline-none focus:border-rose-500 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* DEPARTMENTS TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <div className="overflow-x-auto custom-scrollbar relative min-h-[200px]">
          
          {isLoadingList ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-slate-900/80 z-10 text-slate-400">
              <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="font-bold text-sm tracking-widest uppercase animate-pulse">Loading Departments...</p>
            </div>
          ) : fetchError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-slate-900 z-10 p-6 text-center">
              <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
              <p className="font-bold text-red-600 dark:text-red-400 text-lg mb-2">ERROR FETCHING DATA</p>
              <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md">{fetchError}</p>
            </div>
          ) : departments.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-slate-900 z-10 text-slate-400">
              <p className="font-bold text-sm tracking-widest uppercase">NO DEPARTMENTS FOUND</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse relative z-0">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 transition-colors">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">ID</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">DEPARTMENT NAME</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">QA MANAGER</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {departments.filter(dept => dept.name.toLowerCase().includes(searchTerm.toLowerCase())).map((dept) => (
                  <tr key={dept.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="px-6 py-4 font-bold text-slate-500">#{dept.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-800/50 shrink-0">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <p className="font-bold text-slate-900 dark:text-white text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{dept.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {dept.qaName ? (
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-slate-400" />
                          <div>
                            <p className="font-bold text-sm text-slate-800 dark:text-slate-200">
                              {dept.qaName.firstName ? `${dept.qaName.firstName} ${dept.qaName.lastName}` : dept.qaName.username}
                            </p>
                            <p className="text-xs text-slate-500">{dept.qaName.email}</p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">UNASSIGNED</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative">
            
            {isLoadingQaUsers && (
              <div className="absolute inset-0 z-10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 text-rose-500 animate-spin mb-2" />
                <p className="text-xs font-bold text-rose-600 uppercase tracking-widest">Loading QA Managers...</p>
              </div>
            )}

            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Create Department</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-5">
              {submitError && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-bold flex items-start gap-2 border border-red-100 dark:border-red-800/50">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>{submitError}</p>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-widest">Department Name *</label>
                <input 
                  type="text" name="name" required value={formData.name} onChange={handleInputChange} 
                  placeholder="e.g. IT Department"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-rose-500 text-slate-800 dark:text-white font-bold" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-widest">Assign QA Manager (Optional)</label>
                <select 
                  name="qaCoordinatorId" value={formData.qaCoordinatorId} onChange={handleInputChange} 
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-rose-500 text-slate-800 dark:text-white font-medium"
                >
                  <option value="">-- No QA Assigned --</option>
                  {qaUsers.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.username} {user.email ? `(${user.email})` : ''}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 mt-2">Only available QA Managers are listed here.</p>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors uppercase">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting || isLoadingQaUsers} className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-all shadow-md flex items-center gap-2 disabled:opacity-70 uppercase tracking-wide">
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isSubmitting ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}