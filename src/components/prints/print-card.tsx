"use client";

import React from "react";
import {
  Image as ImageIcon,
  Clock,
  Package,
  Palette,
  DollarSign,
  CheckCircle,
  XCircle,
  MoreVertical,
  Eye,
  MessageSquare,
  Truck,
  Star,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PrintProject } from "@/app/actions/user/get-user-prints";

const statusConfig = {
  DRAFT: {
    label: "Draft",
    icon: Clock,
    color: "bg-gray-100 text-gray-800 border-gray-200",
    description: "Draft project - not yet submitted",
  },
  SUBMITTED: {
    label: "Pending",
    icon: Clock,
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    description: "Waiting for quotes from makers",
  },
  IN_PROGRESS: {
    label: "In Progress",
    icon: Package,
    color: "bg-blue-100 text-blue-800 border-blue-200",
    description: "Quote accepted - being printed",
  },
  COMPLETED: {
    label: "Completed",
    icon: CheckCircle,
    color: "bg-green-100 text-green-800 border-green-200",
    description: "Print received and completed",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: XCircle,
    color: "bg-red-100 text-red-800 border-red-200",
    description: "Project was cancelled",
  },
} as const;

interface PrintCardProps {
  print: PrintProject;
}

export function PrintCard({ print }: PrintCardProps) {
  const status = statusConfig[print.status];
  const StatusIcon = status.icon;

  // Render different content based on status
  const renderStatusSpecificContent = () => {
    switch (print.status) {
      case "DRAFT":
        return (
          <div className="space-y-3">
            {/* Draft-specific info */}
            <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
              <p className="font-medium mb-1">Draft Project</p>
              <p>This project hasn't been submitted to makers yet.</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button size="sm" variant="outline" className="flex-1 text-xs">
                <FileText className="h-3 w-3 mr-1" /> Edit Draft
              </Button>
              <Button size="sm" className="flex-1 text-xs">
                Submit to Makers
              </Button>
            </div>
          </div>
        );

      case "SUBMITTED":
        return (
          <div className="space-y-3">
            {/* Pending-specific info */}
            <div className="text-xs text-muted-foreground bg-yellow-50 p-2 rounded border border-yellow-200">
              <p className="font-medium mb-1 text-yellow-800">
                Waiting for Quotes
              </p>
              <p>
                Makers are reviewing your project and will send quotes soon.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button size="sm" variant="outline" className="flex-1 text-xs">
                <Eye className="h-3 w-3 mr-1" /> View Quotes
              </Button>
              <Button size="sm" variant="outline" className="flex-1 text-xs">
                <MessageSquare className="h-3 w-3 mr-1" /> Message Makers
              </Button>
            </div>
          </div>
        );

      case "IN_PROGRESS":
        return (
          <div className="space-y-3">
            {/* In Progress-specific info */}
            <div className="text-xs text-muted-foreground bg-blue-50 p-2 rounded border border-blue-200">
              <p className="font-medium mb-1 text-blue-800">
                Printing in Progress
              </p>
              <p>Your print is being manufactured. Track progress below.</p>
            </div>

            {/* Progress tracking info */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Estimated Completion:
                </span>
                <span className="font-medium">~3-5 days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Maker:</span>
                <span className="font-medium">John's Print Shop</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button size="sm" variant="outline" className="flex-1 text-xs">
                <Truck className="h-3 w-3 mr-1" /> Track Progress
              </Button>
              <Button size="sm" variant="outline" className="flex-1 text-xs">
                <MessageSquare className="h-3 w-3 mr-1" /> Contact Maker
              </Button>
            </div>
          </div>
        );

      case "COMPLETED":
        return (
          <div className="space-y-3">
            {/* Completed-specific info */}
            <div className="text-xs text-muted-foreground bg-green-50 p-2 rounded border border-green-200">
              <p className="font-medium mb-1 text-green-800">
                Print Completed!
              </p>
              <p>Your print has been delivered. How was your experience?</p>
            </div>

            {/* Completion info */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Delivered:</span>
                <span className="font-medium">2 days ago</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Maker:</span>
                <span className="font-medium">John's Print Shop</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button size="sm" variant="outline" className="flex-1 text-xs">
                <Star className="h-3 w-3 mr-1" /> Rate & Review
              </Button>
              <Button size="sm" variant="outline" className="flex-1 text-xs">
                <Package className="h-3 w-3 mr-1" /> Order Again
              </Button>
            </div>
          </div>
        );

      case "CANCELLED":
        return (
          <div className="space-y-3">
            {/* Cancelled-specific info */}
            <div className="text-xs text-muted-foreground bg-red-50 p-2 rounded border border-red-200">
              <p className="font-medium mb-1 text-red-800">Project Cancelled</p>
              <p>
                This project was cancelled. You can create a new one anytime.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button size="sm" variant="outline" className="flex-1 text-xs">
                <FileText className="h-3 w-3 mr-1" /> View Details
              </Button>
              <Button size="sm" className="flex-1 text-xs">
                Create New Print
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        {/* Image */}
        <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center mb-3">
          {print.imageUrl ? (
            <img
              src={print.imageUrl}
              alt={print.name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="text-center text-muted-foreground">
              <ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs">No Image</p>
            </div>
          )}
        </div>

        {/* Title and Status */}
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-sm leading-tight line-clamp-2 flex-1 pr-2">
            {print.name}
          </h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View Details</DropdownMenuItem>
              {print.status === "DRAFT" && (
                <DropdownMenuItem>Edit Project</DropdownMenuItem>
              )}
              {print.status === "SUBMITTED" && (
                <DropdownMenuItem>View Quotes</DropdownMenuItem>
              )}
              {print.status === "IN_PROGRESS" && (
                <DropdownMenuItem>Track Progress</DropdownMenuItem>
              )}
              {print.status === "COMPLETED" && (
                <DropdownMenuItem>Rate & Review</DropdownMenuItem>
              )}
              {print.status !== "COMPLETED" && print.status !== "CANCELLED" && (
                <DropdownMenuItem className="text-destructive">
                  Cancel Project
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Status Badge */}
        <Badge className={`w-fit ${status.color} border`}>
          <StatusIcon className="h-3 w-3 mr-1" />
          {status.label}
        </Badge>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        {/* Print Details - Always shown */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Palette className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">Material:</span>
            <span className="font-medium">{print.material}</span>
          </div>

          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full border border-border"
              style={{ backgroundColor: print.color.toLowerCase() }}
            ></div>
            <span className="text-muted-foreground">Color:</span>
            <span className="font-medium">{print.color}</span>
          </div>

          <div className="flex items-center gap-2">
            <Package className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">Qty:</span>
            <span className="font-medium">{print.quantity}</span>
          </div>

          {/* Only show price for non-pending prints */}
          {print.status !== "SUBMITTED" && (
            <div className="flex items-center gap-2">
              <DollarSign className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Price:</span>
              <span className="font-medium">${print.price.toFixed(2)}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">Date:</span>
            <span className="font-medium text-xs">
              {print.createdAt.toLocaleDateString()}
            </span>
          </div>

          {/* Deadline */}
          {print.deadline && (
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Deadline:</span>
              <span className="font-medium text-xs">
                {print.deadline.toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        {/* Status-specific content */}
        {renderStatusSpecificContent()}
      </CardContent>
    </Card>
  );
}
