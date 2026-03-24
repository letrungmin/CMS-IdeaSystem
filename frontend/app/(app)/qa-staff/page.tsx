"use client";

import React, { useState } from "react";
import { 
  Users, Search, Filter, Mail, Shield, 
  MoreVertical, CheckCircle2, ChevronRight, Building2
} from "lucide-react";

// Mock Data cho Student Directory
const STUDENTS_DATA = [
  { id: "STU-001", name: "Trung Min", email: "trungmin@student.greenwich.edu.vn", department: "IT Department", status: "Active", ideas: 12 },
  { id: "STU-002", name: "Alex Nguyen", email: "alex.n@student.greenwich.edu.vn", department: "Business Management", status: "Active", ideas: 5 },
  { id: "STU-003", name: "Sarah Le", email: "sarah.l@student.greenwich.edu.vn", department: "Graphic Design", status: "Inactive", ideas: 0 },
  { id: "STU-004", name: "David Tran", email: "david.t@student.greenwich.edu.vn", department: "IT Department", status: "Active", ideas: 24 },
  { id: "STU-005", name: "Emma Pham", email: "emma.p@student.greenwich.edu.vn", department: "Media & Comms", status: "Active", ideas: 8 },
];

export default function StudentDirectoryPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-12">
      
      {/* HEADER */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100 mb-4">
            <Users className="w-4 h-4" /> User Management
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Student Directory</h1>
          <p className="text-slate-500 text-sm max-w-lg">
            Monitor student accounts, view their department affiliations, and track their contribution to the platform.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-200 shrink-0">
          <div className="px-4 py-2 text-center">
            <p className="text-2xl font-black text-slate-800">1,204</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Students</p>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by student name or email..." 
            className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        <div className="flex gap-3">
          <select className="h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 outline-none focus:border-blue-500">
            <option>All Departments</option>
            <option>IT Department</option>
            <option>Business Management</option>
          </select>
          <button className="h-12 px-6 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors flex items-center gap-2 font-bold text-sm shrink-0">
            <Filter className="w-4 h-4" /> Sort
          </button>
        </div>
      </div>

      {/* TABLE DATA */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Student</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Department</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Contributions</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {STUDENTS_DATA.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                  
                  {/* Student Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors cursor-pointer">{student.name}</p>
                        <div className="flex items-center gap-1.5 text-slate-500 text-xs mt-0.5">
                          <Mail className="w-3 h-3" /> {student.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Department */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                      <Building2 className="w-4 h-4 text-slate-400" /> {student.department}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    {student.status === "Active" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">
                        Inactive
                      </span>
                    )}
                  </td>

                  {/* Contributions */}
                  <td className="px-6 py-4 text-center">
                    <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 font-black text-sm rounded-lg">
                      {student.ideas}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-sm">
          <span className="text-slate-500 font-medium">Showing 1 to 5 of 1,204 students</span>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 font-bold hover:bg-slate-50 transition-colors">Previous</button>
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 font-bold hover:bg-slate-50 transition-colors">Next</button>
          </div>
        </div>
      </div>

    </div>
  );
}