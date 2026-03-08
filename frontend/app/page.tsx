"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Lock, Mail, ArrowRight, Loader2, Sparkles } from "lucide-react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/home"); 
    }, 1500);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 overflow-hidden bg-white">
      <div className="flex items-center justify-center p-8 bg-white animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center text-center space-y-2 mb-8">
            <div className="h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-200 transition-transform hover:scale-105 duration-300">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome back</h1>
            <p className="text-slate-500 text-sm">Enter your credentials to access the University Ideas Portal</p>
          </div>

          <Card className="border-slate-200 shadow-xl shadow-slate-100/50 hover:shadow-2xl hover:shadow-slate-200/50 transition-shadow duration-500">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-xl">Sign in</CardTitle>
              <CardDescription>Use your university email address.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <Input id="email" type="email" placeholder="student@university.edu.vn" className="pl-10 h-11 transition-all focus:ring-2 focus:ring-blue-100" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500 hover:underline">Forgot password?</a>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <Input id="password" type="password" placeholder="••••••••" className="pl-10 h-11 transition-all focus:ring-2 focus:ring-blue-100" required />
                  </div>
                </div>
                <Button type="submit" className="w-full h-11 mt-6 bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300" disabled={isLoading}>
                  {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Authenticating...</> : <><span className="mr-2">Sign in</span> <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></>}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="hidden md:flex flex-col items-center justify-center bg-slate-50 p-12 border-l border-slate-100 relative overflow-hidden animate-in fade-in duration-[1500ms] zoom-in-95">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none opacity-40">
           <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-blue-100 to-blue-200 blur-3xl animate-pulse duration-10000" />
           <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-indigo-100 to-blue-50 blur-3xl animate-pulse duration-7000" />
        </div>
        <div className="relative z-10 max-w-md text-center flex flex-col items-center">
          <div className="mb-8 inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-semibold shadow-sm animate-academic">
            <span className="flex h-2 w-2 rounded-full bg-current mr-2 animate-ping opacity-75"></span>
            Academic Year 2025 - 2026
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Shape the future of our university</h2>
          <p className="text-slate-600 text-lg leading-relaxed">Every great initiative starts with a simple idea. Log in to share your thoughts, vote on proposals, and collaborate with peers.</p>
        </div>
      </div>
    </div>
  );
}