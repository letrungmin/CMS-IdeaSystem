"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, ArrowRight, Lightbulb, ShieldCheck, Mail, Lock, Loader2, X } from "lucide-react";
import Logo from "@/components/Logo";

// 3D Animation Variants for Framer Motion
const containerVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 50, rotateX: -15 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0, 
    rotateX: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } 
  },
  exit: { 
    opacity: 0, 
    scale: 0.9, 
    y: -30, 
    rotateX: 15,
    transition: { duration: 0.4 } 
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
};

export default function IndexPage() {
  const router = useRouter();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fake login handler
  const handleFakeLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      // Set default role for testing the main layout
      localStorage.setItem("user_role", "ROLE_STUDENT"); 
      router.push("/home"); // Navigate to app/(app)/home/page.tsx
    }, 1500);
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden font-sans">
      
      {/* ---------- BACKGROUND VIDEO LAYER ---------- */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 z-0 h-full w-full object-cover"
      >
        <source src="/login-bg.mp4" type="video/mp4" />
        <div className="absolute inset-0 bg-slate-900"></div>
      </video>

      {/* ---------- LIGHT OVERLAY & SLIGHT BLUR ---------- */}
      <div className="absolute inset-0 z-10 bg-black/10 backdrop-blur-sm pointer-events-none"></div>

      {/* ---------- MAIN CONTENT LAYER ---------- */}
      <div className="relative z-20 flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
        
        {/* Global Header (Glassmorphism style with NEW LOGO) */}
        <header className="fixed top-0 left-0 w-full z-30 px-6 py-4 flex items-center justify-between border-b border-white/20 bg-white/10 backdrop-blur-md">
          
          {/* Logo with Dark Theme enabled for transparent background */}
          <Logo className="h-10 drop-shadow-md" showText={true} darkTheme={true} />

          {!showLoginForm && (
            <button 
              onClick={() => setShowLoginForm(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/20 text-white text-sm font-semibold hover:bg-blue-600 transition-all backdrop-blur-md border border-white/30 hover:border-transparent shadow-lg"
            >
              <LogIn className="w-4 h-4" /> Sign In
            </button>
          )}
        </header>

        <AnimatePresence mode="wait">
          {!showLoginForm ? (
            
            // ---------- LANDING PAGE INTRO ----------
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-4xl mt-16"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/30 text-white text-sm mb-6 backdrop-blur-md shadow-lg"
              >
                <Lightbulb className="w-4 h-4 text-yellow-300" />
                <span className="font-medium drop-shadow-sm">Enterprise Idea Management System</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight drop-shadow-xl"
              >
                Empowering <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300 drop-shadow-none">Innovation</span> Across Campus
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-white/90 mb-12 max-w-2xl mx-auto font-medium drop-shadow-md leading-relaxed"
              >
                A secure and powerful platform for students and staff to collaborate, share groundbreaking ideas, and shape the future of our university.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <button 
                  onClick={() => setShowLoginForm(true)}
                  className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-blue-600/90 backdrop-blur-md text-white font-bold text-lg border border-blue-400/50 hover:bg-blue-600 transition-all shadow-2xl hover:-translate-y-1 group"
                >
                  Access Portal <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                </button>
              </motion.div>
            </motion.div>

          ) : (
            
            // ---------- 3D GLASSMORPHISM LOGIN FORM ----------
            <motion.div
              key="login-form"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full max-w-md p-1 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] shadow-2xl"
              style={{ perspective: "1000px" }}
            >
              <div className="p-10 bg-black/40 rounded-[1.8rem] border border-white/10 relative">
                
                {/* Close Button */}
                <button 
                  onClick={() => setShowLoginForm(false)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors backdrop-blur-md"
                >
                  <X className="w-4 h-4" />
                </button>

                <motion.div variants={itemVariants} className="text-center mb-8">
                  <h2 className="text-3xl font-extrabold text-white tracking-tight">Welcome Back</h2>
                  <p className="text-slate-300 mt-2 font-medium text-sm">Sign in to your university account</p>
                </motion.div>

                <form onSubmit={handleFakeLogin} className="space-y-5">
                  
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-semibold text-slate-200 mb-1.5 drop-shadow-sm">University Email</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-white transition-colors" />
                      <input 
                        type="email" 
                        required
                        placeholder="your.name@greenwich.edu.vn" 
                        className="w-full h-12 bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 text-white placeholder:text-slate-400 outline-none transition-all focus:border-white focus:bg-white/20 shadow-inner backdrop-blur-md"
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-sm font-semibold text-slate-200 drop-shadow-sm">Password</label>
                      <a href="#" className="text-xs text-blue-300 hover:text-white font-medium transition-colors">Forgot password?</a>
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-white transition-colors" />
                      <input 
                        type="password" 
                        required
                        placeholder="••••••••••••" 
                        className="w-full h-12 bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 text-white placeholder:text-slate-400 outline-none transition-all focus:border-white focus:bg-white/20 shadow-inner backdrop-blur-md"
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="pt-4">
                    <button 
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-blue-600/90 hover:bg-blue-600 border border-blue-400/50 text-white font-bold text-lg transition-all shadow-xl active:scale-[0.98] disabled:opacity-70 group backdrop-blur-md"
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>Sign In Securely <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                      )}
                    </button>
                  </motion.div>
                </form>

                <motion.div variants={itemVariants} className="mt-8 pt-5 border-t border-white/20 text-center flex items-center justify-center gap-2 text-xs text-slate-300">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authorized university access only</span>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Footer */}
        <footer className="fixed bottom-0 left-0 w-full z-30 px-6 py-4 text-center text-xs text-white/60 font-medium drop-shadow-md">
          © 2026 Greenwich University. Ideas Management System.
        </footer>

      </div>
    </main>
  );
}