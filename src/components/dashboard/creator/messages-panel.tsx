"use client";

import type React from "react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Send, Paperclip, MessageSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock Data
const MOCK_MESSAGES = [
  {
    id: "msg1",
    orderId: "ord1",
    printer: "TechPrint Pro",
    lastMessage: "Your print is 60% complete. ETA: 2 hours",
    timestamp: "2 min ago",
    unread: true,
    avatar: "/assets/images/avatars/maker-avatar.png",
  },
  {
    id: "msg2",
    orderId: "ord2",
    printer: "MakerSpace Labs",
    lastMessage: "Material question: Would you prefer PLA or PETG?",
    timestamp: "1 hour ago",
    unread: true,
    avatar: "/assets/images/avatars/plant-avatar.png",
  },
];

interface MessagesPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MessagesPanel: React.FC<MessagesPanelProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    console.log("Sending message:", messageText);
    setMessageText("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
            className="bg-mana-black border border-mana-gray-light/20 rounded-2xl w-full max-w-4xl h-[80vh] flex overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Messages List */}
            <div className="w-1/3 border-r border-mana-gray-light/20 flex flex-col">
              <div className="p-4 border-b border-mana-gray-light/20">
                <h3 className="font-bold text-mana-text">Messages</h3>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-2 space-y-2">
                  {MOCK_MESSAGES.map((message) => (
                    <div
                      key={message.id}
                      onClick={() => setSelectedChat(message.id)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedChat === message.id
                          ? "bg-mana-mint/10 border border-mana-mint/30"
                          : "hover:bg-mana-gray/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage
                            src={message.avatar || "/assets/placeholders/placeholder.svg"}
                          />
                          <AvatarFallback>
                            {message.printer.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm truncate">
                              {message.printer}
                            </p>
                            {message.unread && (
                              <div className="w-2 h-2 bg-mana-mint rounded-full" />
                            )}
                          </div>
                          <p className="text-xs text-mana-text-secondary truncate">
                            {message.lastMessage}
                          </p>
                          <p className="text-xs text-mana-text-secondary">
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedChat ? (
                <>
                  <div className="p-4 border-b border-mana-gray-light/20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage
                          src={
                            MOCK_MESSAGES.find((m) => m.id === selectedChat)
                              ?.avatar || "/assets/placeholders/placeholder.svg"
                          }
                        />
                        <AvatarFallback>M</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {
                            MOCK_MESSAGES.find((m) => m.id === selectedChat)
                              ?.printer
                          }
                        </p>
                        <p className="text-xs text-green-400">● Online</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onClose}
                      className="text-mana-text-secondary hover:text-mana-text"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      <div className="flex justify-start">
                        <div className="bg-mana-gray/50 rounded-lg p-3 max-w-xs">
                          <p className="text-sm">
                            Hi! I've started working on your Voronoi lamp shade.
                            The print is looking great so far!
                          </p>
                          <p className="text-xs text-mana-text-secondary mt-1">
                            2:30 PM
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <div className="bg-mana-mint text-mana-black rounded-lg p-3 max-w-xs">
                          <p className="text-sm">
                            Awesome! Can't wait to see it. How long until
                            completion?
                          </p>
                          <p className="text-xs opacity-70 mt-1">2:32 PM</p>
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div className="bg-mana-gray/50 rounded-lg p-3 max-w-xs">
                          <p className="text-sm">
                            About 2 more hours. I'll send you progress photos!
                          </p>
                          <p className="text-xs text-mana-text-secondary mt-1">
                            2:35 PM
                          </p>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>

                  <div className="p-4 border-t border-mana-gray-light/20">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-mana-text-secondary"
                      >
                        <Paperclip className="w-4 h-4" />
                      </Button>
                      <Input
                        placeholder="Type a message..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleSendMessage()
                        }
                        className="flex-1 bg-mana-gray/50 border-mana-gray-light/30"
                      />
                      <Button
                        onClick={handleSendMessage}
                        className="bg-mana-mint text-mana-black hover:bg-mana-mint/90"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="w-12 h-12 text-mana-text-secondary mx-auto mb-4" />
                    <p className="text-mana-text-secondary">
                      Select a conversation to start messaging
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MessagesPanel;
