"use client";

import React, { useState } from "react";
import { 
  ShieldAlert, Users, Plus, Search, Filter, 
  MoreVertical, Mail, Key, Shield, Building2, Trash2
} from "lucide-react";

// Mock Data representing all system users
const SYSTEM_ACCOUNTS = [
  { id: "ACC-001", name: "System Admin", email: "admin@greenwich.edu.vn", role: "ROLE_ADMIN", department: "University Board", status: "Active" },
  { id: "ACC-002", name: "QA Master", email: "qamanager@greenwich.edu.vn", role: "ROLE_QA_MANAGER", department: "Quality Assurance", status: "Active" },
  { id: "ACC-003", name: "John Doe", email: "john.qa@greenwich.edu.vn", role: "ROLE_QA_COORDINATOR", department: "IT Department", status: "Active" },
  { id: "ACC-004", name: "Sarah Smith", email: "sarah.qa@greenwich.edu.vn", role: "ROLE_QA_COORDINATOR", department: "Business", status: "Active" },
  { id: "ACC-005", name: "Trung Min", email: "trungmin@student.greenwich.edu.vn", role: "ROLE_STAFF", department: "IT Department", status: "Active" },
];

export default function AdminAccountsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const getRoleBadge = (role: string) => {
    switch(role) {
      case "ROLE_ADMIN":
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-100 text-rose-700 text-[10px] font-black uppercase tracking-widest border border-rose-200"><Shield className="w-3 h-3" /> Admin</span>;
      case "ROLE_QA_MANAGER":
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest border border-emerald-200"><ShieldAlert className="w-3 h-3" /> QA Manager</span>;
      case "ROLE_QA_COORDINATOR":
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-violet-100 text-violet-700 text-[10px] font-black uppercase tracking-widest border border-violet-200"><Users className="w-3 h-3" /> QA Coord</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest border border-blue-200">Staff / Student</span>;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 pb-12">
      
      {/* 1. HEADER SECTION */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden border border-rose-900/30">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600 rounded-full -mr-32 -mt-32 blur-[80px] opacity-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-black uppercase tracking-widest mb-4 backdrop-blur-md">
              <Shield className="w-4 h-4" /> System Administrator
            </div>
            <h1 className="text-3xl font-black tracking-tight mb-2">Account Management</h1>
            <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
              Provision and manage all user accounts across the platform. Assign roles (QA Manager, QA Coordinator, Staff) to control system access and permissions.
            </p>
          </div>
          <button className="relative z-10 flex items-center justify-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-rose-900/50 hover:-translate-y-1 shrink-0">
            <Plus className="w-5 h-5" /> Provision Account
          </button>
        </div>
      </div>

      {/* 2. FILTER & SEARCH */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name, email, or ID..." 
            className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-rose-500 transition-colors"
          />
        </div>
        <div className="flex gap-3">
          <select className="h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 outline-none focus:border-rose-500">
            <option>All Roles</option>
            <option>QA Manager</option>
            <option>QA Coordinator</option>
            <option>Staff / Student</option>
          </select>
          <button className="h-12 px-6 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors flex items-center gap-2 font-bold text-sm shrink-0">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      {/* 3. ACCOUNT LIST TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">User Details</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">System Role</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Department</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {SYSTEM_ACCOUNTS.map((account) => (
                <tr key={account.id} className="hover:bg-slate-50/50 transition-colors group">
                  
                  {/* USER INFO */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-black text-sm border border-slate-200">
                        {account.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm group-hover:text-rose-600 transition-colors">{account.name}</p>
                        <div className="flex items-center gap-1 text-slate-500 text-xs mt-0.5">
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
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                      <Building2 className="w-4 h-4 text-slate-400" /> {account.department}
                    </div>
                  </td>

                  {/* ACTIONS */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Reset Password">
                        <Key className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Edit Permissions">
                        <ShieldAlert className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Account" disabled={account.role === "ROLE_ADMIN"}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {/* Fallback icon for mobile when hover doesn't work well */}
                    <div className="flex lg:hidden justify-end">
                      <MoreVertical className="w-5 h-5 text-slate-400" />
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-sm">
          <span className="text-slate-500 font-medium">Showing System Accounts (1-5)</span>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 font-bold hover:bg-slate-50 transition-colors">Prev</button>
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 font-bold hover:bg-slate-50 transition-colors">Next</button>
          </div>
        </div>
      </div>

    </div>
  );
}