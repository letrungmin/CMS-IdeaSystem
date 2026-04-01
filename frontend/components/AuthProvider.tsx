"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createPortal } from "react-dom";

interface AuthContextType {
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isExpired, setIsExpired] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("user_role");
    setIsExpired(false);
    router.replace("/"); 
  };

  const checkAuthStatus = () => {
    try {
      const rawUser = localStorage.getItem("user");
      const token = localStorage.getItem("accessToken") || 
                    localStorage.getItem("token") ||
                    (rawUser ? JSON.parse(rawUser).accessToken : null);

      if (!token) {
        if (pathname !== "/") {
          logout(); 
        } else {
          setIsChecking(false);
        }
        return;
      }

      const payload = JSON.parse(atob(token.split('.')[1]));
      const expTime = payload.exp * 1000; 

      if (Date.now() >= expTime) {
        setIsExpired(true);
        setIsChecking(false);
      } else {
        if (pathname === "/") {
          router.replace("/home");
        } else {
          setIsChecking(false);
        }
      }
    } catch (error) {
      if (pathname !== "/") {
        logout();
      } else {
        setIsChecking(false);
      }
    }
  };

  useEffect(() => {
    checkAuthStatus();
    const interval = setInterval(checkAuthStatus, 10000); 
    
    const handleFocus = () => checkAuthStatus();
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, [pathname]);

  if (isChecking && pathname !== "/") {
    return null; 
  }

  return (
    <AuthContext.Provider value={{ logout }}>
      {children}
      
      {mounted && isExpired && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md p-8 flex flex-col items-center text-center border border-slate-200 dark:border-slate-800">
            <div className="w-20 h-20 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center mb-6 shadow-inner text-4xl font-black">
              !
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Session Expired</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed font-medium">
              Your security token has expired due to inactivity. Please log in again to continue.
            </p>
            <button 
              onClick={logout}
              className="w-full py-3.5 px-6 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all active:scale-95"
            >
              Log Out & Re-login
            </button>
          </div>
        </div>,
        document.body
      )}
    </AuthContext.Provider>
  );
}