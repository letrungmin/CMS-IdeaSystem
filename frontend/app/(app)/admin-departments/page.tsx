"use client";

import React, { useState } from "react";
import { 
  Building2, Plus, Search, Edit, Trash2, 
  Users, Lightbulb, ShieldAlert, Lock, Mail,
  CheckCircle2, AlertCircle
} from "lucide-react";
// 🔥 Gọi Thông dịch viên
import { useLanguage } from "@/components/LanguageProvider";

// Mock Data for University Departments
const DEPARTMENTS_DATA = [
  { id: "DEPT-IT", name: "Information Technology", description: "Computing, Software Engineering, and Network Systems.", coordinator: { name: "John Doe", email: "john.qa@greenwich.edu.vn" }, staffCount: 45, ideaCount: 128, status: "active" },
  { id: "DEPT-BUS", name: "Business Management", description: "Marketing, Finance, Economics, and Business Administration.", coordinator: { name: "Sarah Smith", email: "sarah.qa@greenwich.edu.vn" }, staffCount: 62, ideaCount: 89, status: "active" },
  { id: "DEPT-ART", name: "Graphic Design & Art", description: "Digital Media, 3D Animation, and Visual Communication.", coordinator: null, staffCount: 28, ideaCount: 45, status: "active" },
  { id: "DEPT-LAW", name: "Faculty of Law", description: "International Law, Corporate Law, and Legal Studies.", coordinator: null, staffCount: 0, ideaCount: 0, status: "new" }
];

export default function AdminDepartmentsPage() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [departments, setDepartments] = useState(DEPARTMENTS_DATA);

  const handleDelete = (id: string, staffCount: number, ideaCount: number) => {
    if (staffCount > 0 || ideaCount > 0) {
      alert(t("admin_depts.err_delete_policy"));
      return;
    }
    if (confirm(t("admin_depts.confirm_delete"))) {
      setDepartments(departments.filter(dept => dept.id !== id));
    }
  };

  return (
    // THAY ĐỔI: max-w-6xl -> w-full px-4 sm:px-6 lg:px-8
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-12 transition-colors duration-300">
      
      {/* 1. HEADER SECTION (Admin Red/Rose Theme) */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden border border-rose-900/30">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600 rounded-full -mr-32 -mt-32 blur-[80px] opacity-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-black uppercase tracking-widest mb-4 backdrop-blur-md">
              <ShieldAlert className="w-4 h-4" /> {t("admin_years.role_badge")}
            </div>
            <h1 className="text-3xl font-black tracking-tight mb-2">{t("admin_depts.title")}</h1>
            <p className="text-slate-400 text-sm max-w-xl leading-relaxed">{t("admin_depts.desc")}</p>
          </div>
          <button className="relative z-10 flex items-center justify-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-rose-900/50 hover:-translate-y-1 shrink-0">
            <Plus className="w-5 h-5" /> {t("admin_depts.create_new")}
          </button>
        </div>
      </div>

      {/* 2. FILTER & SEARCH */}
      <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-3 transition-colors">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
          <input 
            type="text" 
            placeholder={t("admin_depts.search_placeholder")}
            className="w-full h-12 pl-12 pr-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-xl text-sm outline-none focus:border-rose-500 dark:focus:border-rose-500 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* 3. DEPARTMENTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {departments.map((dept) => {
          const isDeletable = dept.staffCount === 0 && dept.ideaCount === 0;

          return (
            <div key={dept.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all flex flex-col group relative overflow-hidden">
              
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-3 py-1 rounded-lg">
                    {dept.id}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors" title={t("admin_depts.btn_edit")}>
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(dept.id, dept.staffCount, dept.ideaCount)}
                    disabled={!isDeletable}
                    className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
                      !isDeletable 
                      ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed bg-slate-50 dark:bg-slate-800' 
                      : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30'
                    }`}
                    title={!isDeletable ? t("admin_depts.err_delete_active") : t("admin_depts.btn_delete")}
                  >
                    {!isDeletable ? <Lock className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">{dept.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-1 line-clamp-2">{dept.description}</p>

              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 mb-5">
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">{t("admin_depts.qa_assigned")}</p>
                {dept.coordinator ? (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-400 flex items-center justify-center font-bold text-xs border border-violet-200 dark:border-violet-800/50">
                      {dept.coordinator.name.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{dept.coordinator.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 truncate mt-0.5">
                        <Mail className="w-3 h-3 shrink-0" /> {dept.coordinator.email}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-xl border border-amber-100 dark:border-amber-900/50">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span className="text-xs font-bold">{t("admin_depts.qa_unassigned")}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex gap-4">
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <Users className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                    <span className="text-sm font-black">{dept.staffCount} <span className="text-xs font-medium text-slate-400 dark:text-slate-500">{t("admin_depts.staff_count")}</span></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <Lightbulb className="w-4 h-4 text-amber-400 dark:text-amber-500" />
                    <span className="text-sm font-black">{dept.ideaCount} <span className="text-xs font-medium text-slate-400 dark:text-slate-500">{t("admin_depts.idea_count")}</span></span>
                  </div>
                </div>
                
                {dept.status === "new" ? (
                  <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-md uppercase tracking-widest">{t("admin_depts.status_new")}</span>
                ) : (
                  <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 rounded-md uppercase tracking-widest flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {t("admin_depts.status_active")}
                  </span>
                )}
              </div>
              
            </div>
          );
        })}
      </div>

    </div>
  );
}