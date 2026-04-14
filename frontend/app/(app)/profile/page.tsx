"use client";

import React, { useState, useEffect } from "react";
import { 
  User, Mail, Building, GraduationCap, Camera, 
  MapPin, Calendar, Edit3, ShieldCheck, FileText, Loader2,
  ShieldAlert, Users, Server, Terminal, CheckSquare,
  Phone, Link, Gift, Home
} from "lucide-react";
import IdeaCard, { IdeaType } from "@/components/IdeaCard";
import { useLanguage } from "@/components/LanguageProvider";

interface UserProfile {
  id: string;
  fullName: string;
  username: string;
  email: string;
  role: string;
  departmentName: string;
  academicYearName: string;
  avatarUrl: string;
  joinDate: string;
  locationName: string;
  dob: string;
  mobile: string;
  socialLinks: string;
  address: string;
  totalIdeas: number;
}

export default function ProfilePage() {
  const { t } = useLanguage();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [myIdeas, setMyIdeas] = useState<IdeaType[]>([]);
  const [isLoadingIdeas, setIsLoadingIdeas] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "ideas">("info");

  const getToken = () => {
    try {
      const directToken = localStorage.getItem("accessToken");
      if (directToken) return directToken;
      const userStorage = localStorage.getItem("user");
      if (userStorage) {
        const userObj = JSON.parse(userStorage);
        return userObj.accessToken || "";
      }
    } catch (e) {
      console.error("Token error");
    }
    return "";
  };

  const fetchUserProfile = async () => {
    setIsLoadingProfile(true);
    try {
      const token = getToken();
      const response = await fetch("http://localhost:9999/api/v1/auth/me", {
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        }
      });
      
      if (!response.ok) {
        throw new Error("API Auth Failed.");
      }
      
      const data = await response.json();
      const userData = data.result || data;

      let safeAvatarUrl = "/files/default/avatar.png";
      if (userData.avatar) {
        safeAvatarUrl = userData.avatar.startsWith('http') 
          ? userData.avatar 
          : `http://localhost:9999/api/v1/${userData.avatar.startsWith('/') ? '' : '/'}${userData.avatar}`;
      }

      const buildFullName = (u: any) => {
        const parts = [u.firstName, u.middleName, u.lastName].filter(p => p && p.trim() !== '');
        return parts.length > 0 ? parts.join(' ') : (u.username || "Unknown User");
      };

      const formatDOB = (dateStr: string) => {
        if (!dateStr) return "N/A";
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return "N/A";
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      };

      setProfile({
        id: userData.uuid || userData.id || "unknown",
        fullName: buildFullName(userData),
        username: userData.username || "unknown",
        email: userData.email || "N/A",
        role: userData.roles?.[0]?.name || "Staff",
        departmentName: userData.department?.name || "General Department",
        academicYearName: userData.academicYearName || "Current Year", 
        avatarUrl: safeAvatarUrl,
        joinDate: (userData.joinDate || userData.createdAt) 
          ? new Date(userData.joinDate || userData.createdAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) 
          : "Recently", 
        locationName: userData.locationName || userData.location || "Greenwich Campus",
        dob: formatDOB(userData.dob),
        mobile: userData.mobile || "N/A",
        socialLinks: userData.socialLinks || "N/A",
        address: userData.address || "N/A",
        totalIdeas: userData.totalIdeas || 0
      });
    } catch (err: any) {
      const storedRole = localStorage.getItem("user_role") || "ROLE_STAFF";
      if (storedRole === "ROLE_ADMIN") setProfile(getMockAdminProfile());
      else if (storedRole === "ROLE_QA_MANAGER") setProfile(getMockQAManagerProfile());
      else if (storedRole === "ROLE_QA_COORDINATOR") setProfile(getMockQACoordinatorProfile());
      else setProfile(getMockStaffProfile());
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const fetchMyIdeas = async () => {
    setIsLoadingIdeas(true);
    try {
      const token = getToken();
      const timestamp = new Date().getTime();
      const response = await fetch(`http://localhost:9999/api/v1/idea/me?_t=${timestamp}`, {
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        }
      });
      
      if (!response.ok) throw new Error("Failed to fetch ideas");
      
      const data = await response.json();
      const rawIdeas = data.content || data.result?.content || data;

      if (rawIdeas && Array.isArray(rawIdeas)) {
        const mappedIdeas: IdeaType[] = rawIdeas.map((beIdea: any) => {
          let formattedDate = "Unknown Date";
          if (beIdea.createdAt) {
            const dateObj = new Date(beIdea.createdAt);
            formattedDate = dateObj.toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' });
          }
          return {
            id: beIdea.id, 
            title: beIdea.title || "Untitled Idea", 
            content: beIdea.content || "No content provided.",
            categoryName: beIdea.departmentName || "General", 
            authorName: beIdea.authorName || "Unknown User", 
            createdAt: formattedDate,
            isAnonymous: beIdea.anonymous || false, 
            reactions: {
              LIKE: beIdea.reactions?.LIKE || beIdea.totalReactions || 0,
              LOVE: beIdea.reactions?.LOVE || 0,
              HAHA: beIdea.reactions?.HAHA || 0,
              WOW: beIdea.reactions?.WOW || 0,
              SAD: beIdea.reactions?.SAD || 0,
              ANGRY: beIdea.reactions?.ANGRY || 0,
            },
            userReaction: beIdea.userReaction === "NONE" ? null : beIdea.userReaction || null,
            commentsCount: beIdea.commentCount || 0, 
            viewsCount: beIdea.viewCount || 0, 
            hasAttachments: (beIdea.attachments?.length > 0) || (beIdea.images?.length > 0),
            attachments: beIdea.attachments || [], 
            images: beIdea.images || []
          };
        });
        setMyIdeas(mappedIdeas);
      } else { 
        setMyIdeas([]); 
      }
    } catch (err) { 
      setMyIdeas([]); 
    } finally { 
      setIsLoadingIdeas(false); 
    }
  };

  useEffect(() => { 
    fetchUserProfile(); 
    fetchMyIdeas(); 
  }, []);

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 dark:text-slate-400 font-bold">{t("profile.loading")}</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const isAdmin = profile.role === "ROLE_ADMIN" || profile.role === "System Admin" || profile.role === "Admin";
  const isQAManager = profile.role === "ROLE_QA_MANAGER" || profile.role === "QA Manager";
  const isQACoord = profile.role === "ROLE_QA_COORDINATOR" || profile.role === "QA Coordinator";

  const themeClasses = {
    coverBg: isAdmin ? 'bg-gradient-to-r from-rose-700 via-red-800 to-slate-900' : 
             isQAManager ? 'bg-gradient-to-r from-emerald-600 via-teal-700 to-slate-900' : 
             isQACoord ? 'bg-gradient-to-r from-violet-600 via-purple-700 to-slate-900' : 
             'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600',
    avatarContainer: isAdmin ? 'border-white dark:border-slate-900 bg-rose-100 dark:bg-rose-900 text-rose-500 dark:text-rose-400' : 
                     isQAManager ? 'border-white dark:border-slate-900 bg-emerald-100 dark:bg-emerald-900 text-emerald-500 dark:text-emerald-400' : 
                     isQACoord ? 'border-white dark:border-slate-900 bg-violet-100 dark:bg-violet-900 text-violet-500 dark:text-violet-400' : 
                     'border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500',
    roleBadge: isAdmin ? 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-800/50' : 
               isQAManager ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/50' : 
               isQACoord ? 'bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 border-violet-100 dark:border-violet-800/50' : 
               'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800/50',
    tabActiveText: isAdmin ? 'text-rose-600 dark:text-rose-400' : isQAManager ? 'text-emerald-600 dark:text-emerald-400' : isQACoord ? 'text-violet-600 dark:text-violet-400' : 'text-blue-600 dark:text-blue-400',
    tabUnderline: isAdmin ? 'bg-rose-600 dark:bg-rose-500' : isQAManager ? 'bg-emerald-600 dark:bg-emerald-500' : isQACoord ? 'bg-violet-600 dark:bg-violet-500' : 'bg-blue-600 dark:bg-blue-500',
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-20 transition-colors duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden mb-6 transition-colors">
        <div className={`h-48 md:h-64 w-full relative ${themeClasses.coverBg}`}>
          <div className="absolute inset-0 bg-black/20"></div>
          <button className="absolute top-4 right-4 p-2 bg-black/30 hover:bg-black/50 backdrop-blur-md text-white rounded-xl transition-all flex items-center gap-2 text-sm font-semibold">
            <Camera className="w-4 h-4" /> <span className="hidden sm:inline">{t("profile.edit_cover")}</span>
          </button>
        </div>
        <div className="px-6 sm:px-10 pb-8 relative">
          <div className="flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-8 -mt-16 sm:-mt-20 mb-6">
            <div className="relative inline-block shrink-0">
              <div className={`w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 shadow-xl overflow-hidden flex items-center justify-center transition-colors ${themeClasses.avatarContainer}`}>
                {profile.avatarUrl.includes("default") ? (
                  <span className="text-5xl font-extrabold tracking-tighter">
                    {profile.fullName.substring(0, 2).toUpperCase()}
                  </span>
                ) : (
                  <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                )}
              </div>
              <button className="absolute bottom-2 right-2 p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shadow-md rounded-full transition-all group">
                <Camera className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
            </div>
            <div className="flex-1 pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {profile.fullName}
                  </h1>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700">
                      @{profile.username}
                    </span>
                    <div className={`flex items-center gap-1.5 font-bold px-3 py-1 rounded-lg text-xs w-fit transition-colors border ${themeClasses.roleBadge}`}>
                      {isAdmin ? <ShieldAlert className="w-3.5 h-3.5" /> : isQAManager ? <ShieldCheck className="w-3.5 h-3.5" /> : isQACoord ? <Users className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />} 
                      {profile.role}
                    </div>
                  </div>
                </div>
                <button className="px-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm shrink-0 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
                  <Edit3 className="w-4 h-4" /> {t("profile.edit_profile")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-8 border-b border-slate-200 dark:border-slate-800 mb-6 px-4 transition-colors">
        <button onClick={() => setActiveTab("info")} className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'info' ? themeClasses.tabActiveText : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}>
          <span className="flex items-center gap-2"><User className="w-4 h-4" /> {t("profile.tab_info")}</span>
          {activeTab === 'info' && <div className={`absolute bottom-0 left-0 w-full h-1 rounded-t-full ${themeClasses.tabUnderline}`}></div>}
        </button>
        <button onClick={() => setActiveTab("ideas")} className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'ideas' ? themeClasses.tabActiveText : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}>
          <span className="flex items-center gap-2">
            {isAdmin ? <Terminal className="w-4 h-4" /> : isQAManager ? <CheckSquare className="w-4 h-4" /> : isQACoord ? <Users className="w-4 h-4" /> : <FileText className="w-4 h-4" />} 
            {isAdmin ? t("admin_profile.audit_logs") : isQAManager ? t("qa_profile.tab_approvals") : isQACoord ? t("qa_coord_profile.tab_staff") : t("profile.tab_ideas")}
          </span>
          {activeTab === 'ideas' && <div className={`absolute bottom-0 left-0 w-full h-1 rounded-t-full ${themeClasses.tabUnderline}`}></div>}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {activeTab === "info" && (
          <>
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8 transition-colors">
                <h3 className="text-lg font-black text-slate-800 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                  {t("profile.personal_details")}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-8">
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2"><Mail className="w-4 h-4" /> {t("profile.email")}</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{profile.email}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2"><Phone className="w-4 h-4" /> Mobile</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{profile.mobile}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2"><Gift className="w-4 h-4" /> Date of Birth</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{profile.dob}</span>
                  </div>
                  {isAdmin ? (
                    <>
                      <div className="flex flex-col gap-2">
                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2"><Server className="w-4 h-4" /> System Version</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">v2.4.0 (Enterprise)</span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2"><ShieldAlert className="w-4 h-4" /> Access Level</span>
                        <span className="font-black text-rose-600 dark:text-rose-400">Root Administrator</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex flex-col gap-2">
                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2"><Building className="w-4 h-4" /> {t("profile.department")}</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{profile.departmentName}</span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2"><GraduationCap className="w-4 h-4" /> {t("profile.academic_year")}</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{profile.academicYearName}</span>
                      </div>
                    </>
                  )}
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2"><Calendar className="w-4 h-4" /> {t("profile.joined_date")}</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{profile.joinDate}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2"><MapPin className="w-4 h-4" /> {t("profile.location")}</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{profile.locationName}</span>
                  </div>
                  <div className="flex flex-col gap-2 sm:col-span-2">
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2"><Home className="w-4 h-4" /> Address</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{profile.address}</span>
                  </div>
                  <div className="flex flex-col gap-2 sm:col-span-2">
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2"><Link className="w-4 h-4" /> Social Link</span>
                    {profile.socialLinks !== "N/A" ? (
                      <a href={profile.socialLinks} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:underline truncate">{profile.socialLinks}</a>
                    ) : (
                      <span className="font-semibold text-slate-800 dark:text-slate-200">N/A</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="md:col-span-1 space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8 transition-colors">
                <h3 className="text-lg font-black text-slate-800 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                  {t("profile.activity_stats")}
                </h3>
                {isAdmin && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-5 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 transition-colors">
                      <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 rounded-xl flex items-center justify-center shrink-0"><Users className="w-6 h-6" /></div>
                      <div>
                        <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Managed Users</p>
                        <p className="text-2xl font-black text-slate-800 dark:text-white mt-0.5">1,205</p>
                      </div>
                    </div>
                  </div>
                )}
                {(!isAdmin && !isQAManager && !isQACoord) && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-5 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 transition-colors">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center shrink-0"><FileText className="w-6 h-6" /></div>
                      <div>
                        <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t("profile.ideas_submitted")}</p>
                        <p className="text-2xl font-black text-slate-800 dark:text-white mt-0.5">{profile.totalIdeas || myIdeas.length}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === "ideas" && (
          <div className="md:col-span-3 space-y-6">
            {isAdmin && (
               <div className="flex flex-col items-center justify-center py-24 px-6 text-emerald-500 bg-slate-950 dark:bg-black rounded-3xl border border-slate-800 shadow-inner font-mono transition-colors">
                 <Terminal className="w-16 h-16 mb-6 text-emerald-600/50" />
                 <p className="text-2xl font-black text-emerald-400 mb-2 tracking-tight">/var/log/system.log</p>
                 <p className="text-emerald-600/70">No current audit logs found.</p>
               </div>
            )}
            {(!isAdmin && !isQAManager && !isQACoord) && (
              <>
                {isLoadingIdeas ? (
                  <div className="flex flex-col items-center justify-center py-24 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 transition-colors">
                    <Loader2 className="w-12 h-12 animate-spin mb-4" />
                    <p className="font-bold text-slate-500 dark:text-slate-400 animate-pulse">Loading your brilliant ideas...</p>
                  </div>
                ) : myIdeas.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 px-6 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                    <div className="text-6xl mb-6">📝</div>
                    <p className="text-2xl font-black text-slate-800 dark:text-white mb-2">{t("home.no_ideas")}</p>
                    <p className="text-slate-500 dark:text-slate-400 max-w-sm text-center leading-relaxed">{t("profile.no_ideas")}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myIdeas.map((idea) => (
                      <div key={idea.id} className="h-full">
                        <IdeaCard idea={idea} />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function getMockAdminProfile(): UserProfile { return { id: "1", fullName: "System Admin", username: "sysadmin", email: "admin@greenwich.edu.vn", role: "ROLE_ADMIN", departmentName: "University Board", academicYearName: "All", avatarUrl: "/files/default/avatar.png", joinDate: "Sep 2024", locationName: "Main", dob: "N/A", mobile: "N/A", socialLinks: "N/A", address: "N/A", totalIdeas: 0 }; }
function getMockQAManagerProfile(): UserProfile { return { id: "2", fullName: "QA Master", username: "qamaster", email: "qa@greenwich.edu.vn", role: "ROLE_QA_MANAGER", departmentName: "QA Dept", academicYearName: "2025-2026", avatarUrl: "/files/default/avatar.png", joinDate: "Oct 2024", locationName: "Main", dob: "N/A", mobile: "N/A", socialLinks: "N/A", address: "N/A", totalIdeas: 0 }; }
function getMockQACoordinatorProfile(): UserProfile { return { id: "3", fullName: "IT Coordinator", username: "itcoord", email: "it.coord@greenwich.edu.vn", role: "ROLE_QA_COORDINATOR", departmentName: "IT Department", academicYearName: "2025-2026", avatarUrl: "/files/default/avatar.png", joinDate: "Nov 2024", locationName: "Campus", dob: "N/A", mobile: "N/A", socialLinks: "N/A", address: "N/A", totalIdeas: 0 }; }
function getMockStaffProfile(): UserProfile { return { id: "4", fullName: "Trung Min", username: "trungmin", email: "trungmin@student.greenwich.edu.vn", role: "ROLE_STAFF", departmentName: "IT Department", academicYearName: "2025-2026", avatarUrl: "/files/default/avatar.png", joinDate: "Jan 2025", locationName: "Greenwich Campus", dob: "N/A", mobile: "N/A", socialLinks: "N/A", address: "N/A", totalIdeas: 5 }; }