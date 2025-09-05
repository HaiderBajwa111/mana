"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  Send,
  MoreVertical,
  Phone,
  Video,
  FileText,
  Image,
  Paperclip,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Message {
  id: string;
  content: string;
  timestamp: Date;
  isFromUser: boolean;
  status: "sent" | "delivered" | "read";
}

interface Conversation {
  id: string;
  makerName: string;
  makerAvatar: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isOnline: boolean;
  projectTitle: string;
  status: "active" | "completed" | "pending";
}

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");

  // Mock data - replace with real data from your backend
  const conversations: Conversation[] = [
    {
      id: "1",
      makerName: "Alex Chen",
      makerAvatar: "/assets/placeholders/placeholder-user.jpg",
      lastMessage:
        "I've started printing your drone frame. Should be ready by Friday!",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      unreadCount: 2,
      isOnline: true,
      projectTitle: "Drone Frame - Voronoi Design",
      status: "active",
    },
    {
      id: "2",
      makerName: "Sarah Johnson",
      makerAvatar: "/assets/placeholders/placeholder-user.jpg",
      lastMessage: "Your quote is ready. $45 for the lamp shade.",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      unreadCount: 0,
      isOnline: false,
      projectTitle: "Lamp Shade - Geometric Pattern",
      status: "pending",
    },
    {
      id: "3",
      makerName: "Mike Rodriguez",
      makerAvatar: "/assets/placeholders/placeholder-user.jpg",
      lastMessage: "Print completed! Ready for pickup.",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      unreadCount: 0,
      isOnline: true,
      projectTitle: "Phone Stand - Minimalist",
      status: "completed",
    },
    {
      id: "4",
      makerName: "Emma Wilson",
      makerAvatar: "/assets/placeholders/placeholder-user.jpg",
      lastMessage: "I can start your project next week. What's your timeline?",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      unreadCount: 1,
      isOnline: false,
      projectTitle: "Custom Keychain - Logo Design",
      status: "pending",
    },
  ];

  const messages: Record<string, Message[]> = {
    "1": [
      {
        id: "1",
        content:
          "Hi Alex! I'm interested in your printing services for my drone frame design.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
        isFromUser: true,
        status: "read",
      },
      {
        id: "2",
        content:
          "Hello! I'd be happy to help with your drone frame. Can you share the STL file?",
        timestamp: new Date(
          Date.now() - 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 15
        ),
        isFromUser: false,
        status: "read",
      },
      {
        id: "3",
        content: "Sure! I've uploaded the file. It's a Voronoi pattern design.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
        isFromUser: true,
        status: "read",
      },
      {
        id: "4",
        content:
          "Perfect! I can see the design. What material and color would you prefer?",
        timestamp: new Date(
          Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 30
        ),
        isFromUser: false,
        status: "read",
      },
      {
        id: "5",
        content:
          "I'd like it in black PLA. What's the estimated cost and timeline?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        isFromUser: true,
        status: "read",
      },
      {
        id: "6",
        content:
          "I've started printing your drone frame. Should be ready by Friday!",
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        isFromUser: false,
        status: "delivered",
      },
    ],
  };

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.makerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.projectTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentConversation = selectedConversation
    ? conversations.find((c) => c.id === selectedConversation)
    : null;
  const currentMessages = selectedConversation
    ? messages[selectedConversation] || []
    : [];

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    // TODO: Implement send message functionality
    console.log("Sending message:", newMessage);
    setNewMessage("");
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60)
      );
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-[600px] px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Messages</h1>
        <p className="text-muted-foreground">
          Communicate with makers about your projects
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-4">
            <CardTitle>Conversations</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              <div className="space-y-1">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                      selectedConversation === conversation.id ? "bg-muted" : ""
                    }`}
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={conversation.makerAvatar}
                            alt={conversation.makerName}
                          />
                          <AvatarFallback>
                            {conversation.makerName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        {conversation.isOnline && (
                          <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium text-sm truncate">
                            {conversation.makerName}
                          </h3>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(conversation.lastMessageTime)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate mb-2">
                          {conversation.lastMessage}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge
                            variant="secondary"
                            className={`text-xs ${getStatusColor(conversation.status)}`}
                          >
                            {conversation.status}
                          </Badge>
                          {conversation.unreadCount > 0 && (
                            <Badge className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2">
          {selectedConversation && currentConversation ? (
            <>
              {/* Chat Header */}
              <CardHeader className="pb-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={currentConversation.makerAvatar}
                        alt={currentConversation.makerName}
                      />
                      <AvatarFallback>
                        {currentConversation.makerName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">
                        {currentConversation.makerName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {currentConversation.projectTitle}
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
              </CardHeader>

              {/* Messages */}
              <CardContent className="p-0">
                <ScrollArea className="h-[400px] p-4">
                  <div className="space-y-4">
                    {currentMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isFromUser ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg px-4 py-2 ${
                            message.isFromUser
                              ? "bg-blue-600 text-white"
                              : "bg-muted"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div
                            className={`flex items-center justify-between mt-2 text-xs ${
                              message.isFromUser
                                ? "text-blue-100"
                                : "text-muted-foreground"
                            }`}
                          >
                            <span>
                              {message.timestamp.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            {message.isFromUser && (
                              <span className="ml-2">
                                {message.status === "read"
                                  ? "✓✓"
                                  : message.status === "delivered"
                                    ? "✓✓"
                                    : "✓"}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Image className="h-4 w-4" />
                    </Button>
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleSendMessage()
                      }
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">
                  No conversation selected
                </h3>
                <p className="text-muted-foreground">
                  Choose a conversation from the list to start messaging
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
