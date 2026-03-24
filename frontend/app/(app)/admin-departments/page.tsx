"use client";

import React, { useState } from "react";
import { 
  Building2, Plus, Search, Edit, Trash2, 
  Users, Lightbulb, ShieldAlert, Lock, Mail,
  CheckCircle2, AlertCircle
} from "lucide-react";

// Mock Data for University Departments
const DEPARTMENTS_DATA = [
  {
    id: "DEPT-IT",
    name: "Information Technology",
    description: "Computing, Software Engineering, and Network Systems.",
    coordinator: { name: "John Doe", email: "john.qa@greenwich.edu.vn" },
    staffCount: 45,
    ideaCount: 128,
    status: "active"
  },
  {
    id: "DEPT-BUS",
    name: "Business Management",
    description: "Marketing, Finance, Economics, and Business Administration.",
    coordinator: { name: "Sarah Smith", email: "sarah.qa@greenwich.edu.vn" },
    staffCount: 62,
    ideaCount: 89,
    status: "active"
  },
  {
    id: "DEPT-ART",
    name: "Graphic Design & Art",
    description: "Digital Media, 3D Animation, and Visual Communication.",
    coordinator: null, // No coordinator assigned yet
    staffCount: 28,
    ideaCount: 45,
    status: "active"
  },
  {
    id: "DEPT-LAW",
    name: "Faculty of Law",
    description: "International Law, Corporate Law, and Legal Studies.",
    coordinator: null,
    staffCount: 0,
    ideaCount: 0,
    status: "new" // New department, empty, CAN BE DELETED
  }
];

export default function AdminDepartmentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [departments, setDepartments] = useState(DEPARTMENTS_DATA);

  // Logic to handle deletion
  const handleDelete = (id: string, staffCount: number, ideaCount: number) => {
    if (staffCount > 0 || ideaCount > 0) {
      alert("System Policy: Cannot delete a department that contains active staff members or submitted ideas.");
      return;
    }
    
    if (confirm("Are you sure you want to permanently delete this empty department?")) {
      setDepartments(departments.filter(dept => dept.id !== id));
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 pb-12">
      
      {/* 1. HEADER SECTION (Admin Red/Rose Theme) */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden border border-rose-900/30">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600 rounded-full -mr-32 -mt-32 blur-[80px] opacity-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-black uppercase tracking-widest mb-4 backdrop-blur-md">
              <ShieldAlert className="w-4 h-4" /> System Administrator
            </div>
            <h1 className="text-3xl font-black tracking-tight mb-2">Department Registry</h1>
            <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
              Manage university faculties and departments. Assign QA Coordinators and monitor the operational scale of each division across the campus.
            </p>
          </div>
          <button className="relative z-10 flex items-center justify-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-rose-900/50 hover:-translate-y-1 shrink-0">
            <Plus className="w-5 h-5" /> Establish Department
          </button>
        </div>
      </div>

      {/* 2. FILTER & SEARCH */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search departments by name or ID..." 
            className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-rose-500 transition-colors"
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
            <div key={dept.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col group relative overflow-hidden">
              
              {/* Top Row: Badge & Actions */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 border border-slate-200">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-50 border border-slate-100 px-3 py-1 rounded-lg">
                    {dept.id}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Department">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(dept.id, dept.staffCount, dept.ideaCount)}
                    disabled={!isDeletable}
                    className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
                      !isDeletable 
                      ? 'text-slate-300 cursor-not-allowed bg-slate-50' 
                      : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                    }`}
                    title={!isDeletable ? "Cannot delete: Contains active staff or ideas" : "Delete Department"}
                  >
                    {!isDeletable ? <Lock className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Info */}
              <h3 className="text-xl font-black text-slate-800 mb-2">{dept.name}</h3>
              <p className="text-sm text-slate-500 mb-6 flex-1 line-clamp-2">{dept.description}</p>

              {/* Coordinator Section */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-5">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Assigned QA Coordinator</p>
                {dept.coordinator ? (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-xs border border-violet-200">
                      {dept.coordinator.name.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-bold text-slate-800 truncate">{dept.coordinator.name}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1 truncate mt-0.5">
                        <Mail className="w-3 h-3 shrink-0" /> {dept.coordinator.email}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-2 rounded-xl border border-amber-100">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span className="text-xs font-bold">No coordinator assigned. System alerts disabled.</span>
                  </div>
                )}
              </div>

              {/* Footer Stats */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex gap-4">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-black">{dept.staffCount} <span className="text-xs font-medium text-slate-400">Staff</span></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Lightbulb className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-black">{dept.ideaCount} <span className="text-xs font-medium text-slate-400">Ideas</span></span>
                  </div>
                </div>
                
                {dept.status === "new" ? (
                  <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md uppercase tracking-widest">New</span>
                ) : (
                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md uppercase tracking-widest flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Active
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