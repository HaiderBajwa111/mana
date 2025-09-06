"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Paperclip, 
  Image, 
  X, 
  MessageSquare,
  Phone,
  Video,
  MoreVertical,
  FileText
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRealtimeChat, type Conversation, type Message } from "@/hooks/use-realtime-chat";
import { ChatFileUpload } from "./chat-file-upload";
import { type ChatFileAttachment } from "@/hooks/use-chat-file-upload";
import { useCurrentUser } from "@/hooks/auth/use-current-user";
import { formatDistanceToNow } from "date-fns";

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
  initialConversationId?: string;
}

export function ChatInterface({ 
  isOpen, 
  onClose, 
  projectId,
  initialConversationId 
}: ChatInterfaceProps) {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(
    initialConversationId ?? null
  );
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingAttachments, setPendingAttachments] = useState<ChatFileAttachment[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { user } = useCurrentUser();
  const {
    conversations,
    messages,
    loading,
    sending,
    sendMessage,
    fetchMessages,
    getOrCreateConversation
  } = useRealtimeChat();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedConversationId]);

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversationId && !messages[selectedConversationId]) {
      fetchMessages(selectedConversationId);
    }
  }, [selectedConversationId, fetchMessages, messages]);

  // Create conversation for project if needed
  useEffect(() => {
    if (projectId && isOpen && !selectedConversationId) {
      const existingConv = conversations.find(conv => conv.project.id === projectId);
      if (existingConv) {
        setSelectedConversationId(existingConv.id);
      } else {
        getOrCreateConversation(projectId).then(conv => {
          setSelectedConversationId(conv.id);
        });
      }
    }
  }, [projectId, isOpen, selectedConversationId, conversations, getOrCreateConversation]);

  const handleSendMessage = async () => {
    if ((!messageText.trim() && pendingAttachments.length === 0) || !selectedConversationId || sending) return;
    
    await sendMessage(selectedConversationId, messageText, pendingAttachments);
    setMessageText("");
    setPendingAttachments([]);
  };

  const handleFilesSelected = (attachments: ChatFileAttachment[]) => {
    setPendingAttachments(prev => [...prev, ...attachments]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv?.project?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedConversation = conversations.find(conv => conv.id === selectedConversationId);
  const currentMessages = selectedConversationId ? messages[selectedConversationId] || [] : [];

  const getOtherUser = (conversation: Conversation) => {
    // This would need to be determined based on current user context
    // For now, we'll show the creator or manufacturer
    return conversation?.project?.manufacturer || conversation?.project?.creator || { 
      id: "unknown", 
      firstName: "Unknown", 
      lastName: "User" 
    };
  };

  const formatMessageTime = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "IN_PROGRESS":
        return "bg-green-100 text-green-800 border-green-200";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "SUBMITTED":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="bg-background border rounded-2xl w-full max-w-6xl h-[85vh] flex overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Conversations List */}
          <div className="w-1/3 border-r flex flex-col">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Messages</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                {loading ? (
                  <div className="p-4 text-center text-muted-foreground">
                    Loading conversations...
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    No conversations found
                  </div>
                ) : (
                  filteredConversations.map((conversation) => {
                    // Skip conversations with missing data
                    if (!conversation || !conversation.project) {
                      console.warn("Skipping conversation with missing data:", conversation);
                      return null;
                    }
                    
                    const otherUser = getOtherUser(conversation);
                    const lastMessage = conversation.messages?.[0];
                    
                    return (
                      <div
                        key={conversation.id}
                        onClick={() => setSelectedConversationId(conversation.id)}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedConversationId === conversation.id
                            ? "bg-primary/10 border border-primary/30"
                            : "hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage
                              src={otherUser.profilePictureUrl || ""}
                              alt={`${otherUser.firstName} ${otherUser.lastName}`}
                            />
                            <AvatarFallback>
                              {otherUser.firstName?.[0]}{otherUser.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-medium text-sm truncate">
                                {otherUser.firstName} {otherUser.lastName}
                              </p>
                              {lastMessage && (
                                <span className="text-xs text-muted-foreground">
                                  {formatMessageTime(lastMessage.createdAt)}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground truncate mb-2">
                              {conversation.project.title}
                            </p>
                            {lastMessage && (
                              <p className="text-xs text-muted-foreground truncate">
                                {lastMessage.content}
                              </p>
                            )}
                            <div className="flex items-center justify-between mt-2">
                              <Badge
                                variant="secondary"
                                className={`text-xs ${getStatusColor(conversation.project.status)}`}
                              >
                                {conversation.project.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={getOtherUser(selectedConversation).profilePictureUrl || ""}
                        alt={`${getOtherUser(selectedConversation).firstName} ${getOtherUser(selectedConversation).lastName}`}
                      />
                      <AvatarFallback>
                        {getOtherUser(selectedConversation).firstName?.[0]}
                        {getOtherUser(selectedConversation).lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {getOtherUser(selectedConversation).firstName} {getOtherUser(selectedConversation).lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedConversation.project.title}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Video className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>View Project</DropdownMenuItem>
                        <DropdownMenuItem>Block User</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {currentMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender.id === getOtherUser(selectedConversation).id ? "justify-start" : "justify-end"}`}
                      >
                        <div className="flex items-end gap-2 max-w-[70%]">
                          {message.sender.id === getOtherUser(selectedConversation).id && (
                            <Avatar className="w-6 h-6">
                              <AvatarImage
                                src={message.sender.profilePictureUrl || ""}
                                alt={`${message.sender.firstName} ${message.sender.lastName}`}
                              />
                              <AvatarFallback className="text-xs">
                                {message.sender.firstName?.[0]}{message.sender.lastName?.[0]}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div
                            className={`rounded-lg px-4 py-2 ${
                              message.sender.id === getOtherUser(selectedConversation).id
                                ? "bg-muted"
                                : "bg-primary text-primary-foreground"
                            }`}
                          >
                            {message.content && <p className="text-sm">{message.content}</p>}
                            
                            {/* File attachments */}
                            {message.fileAttachments && message.fileAttachments.length > 0 && (
                              <div className="mt-2 space-y-2">
                                {message.fileAttachments.map((attachment) => (
                                  <div key={attachment.id} className="flex items-center gap-2 p-2 bg-background/50 rounded">
                                    {attachment.fileType === "stl" || attachment.fileType === "obj" || attachment.fileType === "3mf" ? (
                                      <FileText className="w-4 h-4" />
                                    ) : (
                                      <Image className="w-4 h-4" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium truncate">{attachment.fileName}</p>
                                      <p className="text-xs opacity-70">
                                        {(attachment.fileSize / 1024).toFixed(1)} KB
                                      </p>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => window.open(attachment.fileUrl, '_blank')}
                                      className="h-6 px-2 text-xs"
                                    >
                                      View
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs opacity-70">
                                {formatMessageTime(message.createdAt)}
                              </span>
                              {message.sender.id !== getOtherUser(selectedConversation).id && (
                                <span className="text-xs opacity-70 ml-2">
                                  {message.isRead ? "✓✓" : "✓"}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t">
                  {/* Pending attachments */}
                  {pendingAttachments.length > 0 && (
                    <div className="mb-3 p-2 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium">Attachments:</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setPendingAttachments([])}
                          className="h-6 w-6 p-0"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {pendingAttachments.map((attachment, index) => (
                          <div key={attachment.id} className="flex items-center gap-1 px-2 py-1 bg-background rounded text-xs">
                            {attachment.fileType === "stl" || attachment.fileType === "obj" ? (
                              <FileText className="w-3 h-3" />
                            ) : (
                              <Image className="w-3 h-3" />
                            )}
                            <span className="truncate max-w-[100px]">{attachment.fileName}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setPendingAttachments(prev => prev.filter((_, i) => i !== index))}
                              className="h-4 w-4 p-0"
                            >
                              <X className="w-2 h-2" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <ChatFileUpload 
                      onFilesSelected={handleFilesSelected}
                      disabled={sending}
                      userId={user?.id}
                      conversationId={selectedConversationId || undefined}
                    />
                    <Input
                      placeholder="Type your message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1"
                      disabled={sending}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={(!messageText.trim() && pendingAttachments.length === 0) || sending}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Select a conversation to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

