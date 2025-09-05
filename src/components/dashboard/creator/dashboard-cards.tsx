"use client";

import React, { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Upload,
  FileText,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Plus,
  Search,
  Clock,
  MessageSquare,
  Eye,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";

interface UploadModelCardProps {
  onFileUpload?: (file: File) => void;
}

export const UploadModelCard: React.FC<UploadModelCardProps> = ({
  onFileUpload,
}) => {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
    if (event.target) {
      event.target.value = "";
    }
  };

  const processFile = (file: File) => {
    // Validate file type
    const ext = file.name.toLowerCase().substring(file.name.lastIndexOf("."));
    if ([".stl", ".obj", ".3mf"].includes(ext)) {
      setIsUploading(true);

      // Simulate upload process
      setTimeout(() => {
        setIsUploading(false);
        (window as any).__transferredFile = file;

        toast({
          title: "Model uploaded successfully! 🎉",
          description: `${file.name} is ready for printing.`,
        });

        if (onFileUpload) {
          onFileUpload(file);
        }

        router.push("/creator/start-print?skipUpload=true");
      }, 1500);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload an STL, OBJ, or 3MF file.",
        variant: "destructive",
      });
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const validFile = files.find((file) => {
      const ext = file.name.toLowerCase().substring(file.name.lastIndexOf("."));
      return [".stl", ".obj", ".3mf"].includes(ext);
    });

    if (validFile) {
      processFile(validFile);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload an STL, OBJ, or 3MF file.",
        variant: "destructive",
      });
    }
  }, []);

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".stl,.obj,.3mf"
        onChange={handleFileSelect}
        className="hidden"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex-1"
      >
        <Card
          className={`h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed transition-all duration-200 hover:shadow-md border-blue-300 bg-blue-50/50 ${
            isDragging
              ? "border-blue-500 bg-blue-100/70 shadow-lg scale-[1.02]"
              : "hover:border-blue-400"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <CardContent className="space-y-6 text-center flex flex-col items-center justify-center">
            <div className="text-blue-600">
              {isUploading ? (
                <div className="w-12 h-12 mx-auto mb-4 text-green-500">
                  <CheckCircle className="w-12 h-12" />
                </div>
              ) : (
                <div className="w-12 h-12 mb-4">
                  <Upload className="w-12 h-12" />
                </div>
              )}
            </div>

            <h2 className="text-xl font-semibold text-foreground">
              Start by uploading a model
            </h2>
            <p className="text-gray-600 text-base">
              {isDragging
                ? "Drop your file here!"
                : "Upload your STL or 3MF file to get matched with a Maker who can print your part. You can also drag and drop files here."}
            </p>

            <Button
              onClick={handleUploadClick}
              size="lg"
              disabled={isUploading}
              className="mt-6 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 bg-blue-600 hover:bg-blue-700"
            >
              {isUploading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-4 h-4 mr-2"
                  >
                    <Upload className="w-4 h-4" />
                  </motion.div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload a Model
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export const NothingHereYetCard: React.FC = () => {
  const handleSampleSTLClick = () => {
    window.open("https://www.thingiverse.com/thing:763622", "_blank");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="flex-1"
    >
      <Card className="h-full bg-white border-border p-6 flex flex-col justify-between">
        <div className="flex flex-col items-center justify-center my-auto">
          <div id="empty-state-message" className="">
            <h3 className="text-lg font-medium text-foreground mb-2">
              📦 Nothing here yet...
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              You haven't submitted any print jobs.
            </p>
          </div>
          <div id="help-section" className="space-y-4 mt-auto">
            <h4 className="text-lg font-medium text-foreground">
              🧠 Not sure what to upload?
            </h4>
            <div className="flex flex-col gap-3">
              <Button
                variant="outline"
                onClick={handleSampleSTLClick}
                className="flex items-center gap-2 hover:shadow-md transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-500/20 border-blue-800 hover:border-blue-900 hover:bg-blue-50"
              >
                <FileText className="w-4 h-4" />
                Try our sample STL file
                <ExternalLink className="w-3 h-3" />
              </Button>
              <Button
                variant="outline"
                asChild
                className="flex items-center gap-2 hover:shadow-md transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-500/20 border-blue-800 hover:border-blue-900 hover:bg-blue-50"
              >
                <Link
                  href="/guides/beginners"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FileText className="w-4 h-4" />
                  Read our beginner's guide
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export const YourPrintsCard: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="w-full"
    >
      <Card className="w-full bg-gray-50 border-gray-300 p-6 min-h-[200px] hover:shadow-md transition-all duration-200">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Your Prints
        </h2>
        <div className="flex flex-col items-center justify-center h-full text-center">
          <p className="text-gray-500 text-sm">
            Your print jobs and project history will appear here once you start
            uploading models.
          </p>
        </div>
      </Card>
    </motion.div>
  );
};

// Cards for users with existing prints
interface NeedsAttentionCardProps {
  needsAction: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    count?: number;
    action: string;
    actionUrl: string;
    priority: "high" | "medium" | "low";
  }>;
}

export const NeedsAttentionCard: React.FC<NeedsAttentionCardProps> = ({
  needsAction,
}) => {
  const router = useRouter();

  const getNeedsActionColor = (type: string) => {
    switch (type) {
      case "new_quotes":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "select_maker":
        return "bg-green-100 text-green-800 border-green-200";
      case "payment_due":
        return "bg-red-100 text-red-800 border-red-200";
      case "unread_messages":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "invite_makers":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (needsAction.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="space-y-4"
    >
      <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
        <AlertCircle className="w-6 h-6 text-blue-600" />
        Needs Your Attention
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {needsAction.map((item) => (
          <Card
            key={item.id}
            className={`${
              item.type === "new_quotes" || item.type === "select_maker"
                ? "border-blue-200 bg-white border-2"
                : "border-blue-200 bg-blue-50/50 border-2"
            }`}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-base font-semibold ${
                        item.type === "new_quotes" ||
                        item.type === "select_maker"
                          ? "text-black"
                          : "text-blue-800"
                      }`}
                    >
                      {item.title}
                    </span>
                    {item.count && (
                      <Badge
                        variant="secondary"
                        className={getNeedsActionColor(item.type)}
                      >
                        {item.count}
                      </Badge>
                    )}
                  </div>
                  <p
                    className={`text-sm ${
                      item.type === "new_quotes" || item.type === "select_maker"
                        ? "text-black"
                        : "text-blue-700"
                    }`}
                  >
                    {item.description}
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => router.push(item.actionUrl)}
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-md transition-all duration-200"
                >
                  {item.action}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
};

export const NewPrintCard: React.FC = () => {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNewPrint = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
    if (event.target) {
      event.target.value = "";
    }
  };

  const processFile = (file: File) => {
    const ext = file.name.toLowerCase().substring(file.name.lastIndexOf("."));
    if ([".stl", ".obj", ".3mf"].includes(ext)) {
      setIsUploading(true);
      setTimeout(() => {
        setIsUploading(false);
        (window as any).__transferredFile = file;
        toast({
          title: "Model uploaded successfully! 🎉",
          description: `${file.name} is ready for printing.`,
        });
        router.push("/creator/start-print?skipUpload=true");
      }, 1500);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload an STL, OBJ, or 3MF file.",
        variant: "destructive",
      });
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const validFile = files.find((file) => {
      const ext = file.name.toLowerCase().substring(file.name.lastIndexOf("."));
      return [".stl", ".obj", ".3mf"].includes(ext);
    });

    if (validFile) {
      processFile(validFile);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload an STL, OBJ, or 3MF file.",
        variant: "destructive",
      });
    }
  }, []);

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".stl,.obj,.3mf"
        onChange={handleFileSelect}
        className="hidden"
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card
          className="border-2 border-dashed border-blue-300 bg-blue-50/50 transition-all duration-200 cursor-pointer"
          onClick={handleNewPrint}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <CardContent className="p-4 text-center">
            <Upload className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <h3 className="text-base font-semibold text-foreground mb-1">
              New Print
            </h3>
            <p className="text-xs text-gray-600 mb-3">
              Upload a new model or drag & drop files here
            </p>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-md transition-all duration-200 mb-2"
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-4 h-4 mr-2"
                  >
                    <Upload className="w-4 h-4" />
                  </motion.div>
                  Uploading...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Start New Print
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export const ProTipsCard: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="lg:col-span-1"
    >
      <Card className="border-green-200 bg-green-50/50 h-full">
        <CardHeader>
          <CardTitle className="text-lg text-green-800">💡 Pro Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-green-700 space-y-2">
            <p>• Add detailed design notes for accurate quotes</p>
            <p>• Include reference images when possible</p>
            <p>• Set realistic deadlines to avoid rush fees</p>
            <p>• Consider multiple materials for cost options</p>
            <p>• Communicate clearly with makers</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

interface YourPrintsTabsCardProps {
  openRequests: Array<{
    id: string;
    title: string;
    thumbnail: string;
    thumbnailUrl?: string;
    lastUpdated: string;
    status: "DRAFT" | "SUBMITTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
    quoteCount?: number;
    contextCTA: string;
    contextAction: string;
  }>;
  drafts: Array<{
    id: string;
    title: string;
    thumbnail: string;
    thumbnailUrl?: string;
    lastUpdated: string;
    status: "DRAFT" | "SUBMITTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
    contextCTA: string;
    contextAction: string;
  }>;
  completed: Array<{
    id: string;
    title: string;
    thumbnail: string;
    thumbnailUrl?: string;
    lastUpdated: string;
    status: "DRAFT" | "SUBMITTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
    contextCTA: string;
    contextAction: string;
  }>;
}

export const YourPrintsTabsCard: React.FC<YourPrintsTabsCardProps> = ({
  openRequests,
  drafts,
  completed,
}) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("active");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "SUBMITTED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "COMPLETED":
        return "bg-green-100 text-green-800 border-green-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "DRAFT":
        return <FileText className="w-3 h-3" />;
      case "SUBMITTED":
        return <Clock className="w-3 h-3" />;
      case "IN_PROGRESS":
        return <Upload className="w-3 h-3" />;
      case "COMPLETED":
        return <CheckCircle className="w-3 h-3" />;
      case "CANCELLED":
        return <AlertCircle className="w-3 h-3" />;
      default:
        return <FileText className="w-3 h-3" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "Draft";
      case "SUBMITTED":
        return "Submitted";
      case "IN_PROGRESS":
        return "In Progress";
      case "COMPLETED":
        return "Completed";
      case "CANCELLED":
        return "Cancelled";
      default:
        return status;
    }
  };

  const handleNewPrint = () => {
    router.push("/creator/start-print");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="space-y-4"
    >
      {/* Sticky Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 pb-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Your Prints</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search prints..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger
            value="active"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Active ({openRequests.length})
          </TabsTrigger>
          <TabsTrigger
            value="drafts"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Drafts ({drafts.length})
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Completed ({completed.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab Content */}
        <TabsContent value="active" className="space-y-3">
          {openRequests.length === 0 ? (
            <Card className="p-8 text-center bg-gray-50 border-gray-300 min-h-[200px]">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Upload className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No active requests yet
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">
                    Start your first print to get quotes from local makers
                  </p>
                </div>
                <Button
                  onClick={handleNewPrint}
                  className="bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-md transition-all duration-200"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Start New Print
                </Button>
              </div>
            </Card>
          ) : (
            openRequests.map((request) => (
              <Card key={request.id} className="border-border bg-white">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                      {request.thumbnailUrl ? (
                        <img
                          src={request.thumbnailUrl}
                          alt={`${request.title} preview`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FileText className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{request.title}</h4>
                        <Badge className={getStatusColor(request.status)}>
                          {getStatusIcon(request.status)}
                          <span className="ml-1 text-xs">
                            {getStatusText(request.status)}
                          </span>
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Updated {request.lastUpdated}</span>
                        {request.quoteCount && (
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            {request.quoteCount} quotes
                          </span>
                        )}
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-1" />
                      {request.contextCTA}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="drafts" className="space-y-3">
          {drafts.length === 0 ? (
            <Card className="p-8 text-center bg-gray-50 border-gray-300 min-h-[200px]">
              <p className="text-gray-500 text-sm">No draft prints.</p>
            </Card>
          ) : (
            drafts.map((draft) => (
              <Card key={draft.id} className="border-border bg-white">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                      {draft.thumbnailUrl ? (
                        <img
                          src={draft.thumbnailUrl}
                          alt={`${draft.title} preview`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FileText className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{draft.title}</h4>
                        <Badge className={getStatusColor(draft.status)}>
                          {getStatusIcon(draft.status)}
                          <span className="ml-1 text-xs">
                            {getStatusText(draft.status)}
                          </span>
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Updated {draft.lastUpdated}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      {draft.contextCTA}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-3">
          {completed.length === 0 ? (
            <Card className="p-8 text-center bg-gray-50 border-gray-300 min-h-[200px]">
              <p className="text-gray-500 text-sm">No completed prints yet.</p>
            </Card>
          ) : (
            completed.map((completedPrint) => (
              <Card key={completedPrint.id} className="border-border bg-white">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                      {completedPrint.thumbnailUrl ? (
                        <img
                          src={completedPrint.thumbnailUrl}
                          alt={`${completedPrint.title} preview`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FileText className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">
                          {completedPrint.title}
                        </h4>
                        <Badge
                          className={getStatusColor(completedPrint.status)}
                        >
                          {getStatusIcon(completedPrint.status)}
                          <span className="ml-1 text-xs">
                            {getStatusText(completedPrint.status)}
                          </span>
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Updated {completedPrint.lastUpdated}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      {completedPrint.contextCTA}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};
