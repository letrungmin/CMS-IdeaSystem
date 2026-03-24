"use client";

import React, { useState } from "react";
import { 
  Tags, Plus, Edit, Trash2, 
  Search, Lock, Info 
} from "lucide-react";

// MOCK DATA
const CATEGORIES_DATA = [
  {
    id: "CAT-01",
    name: "Campus Infrastructure",
    description: "Ideas for improving physical facilities, internet, and study spaces.",
    ideaCount: 142 
  },
  {
    id: "CAT-02",
    name: "Mental Health Initiatives",
    description: "Proposals for counseling, peer support, and wellbeing programs.",
    ideaCount: 89 
  },
  {
    id: "CAT-03",
    name: "Remote Learning Tools",
    description: "Suggestions for software licenses and online learning platforms.",
    ideaCount: 0 
  }
];

export default function ManageCategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState(CATEGORIES_DATA);


  const handleDelete = (id: string, ideaCount: number) => {
    if (ideaCount > 0) {
      alert("System Policy: Cannot delete a category that is already in use by submitted ideas.");
      return;
    }
    
    if (confirm("Are you sure you want to delete this unused category?")) {
      setCategories(categories.filter(cat => cat.id !== id));
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full -mr-32 -mt-32 blur-[80px] opacity-40"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold mb-4 backdrop-blur-md">
            <Tags className="w-4 h-4 text-emerald-400" /> QA Manager Portal
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Category Management</h1>
          <p className="text-slate-400 text-sm max-w-lg leading-relaxed">
            Create tags to organize staff ideas. Note: Per University policy, categories can only be deleted if they have not been used in any submissions.
          </p>
        </div>
        <button className="relative z-10 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black rounded-xl transition-all shadow-lg shadow-emerald-500/30 hover:-translate-y-1 shrink-0">
          <Plus className="w-5 h-5" /> Add Category
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search categories by name..." 
            className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* CATEGORIES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const isUsed = cat.ideaCount > 0;

          return (
            <div key={cat.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col group relative overflow-hidden">
              
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-lg">
                  {cat.id}
                </span>
                
                {/* ACTION BUTTONS */}
                <div className="flex gap-2">
                  <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Category">
                    <Edit className="w-4 h-4" />
                  </button>
                  
                  {/* DELETE BUTTON LOGIC */}
                  <button 
                    onClick={() => handleDelete(cat.id, cat.ideaCount)}
                    disabled={isUsed}
                    className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
                      isUsed 
                      ? 'text-slate-300 cursor-not-allowed bg-slate-50' 
                      : 'text-slate-400 hover:text-red-600 hover:bg-red-50'
                    }`}
                    title={isUsed ? "Cannot delete: Category is in use" : "Delete Category"}
                  >
                    {isUsed ? <Lock className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-black text-slate-800 mb-2">{cat.name}</h3>
              <p className="text-sm text-slate-500 line-clamp-3 flex-1 mb-6">{cat.description}</p>

              {/* STATS & WARNING */}
              <div className={`mt-auto pt-4 border-t flex items-center justify-between ${isUsed ? 'border-emerald-100' : 'border-slate-100'}`}>
                {isUsed ? (
                  <div className="flex items-center gap-2 text-emerald-600">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-[10px] font-black">
                      {cat.ideaCount}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-widest">Ideas Linked</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Info className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Not in use</span>
                  </div>
                )}
              </div>
              
            </div>
          );
        })}
      </div>
    </div>
  );
}