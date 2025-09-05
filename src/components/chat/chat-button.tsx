"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, X } from "lucide-react";
import { ChatInterface } from "./chat-interface";
import { useRealtimeChat } from "@/hooks/use-realtime-chat";

interface ChatButtonProps {
  projectId?: string;
  conversationId?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  className?: string;
  showUnreadCount?: boolean;
}

export function ChatButton({ 
  projectId, 
  conversationId,
  variant = "outline",
  size = "default",
  className = "",
  showUnreadCount = true
}: ChatButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { conversations } = useRealtimeChat();

  // Calculate unread count for this project/conversation
  const getUnreadCount = () => {
    if (!showUnreadCount) return 0;
    
    if (conversationId) {
      // Count unread messages in specific conversation
      const conversation = conversations.find(conv => conv.id === conversationId);
      if (!conversation) return 0;
      
      // This would need to be calculated based on current user
      // For now, we'll return 0 as we don't have user context here
      return 0;
    }
    
    if (projectId) {
      // Count unread messages in project conversation
      const conversation = conversations.find(conv => conv.project.id === projectId);
      if (!conversation) return 0;
      
      // This would need to be calculated based on current user
      return 0;
    }
    
    // Count all unread messages
    return conversations.reduce((total, conv) => {
      // This would need to be calculated based on current user
      return total;
    }, 0);
  };

  const unreadCount = getUnreadCount();

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setIsOpen(true)}
        className={`relative ${className}`}
      >
        <MessageSquare className="h-4 w-4" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        )}
      </Button>

      <ChatInterface
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        projectId={projectId}
        initialConversationId={conversationId}
      />
    </>
  );
}

