"use client";

import React, { useState } from "react";
import { X, UploadCloud, AlertCircle, Shield } from "lucide-react";

export default function SubmitIdeaModal({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent background scrolling when modal is open
  if (isOpen && typeof window !== "undefined") {
    document.body.style.overflow = "hidden";
  } else if (!isOpen && typeof window !== "undefined") {
    document.body.style.overflow = "unset";
  }

  return (
    <>
      {/* Wrapper to trigger the modal from TopBar button */}
      <div onClick={() => setIsOpen(true)} className="inline-block">
        {children}
      </div>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          
          {/* Modal Container */}
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-800">Submit a New Idea</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body (Scrollable form) */}
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              <form className="space-y-6">
                
                {/* Title */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Idea Title <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    placeholder="E.g., Upgrade the campus library Wi-Fi" 
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                  />
                </div>

                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Category <span className="text-red-500">*</span></label>
                  <select className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-slate-600 bg-white">
                    <option value="">Select a category...</option>
                    <option value="it">IT Infrastructure</option>
                    <option value="facilities">Campus Facilities</option>
                    <option value="curriculum">Curriculum Enhancement</option>
                    <option value="services">Student Services</option>
                  </select>
                </div>

                {/* Content/Description */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Description <span className="text-red-500">*</span></label>
                  <textarea 
                    rows={5}
                    placeholder="Describe your idea in detail. What is the problem? What is your proposed solution?" 
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all resize-none"
                  ></textarea>
                </div>

                {/* File Upload (Drag & Drop UI) */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Supporting Documents</label>
                  <div className="mt-1 border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 hover:border-blue-400 transition-colors cursor-pointer group">
                    <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-medium text-slate-700">Click to upload or drag and drop</p>
                    <p className="text-xs text-slate-500 mt-1">PDF, DOCX, JPG or PNG (MAX. 10MB)</p>
                  </div>
                </div>

                {/* Settings: Anonymous & Terms */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="flex items-center h-5">
                      <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900 flex items-center gap-1.5">
                        <Shield className="w-4 h-4 text-slate-500" /> Post Anonymously
                      </span>
                      <span className="text-xs text-slate-500 mt-0.5">Your identity will be hidden from other students, but recorded by the system administrators.</span>
                    </div>
                  </label>

                  <div className="w-full h-px bg-slate-200"></div>

                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="flex items-center h-5">
                      <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900">
                        I agree to the Terms and Conditions <span className="text-red-500">*</span>
                      </span>
                      <span className="text-xs text-slate-500 mt-0.5 flex items-start gap-1">
                        <AlertCircle className="w-3 h-3 min-w-3 mt-0.5 shrink-0" />
                        By submitting, you agree that this idea does not contain offensive content and complies with university guidelines.
                      </span>
                    </div>
                  </label>
                </div>

              </form>
            </div>

            {/* Modal Footer (Actions) */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3 rounded-b-2xl">
              <button 
                onClick={() => setIsOpen(false)}
                className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-200 transition-all hover:-translate-y-0.5">
                Submit Idea
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}