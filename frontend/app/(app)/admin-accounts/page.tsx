"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom"; // DÙNG PHÉP THUẬT NÀY ĐỂ MODAL ĐÈ LÊN MỌI THỨ
import { useLanguage } from "@/components/LanguageProvider";

export default function AdminAccountsPage() {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false); // Tránh lỗi SSR của Next.js
  const [searchTerm, setSearchTerm] = useState("");
  
  const [accounts, setAccounts] = useState<any[]>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [rolesList, setRolesList] = useState<any[]>([]);
  const [departmentsList, setDepartmentsList] = useState<any[]>([]);
  const [isLoadingFormOptions, setIsLoadingFormOptions] = useState(false);
  
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    firstName: "",
    middleName: "",
    lastName: "",
    password: "",
    dob: "",
    mobile: "",
    socialLinks: "",
    address: "",
    location: "GREENWICH_HANOI", 
    roleId: "",
    departmentId: ""
  });
  
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // Đảm bảo code chỉ chạy Portal khi client đã render xong
  useEffect(() => {
    setMounted(true);
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    setIsLoadingAccounts(true);
    setFetchError(null);
    try {
      const token = localStorage.getItem("accessToken");
      
      const response = await fetch("http://localhost:9999/api/v1/auth", {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error(`API Error ${response.status}: Failed to load accounts.`);
      }

      const data = await response.json();
      const usersList = data.result?.content || [];
      
      if (!Array.isArray(usersList)) {
        throw new Error("Backend returned invalid data structure (expected an array in result.content).");
      }

      const mappedAccounts = usersList.map((user: any) => ({
        id: user.id || "N/A",
        name: user.username || "Unknown",
        email: user.email || "No Email",
        role: user.roles && user.roles.length > 0 ? user.roles[0] : "ROLE_STAFF",
        department: user.departmentName || "Unassigned",
        avatarUrl: user.avatarUrl,
        status: "Active"
      }));
      
      setAccounts(mappedAccounts);
      
    } catch (error: any) {
      console.error("Failed to fetch accounts", error);
      setFetchError(error.message || "An unknown error occurred while fetching accounts.");
    } finally {
      setIsLoadingAccounts(false);
    }
  };

  useEffect(() => {
    if (isModalOpen && rolesList.length === 0) {
      fetchFormOptions();
    }
  }, [isModalOpen]);

  const fetchFormOptions = async () => {
    setIsLoadingFormOptions(true);
    try {
      const token = localStorage.getItem("accessToken");
      const headers = { "Authorization": `Bearer ${token}` };

      const [rolesRes, deptsRes] = await Promise.all([
        fetch("http://localhost:9999/api/v1/roles", { headers }),
        fetch("http://localhost:9999/api/v1/departments", { headers })
      ]);

      if (rolesRes.ok) {
        const rolesData = await rolesRes.json();
        const roles = rolesData.result || rolesData.content || rolesData || [];
        setRolesList(Array.isArray(roles) ? roles : []);
        if (roles.length > 0) {
          setFormData(prev => ({ ...prev, roleId: roles[0].id.toString() }));
        }
      }

      if (deptsRes.ok) {
        const deptsData = await deptsRes.json();
        const depts = deptsData.result || deptsData.content || deptsData || [];
        setDepartmentsList(Array.isArray(depts) ? depts : []);
        if (depts.length > 0) {
          setFormData(prev => ({ ...prev, departmentId: depts[0].id.toString() }));
        }
      }
    } catch (err) {
      console.error("Failed to load roles/departments", err);
      setError("Failed to load necessary form data.");
    } finally {
      setIsLoadingFormOptions(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!formData.roleId || !formData.departmentId) {
      setError("Please select a valid Role and Department.");
      setIsSubmitting(false);
      return;
    }

    try {
      const roleIdValue = isNaN(Number(formData.roleId)) ? formData.roleId : parseInt(formData.roleId);

      const payload = {
        email: formData.email,
        username: formData.username,
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        password: formData.password,
        dob: formData.dob,
        mobile: formData.mobile,
        socialLinks: formData.socialLinks,
        address: formData.address,
        location: formData.location, 
        roles: [roleIdValue], 
        department: parseInt(formData.departmentId)
      };

      const formDataToSend = new FormData();
      formDataToSend.append(
        "data",
        new Blob([JSON.stringify(payload)], { type: "application/json" })
      );

      if (avatarFile) {
        formDataToSend.append("avatar", avatarFile);
      }

      const token = localStorage.getItem("accessToken");
      
      const response = await fetch("http://localhost:9999/api/v1/auth/register", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        let errMsg = `System Error: ${response.status}`;
        try {
          const errData = await response.json();
          errMsg = errData.message || errData.error || errMsg;
        } catch (parseErr) {}
        throw new Error(errMsg);
      }

      setIsModalOpen(false);
      setFormData({
        email: "", username: "", firstName: "", middleName: "", lastName: "",
        password: "", dob: "", mobile: "", socialLinks: "", address: "",
        location: "GREENWICH_HANOI", roleId: rolesList[0]?.id?.toString() || "", departmentId: departmentsList[0]?.id?.toString() || ""
      });
      setAvatarFile(null);

      fetchAccounts();

    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleBadge = (role: string) => {
    switch(role) {
      case "ROLE_ADMIN":
        return <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 text-[10px] font-black uppercase tracking-widest border border-rose-200 dark:border-rose-800/50">ADMIN</span>;
      case "ROLE_QA_MANAGER":
        return <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-200 dark:border-emerald-800/50">QA MANAGER</span>;
      case "ROLE_QA_COORDINATOR":
        return <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 text-[10px] font-black uppercase tracking-widest border border-violet-200 dark:border-violet-800/50">QA COORD</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-200 dark:border-blue-800/50">STAFF</span>;
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-12 transition-colors duration-300">
      
      <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden border border-rose-900/30">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600 rounded-full -mr-32 -mt-32 blur-[80px] opacity-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-black uppercase tracking-widest mb-4 backdrop-blur-md">
              ADMINISTRATOR
            </div>
            <h1 className="text-3xl font-black tracking-tight mb-2">User Accounts</h1>
            <p className="text-slate-400 text-sm max-w-xl leading-relaxed">Manage system access, roles, and departmental assignments for all users.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="relative z-10 flex items-center justify-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-rose-900/50 hover:-translate-y-1 shrink-0"
          >
            + PROVISION ACCOUNT
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-3 transition-colors">
        <div className="relative flex-1">
          <input 
            type="text" 
            placeholder="Search by username or email..."
            className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-xl text-sm outline-none focus:border-rose-500 dark:focus:border-rose-500 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <select className="h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 outline-none focus:border-rose-500 dark:focus:border-rose-500 transition-colors cursor-pointer">
            <option>ALL ROLES</option>
            <option>QA MANAGER</option>
            <option>QA COORDINATOR</option>
            <option>STAFF</option>
          </select>
          <button className="h-12 px-6 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors font-bold text-sm shrink-0">
            FILTER
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <div className="overflow-x-auto custom-scrollbar relative min-h-[200px]">
          
          {isLoadingAccounts ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-slate-900/80 z-10 text-slate-400">
              <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="font-bold text-sm tracking-widest uppercase animate-pulse">Loading Accounts...</p>
            </div>
          ) : fetchError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-slate-900 z-10 p-6 text-center">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mb-3">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <p className="font-bold text-red-600 dark:text-red-400 text-lg mb-2">ERROR FETCHING DATA</p>
              <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md">{fetchError}</p>
            </div>
          ) : accounts.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-slate-900 z-10 text-slate-400">
              <p className="font-bold text-sm tracking-widest uppercase">NO ACCOUNTS FOUND</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse relative z-0">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 transition-colors">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">USER</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">ROLE</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">DEPARTMENT</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {accounts.filter(acc => acc.name.toLowerCase().includes(searchTerm.toLowerCase()) || acc.email.toLowerCase().includes(searchTerm.toLowerCase())).map((account) => (
                  <tr key={account.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {account.avatarUrl && !account.avatarUrl.includes("default") ? (
                           <img 
                              src={`http://localhost:9999${account.avatarUrl}`} 
                              alt="Avatar" 
                              className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                              onError={(e) => { (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + account.name; }}
                           />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center font-black text-sm border border-slate-200 dark:border-slate-700">
                            {account.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">{account.name}</p>
                          <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{account.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getRoleBadge(account.role)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-600 dark:text-slate-300">
                        {account.department}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="px-3 py-1 text-xs font-bold text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                          RESET PWD
                        </button>
                        <button className="px-3 py-1 text-xs font-bold text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition-colors">
                          EDIT
                        </button>
                        <button disabled={account.role === "ROLE_ADMIN"} className="px-3 py-1 text-xs font-bold text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-30">
                          DELETE
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* SỬ DỤNG CREATEPORTAL ĐỂ ĐẨY MODAL LÊN TẦNG CAO NHẤT, VƯỢT MẶT CẢ SIDEBAR VÀ HEADER */}
      {mounted && isModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 relative">
            
            {isLoadingFormOptions && (
              <div className="absolute inset-0 z-10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                <p className="text-sm font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest animate-pulse">Loading System Data...</p>
              </div>
            )}

            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-black text-slate-800 dark:text-white">Provision New Account</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors font-bold text-xs"
              >
                CLOSE
              </button>
            </div>
            
            <form onSubmit={handleCreateSubmit} className="p-6">
              {error && (
                <div className="p-3 mb-6 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Email *</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-rose-500 text-slate-800 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Username *</label>
                    <input type="text" name="username" required minLength={4} maxLength={50} value={formData.username} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-rose-500 text-slate-800 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Password *</label>
                    <input type="password" name="password" required minLength={8} value={formData.password} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-rose-500 text-slate-800 dark:text-white" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">First Name *</label>
                      <input type="text" name="firstName" required value={formData.firstName} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-rose-500 text-slate-800 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Last Name *</label>
                      <input type="text" name="lastName" required value={formData.lastName} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-rose-500 text-slate-800 dark:text-white" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Middle Name</label>
                    <input type="text" name="middleName" value={formData.middleName} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-rose-500 text-slate-800 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Date of Birth *</label>
                    <input type="date" name="dob" required value={formData.dob} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-rose-500 text-slate-800 dark:text-white" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Mobile *</label>
                    <input type="text" name="mobile" required pattern="^[0-9]{9,12}$" placeholder="9 to 12 digits" value={formData.mobile} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-rose-500 text-slate-800 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Address *</label>
                    <input type="text" name="address" required value={formData.address} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-rose-500 text-slate-800 dark:text-white" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Campus Location *</label>
                      <select name="location" required value={formData.location} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-rose-500 text-slate-800 dark:text-white">
                        <option value="GREENWICH_HANOI">Greenwich Hanoi</option>
                        <option value="GREENWICH_HCM">Greenwich Ho Chi Minh</option>
                        <option value="GREENWICH_DANANG">Greenwich Danang</option>
                        <option value="GREENWICH_CANTHO">Greenwich Can Tho</option>
                        <option value="GREENWICH_LONDON">Greenwich London</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Social Links</label>
                      <input type="text" name="socialLinks" value={formData.socialLinks} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-rose-500 text-slate-800 dark:text-white" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Role *</label>
                      <select name="roleId" required value={formData.roleId} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-rose-500 text-slate-800 dark:text-white truncate">
                        {rolesList.length === 0 && <option value="">No roles found</option>}
                        {rolesList.map(role => (
                          <option key={role.id} value={role.id}>{role.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Department *</label>
                      <select name="departmentId" required value={formData.departmentId} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-rose-500 text-slate-800 dark:text-white truncate">
                        {departmentsList.length === 0 && <option value="">No departments found</option>}
                        {departmentsList.map(dept => (
                          <option key={dept.id} value={dept.id}>{dept.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Avatar Image (Optional)</label>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-rose-500 text-slate-800 dark:text-white text-sm" />
                  </div>
                </div>
              </div>

              <div className="pt-8 flex items-center justify-end gap-3 mt-4 border-t border-slate-100 dark:border-slate-800">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  CANCEL
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting || isLoadingFormOptions}
                  className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-all shadow-md disabled:opacity-70"
                >
                  {isSubmitting ? "PROCESSING..." : "CREATE ACCOUNT"}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}