"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Upload,
  MessageSquare,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Eye,
  MessageCircle,
  ShoppingCart,
  Play,
  Package,
  FileText,
  Plus,
  MoreVertical,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSidebar } from "@/contexts/sidebar-context";
import { toast } from "@/components/ui/use-toast";
import { useCurrentUser } from "@/hooks/auth/use-current-user";
import { useLocalStorage } from "@/hooks/utils/use-local-storage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { STLUploadModal } from "./stl-upload-modal";
import { StaticSTLThumbnail } from "@/components/3d/static-stl-thumbnail";
import { QuotesModal } from "./quotes-modal";

interface DashboardStats {
  totalPrints: number;
  activeRequests: number;
  completedPrints: number;
  totalSpent: number;
}

interface NeedsActionItem {
  id: string;
  type:
    | "new_quotes"
    | "select_maker"
    | "payment_due"
    | "unread_messages"
    | "invite_makers";
  title: string;
  description: string;
  count?: number;
  action: string;
  actionUrl: string;
  priority: "high" | "medium" | "low";
}

interface OpenRequest {
  id: string;
  title: string;
  thumbnail: string;
  thumbnailUrl?: string;
  fileUrl?: string;
  lastUpdated: string;
  status: "DRAFT" | "SUBMITTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  quoteCount?: number;
  contextCTA: string;
  contextAction: string;
}

interface PostedHomeProps {
  stats: DashboardStats;
  needsAction: NeedsActionItem[];
  openRequests: OpenRequest[];
  drafts: OpenRequest[];
  completed: OpenRequest[];
  user: any; // Add user prop
}

export default function PostedHome({
  stats,
  needsAction,
  openRequests,
  drafts,
  completed,
  user,
}: PostedHomeProps) {
  const router = useRouter();
  const { isMinimized } = useSidebar();
  const [searchQuery, setSearchQuery] = useLocalStorage<string>(
    "creator_dashboard_search",
    ""
  );
  const [activeTab, setActiveTab] = useLocalStorage<string>(
    "creator_dashboard_tab",
    "active"
  );
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showQuotesModal, setShowQuotesModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<OpenRequest | null>(null);
  const [quoteCounts, setQuoteCounts] = useState<Record<string, number>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleNewPrint = () => {
    // Trigger the hidden file input
    fileInputRef.current?.click();
  };

  const handleShowQuotes = (project: OpenRequest) => {
    setSelectedProject(project);
    setShowQuotesModal(true);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const ext = file.name
        .toLowerCase()
        .substring(file.name.lastIndexOf("."));
      if ([".stl", ".obj", ".3mf"].includes(ext)) {
        // Set the selected file and show the upload modal
        setSelectedFile(file);
        setShowUploadModal(true);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload an STL, OBJ, or 3MF file.",
          variant: "destructive",
        });
      }
    }

    // Reset the input value so the same file can be selected again
    if (event.target) {
      event.target.value = "";
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files);
      const validFile = files.find((file) => {
        const ext = file.name
          .toLowerCase()
          .substring(file.name.lastIndexOf("."));
        return [".stl", ".obj", ".3mf"].includes(ext);
      });

      if (validFile) {
        // Set the selected file and show the upload modal
        setSelectedFile(validFile);
        setShowUploadModal(true);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload an STL, OBJ, or 3MF file.",
          variant: "destructive",
        });
      }
    },
    []
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUBMITTED":
        return "bg-yellow-50 text-yellow-700 border border-yellow-200";
      case "IN_PROGRESS":
        return "bg-orange-50 text-orange-700 border border-orange-200";
      case "COMPLETED":
        return "bg-green-50 text-green-700 border border-green-200";
      case "DRAFT":
        return "bg-gray-50 text-gray-700 border border-gray-200";
      case "CANCELLED":
        return "bg-red-50 text-red-700 border border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  const getNeedsActionColor = (type: string) => {
    switch (type) {
      case "new_quotes":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "select_maker":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "payment_due":
        return "bg-red-50 text-red-700 border border-red-200";
      case "unread_messages":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      case "invite_makers":
        return "bg-orange-50 text-orange-700 border border-orange-200";
      default:
        return "bg-blue-50 text-blue-700 border border-blue-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "SUBMITTED":
        return "Awaiting responses";
      case "IN_PROGRESS":
        return "In progress";
      case "COMPLETED":
        return "Completed";
      case "DRAFT":
        return "Draft";
      case "CANCELLED":
        return "Cancelled";
      default:
        return status
          .replace("_", " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "awaiting_quotes":
        return <Clock className="w-4 h-4" />;
      case "quotes_received":
        return <MessageSquare className="w-4 h-4" />;
      case "maker_selected":
        return <CheckCircle className="w-4 h-4" />;
      case "in_production":
        return <Play className="w-4 h-4" />;
      case "shipped":
        return <Package className="w-4 h-4" />;
      case "draft":
        return <FileText className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  // Derived groupings for new tabs/labels
  const pendingQuotes = openRequests.filter((r) => r.status === "SUBMITTED");
  const inProgress = openRequests.filter((r) => r.status === "IN_PROGRESS");
  // Placeholder for now: map completed items to Ready until a READY status exists
  const ready = completed;
  const totalOrders =
    pendingQuotes.length + inProgress.length + ready.length + completed.length;

  // Fetch quote counts for all projects
  useEffect(() => {
    const fetchQuoteCounts = async () => {
      const counts: Record<string, number> = {};
      const allProjects = [...pendingQuotes, ...inProgress];
      
      for (const project of allProjects) {
        try {
          const response = await fetch(`/api/creator/project-quotes?projectId=${project.id}`);
          if (response.ok) {
            const quotes = await response.json();
            counts[project.id] = quotes.length;
          }
        } catch (error) {
          console.error(`Error fetching quotes for project ${project.id}:`, error);
        }
      }
      
      setQuoteCounts(counts);
    };

    if (openRequests.length > 0) {
      fetchQuoteCounts();
      // Refresh quote counts every 30 seconds
      const interval = setInterval(fetchQuoteCounts, 30000);
      return () => clearInterval(interval);
    }
  }, [openRequests]);

  // Filter helpers and derived filtered lists
  const matchQuery = (title: string) =>
    !searchQuery || title.toLowerCase().includes(searchQuery.toLowerCase());
  const pendingFiltered = pendingQuotes.filter((r) => matchQuery(r.title));
  const progressFiltered = inProgress.filter((r) => matchQuery(r.title));
  const readyFiltered = ready.filter((r) => matchQuery(r.title));
  const completedFiltered = completed.filter((r) => matchQuery(r.title));

  // Keyboard shortcuts for quick actions
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input/textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }
      
      if (e.key === "/") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      
      // Only trigger upload shortcut with Ctrl/Cmd + N or Ctrl/Cmd + U
      if ((e.metaKey || e.ctrlKey) && (e.key.toLowerCase() === "n" || e.key.toLowerCase() === "u")) {
        e.preventDefault();
        handleNewPrint();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div 
      className="min-h-[600px] px-4 py-6"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Hidden file input for upload button */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".stl,.obj,.3mf"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div
        className={`w-full transition-all duration-300 flex flex-col space-y-6 ${
          isMinimized ? "max-w-6xl" : "max-w-5xl"
        } mx-auto`}
      >
        {/* Header */
        }
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-2"
        >
          <h1 className="text-3xl font-semibold text-foreground">Creator Dashboard</h1>
          <p className="text-sm text-muted-foreground">Transform your 3D designs into reality with local manufacturers</p>
        </motion.div>

        {/* Steps row with tooltips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="rounded-lg border bg-card/50 p-4"
        >
          <TooltipProvider>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
              {["Start Project", "Receive Quotes", "Choose Maker", "Track Progress", "Receive Parts"].map((label, idx) => (
                <Tooltip key={label}>
                  <TooltipTrigger asChild>
                    <div className="flex items-start gap-3 cursor-help">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold bg-blue-600 text-white">
                        {idx + 1}
                      </div>
                      <div className="leading-tight">
                        <div className="text-sm font-medium">{label}</div>
                        <div className="text-xs text-muted-foreground">
                          {idx === 0 && "Upload your STL file and details"}
                          {idx === 1 && "Local makers send competitive quotes"}
                          {idx === 2 && "Compare price, ratings and delivery"}
                          {idx === 3 && "Monitor real-time updates as parts print"}
                          {idx === 4 && "Pickup locally or get delivered"}
                        </div>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {idx === 0 && "Drag & drop supported (STL, OBJ, 3MF)."}
                    {idx === 1 && "Responding makers appear under Pending Quotes."}
                    {idx === 2 && "Compare price, ETA and reviews before choosing."}
                    {idx === 3 && "Follow milestones and messages in progress."}
                    {idx === 4 && "Pickup at the shop or schedule delivery."}
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>
        </motion.div>

        {/* Main content grid removed per request */}

        {/* Gradient CTA banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <Card className="overflow-hidden border-0">
            <div
              className="relative rounded-xl p-6 md:p-7 text-white"
              style={{
                background:
                  "linear-gradient(90deg, rgba(45,122,255,1) 0%, rgba(131,56,236,1) 100%)",
              }}
            >
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <Plus className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xl font-semibold">Start 3D Print</div>
                    <div className="text-sm opacity-90">Upload your design and get instant quotes from local manufacturers</div>
                  </div>
                </div>
                <Button onClick={handleNewPrint} className="bg-white text-black hover:bg-white/90">Start Now</Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Your Prints Section - Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-4"
        >
          {/* Sticky Header */}
          <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 pb-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-foreground">My 3D Prints</h2>
                <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                  {totalOrders} order{totalOrders === 1 ? "" : "s"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search prints..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-48"
                    ref={searchInputRef}
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:shadow-md transition-all duration-200"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList
                  className={`grid w-full ${completed.length > 0 ? "grid-cols-4" : "grid-cols-3"}`}
                >
                  <TabsTrigger
                    value="active"
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    Pending Quotes ({pendingQuotes.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="inprogress"
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    In Progress ({inProgress.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="ready"
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    Ready ({ready.length})
                  </TabsTrigger>
                  {completed.length > 0 && (
                    <TabsTrigger
                      value="completed"
                      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                      Completed ({completed.length})
                    </TabsTrigger>
                  )}
                </TabsList>

                {/* Tab Content */}
                <TabsContent value="active" className="space-y-3">
                  {pendingFiltered.length === 0 ? (
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
                            Start your first print to get quotes from local
                            makers
                          </p>
                        </div>
                        <Button
                          onClick={handleNewPrint}
                          className="bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-md transition-all duration-200"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Start New Print
                        </Button>
                        <div className="text-xs text-gray-500 bg-white p-3 rounded-lg border">
                          <p className="font-medium mb-1">💡 Tip:</p>
                          <p>
                            Add detailed design notes and reference images to
                            get faster, more accurate quotes from makers.
                          </p>
                        </div>
                      </div>
                    </Card>
                  ) : (
                  pendingFiltered.map((request) => (
                      <motion.div key={request.id} whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                        <Card className="border-border bg-white">
                          <CardContent className="p-3">
                          <div className="flex items-center gap-3">
                            <StaticSTLThumbnail
                              thumbnailUrl={request.thumbnailUrl}
                              fileUrl={request.fileUrl}
                              className="w-12 h-12"
                              width={48}
                              height={48}
                            />
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-sm truncate max-w-[50vw]">{request.title}</h4>
                                <Badge
                                  className={getStatusColor(request.status)}
                                >
                                  {getStatusIcon(request.status)}
                                  <span className="ml-1 text-xs">
                                    {getStatusText(request.status)}
                                  </span>
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>Updated {request.lastUpdated}</span>
                                {quoteCounts[request.id] > 0 && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-auto py-1 px-2 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                    onClick={() => handleShowQuotes(request)}
                                  >
                                    <MessageSquare className="w-3 h-3 mr-1" />
                                    {quoteCounts[request.id]} quote{quoteCounts[request.id] > 1 ? 's' : ''}
                                  </Button>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  router.push(request.contextAction)
                                }
                                className="hover:shadow-md transition-all duration-200"
                              >
                                {request.contextCTA}
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                  >
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() =>
                                      router.push(
                                        `/creator/prints/${request.id}`
                                      )
                                    }
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      router.push(
                                        `/creator/prints/${request.id}/edit`
                                      )
                                    }
                                  >
                                    <FileText className="w-4 h-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      router.push(
                                        `/creator/prints/${request.id}/messages`
                                      )
                                    }
                                  >
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    Messages
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  )}
                </TabsContent>

                {/* In Progress */}
                <TabsContent value="inprogress" className="space-y-3">
                  {progressFiltered.length === 0 ? (
                    <Card className="p-8 text-center bg-gray-50 border-gray-300 min-h-[200px]">
                      <p className="text-gray-500 text-sm">No prints in progress.</p>
                    </Card>
                  ) : (
                    progressFiltered.map((request) => (
                      <motion.div key={request.id} whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                        <Card className="border-border bg-white">
                          <CardContent className="p-3">
                          <div className="flex items-center gap-3">
                            <StaticSTLThumbnail
                              thumbnailUrl={request.thumbnailUrl}
                              fileUrl={request.fileUrl}
                              className="w-12 h-12"
                              width={48}
                              height={48}
                            />
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-sm truncate max-w-[50vw]">{request.title}</h4>
                                <Badge className={getStatusColor(request.status)}>
                                  {getStatusIcon(request.status)}
                                  <span className="ml-1 text-xs">{getStatusText(request.status)}</span>
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>Updated {request.lastUpdated}</span>
                                {quoteCounts[request.id] > 0 && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-auto py-1 px-2 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                    onClick={() => handleShowQuotes(request)}
                                  >
                                    <MessageSquare className="w-3 h-3 mr-1" />
                                    {quoteCounts[request.id]} quote{quoteCounts[request.id] > 1 ? 's' : ''}
                                  </Button>
                                )}
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-blue-600" style={{ width: "40%" }} />
                              </div>
                            </div>
                            <Button size="sm" variant="outline" className="hover:shadow-md transition-all duration-200" onClick={() => router.push(request.contextAction)}>
                              Track Progress
                            </Button>
                          </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  )}
                </TabsContent>

                {/* Ready */}
                <TabsContent value="ready" className="space-y-3">
                  {readyFiltered.length === 0 ? (
                    <Card className="p-8 text-center bg-gray-50 border-gray-300 min-h-[200px]">
                      <p className="text-gray-500 text-sm">No prints ready for pickup.</p>
                    </Card>
                  ) : (
                    readyFiltered.map((request) => (
                      <motion.div key={request.id} whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                        <Card className="border-border bg-white">
                          <CardContent className="p-3">
                          <div className="flex items-center gap-3">
                            <StaticSTLThumbnail
                              thumbnailUrl={request.thumbnailUrl}
                              fileUrl={request.fileUrl}
                              className="w-12 h-12"
                              width={48}
                              height={48}
                            />
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-sm truncate max-w-[50vw]">{request.title}</h4>
                                <Badge className="bg-orange-50 text-orange-700 border border-orange-200">Ready for Pickup</Badge>
                              </div>
                              <div className="text-xs text-muted-foreground">Updated {request.lastUpdated}</div>
                            </div>
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">View Pickup Details</Button>
                          </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="completed" className="space-y-3">
                  {completedFiltered.length === 0 ? (
                    <Card className="p-8 text-center bg-gray-50 border-gray-300 min-h-[200px]">
                      <p className="text-gray-500 text-sm">
                        No completed prints yet.
                      </p>
                    </Card>
                  ) : (
                    completedFiltered.map((completedPrint) => (
                      <motion.div key={completedPrint.id} whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                        <Card className="border-border bg-white">
                          <CardContent className="p-3">
                          <div className="flex items-center gap-3">
                            <StaticSTLThumbnail
                              thumbnailUrl={completedPrint.thumbnailUrl}
                              fileUrl={completedPrint.fileUrl}
                              className="w-12 h-12"
                              width={48}
                              height={48}
                            />
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-sm truncate max-w-[50vw]">{completedPrint.title}</h4>
                                <Badge
                                  className={getStatusColor(
                                    completedPrint.status
                                  )}
                                >
                                  {getStatusIcon(completedPrint.status)}
                                  <span className="ml-1 text-xs">
                                    Completed
                                  </span>
                                </Badge>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Completed {completedPrint.lastUpdated}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  router.push(completedPrint.contextAction)
                                }
                                className="hover:shadow-md transition-all duration-200"
                              >
                                View Details
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                  >
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() =>
                                      router.push(
                                        `/creator/prints/${completedPrint.id}`
                                      )
                                    }
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      router.push(
                                        `/creator/prints/${completedPrint.id}/reorder`
                                      )
                                    }
                                  >
                                    <FileText className="w-4 h-4 mr-2" />
                                    Reorder
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      router.push(
                                        `/creator/prints/${completedPrint.id}/review`
                                      )
                                    }
                                  >
                                    <FileText className="w-4 h-4 mr-2" />
                                    Leave Review
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </motion.div>

        {/* Optional: Background pattern - matching empty state */}
        <div className="absolute inset-0 -z-10 opacity-5 pointer-events-none">
          <svg viewBox="0 0 400 300" className="w-full h-full">
            <defs>
              <pattern
                id="grid"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 20 0 L 0 0 0 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="400" height="300" fill="url(#grid)" />
          </svg>
        </div>
      </div>
      
      {/* STL Upload Modal */}
      <STLUploadModal
        open={showUploadModal}
        onOpenChange={(open) => {
          setShowUploadModal(open);
          if (!open) {
            setSelectedFile(null);
          }
        }}
        file={selectedFile}
      />
      
      {/* Quotes Modal */}
      {selectedProject && (
        <QuotesModal
          open={showQuotesModal}
          onOpenChange={setShowQuotesModal}
          projectId={selectedProject.id}
          projectTitle={selectedProject.title}
        />
      )}
    </div>
  );
}
