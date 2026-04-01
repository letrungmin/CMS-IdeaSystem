"use client";

import React, { useState } from "react";
import { 
  ShieldAlert, Users, Plus, Search, Filter, 
  MoreVertical, Mail, Key, Shield, Building2, Trash2
} from "lucide-react";
// 🔥 Gọi Thông dịch viên
import { useLanguage } from "@/components/LanguageProvider";

// Mock Data representing all system users
const SYSTEM_ACCOUNTS = [
  { id: "ACC-001", name: "System Admin", email: "admin@greenwich.edu.vn", role: "ROLE_ADMIN", department: "University Board", status: "Active" },
  { id: "ACC-002", name: "QA Master", email: "qamanager@greenwich.edu.vn", role: "ROLE_QA_MANAGER", department: "Quality Assurance", status: "Active" },
  { id: "ACC-003", name: "John Doe", email: "john.qa@greenwich.edu.vn", role: "ROLE_QA_COORDINATOR", department: "IT Department", status: "Active" },
  { id: "ACC-004", name: "Sarah Smith", email: "sarah.qa@greenwich.edu.vn", role: "ROLE_QA_COORDINATOR", department: "Business", status: "Active" },
  { id: "ACC-005", name: "Trung Min", email: "trungmin@student.greenwich.edu.vn", role: "ROLE_STAFF", department: "IT Department", status: "Active" },
];

export default function AdminAccountsPage() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");

  const getRoleBadge = (role: string) => {
    switch(role) {
      case "ROLE_ADMIN":
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 text-[10px] font-black uppercase tracking-widest border border-rose-200 dark:border-rose-800/50"><Shield className="w-3 h-3" /> {t("admin_accounts.role_admin")}</span>;
      case "ROLE_QA_MANAGER":
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-200 dark:border-emerald-800/50"><ShieldAlert className="w-3 h-3" /> {t("admin_accounts.role_qa_manager")}</span>;
      case "ROLE_QA_COORDINATOR":
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 text-[10px] font-black uppercase tracking-widest border border-violet-200 dark:border-violet-800/50"><Users className="w-3 h-3" /> {t("admin_accounts.role_qa_coord")}</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-200 dark:border-blue-800/50">{t("admin_accounts.role_staff")}</span>;
    }
  };

  return (
    // THAY ĐỔI: max-w-6xl -> w-full px-4 sm:px-6 lg:px-8
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-12 transition-colors duration-300">
      
      {/* 1. HEADER SECTION (Giữ nguyên tông Đỏ uy quyền của Admin) */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden border border-rose-900/30">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600 rounded-full -mr-32 -mt-32 blur-[80px] opacity-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-black uppercase tracking-widest mb-4 backdrop-blur-md">
              <Shield className="w-4 h-4" /> {t("admin_accounts.role_badge")}
            </div>
            <h1 className="text-3xl font-black tracking-tight mb-2">{t("admin_accounts.title")}</h1>
            <p className="text-slate-400 text-sm max-w-xl leading-relaxed">{t("admin_accounts.desc")}</p>
          </div>
          <button className="relative z-10 flex items-center justify-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-rose-900/50 hover:-translate-y-1 shrink-0">
            <Plus className="w-5 h-5" /> {t("admin_accounts.provision")}
          </button>
        </div>
      </div>

      {/* 2. FILTER & SEARCH */}
      <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-3 transition-colors">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
          <input 
            type="text" 
            placeholder={t("admin_accounts.search_placeholder")}
            className="w-full h-12 pl-12 pr-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-xl text-sm outline-none focus:border-rose-500 dark:focus:border-rose-500 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <select className="h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 outline-none focus:border-rose-500 dark:focus:border-rose-500 transition-colors cursor-pointer">
            <option>{t("admin_accounts.all_roles")}</option>
            <option>{t("admin_accounts.qa_manager")}</option>
            <option>{t("admin_accounts.qa_coordinator")}</option>
            <option>{t("admin_accounts.staff_student")}</option>
          </select>
          <button className="h-12 px-6 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-2 font-bold text-sm shrink-0">
            <Filter className="w-4 h-4" /> {t("admin_accounts.filter")}
          </button>
        </div>
      </div>

      {/* 3. ACCOUNT LIST TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 transition-colors">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t("admin_accounts.th_user")}</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t("admin_accounts.th_role")}</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t("admin_accounts.th_dept")}</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">{t("admin_accounts.th_actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {SYSTEM_ACCOUNTS.map((account) => (
                <tr key={account.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                  
                  {/* USER INFO */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center font-black text-sm border border-slate-200 dark:border-slate-700">
                        {account.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">{account.name}</p>
                        <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                          <Mail className="w-3 h-3" /> {account.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* ROLE BADGE */}
                  <td className="px-6 py-4">
                    {getRoleBadge(account.role)}
                  </td>

                  {/* DEPARTMENT */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                      <Building2 className="w-4 h-4 text-slate-400 dark:text-slate-500" /> {account.department}
                    </div>
                  </td>

                  {/* ACTIONS */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 rounded-lg transition-colors" title={t("admin_accounts.btn_reset_pwd")}>
                        <Key className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400 rounded-lg transition-colors" title={t("admin_accounts.btn_edit_perms")}>
                        <ShieldAlert className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 dark:hover:text-red-400 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed" title={t("admin_accounts.btn_delete")} disabled={account.role === "ROLE_ADMIN"}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {/* Fallback icon for mobile when hover doesn't work well */}
                    <div className="flex lg:hidden justify-end">
                      <MoreVertical className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row items-center justify-between text-sm gap-4 transition-colors">
          <span className="text-slate-500 dark:text-slate-400 font-medium">{t("admin_accounts.showing")} (1-5)</span>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">{t("common.previous")}</button>
            <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">{t("common.next")}</button>
          </div>
        </div>
      </div>

    </div>
  );
}