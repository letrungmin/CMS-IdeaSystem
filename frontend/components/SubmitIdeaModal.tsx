"use client";

import React, { useState, useRef } from "react";
import { 
  X, UploadCloud, File, Trash2, ShieldCheck, 
  AlertCircle, Send, CheckSquare, Square
} from "lucide-react";

interface SubmitIdeaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SubmitIdeaModal({ isOpen, onClose }: SubmitIdeaModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  
  // NEW STATES FOR SPECIFICATION REQUIREMENTS
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Remove selected file
  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Form Validation (Must fill fields AND agree to terms)
  const isFormValid = title.trim() !== "" && category !== "" && description.trim() !== "" && agreedToTerms;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);
    
    // Simulate API Call (Multipart Form Data would be used here in reality)
    setTimeout(() => {
      console.log("Submitting Idea:", { title, category, description, isAnonymous, fileName: selectedFile?.name });
      setIsSubmitting(false);
      onClose();
      // Reset form
      setTitle(""); setCategory(""); setDescription(""); setSelectedFile(null); setAgreedToTerms(false); setIsAnonymous(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Submit New Idea</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Share your vision</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <form id="submit-idea-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Title & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                  Idea Title <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="E.g., 24/7 Library Access" 
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-blue-500 transition-colors cursor-pointer"
                >
                  <option value="" disabled>Select a category...</option>
                  <option value="infrastructure">Campus Infrastructure</option>
                  <option value="wellbeing">Mental Health & Wellbeing</option>
                  <option value="academic">Academic Resources</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                Detailed Description <span className="text-red-500">*</span>
              </label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain your idea, the problem it solves, and the expected benefits..." 
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-blue-500 transition-colors min-h-[120px] resize-none"
              ></textarea>
            </div>

            {/* NEW: DOCUMENT UPLOAD (OPTIONAL) */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">
                Supporting Document (Optional)
              </label>
              
              {!selectedFile ? (
                <div 
                  className="w-full border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-blue-400 hover:bg-blue-50/50 transition-colors cursor-pointer group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-6 h-6 text-blue-500" />
                  </div>
                  <p className="text-sm font-bold text-slate-700">Click to upload a file</p>
                  <p className="text-xs font-medium text-slate-400 mt-1">PDF, DOCX, or ZIP (Max 10MB)</p>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange}
                    className="hidden" 
                    accept=".pdf,.doc,.docx,.zip"
                  />
                </div>
              ) : (
                <div className="w-full border border-slate-200 rounded-xl p-4 flex items-center justify-between bg-white shadow-sm">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                      <File className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-bold text-slate-700 truncate">{selectedFile.name}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onClick={removeFile}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* TOGGLES & TERMS */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
              
              {/* Anonymous Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-800">Submit Anonymously</p>
                  <p className="text-xs text-slate-500 mt-0.5">Your identity will be hidden from other students.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={isAnonymous} onChange={() => setIsAnonymous(!isAnonymous)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-800"></div>
                </label>
              </div>

              <div className="w-full h-px bg-slate-200"></div>

              {/* NEW: TERMS AND CONDITIONS CHECKBOX */}
              <div className="flex items-start gap-3">
                <button 
                  type="button"
                  onClick={() => setAgreedToTerms(!agreedToTerms)}
                  className={`mt-0.5 shrink-0 ${agreedToTerms ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {agreedToTerms ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                </button>
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    I agree to the <a href="#" className="text-blue-600 hover:underline">Terms & Conditions</a>
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    By submitting this idea, I confirm that the content complies with the University's code of conduct and does not contain offensive material.
                  </p>
                </div>
              </div>

            </div>

          </form>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Secure Submission</span>
          </div>
          
          <div className="flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              form="submit-idea-form"
              disabled={!isFormValid || isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Processing..." : (
                <><Send className="w-4 h-4" /> Submit Idea</>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}