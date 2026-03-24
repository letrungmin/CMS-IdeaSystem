"use client";

import React, { useState, useEffect } from "react";
import { 
  User as UserIcon, Mail, Building2, ShieldAlert, 
  MapPin, Calendar, Clock, Edit, Shield, Activity, 
  Lightbulb, MessageSquare, ThumbsUp, Users, CheckSquare, Settings
} from "lucide-react";

export default function ProfilePage() {
  const [userRole, setUserRole] = useState("ROLE_STAFF");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const role = localStorage.getItem("user_role");
    if (role) setUserRole(role);
  }, []);

  if (!isMounted) return null;

  // Render Theme & Details based on Role
  let roleBadgeColor = "bg-blue-100 text-blue-700 border-blue-200";
  let roleTitle = "Staff Member";
  let avatarGradient = "from-blue-500 to-indigo-600";
  let userName = "Trung Min";
  let userEmail = "trungmin@student.greenwich.edu.vn";
  let userDept = "IT Department";

  if (userRole === "ROLE_QA_COORDINATOR") {
    roleBadgeColor = "bg-violet-100 text-violet-700 border-violet-200";
    roleTitle = "QA Coordinator";
    avatarGradient = "from-violet-500 to-purple-700";
    userName = "Alex Nguyen";
    userEmail = "alex.qa@greenwich.edu.vn";
  } else if (userRole === "ROLE_QA_MANAGER") {
    roleBadgeColor = "bg-emerald-100 text-emerald-700 border-emerald-200";
    roleTitle = "QA Manager";
    avatarGradient = "from-emerald-500 to-teal-700";
    userName = "Master QA";
    userEmail = "manager@greenwich.edu.vn";
    userDept = "University Board";
  } else if (userRole === "ROLE_ADMIN") {
    roleBadgeColor = "bg-rose-100 text-rose-700 border-rose-200";
    roleTitle = "System Administrator";
    avatarGradient = "from-rose-500 to-red-700";
    userName = "Root Admin";
    userEmail = "admin@greenwich.edu.vn";
    userDept = "System Core";
  }

  // CONDITIONAL STATS RENDERER
  const renderStats = () => {
    switch (userRole) {
      case "ROLE_STAFF":
      case "ROLE_STUDENT":
        return (
          <>
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-center">
              <Lightbulb className="w-6 h-6 text-amber-500 mx-auto mb-2" />
              <p className="text-2xl font-black text-slate-800">12</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Ideas Posted</p>
            </div>
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-center">
              <ThumbsUp className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
              <p className="text-2xl font-black text-slate-800">348</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Thumbs Up</p>
            </div>
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-center">
              <MessageSquare className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-black text-slate-800">45</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Comments</p>
            </div>
          </>
        );
      case "ROLE_QA_COORDINATOR":
        return (
          <>
            <div className="bg-violet-50 p-5 rounded-2xl border border-violet-100 text-center">
              <Users className="w-6 h-6 text-violet-500 mx-auto mb-2" />
              <p className="text-2xl font-black text-violet-900">45</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-violet-500 mt-1">Dept Staff</p>
            </div>
            <div className="bg-violet-50 p-5 rounded-2xl border border-violet-100 text-center">
              <Lightbulb className="w-6 h-6 text-amber-500 mx-auto mb-2" />
              <p className="text-2xl font-black text-violet-900">84</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-violet-500 mt-1">Dept Ideas</p>
            </div>
          </>
        );
      case "ROLE_QA_MANAGER":
        return (
          <>
            <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 text-center">
              <CheckSquare className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
              <p className="text-2xl font-black text-emerald-900">124</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mt-1">Pending Queue</p>
            </div>
            <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 text-center">
              <Lightbulb className="w-6 h-6 text-amber-500 mx-auto mb-2" />
              <p className="text-2xl font-black text-emerald-900">842</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mt-1">Total Ideas</p>
            </div>
          </>
        );
      case "ROLE_ADMIN":
        return (
          <>
            <div className="bg-rose-50 p-5 rounded-2xl border border-rose-100 text-center">
              <Users className="w-6 h-6 text-rose-500 mx-auto mb-2" />
              <p className="text-2xl font-black text-rose-900">1,204</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-rose-600 mt-1">Active Accounts</p>
            </div>
            <div className="bg-rose-50 p-5 rounded-2xl border border-rose-100 text-center">
              <Building2 className="w-6 h-6 text-rose-500 mx-auto mb-2" />
              <p className="text-2xl font-black text-rose-900">4</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-rose-600 mt-1">Departments</p>
            </div>
          </>
        );
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-12">
      
      {/* 1. COVER PHOTO & AVATAR SECTION */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Cover Photo */}
        <div className="h-48 w-full bg-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-800"></div>
          {/* Abstract background blobs */}
          <div className={`absolute -bottom-24 -right-24 w-64 h-64 rounded-full blur-[80px] opacity-40 bg-gradient-to-br ${avatarGradient}`}></div>
          <div className={`absolute -top-24 -left-24 w-64 h-64 rounded-full blur-[80px] opacity-30 bg-gradient-to-br ${avatarGradient}`}></div>
        </div>

        {/* Profile Info Context */}
        <div className="px-8 pb-8 relative">
          
          {/* Avatar & Edit Button */}
          <div className="flex justify-between items-end -mt-16 mb-6">
            <div className={`w-32 h-32 rounded-3xl bg-gradient-to-br ${avatarGradient} border-4 border-white shadow-xl flex items-center justify-center text-4xl font-black text-white shrink-0 relative`}>
              {userName.charAt(0)}
              <div className="absolute bottom-2 right-2 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
            
            <button className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors flex items-center gap-2 text-sm border border-slate-200 shadow-sm">
              <Edit className="w-4 h-4" /> Edit Profile
            </button>
          </div>

          {/* User Details */}
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">{userName}</h1>
              <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg border ${roleBadgeColor}`}>
                {roleTitle}
              </span>
            </div>
            <p className="text-slate-500 text-sm font-medium">Joined September 2024 • ID: ACC-2026</p>
          </div>

        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 2. LEFT COLUMN: Info Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-slate-400" /> Personal Information
            </h3>
            
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                  <Mail className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Email Address</p>
                  <p className="text-sm font-bold text-slate-700 break-all">{userEmail}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                  <Building2 className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Department</p>
                  <p className="text-sm font-bold text-slate-700">{userDept}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                  <MapPin className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Campus Location</p>
                  <p className="text-sm font-bold text-slate-700">Greenwich HCM Campus</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. RIGHT COLUMN: Stats & Activity */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Dynamic Stats Row */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-slate-400" /> Performance Metrics
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {renderStats()}
            </div>
          </div>

          {/* Activity Timeline (Generic for all) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-400" /> Recent Activity
            </h3>
            
            <div className="space-y-0 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
              
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active pb-6">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-blue-100 text-blue-600 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                  <Settings className="w-4 h-4" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-bold text-slate-800">Profile Updated</p>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Today</span>
                  </div>
                  <p className="text-xs text-slate-500">Changed notification preferences and updated password.</p>
                </div>
              </div>

              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active pb-6">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-emerald-100 text-emerald-600 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-bold text-slate-800">Security Checkpoint</p>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">2 Days Ago</span>
                  </div>
                  <p className="text-xs text-slate-500">Successfully logged in from new device (Mac OS).</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
}