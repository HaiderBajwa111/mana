"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/ui/use-toast";

export function useChatNotifications() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const supabase = createClient();
  const { toast } = useToast();

  useEffect(() => {
    // Subscribe to new messages
    const messagesSubscription = supabase
      .channel('chat-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          const newMessage = payload.new as any;
          
          // Check if this message is for the current user
          // This would need to be determined based on current user context
          // For now, we'll just show all new messages
          
          setUnreadCount(prev => prev + 1);
          setLastMessage(newMessage);
          
          // Show toast notification
          toast({
            title: "New Message",
            description: newMessage.content,
            duration: 5000,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesSubscription);
    };
  }, [supabase, toast]);

  const markAsRead = () => {
    setUnreadCount(0);
  };

  return {
    unreadCount,
    lastMessage,
    markAsRead
  };
}

