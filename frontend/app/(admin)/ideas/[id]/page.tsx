"use client";

import React, { useState } from 'react';
import Link from 'next/link';

// Mock Data: Simulating fetching a single idea from Spring Boot by ID
const IDEA_DETAIL = {
  id: "1",
  title: "Upgrade Campus Wi-Fi in Building A",
  content: "The internet connection drops frequently during peak hours. We need more access points on the 3rd and 4th floors to support online exams. Currently, students are failing to submit their quizzes on time due to network timeouts. I propose we partner with Cisco or Aruba to install enterprise-grade access points.",
  author: "John Doe",
  department: "IT Faculty",
  date: "Oct 24, 2025 • 10:30 AM",
  category: "Infrastructure",
  upvotes: 45,
  downvotes: 2,
  status: "Under Review",
  documents: [
    { name: "wifi_coverage_report.pdf", size: "2.4 MB" }
  ]
};

const MOCK_COMMENTS = [
  { id: 1, author: "Jane Smith", role: "QA Coordinator", text: "I agree. We have received multiple complaints about this issue this semester.", date: "2 hours ago" },
  { id: 2, author: "Anonymous", role: "Staff", text: "Building B has the exact same problem. We should upgrade both.", date: "1 hour ago" }
];

export default function IdeaDetailPage({ params }: { params: { id: string } }) {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(MOCK_COMMENTS);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      const newComment = {
        id: comments.length + 1,
        author: "Current User",
        role: "Staff",
        text: commentText,
        date: "Just now"
      };
      setComments([...comments, newComment]);
      setCommentText("");
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* 1. Header & Navigation */}
      <div className="flex items-center gap-4">
        <Link href="/ideas" className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Idea Details</h1>
        </div>
      </div>

      {/* 2. Main Idea Content Card */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        
        {/* Meta info */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white text-lg">
              {IDEA_DETAIL.author.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-gray-900">{IDEA_DETAIL.author}</p>
              <p className="text-sm text-gray-500">{IDEA_DETAIL.department} • {IDEA_DETAIL.date}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-semibold rounded-full border border-blue-100">
              {IDEA_DETAIL.category}
            </span>
            <span className="px-3 py-1 bg-yellow-50 text-yellow-700 text-sm font-semibold rounded-full border border-yellow-100">
              {IDEA_DETAIL.status}
            </span>
          </div>
        </div>

        {/* Content */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{IDEA_DETAIL.title}</h2>
        <div className="prose max-w-none text-gray-700 leading-relaxed mb-8">
          <p>{IDEA_DETAIL.content}</p>
        </div>

        {/* Attachments */}
        {IDEA_DETAIL.documents.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Attached Documents</h3>
            <div className="flex gap-4">
              {IDEA_DETAIL.documents.map((doc, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition">
                  <div className="p-2 bg-red-50 text-red-600 rounded">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                    <p className="text-xs text-gray-500">{doc.size}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Voting Actions */}
        <div className="flex items-center gap-6 pt-6 border-t border-gray-100">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition font-medium text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path></svg>
            Upvote ({IDEA_DETAIL.upvotes})
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition font-medium text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"></path></svg>
            Downvote ({IDEA_DETAIL.downvotes})
          </button>
        </div>
      </div>

      {/* 3. Comments Section */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Discussion ({comments.length})</h3>

        {/* Comment Input */}
        <form onSubmit={handlePostComment} className="mb-8">
          <textarea
            rows={3}
            placeholder="Add to the discussion..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none mb-3"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !commentText.trim()}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 disabled:bg-blue-300 transition"
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 flex-shrink-0">
                {comment.author === "Anonymous" ? "?" : comment.author.charAt(0)}
              </div>
              <div className="flex-1 bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-bold text-gray-900">{comment.author}</span>
                    <span className="ml-2 px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded font-medium">{comment.role}</span>
                  </div>
                  <span className="text-xs text-gray-500">{comment.date}</span>
                </div>
                <p className="text-gray-700 text-sm">{comment.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}