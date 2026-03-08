import React from "react";
import Link from "next/link";
import IdeaCard, { IdeaProps } from "@/components/IdeaCard";
import SubmitIdeaModal from "@/components/SubmitIdeaModal";
import NotificationBell from "@/components/NotificationBell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, PlusCircle, TrendingUp, Filter, AlertCircle } from "lucide-react";

const MOCK_IDEAS: IdeaProps[] = [
  { id: "1", title: "Upgrade the Greenwich Campus Wi-Fi", content: "We need dedicated bandwidth...", categoryName: "IT Infrastructure", authorName: "Trung Min", isAnonymous: false, viewCount: 342, upvotes: 89, downvotes: 2, commentCount: 15, createdAt: "2 hours ago" },
  { id: "2", title: "More vegetarian options", content: "Adding a dedicated salad bar...", categoryName: "Student Services", authorName: "Anon", isAnonymous: true, viewCount: 512, upvotes: 124, downvotes: 14, commentCount: 32, createdAt: "5 hours ago" }
];

const TOP_CATEGORIES = ["IT Infrastructure", "Curriculum Enhancement", "Student Services", "Campus Facilities", "Mental Health"];

export default function HomeFeed() {
  return (
    <div className="min-h-screen bg-slate-50/50">
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-bold text-white shadow-sm">U</div>
            <span className="text-xl font-bold tracking-tight text-slate-900">UniIdeas</span>
          </div>
          <div className="hidden flex-1 items-center justify-center px-8 md:flex">
            <div className="relative w-full max-w-md group">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input type="text" placeholder="Search ideas..." className="h-10 w-full rounded-full border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition-all focus:border-blue-500 focus:bg-white" />
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <NotificationBell />
            <Link href="/profile">
              <Button variant="outline" className="hidden sm:flex rounded-full transition-colors hover:bg-slate-100">My Profile</Button>
            </Link>
            <SubmitIdeaModal>
              <Button className="rounded-full bg-blue-600 hover:bg-blue-700 transition-transform hover:scale-105 shadow-md shadow-blue-200"><PlusCircle className="mr-2 h-4 w-4" /> New Idea</Button>
            </SubmitIdeaModal>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-6xl px-4 py-8 animate-in fade-in duration-700 slide-in-from-bottom-4">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="mb-8 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 animate-hero-gradient p-8 text-white shadow-lg relative overflow-hidden group">
              <div className="relative z-10">
                <h1 className="mb-2 text-3xl font-bold tracking-tight drop-shadow-sm">Academic Year 2025-2026 Ideas</h1>
                <p className="mb-6 max-w-xl text-blue-50 line-clamp-2">Your voice matters. Share your innovative ideas to improve our campus.</p>
                <div className="flex items-center gap-4">
                  <SubmitIdeaModal>
                    <Button variant="secondary" size="lg" className="rounded-full font-semibold">Submit an Idea</Button>
                  </SubmitIdeaModal>
                  <div className="flex items-center text-sm font-medium text-white bg-black/20 px-3 py-1.5 rounded-full"><AlertCircle className="mr-2 h-4 w-4" /> Closes in 45 days</div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-5">
              {MOCK_IDEAS.map((idea) => <IdeaCard key={idea.id} idea={idea} />)}
            </div>
          </div>

          <div className="hidden lg:col-span-4 lg:block">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500">Top Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {TOP_CATEGORIES.map(cat => <Badge key={cat} variant="secondary">{cat}</Badge>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}