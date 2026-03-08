import React from 'react';
import IdeaDetailModal from './IdeaDetailModal';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, MessageSquare, Eye, Clock } from "lucide-react";

export interface IdeaProps {
  id: string; title: string; content: string; categoryName: string;
  authorName: string; isAnonymous: boolean; viewCount: number;
  upvotes: number; downvotes: number; commentCount: number; createdAt: string;
}

export default function IdeaCard({ idea }: { idea: IdeaProps }) {
  if (!idea) return null;
  const displayName = idea.isAnonymous ? "Anonymous Student" : idea.authorName;
  const avatarInitials = idea.isAnonymous ? "🕵️" : idea.authorName.substring(0, 2).toUpperCase();

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow duration-200 border-slate-200">
      <CardHeader className="pb-3 flex flex-row items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-slate-100">
            <AvatarImage src={idea.isAnonymous ? "" : `https://api.dicebear.com/7.x/initials/svg?seed=${idea.authorName}`} />
            <AvatarFallback className="bg-slate-100 text-slate-600">{avatarInitials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-sm text-slate-900">{displayName}</span>
            <div className="flex items-center text-xs text-slate-500 mt-0.5"><Clock className="w-3 h-3 mr-1" /> {idea.createdAt}</div>
          </div>
        </div>
        <Badge variant="secondary" className="bg-blue-50 text-blue-700">{idea.categoryName}</Badge>
      </CardHeader>
      <CardContent className="pb-4">
        <IdeaDetailModal idea={idea}>
          <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2 hover:text-blue-600 cursor-pointer text-left">{idea.title}</h3>
        </IdeaDetailModal>
        <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">{idea.content}</p>
      </CardContent>
      <CardFooter className="pt-0 flex items-center justify-between border-t border-slate-50 mt-2 pt-3">
        <div className="flex items-center gap-1">
          <div className="flex items-center bg-slate-50 rounded-full p-0.5 border border-slate-100">
            <Button variant="ghost" size="sm" className="h-8 px-3 rounded-full hover:bg-green-100 hover:text-green-700"><ThumbsUp className="w-4 h-4 mr-1.5" />{idea.upvotes}</Button>
            <div className="w-[1px] h-4 bg-slate-200 mx-0.5"></div>
            <Button variant="ghost" size="sm" className="h-8 px-3 rounded-full hover:bg-red-100 hover:text-red-700"><ThumbsDown className="w-4 h-4 mr-1.5" />{idea.downvotes}</Button>
          </div>
          <IdeaDetailModal idea={idea}>
            <Button variant="ghost" size="sm" className="h-8 px-3 ml-2 hover:bg-slate-100 rounded-full"><MessageSquare className="w-4 h-4 mr-1.5" />{idea.commentCount} Comments</Button>
          </IdeaDetailModal>
        </div>
        <div className="flex items-center text-slate-400 text-xs font-medium"><Eye className="w-4 h-4 mr-1.5" />{idea.viewCount} views</div>
      </CardFooter>
    </Card>
  );
}