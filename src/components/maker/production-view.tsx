"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/ui/use-toast";
import { ArrowLeft, Clock, Package, User, Calendar, Printer, Play, Pause, CheckCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface ProductionOrder {
  id: string;
  projectTitle: string;
  creatorName: string;
  quantity: number;
  material: string;
  color: string;
  status: "queued" | "printing" | "paused" | "completed";
  estimatedHours?: number;
  estimatedMinutes?: number;
  startedAt?: Date;
  completedAt?: Date;
  progress?: number;
}

export default function ProductionView() {
  const [orders, setOrders] = useState<ProductionOrder[]>([
    {
      id: "1",
      projectTitle: "Custom Phone Stand",
      creatorName: "John Doe",
      quantity: 2,
      material: "PLA",
      color: "Blue",
      status: "printing",
      estimatedHours: 3,
      estimatedMinutes: 45,
      startedAt: new Date(),
      progress: 35,
    },
    {
      id: "2",
      projectTitle: "Desk Organizer",
      creatorName: "Jane Smith",
      quantity: 1,
      material: "PETG",
      color: "Black",
      status: "queued",
    },
  ]);
  
  const [selectedOrder, setSelectedOrder] = useState<ProductionOrder | null>(null);
  const [timeDialogOpen, setTimeDialogOpen] = useState(false);
  const [estimatedHours, setEstimatedHours] = useState<string>("0");
  const [estimatedMinutes, setEstimatedMinutes] = useState<string>("0");
  const { toast } = useToast();

  const updateOrderStatus = (orderId: string, status: ProductionOrder["status"]) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { 
            ...order, 
            status,
            startedAt: status === "printing" ? new Date() : order.startedAt,
            completedAt: status === "completed" ? new Date() : undefined,
            progress: status === "completed" ? 100 : order.progress
          }
        : order
    ));
    
    toast({
      title: "Status Updated",
      description: `Order status changed to ${status}`,
    });
  };

  const setEstimatedTime = () => {
    if (!selectedOrder) return;
    
    setOrders(prev => prev.map(order => 
      order.id === selectedOrder.id 
        ? { 
            ...order, 
            estimatedHours: parseInt(estimatedHours) || 0,
            estimatedMinutes: parseInt(estimatedMinutes) || 0,
          }
        : order
    ));
    
    toast({
      title: "Time Estimate Set",
      description: `Estimated time: ${estimatedHours}h ${estimatedMinutes}m`,
    });
    
    setTimeDialogOpen(false);
    setSelectedOrder(null);
    setEstimatedHours("0");
    setEstimatedMinutes("0");
  };

  const getStatusColor = (status: ProductionOrder["status"]) => {
    switch(status) {
      case "queued": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "printing": return "bg-blue-100 text-blue-700 border-blue-200";
      case "paused": return "bg-orange-100 text-orange-700 border-orange-200";
      case "completed": return "bg-green-100 text-green-700 border-green-200";
    }
  };

  const formatTimeRemaining = (hours?: number, minutes?: number, progress?: number) => {
    if (!hours && !minutes) return "Not set";
    
    const totalMinutes = (hours || 0) * 60 + (minutes || 0);
    const remainingMinutes = Math.round(totalMinutes * ((100 - (progress || 0)) / 100));
    const remainingHours = Math.floor(remainingMinutes / 60);
    const remainingMins = remainingMinutes % 60;
    
    return `${remainingHours}h ${remainingMins}m remaining`;
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-4"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Production Status</h1>
            <p className="text-muted-foreground">Manage your active print jobs</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Card className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Printer className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">Active Jobs</span>
                  <Badge variant="secondary" className="ml-2">
                    {orders.filter(o => o.status === "printing").length}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid gap-4">
        {orders.map((order) => (
          <Card key={order.id} className="border-border">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{order.projectTitle}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {order.creatorName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Package className="w-3 h-3" />
                          Qty: {order.quantity}
                        </span>
                        <span>{order.material} - {order.color}</span>
                      </div>
                    </div>
                    
                    <Badge variant="outline" className={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>

                  {/* Progress Bar for Printing Jobs */}
                  {order.status === "printing" && order.progress !== undefined && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{order.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${order.progress}%` }}
                        />
                      </div>
                      {order.estimatedHours !== undefined && (
                        <p className="text-xs text-muted-foreground mt-2">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {formatTimeRemaining(order.estimatedHours, order.estimatedMinutes, order.progress)}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Time Estimate Display */}
                  {order.status === "queued" && (
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground">
                        <Clock className="w-3 h-3 inline mr-1" />
                        Estimated time: {
                          order.estimatedHours || order.estimatedMinutes 
                            ? `${order.estimatedHours || 0}h ${order.estimatedMinutes || 0}m`
                            : "Not set"
                        }
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {order.status === "queued" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedOrder(order);
                            setEstimatedHours(String(order.estimatedHours || 0));
                            setEstimatedMinutes(String(order.estimatedMinutes || 0));
                            setTimeDialogOpen(true);
                          }}
                        >
                          <Clock className="w-4 h-4 mr-1" />
                          Set Time
                        </Button>
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={() => updateOrderStatus(order.id, "printing")}
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Start Printing
                        </Button>
                      </>
                    )}
                    
                    {order.status === "printing" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateOrderStatus(order.id, "paused")}
                        >
                          <Pause className="w-4 h-4 mr-1" />
                          Pause
                        </Button>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => updateOrderStatus(order.id, "completed")}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Mark Complete
                        </Button>
                      </>
                    )}
                    
                    {order.status === "paused" && (
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => updateOrderStatus(order.id, "printing")}
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Resume
                      </Button>
                    )}
                    
                    {order.status === "completed" && (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span>Completed {order.completedAt?.toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {orders.length === 0 && (
          <Card className="border-border">
            <CardContent className="p-12 text-center">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No active production orders</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Time Estimate Dialog */}
      <Dialog open={timeDialogOpen} onOpenChange={setTimeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Estimated Print Time</DialogTitle>
            <DialogDescription>
              Enter the estimated time for this print job. This will be shown to the creator.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <div>
              <Label htmlFor="hours">Hours</Label>
              <Input
                id="hours"
                type="number"
                min="0"
                max="999"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="minutes">Minutes</Label>
              <Input
                id="minutes"
                type="number"
                min="0"
                max="59"
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setTimeDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={setEstimatedTime}>
              Set Time
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}