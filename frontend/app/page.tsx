"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { LogIn, Lightbulb, ShieldCheck, Mail, Lock, Loader2, X, AlertCircle, Eye, EyeOff } from "lucide-react";
import Logo from "@/components/Logo";
import { getRoleFromToken } from "@/utils/auth"; 

const containerVariants: Variants = {
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

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
};

const pageContent = [
  {
    badge: "University Idea Management System",
    segments: [
      { text: "Share ", highlight: false },
      { text: "Ideas. ", highlight: true },
      { text: "Spark ", highlight: false },
      { text: "Change.", highlight: true }
    ],
    description: "Every great initiative starts with a simple thought. Drop your ideas here and let the community bring them to life.",
    signInAction: "Sign In",
    welcomeTitle: "Welcome Back",
    welcomeSub: "Sign in to your university account",
    usernameLabel: "Username",
    passwordLabel: "Password",
    forgotPassword: "Forgot password?",
    signInBtn: "Sign In Securely",
    authorizedText: "Authorized university access only"
  },
  {
    badge: "Hệ Thống Quản Lý Ý Tưởng Trực Tuyến",
    segments: [
      { text: "Góp ", highlight: false },
      { text: "Ý Tưởng. ", highlight: true },
      { text: "Tạo ", highlight: false },
      { text: "Thay Đổi.", highlight: true }
    ],
    description: "Mọi sáng kiến lớn đều bắt đầu từ một suy nghĩ nhỏ. Hãy để lại ý tưởng của bạn và để cộng đồng cùng biến nó thành hiện thực.",
    signInAction: "Đăng Nhập",
    welcomeTitle: "Chào Mừng Trở Lại",
    welcomeSub: "Đăng nhập vào tài khoản nội bộ của bạn",
    usernameLabel: "Tên đăng nhập",
    passwordLabel: "Mật khẩu",
    forgotPassword: "Quên mật khẩu?",
    signInBtn: "Đăng Nhập An Toàn",
    authorizedText: "Chỉ dành cho tài khoản được cấp phép"
  }
];

const AnimatedText = ({ text, delayOffset = 0, speed = 0.12, className = "" }: { text: string, delayOffset?: number, speed?: number, className?: string }) => {
  return (
    <span className={className}>
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, display: "none" }}
          animate={{ opacity: 1, display: "inline-block" }}
          transition={{ delay: delayOffset + index * speed, duration: 0.05 }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
};

export default function IndexPage() {
  const router = useRouter();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [langIndex, setLangIndex] = useState(0);
  
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: "", 
    password: ""
  });

  useEffect(() => {
    if (showLoginForm) return;
    const interval = setInterval(() => {
      setLangIndex((prev) => (prev === 0 ? 1 : 0));
    }, 8000); 
    return () => clearInterval(interval);
  }, [showLoginForm]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null); 
  };

  const handleRealLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:9999/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.code !== 1000) {
        throw new Error(data.message || "Invalid credentials. Please try again.");
      }

      const userInfo = data.result || data;

      // 1. Lưu thông tin cơ bản
      localStorage.setItem("user", JSON.stringify(userInfo));
      
      const tokenToSave = userInfo?.token || userInfo?.accessToken;
      if (tokenToSave) {
        localStorage.setItem("token", tokenToSave);
        localStorage.setItem("accessToken", tokenToSave);
      }

      // 2. GIẢI MÃ ROLE TỪ TOKEN ĐỂ SIDEBAR & TOPBAR ĐỔI GIAO DIỆN
      const decodedRole = getRoleFromToken();
      localStorage.setItem("user_role", decodedRole || "ROLE_STAFF");
      localStorage.setItem("username", userInfo.username || formData.username);

      // 3. LẤY MẬT LỆNH REDIRECT TỪ URL 
      const urlParams = new URLSearchParams(window.location.search);
      const redirectUrl = urlParams.get("redirect");
      
      if (redirectUrl) {
        window.location.href = redirectUrl;
        return;
      }

      // 4. ĐIỀU HƯỚNG MẶC ĐỊNH
      let destination = "/home";
      if (decodedRole === "ROLE_ADMIN") {
        destination = "/admin-accounts";
      } else if (decodedRole === "ROLE_QA_MANAGER") {
        destination = "/qa-queue";
      } else if (decodedRole === "ROLE_QA_COORDINATOR") {
        destination = "/dept-dashboard";
      }

      // Ép tải lại trang để Layout nhận diện Role mới
      window.location.href = destination;

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const content = pageContent[langIndex];
  const titleSpeed = 0.12;
  const descSpeed = 0.04;
  
  let cumulativeLength = 0;
  const headerSegmentsWithDelay = content.segments.map(segment => {
    const delay = cumulativeLength * titleSpeed;
    cumulativeLength += segment.text.length;
    return { ...segment, delay };
  });
  
  const descDelay = cumulativeLength * titleSpeed + 0.3;

  return (
    <main className="relative min-h-screen w-full overflow-hidden font-sans">
      
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

      <div className="absolute inset-0 z-10 bg-black/10 backdrop-blur-sm pointer-events-none"></div>

      <div className="absolute top-10 md:top-14 left-1/2 -translate-x-1/2 z-40 pointer-events-none transition-all duration-500">
        <Logo className="h-20 md:h-24 drop-shadow-2xl" showText={true} darkTheme={true} />
      </div>

      <div className="relative z-20 flex min-h-screen flex-col items-center justify-center p-4 md:p-8 pt-32">
        <AnimatePresence mode="wait">
          {!showLoginForm ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-4xl mt-10 min-h-[400px] flex flex-col items-center justify-center"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={langIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center w-full"
                >
                  <motion.div
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/30 text-white text-sm mb-6 backdrop-blur-md shadow-lg"
                  >
                    <Lightbulb className="w-4 h-4 text-yellow-300" />
                    <span className="font-medium drop-shadow-sm">{content.badge}</span>
                  </motion.div>
                  
                  <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight drop-shadow-xl min-h-[140px] md:min-h-[100px] flex flex-wrap justify-center w-full">
                    {headerSegmentsWithDelay.map((segment, idx) => (
                      <AnimatedText 
                        key={idx}
                        text={segment.text} 
                        delayOffset={segment.delay}
                        speed={titleSpeed}
                        className={segment.highlight ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300 drop-shadow-none" : ""} 
                      />
                    ))}
                  </h1>
                  
                  <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto font-medium drop-shadow-md leading-relaxed min-h-[80px]">
                    <AnimatedText text={content.description} delayOffset={descDelay} speed={descSpeed} />
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="mt-4 absolute bottom-32 md:bottom-40 z-50">
                <button 
                  onClick={() => setShowLoginForm(true)}
                  className="flex items-center gap-3 px-12 py-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/30 text-white font-bold text-lg hover:bg-white/20 hover:border-white/50 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all duration-300 shadow-xl group"
                >
                  <LogIn className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                  <span className="tracking-wide">{content.signInAction}</span>
                </button>
              </div>

            </motion.div>
          ) : (
            <motion.div
              key="login-form"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/30 rounded-[2rem] shadow-[0_0_40px_rgba(255,255,255,0.1)] mt-8"
              style={{ perspective: "1000px" }}
            >
              <div className="p-10 relative">
                
                <button 
                  onClick={() => setShowLoginForm(false)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors backdrop-blur-md"
                >
                  <X className="w-4 h-4" />
                </button>

                <motion.div variants={itemVariants} className="text-center mb-6">
                  <h2 className="text-3xl font-extrabold text-white tracking-tight">{content.welcomeTitle}</h2>
                  <p className="text-slate-200 mt-2 font-medium text-sm">{content.welcomeSub}</p>
                </motion.div>

                {error && (
                  <motion.div variants={itemVariants} className="mb-6 p-3 rounded-xl bg-red-500/20 border border-red-500/50 flex items-center gap-3 backdrop-blur-md">
                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                    <p className="text-xs text-red-200 font-medium leading-snug">{error}</p>
                  </motion.div>
                )}

                <form onSubmit={handleRealLogin} className="space-y-5">
                  
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-semibold text-slate-100 mb-1.5 drop-shadow-sm">{content.usernameLabel}</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300 group-focus-within:text-white transition-colors" />
                      <input 
                        type="text" 
                        name="username" 
                        value={formData.username}
                        onChange={handleChange}
                        required
                        placeholder="your.name@greenwich.edu.vn" 
                        className="w-full h-12 bg-black/20 border border-white/20 rounded-xl pl-12 pr-4 text-white placeholder:text-slate-300 outline-none transition-all focus:border-white focus:bg-black/40 shadow-inner backdrop-blur-sm"
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-sm font-semibold text-slate-100 drop-shadow-sm">{content.passwordLabel}</label>
                      <a href="#" className="text-xs text-blue-200 hover:text-white font-medium transition-colors">{content.forgotPassword}</a>
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300 group-focus-within:text-white transition-colors" />
                      <input 
                        type={showPassword ? "text" : "password"} 
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="••••••••••••" 
                        className="w-full h-12 bg-black/20 border border-white/20 rounded-xl pl-12 pr-12 text-white placeholder:text-slate-300 outline-none transition-all focus:border-white focus:bg-black/40 shadow-inner backdrop-blur-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="pt-4">
                    <button 
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 border-none text-white font-bold text-lg transition-all shadow-lg hover:shadow-cyan-500/30 active:scale-[0.98] disabled:opacity-70 group"
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>{content.signInBtn} <LogIn className="w-5 h-5 ml-1" /></>
                      )}
                    </button>
                  </motion.div>
                </form>

                <motion.div variants={itemVariants} className="mt-8 pt-5 border-t border-white/20 text-center flex items-center justify-center gap-2 text-xs text-slate-200">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{content.authorizedText}</span>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="fixed bottom-0 left-0 w-full z-30 px-6 py-4 text-center text-xs text-white/60 font-medium drop-shadow-md pointer-events-none">
          © 2026 Greenwich University. Ideas Management System.
        </footer>

      </div>
    </main>
  );
}