"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  MessageSquare, 
  Search, 
  Loader2, 
  FileText,
  Image,
  CheckCircle,
  Clock
} from "lucide-react";
import { useRealtimeChat, type Conversation, type Message } from "@/hooks/use-realtime-chat";
import { useCurrentUser } from "@/hooks/auth/use-current-user";
import { formatDistanceToNow } from "date-fns";
import { ChatInterface } from "@/components/chat/chat-interface";

export default function MakerMessagesView() {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const { user } = useCurrentUser();
  const { conversations, loading } = useRealtimeChat();

  // Filter conversations based on search query
  const filteredConversations = conversations.filter(conv =>
    conv?.project?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getOtherUser = (conversation: Conversation) => {
    // For makers, the other user is the creator
    return conversation?.project?.creator || { id: "unknown", firstName: "Unknown", lastName: "User" };
  };

  const getProjectStatusColor = (status: string) => {
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

  const handleConversationClick = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
    setSelectedConversationId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Messages</h1>
        <p className="text-sm text-muted-foreground">
          Communicate with creators about your assigned projects
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Conversations List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Conversations ({filteredConversations.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Loading conversations...</p>
              </div>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-muted-foreground">No conversations yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                {searchQuery ? "No conversations match your search" : "You'll see conversations here once projects are assigned to you"}
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[600px]">
              <div className="p-4 space-y-3">
                {filteredConversations.map((conversation) => {
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
                      onClick={() => handleConversationClick(conversation.id)}
                      className={`p-4 rounded-lg cursor-pointer transition-colors border ${
                        selectedConversationId === conversation.id
                          ? "bg-purple-50 border-purple-200"
                          : "hover:bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="w-12 h-12">
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
                            <h4 className="font-semibold text-sm truncate">
                              {otherUser.firstName} {otherUser.lastName}
                            </h4>
                            {lastMessage && (
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(lastMessage.createdAt), { addSuffix: true })}
                              </span>
                            )}
                          </div>
                          
                          <p className="text-sm text-muted-foreground truncate mb-2">
                            {conversation.project.title}
                          </p>
                          
                          {lastMessage && (
                            <div className="flex items-center gap-2 mb-2">
                              {lastMessage.fileAttachments && lastMessage.fileAttachments.length > 0 ? (
                                <div className="flex items-center gap-1">
                                  {lastMessage.fileAttachments[0].fileType === "stl" || 
                                   lastMessage.fileAttachments[0].fileType === "obj" ? (
                                    <FileText className="w-3 h-3 text-muted-foreground" />
                                  ) : (
                                    <Image className="w-3 h-3 text-muted-foreground" />
                                  )}
                                  <span className="text-xs text-muted-foreground">
                                    {lastMessage.fileAttachments[0].fileName}
                                  </span>
                                </div>
                              ) : (
                                <p className="text-xs text-muted-foreground truncate">
                                  {lastMessage.content}
                                </p>
                              )}
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <Badge
                              variant="secondary"
                              className={`text-xs ${getProjectStatusColor(conversation.project.status)}`}
                            >
                              {conversation.project.status}
                            </Badge>
                            
                            <div className="flex items-center gap-1">
                              {lastMessage && (
                                <>
                                  {lastMessage.sender.id === user?.id ? (
                                    <CheckCircle className="w-3 h-3 text-green-500" />
                                  ) : (
                                    <Clock className="w-3 h-3 text-muted-foreground" />
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <ChatInterface
        isOpen={isChatOpen}
        onClose={handleCloseChat}
        initialConversationId={selectedConversationId || undefined}
      />
    </div>
  );
}
