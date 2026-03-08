import React from "react";
import IdeaCard, { IdeaProps } from "@/components/IdeaCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, PlusCircle, TrendingUp, Filter, AlertCircle } from "lucide-react";

// --- MOCK DATA ---
const MOCK_IDEAS: IdeaProps[] = [
  {
    id: "idea-001",
    title: "Upgrade the Greenwich Campus Wi-Fi for CS students",
    content: "The current library Wi-Fi drops frequently when we are downloading large Docker images or pushing code. We need a dedicated high-bandwidth network for the IT department to ensure seamless academic operations and project submissions.",
    categoryName: "IT Infrastructure",
    authorName: "Trung Min",
    isAnonymous: false,
    viewCount: 342,
    upvotes: 89,
    downvotes: 2,
    commentCount: 15,
    createdAt: "2 hours ago",
  },
  {
    id: "idea-002",
    title: "Introduce more plant-based and healthy meals in the cafeteria",
    content: "Our cafeteria heavily relies on fast food and high-carb options. Adding a dedicated salad bar and more vegan protein options would greatly benefit students' health and focus during afternoon lectures.",
    categoryName: "Student Services",
    authorName: "Anonymous Student",
    isAnonymous: true,
    viewCount: 512,
    upvotes: 124,
    downvotes: 14,
    commentCount: 32,
    createdAt: "5 hours ago",
  },
  {
    id: "idea-003",
    title: "Extend Library opening hours during final exam weeks",
    content: "Currently, the library closes at 8 PM. During the two weeks leading up to finals, it would be incredibly helpful if the library remained open until midnight to provide a quiet study space for students who live in noisy dorms.",
    categoryName: "Library & Resources",
    authorName: "Thanh Thai",
    isAnonymous: false,
    viewCount: 890,
    upvotes: 210,
    downvotes: 5,
    commentCount: 45,
    createdAt: "1 day ago",
  },
];

const TOP_CATEGORIES = [
  "IT Infrastructure",
  "Curriculum Enhancement",
  "Student Services",
  "Campus Facilities",
  "Mental Health",
];

export default function HomeFeed() {
  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* HEADER / NAVIGATION (Placeholder for actual Navbar) */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-bold text-white">
              U
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              UniIdeas
            </span>
          </div>
          
          <div className="hidden flex-1 items-center justify-center px-8 md:flex">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search ideas, categories..."
                className="h-10 w-full rounded-full border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" className="hidden sm:flex rounded-full">
              Sign In
            </Button>
            <Button className="rounded-full bg-blue-600 hover:bg-blue-700">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Idea
            </Button>
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <main className="container mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          {/* LEFT COLUMN: THE FEED (70%) */}
          <div className="lg:col-span-8">
            {/* Hero Banner / Call to Action */}
            <div className="mb-8 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white shadow-lg">
              <h1 className="mb-2 text-3xl font-bold tracking-tight">
                Academic Year 2025-2026 Ideas
              </h1>
              <p className="mb-6 max-w-xl text-blue-100 line-clamp-2">
                Your voice matters. Share your innovative ideas to improve our campus, curriculum, and student life. 
              </p>
              <div className="flex items-center gap-4">
                <Button variant="secondary" size="lg" className="rounded-full font-semibold">
                  Submit an Idea
                </Button>
                <div className="flex items-center text-sm font-medium text-blue-200">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Closes in 45 days
                </div>
              </div>
            </div>

            {/* Feed Filters */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Recent Ideas</h2>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-slate-600">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Popular
                </Button>
                <Button variant="ghost" size="sm" className="text-slate-600">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
            </div>

            {/* Idea Cards List */}
            <div className="flex flex-col gap-5">
              {MOCK_IDEAS.map((idea) => (
                <IdeaCard key={idea.id} idea={idea} />
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: SIDEBAR (30%) */}
          <div className="hidden lg:col-span-4 lg:block">
            <div className="sticky top-24 space-y-6">
              
              {/* Widget: Top Categories */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500">
                  Top Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                  {TOP_CATEGORIES.map((category) => (
                    <Badge 
                      key={category} 
                      variant="secondary" 
                      className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700"
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Widget: Rules & Terms */}
              <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-5">
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-blue-800">
                  Before you post
                </h3>
                <ul className="space-y-2 text-sm text-blue-900/80">
                  <li className="flex items-start">
                    <span className="mr-2 font-bold text-blue-500">•</span>
                    Be respectful and constructive.
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 font-bold text-blue-500">•</span>
                    Check for duplicates before submitting.
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 font-bold text-blue-500">•</span>
                    Anonymous posts are allowed but monitored by QA.
                  </li>
                </ul>
              </div>

            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}