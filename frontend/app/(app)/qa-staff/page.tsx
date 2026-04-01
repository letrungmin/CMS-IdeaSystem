"use client";

import React, { useState } from "react";
import { Users, Search, Filter, Mail, MoreVertical, CheckCircle2, Building2 } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

const STUDENTS_DATA = [
  { id: "STU-001", name: "Trung Min", email: "trungmin@student.greenwich.edu.vn", department: "IT Department", status: "Active", ideas: 12 },
  { id: "STU-002", name: "Alex Nguyen", email: "alex.n@student.greenwich.edu.vn", department: "Business Management", status: "Active", ideas: 5 },
  { id: "STU-003", name: "Sarah Le", email: "sarah.l@student.greenwich.edu.vn", department: "Graphic Design", status: "Inactive", ideas: 0 },
  { id: "STU-004", name: "David Tran", email: "david.t@student.greenwich.edu.vn", department: "IT Department", status: "Active", ideas: 24 },
  { id: "STU-005", name: "Emma Pham", email: "emma.p@student.greenwich.edu.vn", department: "Media & Comms", status: "Active", ideas: 8 },
];

export default function StudentDirectoryPage() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-12 transition-colors">
      
      {/* HEADER */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-end gap-6 transition-colors">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold border border-blue-100 dark:border-blue-800/50 mb-4">
            <Users className="w-4 h-4" /> {t("qa_staff.badge")}
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">{t("qa_staff.title")}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-lg">{t("qa_staff.desc")}</p>
        </div>
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 p-2 rounded-2xl border border-slate-200 dark:border-slate-700 shrink-0 transition-colors">
          <div className="px-4 py-2 text-center">
            <p className="text-2xl font-black text-slate-800 dark:text-white">1,204</p>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t("qa_staff.total_students")}</p>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-3 transition-colors">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
          <input 
            type="text" 
            placeholder={t("qa_staff.search_placeholder")}
            className="w-full h-12 pl-12 pr-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-blue-500 dark:focus:border-blue-500 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <select className="h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 outline-none focus:border-blue-500 transition-colors cursor-pointer">
            <option>{t("qa_staff.all_depts")}</option>
            <option>IT Department</option>
            <option>Business Management</option>
          </select>
          <button className="h-12 px-6 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-2 font-bold text-sm shrink-0">
            <Filter className="w-4 h-4" /> {t("qa_staff.sort")}
          </button>
        </div>
      </div>

      {/* TABLE DATA */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 transition-colors">
                <th className="px-6 py-4 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t("qa_staff.th_student")}</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t("qa_staff.th_dept")}</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t("qa_staff.th_status")}</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">{t("qa_staff.th_contributions")}</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">{t("qa_staff.th_actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {STUDENTS_DATA.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer">{student.name}</p>
                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                          <Mail className="w-3 h-3" /> {student.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                      <Building2 className="w-4 h-4 text-slate-400 dark:text-slate-500" /> {student.department}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {student.status === "Active" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-100 dark:border-emerald-800/50">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {t("qa_staff.status_active")}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold border border-slate-200 dark:border-slate-700">
                        {t("qa_staff.status_inactive")}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black text-sm rounded-lg border border-slate-200 dark:border-slate-700">
                      {student.ideas}
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
        </div>
        
        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row items-center justify-between text-sm transition-colors gap-4">
          <span className="text-slate-500 dark:text-slate-400 font-medium">
            {t("qa_staff.showing").replace("{start}", "1").replace("{end}", "5").replace("{total}", "1,204")}
          </span>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">{t("common.previous")}</button>
            <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">{t("common.next")}</button>
          </div>
        </div>
      </div>

    </div>
  );
}