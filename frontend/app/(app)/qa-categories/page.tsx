"use client";

import React, { useState, useEffect } from "react";

interface Category {
  id: number;
  name: string;
  active: boolean;
}

export default function ManageCategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = async () => {
    setIsFetching(true);
    try {
      const token = localStorage.getItem("accessToken");
      const timestamp = new Date().getTime();
      
      const response = await fetch(`http://localhost:9999/api/v1/categories/active?_t=${timestamp}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!response.ok) throw new Error("Failed to fetch categories");
      
      const data = await response.json();
      
      let rawList: any[] = [];
      if (data.result && Array.isArray(data.result)) {
        rawList = data.result;
      } else if (Array.isArray(data)) {
        rawList = data;
      }

      const mappedList: Category[] = rawList.map((item: any) => ({
        id: item.id,
        name: item.name,
        active: item.active
      }));

      setCategories(mappedList);
    } catch (err) {
      console.error(err);
      setCategories([]);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category? It cannot be deleted if it is already linked to ideas.")) return;
    
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`http://localhost:9999/api/v1/categories/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!response.ok) {
        let errMsg = `Error ${response.status}`;
        try {
          const errData = await response.json();
          errMsg = errData.message || errMsg;
        } catch (e) {}
        throw new Error(errMsg);
      }

      await fetchCategories();
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-12 transition-colors">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden border border-emerald-900/30">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full -mr-32 -mt-32 blur-[80px] opacity-30"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold mb-4 backdrop-blur-md uppercase">
            QA MANAGER
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Manage Categories</h1>
          <p className="text-slate-400 text-sm max-w-lg leading-relaxed">
            Create, update, and remove idea categories. Categories currently in use cannot be deleted.
          </p>
        </div>
        <button 
          className="relative z-10 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black rounded-xl transition-all shadow-lg shadow-emerald-500/30 hover:-translate-y-1 shrink-0"
        >
          + ADD CATEGORY
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-3 transition-colors">
        <div className="relative flex-1">
          <input 
            type="text" 
            placeholder="Search categories by name..."
            className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-emerald-500 dark:focus:border-emerald-500 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isFetching ? (
        <div className="flex justify-center py-20 font-bold text-emerald-500">
          LOADING CATEGORIES...
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-sm transition-colors">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">No Categories Found</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Try adjusting your search terms or add a new category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCategories.map((cat) => (
            <div key={cat.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all flex flex-col group relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-3 py-1 rounded-lg">
                  ID: {cat.id}
                </span>
                <div className="flex gap-2">
                  <button 
                    className="px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                  >
                    EDIT
                  </button>
                  <button 
                    onClick={() => handleDelete(cat.id)}
                    disabled={isSubmitting}
                    className="px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50"
                  >
                    DELETE
                  </button>
                </div>
              </div>
              <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">{cat.name}</h3>
              
              <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between transition-colors">
                <div className="flex items-center gap-1.5">
                  <span className={`text-xs font-bold uppercase tracking-widest px-2 py-1 rounded-md ${cat.active ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                    {cat.active ? "ACTIVE" : "INACTIVE"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}