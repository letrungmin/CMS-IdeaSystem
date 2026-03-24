"use client";

import React, { useState } from "react";
import { 
  User, Bell, Lock, Eye, Globe, Palette, 
<<<<<<< HEAD
  Save, ShieldCheck, Mail, Smartphone, Heart 
=======
  Save, ShieldCheck, Mail, Smartphone 
>>>>>>> ce7d26faf57dbd960db18dedb1323adf3e65d957
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* HEADER */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your account preferences and security settings.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* LEFT: SETTINGS NAVIGATION */}
        <div className="w-full md:w-64 space-y-1">
          {[
            { id: "general", label: "General", icon: <Globe className="w-4 h-4" /> },
            { id: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4" /> },
            { id: "privacy", label: "Privacy", icon: <Eye className="w-4 h-4" /> },
            { id: "security", label: "Security", icon: <Lock className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id 
                ? "bg-slate-900 text-white shadow-lg shadow-slate-200" 
                : "text-slate-500 hover:bg-white hover:text-slate-900"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* RIGHT: SETTINGS CONTENT */}
        <div className="flex-1 space-y-6">
          
          {activeTab === "general" && (
            <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-bold text-slate-800">General Preferences</h3>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Language</label>
                  <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-blue-500">
                    <option>English (United States)</option>
                    <option>Tiếng Việt (Vietnam)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Theme Mode</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button className="flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-blue-500 bg-blue-50 text-blue-700 font-bold text-sm">
                      <Palette className="w-4 h-4" /> Light
                    </button>
                    <button className="flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-slate-100 bg-slate-50 text-slate-400 font-bold text-sm hover:border-slate-200">
                      <Palette className="w-4 h-4" /> Dark (Soon)
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeTab === "notifications" && (
            <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-bold text-slate-800">Notification Channels</h3>
              </div>
              <div className="p-6 space-y-6">
                {[
                  { title: "Email Notifications", desc: "Receive weekly digests and important updates.", icon: <Mail className="text-blue-500" /> },
                  { title: "Push Notifications", desc: "Get instant alerts on your mobile/desktop.", icon: <Smartphone className="text-purple-500" /> },
                  { title: "Reaction Alerts", desc: "Notify me when someone reacts to my ideas.", icon: <Heart className="text-rose-500" size={16} /> },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex gap-4">
                      <div className="p-2 bg-slate-50 rounded-lg h-fit">{item.icon}</div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{item.title}</p>
                        <p className="text-xs text-slate-500">{item.desc}</p>
                      </div>
                    </div>
                    {/* CUSTOM TOGGLE SWITCH */}
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={i !== 1} />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === "security" && (
            <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-bold text-slate-800">Password & Security</h3>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">New Password</label>
                    <input type="password" placeholder="Min. 8 characters" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500" />
                  </div>
                </div>
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <p className="text-xs text-emerald-700 leading-relaxed font-medium">
                    Two-factor authentication (2FA) is currently <strong>enabled</strong>. Your account is protected by your university email.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* ACTION BUTTONS */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">Cancel</button>
            <button className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95">
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}