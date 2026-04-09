"use client";

import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, Calendar, Plus, Edit, 
  Trash2, AlertCircle, CheckCircle2, Clock,
  CalendarDays, Settings, X, Loader2, Power
} from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

interface AcademicYear {
  id: number;
  name: string;
  ideaClosureDate: string;
  finalClosureDate: string;
  status: string;
  isActive: boolean;
}

const formatDateDisplay = (dateString: string) => {
  if (!dateString || dateString === "N/A") return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

export default function AdminAcademicYearsPage() {
  const { t } = useLanguage();
  const [years, setYears] = useState<AcademicYear[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedYearId, setSelectedYearId] = useState<number | null>(null);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [yearToDelete, setYearToDelete] = useState<number | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    ideaClosureDate: "",
    finalClosureDate: "",
    active: true
  });

  const getAuthHeader = () => {
    const token = localStorage.getItem("accessToken");
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };
  };

  const handleApiError = async (response: Response) => {
    let errorMessage = `System Error: ${response.status}`;
    if (response.status === 403) {
      errorMessage = "Access Denied. Administrator privileges required.";
    } else {
      try {
        const errData = await response.json();
        errorMessage = errData.message || errData.error || errorMessage;
      } catch (e) {}
    }
    throw new Error(errorMessage);
  };

  const fetchAcademicYears = async () => {
    setIsFetching(true);
    try {
      const response = await fetch(`http://localhost:9999/api/v1/academic-years?_t=${new Date().getTime()}`, {
        headers: getAuthHeader()
      });
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      const fetchedYears = data.result || [];
      
      if (Array.isArray(fetchedYears)) {
        const now = new Date();
        const mappedYears = fetchedYears.map(y => {
          let currentStatus = "past";
          if (y.active) {
            currentStatus = "active";
          } else {
            const finalDate = new Date(y.finalClosureDate);
            if (finalDate > now) {
              currentStatus = "upcoming";
            }
          }
          return {
            id: y.id,
            name: y.name,
            ideaClosureDate: y.ideaClosureDate || "N/A",
            finalClosureDate: y.finalClosureDate || "N/A",
            status: currentStatus,
            isActive: y.active
          };
        });
        mappedYears.sort((a, b) => b.id - a.id);
        setYears(mappedYears);
      }
    } catch (err) {
      setYears([]);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchAcademicYears();
  }, []);

  const activeYear = years.find(y => y.isActive);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    if (error) setError(null);
  };

  const openCreateModal = () => {
    setModalMode("create");
    setFormData({ name: "", ideaClosureDate: "", finalClosureDate: "", active: true });
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (year: AcademicYear) => {
    setModalMode("edit");
    setSelectedYearId(year.id);
    setFormData({
      name: year.name,
      ideaClosureDate: year.ideaClosureDate !== "N/A" ? year.ideaClosureDate.substring(0, 16) : "",
      finalClosureDate: year.finalClosureDate !== "N/A" ? year.finalClosureDate.substring(0, 16) : "",
      active: year.isActive
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const payload = {
        name: formData.name,
        ideaClosureDate: formData.ideaClosureDate,
        finalClosureDate: formData.finalClosureDate,
        active: formData.active
      };
      const url = modalMode === "create" ? "http://localhost:9999/api/v1/academic-years" : `http://localhost:9999/api/v1/academic-years/${selectedYearId}`;
      const method = modalMode === "create" ? "POST" : "PUT";
      const response = await fetch(url, {
        method,
        headers: getAuthHeader(),
        body: JSON.stringify(payload)
      });
      if (!response.ok) await handleApiError(response);
      await fetchAcademicYears();
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message || "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (id: number, currentActive: boolean) => {
    setTogglingId(id);
    try {
      const response = await fetch(`http://localhost:9999/api/v1/academic-years/${id}?active=${!currentActive}`, {
        method: "PATCH",
        headers: getAuthHeader()
      });
      if (!response.ok) await handleApiError(response);
      await fetchAcademicYears();
    } catch (err: any) {
      alert(`Action failed: ${err.message}`);
    } finally {
      setTogglingId(null);
    }
  };

  const confirmDelete = async () => {
    if (!yearToDelete) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`http://localhost:9999/api/v1/academic-years/${yearToDelete}`, {
        method: "DELETE",
        headers: getAuthHeader()
      });
      if (!response.ok) await handleApiError(response);
      await fetchAcademicYears();
      setIsDeleteModalOpen(false);
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
      setYearToDelete(null);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-12 transition-colors duration-300">
      <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden border border-rose-900/30">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600 rounded-full -mr-32 -mt-32 blur-[80px] opacity-30"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-widest mb-4 backdrop-blur-md">
              <ShieldAlert className="w-4 h-4" /> System Administrator
            </div>
            <h1 className="text-3xl font-black tracking-tight mb-2">Academic Year Management</h1>
            <p className="text-slate-400 text-sm max-w-xl leading-relaxed">Define system-wide deadlines and active sessions for idea submissions.</p>
          </div>
          <button onClick={openCreateModal} className="relative z-10 flex items-center justify-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-rose-900/50 hover:-translate-y-1 shrink-0">
            <Plus className="w-5 h-5" /> Create New Year
          </button>
        </div>
      </div>

      {isFetching ? (
        <div className="flex justify-center items-center py-20"><Loader2 className="w-10 h-10 animate-spin text-rose-500" /></div>
      ) : (
        <>
          {activeYear && (
            <div className="bg-gradient-to-br from-white to-rose-50 dark:from-slate-900 dark:to-rose-900/10 p-1 rounded-3xl shadow-lg border border-rose-100 dark:border-rose-900/30 transition-colors">
              <div className="bg-white dark:bg-slate-900 rounded-[1.4rem] p-6 lg:p-8 flex flex-col lg:flex-row gap-8 items-center relative overflow-hidden transition-colors">
                <div className="flex items-center gap-6 w-full lg:w-1/3 shrink-0 lg:border-r border-slate-100 dark:border-slate-800 pr-6">
                  <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 shadow-inner"><CalendarDays className="w-8 h-8" /></div>
                  <div>
                    <p className="text-[10px] font-black text-rose-500 dark:text-rose-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span> Currently Active
                    </p>
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white leading-tight">{activeYear.name}</h2>
                  </div>
                </div>
                <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <p className="text-xs font-bold text-slate-500 flex items-center gap-2 mb-2"><AlertCircle className="w-4 h-4 text-amber-500" /> Idea Closure</p>
                    <p className="text-xl font-black text-slate-900 dark:text-white">{formatDateDisplay(activeYear.ideaClosureDate)}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 border-l-4 border-l-rose-500">
                    <p className="text-xs font-bold text-slate-500 flex items-center gap-2 mb-2"><ShieldAlert className="w-4 h-4 text-rose-500" /> Final Closure</p>
                    <p className="text-xl font-black text-slate-900 dark:text-white">{formatDateDisplay(activeYear.finalClosureDate)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2"><Settings className="w-5 h-5 text-slate-400" /> Academic Years History</h3>
            </div>
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 transition-colors">
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Year Name</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Duration & Deadlines</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Current Status</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {years.map((year) => (
                    <tr key={year.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4"><p className="font-bold text-slate-900 dark:text-white">{year.name}</p><p className="text-xs text-slate-500 mt-0.5">ID: {year.id}</p></td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1 text-xs font-medium text-slate-600 dark:text-slate-300">
                          <div className="flex items-center gap-2"><span className="w-20 text-slate-400">Idea Closure:</span> {formatDateDisplay(year.ideaClosureDate)}</div>
                          <div className="flex items-center gap-2"><span className="w-20 text-slate-400">Final Closure:</span> {formatDateDisplay(year.finalClosureDate)}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {year.status === "active" ? <span className="px-2.5 py-1 rounded-md bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest border border-rose-100">Active</span> :
                         year.status === "upcoming" ? <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest border border-blue-100">Upcoming</span> :
                         <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest border border-slate-200">Concluded</span>}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 items-center">
                          <button onClick={() => openEditModal(year)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => { setYearToDelete(year.id); setIsDeleteModalOpen(true); }} disabled={year.isActive} className={`p-2 rounded-lg ${year.isActive ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-red-600'}`}><Trash2 className="w-4 h-4" /></button>
                          <button onClick={() => handleToggleActive(year.id, year.isActive)} disabled={togglingId === year.id} className={`p-2 rounded-lg border ${year.isActive ? 'border-amber-200 text-amber-600 bg-amber-50' : 'border-emerald-200 text-emerald-600 bg-emerald-50'}`}>{togglingId === year.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Power className="w-4 h-4" />}</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-black text-slate-800 dark:text-white">{modalMode === "create" ? "Create Academic Year" : "Edit Academic Year"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleFormSubmit} className="p-6 space-y-5">
              {error && <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm font-bold flex items-start gap-3 border border-red-100"><AlertCircle className="w-5 h-5" /><p>{error}</p></div>}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-widest">Academic Year Name</label>
                <input type="text" name="name" required value={formData.name} onChange={handleInputChange} placeholder="e.g. 2025-2026" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-xl outline-none focus:border-rose-500 font-bold" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-widest">Idea Closure (Date & Time)</label>
                <input type="datetime-local" name="ideaClosureDate" required value={formData.ideaClosureDate} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-xl outline-none focus:border-rose-500 font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-widest">Final Closure (Date & Time)</label>
                <input type="datetime-local" name="finalClosureDate" required value={formData.finalClosureDate} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-xl outline-none focus:border-rose-500 font-medium" />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <input type="checkbox" name="active" id="active" checked={formData.active} onChange={handleInputChange} className="w-5 h-5 rounded border-slate-300 text-rose-600" />
                <label htmlFor="active" className="text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer">Set as Active Academic Year</label>
              </div>
              <div className="pt-4 flex items-center justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md flex items-center gap-2">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null} {modalMode === "create" ? "Create" : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 className="w-8 h-8" /></div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Delete Academic Year?</h3>
            <p className="text-slate-500 mb-8 font-medium">This action cannot be undone. Are you sure you want to delete this record?</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setIsDeleteModalOpen(false)} className="px-6 py-3 font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
              <button onClick={confirmDelete} disabled={isSubmitting} className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl flex items-center gap-2">{isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}