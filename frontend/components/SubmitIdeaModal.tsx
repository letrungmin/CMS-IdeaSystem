"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles, Send, ShieldAlert } from "lucide-react";

export default function SubmitIdeaModal({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsOpen(false);
      alert("Idea submitted successfully! AI duplication check passed.");
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[650px] bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2"><Sparkles className="h-6 w-6 text-blue-600" /> Submit New Idea</DialogTitle>
          <DialogDescription>Share your innovative thoughts. The AI will automatically check for duplicates.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-2">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-slate-900 font-semibold text-base">Idea Title <span className="text-red-500">*</span></Label>
            <Input id="title" placeholder="e.g., Upgrade the Campus Wi-Fi..." required className="h-11 focus-visible:ring-blue-500 text-base" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category" className="text-slate-900 font-semibold text-base">Category <span className="text-red-500">*</span></Label>
            <Select required>
              <SelectTrigger className="h-11 focus:ring-blue-500"><SelectValue placeholder="Select a category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="it">IT Infrastructure</SelectItem>
                <SelectItem value="facilities">Campus Facilities</SelectItem>
                <SelectItem value="academic">Curriculum Enhancement</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="content" className="text-slate-900 font-semibold text-base">Details & Rationale <span className="text-red-500">*</span></Label>
            <Textarea id="content" placeholder="Explain the problem and proposed solution..." className="min-h-[150px] resize-y focus-visible:ring-blue-500 text-base" required />
          </div>
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="space-y-1">
              <Label className="text-base font-semibold text-slate-900">Post Anonymously</Label>
              <p className="text-sm text-slate-500 pr-4">Identity hidden from students, visible to QA.</p>
            </div>
            <Switch className="data-[state=checked]:bg-slate-800" />
          </div>
          <div className="flex items-start gap-3 pt-2 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
            <ShieldAlert className="h-5 w-5 text-blue-600 mt-0.5" />
            <p className="text-sm text-slate-700">By clicking submit, you agree to the Terms & Conditions.</p>
          </div>
          <DialogFooter className="pt-6 border-t border-slate-100 sm:justify-between">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} disabled={isLoading}>Cancel</Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
              {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking...</> : <><Send className="mr-2 h-4 w-4" /> Submit Idea</>}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}