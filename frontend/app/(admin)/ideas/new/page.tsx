"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function SubmitIdeaPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: '',
    isAnonymous: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation using Toast Error
    if (!agreedToTerms) {
      toast.error("You must agree to the Terms and Conditions before submitting.");
      return;
    }

    setIsSubmitting(true);
    
    // Show loading toast and keep its ID to update it later
    const toastId = toast.loading("Analyzing your idea with AI...");

    try {
      // 1. CALL THE PYTHON AI MICROSERVICE (Port 8000)
      const aiResponse = await fetch('http://localhost:8000/api/v1/analyze-sentiment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: formData.content }),
      });

      if (!aiResponse.ok) {
        throw new Error("AI Service is not responding.");
      }

      const aiData = await aiResponse.json();

      // 2. TODO: Send both formData and aiData.sentiment to Spring Boot Backend
      // Simulating network delay for Backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 3. Update the loading toast to a SUCCESS toast
      toast.success(
        `Idea Submitted! AI Sentiment: ${aiData.sentiment}`,
        { id: toastId }
      );
      
      // 4. Redirect back to the Ideas feed
      router.push('/ideas');
      
    } catch (error) {
      console.error("Failed to submit idea:", error);
      // Update the loading toast to an ERROR toast
      toast.error("Error: Python AI Service is not responding on port 8000!", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Link href="/ideas" className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Submit New Idea</h1>
          <p className="text-sm text-gray-500 mt-1">Share your thoughts to improve our university. Powered by AI.</p>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Title Input */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Idea Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="E.g., Upgrade Campus Wi-Fi"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>

          {/* Category Selection */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
            >
              <option value="" disabled>Select a category</option>
              <option value="infrastructure">Infrastructure & Facilities</option>
              <option value="academic">Academic & Curriculum</option>
              <option value="student_life">Student Life & Events</option>
              <option value="canteen">Food & Beverage (Canteen)</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Content Textarea */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Idea Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="content"
              name="content"
              required
              rows={5}
              value={formData.content}
              onChange={handleChange}
              placeholder="Describe your idea in detail. What is the problem? What is your proposed solution?"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
            />
          </div>

          {/* Toggles & Checkboxes */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            
            {/* Anonymous Toggle */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="isAnonymous"
                  name="isAnonymous"
                  type="checkbox"
                  checked={formData.isAnonymous}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="isAnonymous" className="font-medium text-gray-700">Post Anonymously</label>
                <p className="text-gray-500">Your name will be hidden from public view.</p>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="font-medium text-gray-700">
                  I agree to the <a href="#" className="text-blue-600 hover:underline">Terms and Conditions</a> <span className="text-red-500">*</span>
                </label>
              </div>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push('/ideas')}
              className="px-6 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 transition flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                'Submit Idea'
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}