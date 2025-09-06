"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/ui/use-toast";

export interface Message {
  id: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  sender: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    profilePictureUrl: string | null;
  };
  fileAttachments: Array<{
    id: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    fileUrl: string;
    mimeType: string | null;
  }>;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  project: {
    id: string;
    title: string;
    status: string;
    creator: {
      id: string;
      firstName: string | null;
      lastName: string | null;
      profilePictureUrl: string | null;
    };
    manufacturer: {
      id: string;
      firstName: string | null;
      lastName: string | null;
      profilePictureUrl: string | null;
    } | null;
  };
  messages: Message[];
}

export function useRealtimeChat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  
  const supabase = createClient();
  
  const { toast } = useToast();
  const subscriptionsRef = useRef<Map<string, any>>(new Map());

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    try {
      const response = await fetch("/api/conversations");
      if (!response.ok) throw new Error("Failed to fetch conversations");
      
      const data = await response.json();
      setConversations(data);
      
      // Initialize messages object
      const messagesMap: Record<string, Message[]> = {};
      data.forEach((conv: Conversation) => {
        messagesMap[conv.id] = conv.messages || [];
      });
      setMessages(messagesMap);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      toast({
        title: "Error",
        description: "Failed to load conversations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Fetch messages for a specific conversation
  const fetchMessages = useCallback(async (conversationId: string) => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}/messages`);
      if (!response.ok) throw new Error("Failed to fetch messages");
      
      const data = await response.json();
      setMessages(prev => ({
        ...prev,
        [conversationId]: data
      }));
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive"
      });
    }
  }, [toast]);

  // Send a message
  const sendMessage = useCallback(async (
    conversationId: string, 
    content: string, 
    fileAttachments: any[] = []
  ) => {
    if (!content.trim() && fileAttachments.length === 0) return;
    
    setSending(true);
    try {
      const response = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: content.trim(),
          fileAttachments
        }),
      });

      if (!response.ok) throw new Error("Failed to send message");
      
      const newMessage = await response.json();
      
      // Optimistically update local state
      setMessages(prev => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] || []), newMessage]
      }));

      // Update conversation in list
      setConversations(prev => 
        prev.map(conv => 
          conv.id === conversationId 
            ? { ...conv, updatedAt: new Date().toISOString() }
            : conv
        )
      );

    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  }, [toast]);

  // Create or get conversation for a project
  const getOrCreateConversation = useCallback(async (projectId: string, title?: string) => {
    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
          title
        }),
      });

      if (!response.ok) throw new Error("Failed to create conversation");
      
      const conversation = await response.json();
      
      // Add to conversations list if not already there
      setConversations(prev => {
        const exists = prev.find(conv => conv.id === conversation.id);
        if (exists) return prev;
        return [conversation, ...prev];
      });

      return conversation;
    } catch (error) {
      console.error("Error creating conversation:", error);
      toast({
        title: "Error",
        description: "Failed to create conversation",
        variant: "destructive"
      });
      throw error;
    }
  }, [toast]);

  // Set up real-time subscriptions
  useEffect(() => {
    const setupRealtimeSubscriptions = async () => {
      // Subscribe to new messages
      const messagesSubscription = supabase
        .channel('messages')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages'
          },
          (payload) => {
            const newMessage = payload.new as any;
            
            // Fetch the full message with relations
            fetch(`/api/conversations/${newMessage.conversationId}/messages?limit=1&offset=0`)
              .then(res => res.json())
              .then(messages => {
                if (messages.length > 0) {
                  const fullMessage = messages[0];
                  setMessages(prev => ({
                    ...prev,
                    [newMessage.conversationId]: [...(prev[newMessage.conversationId] || []), fullMessage]
                  }));

                  // Update conversation timestamp
                  setConversations(prev => 
                    prev.map(conv => 
                      conv.id === newMessage.conversationId 
                        ? { ...conv, updatedAt: new Date().toISOString() }
                        : conv
                    )
                  );
                }
              })
              .catch(console.error);
          }
        )
        .subscribe();

      subscriptionsRef.current.set('messages', messagesSubscription);

      // Subscribe to conversation updates
      const conversationsSubscription = supabase
        .channel('conversations')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'conversations'
          },
          (payload) => {
            const updatedConversation = payload.new as any;
            
            setConversations(prev => 
              prev.map(conv => 
                conv.id === updatedConversation.id 
                  ? { ...conv, updatedAt: updatedConversation.updatedAt }
                  : conv
              )
            );
          }
        )
        .subscribe();

      subscriptionsRef.current.set('conversations', conversationsSubscription);
    };

    setupRealtimeSubscriptions();

    // Cleanup subscriptions on unmount
    return () => {
      subscriptionsRef.current.forEach(subscription => {
        supabase.removeChannel(subscription);
      });
      subscriptionsRef.current.clear();
    };
  }, [supabase]);

  // Initial fetch
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return {
    conversations,
    messages,
    loading,
    sending,
    sendMessage,
    fetchMessages,
    getOrCreateConversation,
    refreshConversations: fetchConversations
  };
}

