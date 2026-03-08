"use client";

import React from "react";
import Link from "next/link";
import IdeaCard, { IdeaProps } from "@/components/IdeaCard";
import NotificationBell from "@/components/NotificationBell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, MapPin, Mail, Phone, Calendar, Building, Settings, Github, Clock, Edit } from "lucide-react";

const USER_PROFILE = { firstName: "Trung", lastName: "Min", username: "trungmin_ai", email: "trungmin.it@greenwich.edu.vn", dob: "May 20, 2003", mobile: "+84 912 345 678", address: "Greenwich Campus", department: "IT Department", socialLink: "github.com/trungmin-ai", bio: "Software Engineering student passionate about AI and Backend Development." };
const MY_IDEAS: IdeaProps[] = [{ id: "1", title: "Upgrade the Greenwich Campus Wi-Fi", content: "Dedicated network needed...", categoryName: "IT Infrastructure", authorName: "Trung Min", isAnonymous: false, viewCount: 342, upvotes: 89, downvotes: 2, commentCount: 15, createdAt: "2 hours ago" }];

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/home" className="flex items-center text-slate-500 hover:text-blue-600 font-medium group">
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Feed
          </Link>
          <div className="flex items-center gap-2">
            <NotificationBell />
            <Button variant="ghost" size="icon" className="text-slate-500 rounded-full hover:bg-slate-100"><Settings className="w-5 h-5" /></Button>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          <div className="h-48 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
          <div className="px-8 pb-8 relative">
            <div className="flex justify-between items-end -mt-16 mb-4 relative z-10">
              <Avatar className="h-32 w-32 border-4 border-white shadow-md bg-white">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${USER_PROFILE.firstName}`} />
                <AvatarFallback>TM</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900">{USER_PROFILE.firstName} {USER_PROFILE.lastName}</h1>
                <p className="text-slate-500 font-medium text-lg mb-4">@{USER_PROFILE.username}</p>
                <p className="text-slate-700 max-w-2xl leading-relaxed">{USER_PROFILE.bio}</p>
              </div>
              <Button className="rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-sm mt-2"><Edit className="w-4 h-4 mr-2" /> Edit Profile</Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h2 className="text-lg font-bold text-slate-900 mb-4">About</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3"><Building className="w-5 h-5 text-slate-400 mt-0.5" /><div><p className="text-sm font-semibold">Department</p><p className="text-sm text-slate-600">{USER_PROFILE.department}</p></div></div>
                <div className="flex items-start gap-3"><Mail className="w-5 h-5 text-slate-400 mt-0.5" /><div><p className="text-sm font-semibold">Email</p><p className="text-sm text-slate-600">{USER_PROFILE.email}</p></div></div>
                <div className="flex items-start gap-3"><Phone className="w-5 h-5 text-slate-400 mt-0.5" /><div><p className="text-sm font-semibold">Mobile</p><p className="text-sm text-slate-600">{USER_PROFILE.mobile}</p></div></div>
                <div className="flex items-start gap-3"><Calendar className="w-5 h-5 text-slate-400 mt-0.5" /><div><p className="text-sm font-semibold">DOB</p><p className="text-sm text-slate-600">{USER_PROFILE.dob}</p></div></div>
              </div>
              <Separator className="my-5" />
              <h2 className="text-lg font-bold text-slate-900 mb-4">Social Links</h2>
              <a href="#" className="flex items-center gap-3 text-blue-600 hover:underline"><Github className="w-5 h-5" /><span className="text-sm font-medium">{USER_PROFILE.socialLink}</span></a>
            </div>
          </div>

          <div className="lg:col-span-8">
            
            <Tabs defaultValue="ideas" className="w-full flex flex-col">
              
              <TabsList className="w-full flex flex-row bg-slate-100/70 border border-slate-200 rounded-full h-14 p-1.5 mb-6 shadow-inner">
                <TabsTrigger 
                  value="ideas" 
                  className="flex-1 rounded-full h-full text-base font-semibold text-slate-500 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm transition-all"
                >
                  My Ideas
                </TabsTrigger>
                <TabsTrigger 
                  value="activity" 
                  className="flex-1 rounded-full h-full text-base font-semibold text-slate-500 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm transition-all"
                >
                  Recent Activity
                </TabsTrigger>
              </TabsList>

              <TabsContent value="ideas" className="w-full mt-0 outline-none">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-900">Ideas Submitted <Badge variant="secondary" className="ml-2 bg-slate-200">{MY_IDEAS.length}</Badge></h3>
                </div>
                <div className="flex flex-col gap-4">
                  {MY_IDEAS.map((idea) => <IdeaCard key={idea.id} idea={idea} />)}
                </div>
              </TabsContent>

              <TabsContent value="activity" className="w-full mt-0 outline-none">
                <div className="w-full bg-white rounded-2xl p-8 border border-slate-200 text-center flex flex-col items-center justify-center min-h-[300px]">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4"><Clock className="w-8 h-8 text-slate-300" /></div>
                  <h3 className="text-lg font-bold">No recent activity</h3>
                  <p className="text-slate-500">When you interact with ideas, they will show up here.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}