"use client";

import React, { useState } from 'react';
import Link from 'next/link';

// Mock Data: Simulating ideas fetched from the Spring Boot backend
const INITIAL_IDEAS = [
  {
    id: 1,
    title: "Upgrade Campus Wi-Fi in Building A",
    content: "The internet connection drops frequently during peak hours. We need more access points on the 3rd and 4rd floors to support online exams.",
    author: "John Doe",
    department: "IT Faculty",
    isAnonymous: false,
    date: "2 hours ago",
    category: "Infrastructure",
    upvotes: 45,
    downvotes: 2,
    comments: 12,
  },
  {
    id: 2,
    title: "More Vegetarian Options in the Canteen",
    content: "Currently, there is only one vegetarian stall. It would be great to have more healthy, plant-based meal options for students and staff.",
    author: "Hidden",
    department: "Business Dept",
    isAnonymous: true,
    date: "5 hours ago",
    category: "Food & Beverage",
    upvotes: 128,
    downvotes: 15,
    comments: 34,
  },
  {
    id: 3,
    title: "Implement AI for Plagiarism Detection",
    content: "We should integrate an AI-powered NLP service to help lecturers detect AI-generated assignments more efficiently.",
    author: "Dr. Smith",
    department: "QA Department",
    isAnonymous: false,
    date: "1 day ago",
    category: "Academic",
    upvotes: 89,
    downvotes: 4,
    comments: 21,
  }
];

export default function IdeasPage() {
  const [ideas, setIdeas] = useState(INITIAL_IDEAS);
  const [filter, setFilter] = useState('latest');

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Page Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Idea Repository</h1>
          <p className="text-sm text-gray-500 mt-1">Discover, vote, and comment on ideas from all departments.</p>
        </div>
        
        {/* LINK TO SUBMIT NEW IDEA PAGE */}
        <Link 
          href="/ideas/new" 
          className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 transition flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Submit New Idea
        </Link>
      </div>

      {/* Quick Filters */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-4">
        <button 
          onClick={() => setFilter('latest')}
          className={`px-4 py-2 text-sm font-medium rounded-full transition ${filter === 'latest' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          Latest
        </button>
        <button 
          onClick={() => setFilter('popular')}
          className={`px-4 py-2 text-sm font-medium rounded-full transition ${filter === 'popular' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          Most Popular
        </button>
        <button 
          onClick={() => setFilter('my_department')}
          className={`px-4 py-2 text-sm font-medium rounded-full transition ${filter === 'my_department' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          My Department
        </button>
      </div>

      {/* Ideas Feed */}
      <div className="space-y-4">
        {ideas.map((idea) => (
          <div key={idea.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition duration-200">
            
            {/* Idea Header: Author & Meta */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${idea.isAnonymous ? 'bg-gray-400' : 'bg-indigo-600'}`}>
                  {idea.isAnonymous ? '?' : idea.author.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    {idea.isAnonymous ? 'Anonymous Staff' : idea.author}
                  </p>
                  <p className="text-xs text-gray-500">
                    {idea.date} • <span className="font-medium text-gray-700">{idea.department}</span>
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-100">
                {idea.category}
              </span>
            </div>

            {/* Idea Body */}
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{idea.title}</h3>
              <p className="text-gray-700 text-sm leading-relaxed">{idea.content}</p>
            </div>

            {/* Idea Footer: Actions (Vote & Comment) */}
            <div className="flex items-center gap-6 pt-4 border-t border-gray-100 text-gray-500">
              
              {/* Upvote */}
              <button className="flex items-center gap-1.5 hover:text-green-600 transition group">
                <div className="p-1.5 rounded-full group-hover:bg-green-50">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path></svg>
                </div>
                <span className="text-sm font-medium">{idea.upvotes}</span>
              </button>

              {/* Downvote */}
              <button className="flex items-center gap-1.5 hover:text-red-600 transition group">
                <div className="p-1.5 rounded-full group-hover:bg-red-50">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"></path></svg>
                </div>
                <span className="text-sm font-medium">{idea.downvotes}</span>
              </button>

              {/* Comments */}
              <button className="flex items-center gap-1.5 hover:text-blue-600 transition group ml-auto">
                <div className="p-1.5 rounded-full group-hover:bg-blue-50">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                </div>
                <span className="text-sm font-medium">{idea.comments} Comments</span>
              </button>

            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <div className="flex justify-center pt-4">
        <button className="px-6 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-full shadow-sm hover:bg-gray-50 transition">
          Load More Ideas
        </button>
      </div>

    </div>
  );
}