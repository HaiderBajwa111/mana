"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Package, User, Calendar, DollarSign, Star, Download, Filter, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CompletedOrder {
  id: string;
  projectTitle: string;
  creatorName: string;
  quantity: number;
  material: string;
  color: string;
  completedAt: Date;
  earnings: number;
  rating?: number;
  review?: string;
  printTime: {
    hours: number;
    minutes: number;
  };
}

export default function CompletedOrdersView() {
  const [orders] = useState<CompletedOrder[]>([
    {
      id: "1",
      projectTitle: "Desk Lamp Base",
      creatorName: "Alice Johnson",
      quantity: 1,
      material: "PLA",
      color: "White",
      completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      earnings: 45.50,
      rating: 5,
      review: "Excellent quality and fast delivery!",
      printTime: { hours: 4, minutes: 30 },
    },
    {
      id: "2",
      projectTitle: "Custom Keychain Set",
      creatorName: "Bob Wilson",
      quantity: 5,
      material: "PETG",
      color: "Red",
      completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      earnings: 25.00,
      rating: 4,
      printTime: { hours: 2, minutes: 15 },
    },
    {
      id: "3",
      projectTitle: "Phone Holder",
      creatorName: "Carol Davis",
      quantity: 2,
      material: "ABS",
      color: "Black",
      completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      earnings: 35.75,
      printTime: { hours: 3, minutes: 0 },
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterPeriod, setFilterPeriod] = useState("all");

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.creatorName.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterPeriod === "all") return matchesSearch;
    
    const daysDiff = Math.floor((Date.now() - order.completedAt.getTime()) / (1000 * 60 * 60 * 24));
    
    switch(filterPeriod) {
      case "week": return matchesSearch && daysDiff <= 7;
      case "month": return matchesSearch && daysDiff <= 30;
      case "quarter": return matchesSearch && daysDiff <= 90;
      default: return matchesSearch;
    }
  });

  const totalEarnings = filteredOrders.reduce((sum, order) => sum + order.earnings, 0);
  const averageRating = filteredOrders.filter(o => o.rating).reduce((sum, order) => sum + (order.rating || 0), 0) / 
                        filteredOrders.filter(o => o.rating).length || 0;

  const renderStars = (rating?: number) => {
    if (!rating) return <span className="text-xs text-muted-foreground">No rating</span>;
    
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3 h-3 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
        <span className="text-xs ml-1">({rating})</span>
      </div>
    );
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
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Completed Orders</h1>
            <p className="text-muted-foreground">View your order history and earnings</p>
          </div>
          
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">{filteredOrders.length}</p>
                </div>
                <Package className="w-8 h-8 text-blue-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Earnings</p>
                  <p className="text-2xl font-bold">${totalEarnings.toFixed(2)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Rating</p>
                  <p className="text-2xl font-bold">{averageRating.toFixed(1)}</p>
                </div>
                <Star className="w-8 h-8 text-yellow-500 opacity-20" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">
                    {orders.filter(o => {
                      const daysDiff = Math.floor((Date.now() - o.completedAt.getTime()) / (1000 * 60 * 60 * 24));
                      return daysDiff <= 30;
                    }).length}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-purple-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Select value={filterPeriod} onValueChange={setFilterPeriod}>
            <SelectTrigger className="w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
              <SelectItem value="quarter">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Orders List */}
      <div className="grid gap-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="border-border">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
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
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {order.completedAt.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">${order.earnings.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.printTime.hours}h {order.printTime.minutes}m print time
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {renderStars(order.rating)}
                      {order.review && (
                        <p className="text-sm text-muted-foreground italic">"{order.review}"</p>
                      )}
                    </div>
                    
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                      Completed
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredOrders.length === 0 && (
          <Card className="border-border">
            <CardContent className="p-12 text-center">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No completed orders found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}