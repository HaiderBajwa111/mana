"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { MapPin, Download, PackageCheck, Loader2, RefreshCw, Eye, Info } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/ui/use-toast";
import { type AvailableProject } from "@/types/maker";
import { ProjectDetailModal } from "./project-detail-modal";
import { StaticSTLThumbnail } from "@/components/3d/static-stl-thumbnail";
import { useState as useModalState } from "react";
import { OptimizedSTLViewer } from "@/components/3d/optimized-stl-viewer";
import { QuoteCalculatorModal } from "./quote-calculator-modal";

export default function MakerDashboardView() {
  const [activeTab, setActiveTab] = useState<"new" | "inprogress" | "ready" | "completed">("new");
  const [projects, setProjects] = useState<AvailableProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedProject, setSelectedProject] = useState<AvailableProject | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [previewProject, setPreviewProject] = useModalState<AvailableProject | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useModalState(false);
  const [quoteProject, setQuoteProject] = useState<AvailableProject | null>(null);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const { toast } = useToast();
  
  // Touch handling for double-tap
  const lastTapRef = useRef<number>(0);
  const DOUBLE_TAP_DELAY = 300; // milliseconds

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/maker/available-projects", { credentials: "same-origin" });
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      setProjects(data);
      return data;
    } catch (e) {
      toast({ title: "Error", description: "Failed to load available projects", variant: "destructive" });
      return [];
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        await fetchProjects();
      } finally {
        setLoading(false);
      }
    };
    load();

    // Poll for new projects every 30 seconds
    const interval = setInterval(() => {
      fetchProjects();
    }, 30000);

    return () => clearInterval(interval);
  }, [toast]);

  // Temporary bucketing by index to demo tabs
  const groups = useMemo(() => {
    return {
      NEW: projects.slice(0, Math.max(0, projects.length)),
      IN_PROGRESS: [],
      READY: [],
      COMPLETED: [],
    };
  }, [projects]);

  const listFor = (key: "new" | "inprogress" | "ready" | "completed") =>
    key === "new" ? groups.NEW : key === "inprogress" ? groups.IN_PROGRESS : key === "ready" ? groups.READY : groups.COMPLETED;

  // Handle double-click for desktop
  const handleProjectDoubleClick = (project: AvailableProject) => {
    setSelectedProject(project);
    setDetailModalOpen(true);
  };

  // Handle touch for mobile double-tap
  const handleProjectTouch = (project: AvailableProject) => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTapRef.current;
    
    if (timeSinceLastTap < DOUBLE_TAP_DELAY && timeSinceLastTap > 0) {
      // Double tap detected
      setSelectedProject(project);
      setDetailModalOpen(true);
    }
    
    lastTapRef.current = now;
  };

  const handleSendQuote = () => {
    // Open quote calculator modal from project detail modal
    if (selectedProject) {
      setQuoteProject(selectedProject);
      setQuoteModalOpen(true);
      setDetailModalOpen(false);
    }
  };

  const handleSendQuoteFromList = (project: AvailableProject) => {
    setQuoteProject(project);
    setQuoteModalOpen(true);
  };

  const handleQuoteSent = async () => {
    // Refresh projects after quote is sent
    await fetchProjects();
  };

  const handlePreviewSTL = (project: AvailableProject) => {
    setPreviewProject(project);
    setPreviewModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Manufacturing Dashboard</h1>
        <p className="text-sm text-muted-foreground">Browse and quote on 3D printing projects from local creators</p>
      </div>

      <Card className="bg-purple-50 border-purple-100">
        <CardContent className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {["Browse Projects","Submit Quote","Get Accepted","Print & Deliver"].map((t, i) => (
              <div key={t} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-white text-purple-700 border border-purple-200 flex items-center justify-center text-xs font-semibold">{i+1}</div>
                <div>
                  <div className="text-sm font-medium">{t}</div>
                  <div className="text-xs text-muted-foreground">
                    {i===0&&"Review available print requests from creators"}
                    {i===1&&"Provide competitive pricing and delivery times"}
                    {i===2&&"Creator selects your quote to start production"}
                    {i===3&&"Complete the order and deliver to customer"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Available Projects</h2>
          <p className="text-xs text-muted-foreground mt-1">Browse and send quotes for 3D printing projects</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              setRefreshing(true);
              await fetchProjects();
              setRefreshing(false);
              toast({ title: "Refreshed", description: "Projects updated" });
            }}
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <span className="px-2 py-1 text-xs bg-muted rounded-full">{projects.length} project{projects.length===1?"":"s"}</span>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v)=>setActiveTab(v as any)} className="w-full">
        <TabsList className={`grid w-full ${groups.COMPLETED.length>0?"grid-cols-4":"grid-cols-3"}`}>
          <TabsTrigger value="new" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">New Requests ({groups.NEW.length})</TabsTrigger>
          <TabsTrigger value="inprogress" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">In Progress ({groups.IN_PROGRESS.length})</TabsTrigger>
          <TabsTrigger value="ready" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Ready ({groups.READY.length})</TabsTrigger>
          {groups.COMPLETED.length>0 && (
            <TabsTrigger value="completed" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Completed ({groups.COMPLETED.length})</TabsTrigger>
          )}
        </TabsList>

        {(["new","inprogress","ready","completed"] as const).map((key)=> (
          <TabsContent key={key} value={key} className="space-y-4 mt-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Loading available projects...</p>
                </div>
              </div>
            ) : (
              listFor(key).map((p)=> (
                <Card 
                  key={p.id} 
                  className="border-border transition-shadow hover:shadow-md"
                >
                  <CardContent className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-start gap-4 min-w-0">
                      <StaticSTLThumbnail
                        thumbnailUrl={p.thumbnailUrl}
                        fileUrl={p.fileUrl}
                        className="w-16 h-16"
                        width={64}
                        height={64}
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold truncate max-w-[50vw]">{p.title}</h3>
                          {key==="new" && <Badge className="bg-blue-100 text-blue-800 border border-blue-200">New Request</Badge>}
                          {key==="inprogress" && <Badge className="bg-orange-100 text-orange-800 border border-orange-200">In Progress</Badge>}
                          {key==="ready" && <Badge className="bg-green-100 text-green-800 border border-green-200">Ready for Pickup</Badge>}
                          {key==="completed" && <Badge className="bg-gray-200 text-gray-800 border">Completed</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{p.description}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{p.city || "Unknown"}, {p.state || "Unknown"}</span>
                          <Separator orientation="vertical" className="h-4" />
                          <span>Qty: {p.quantity}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button 
                        variant="outline"
                        onClick={() => handleProjectDoubleClick(p)}
                        className="flex items-center gap-2"
                      >
                        <Info className="w-4 h-4" />
                        See Details
                      </Button>
                      {key==="new" ? (
                        <Button 
                          className="bg-purple-600 hover:bg-purple-700"
                          onClick={() => handleSendQuoteFromList(p)}
                        >
                          Send Quote
                        </Button>
                      ) : key==="inprogress" ? (
                        <Button variant="outline">Update Status</Button>
                      ) : key==="ready" ? (
                        <Button variant="outline">View Pickup Details</Button>
                      ) : (
                        <Button variant="outline" asChild><Link href="#">View Review</Link></Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handlePreviewSTL(p)}
                        title="Preview STL in 3D"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon" title="Download STL">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}

            {!loading && listFor(key).length===0 && (
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <PackageCheck className="w-4 h-4" /> No projects in this filter
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
      
      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        onSendQuote={handleSendQuote}
      />
      
      {/* Quote Calculator Modal */}
      <QuoteCalculatorModal
        project={quoteProject}
        open={quoteModalOpen}
        onOpenChange={setQuoteModalOpen}
        onQuoteSent={handleQuoteSent}
      />
      
      {/* STL Preview Modal */}
      {previewModalOpen && previewProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">3D Preview: {previewProject.title}</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setPreviewModalOpen(false);
                  setPreviewProject(null);
                }}
              >
                Close
              </Button>
            </div>
            <div className="w-full h-[500px] bg-gray-50 rounded-lg">
              <OptimizedSTLViewer
                url={previewProject.fileUrl}
                className="w-full h-full"
                interactive={true}
                autoRotate={true}
                quality="high"
              />
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              <p>Use mouse to rotate, scroll to zoom</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
