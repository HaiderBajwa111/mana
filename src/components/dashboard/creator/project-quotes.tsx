"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  Clock,
  CheckCircle,
  Building,
  MapPin,
  Calendar,
  Loader2,
  MessageSquare,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "@/components/ui/use-toast";

interface Quote {
  id: string;
  price: string | number;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  notes?: string;
  estimatedDeliveryDays?: number;
  createdAt: string;
  manufacturer: {
    id: string;
    firstName?: string;
    lastName?: string;
  };
  manufacturerProfile: {
    businessName: string;
    city?: string;
    state?: string;
  };
}

interface ProjectQuotesProps {
  projectId: string;
  projectTitle: string;
  onQuoteAccepted?: () => void;
}

export function ProjectQuotes({ projectId, projectTitle, onQuoteAccepted }: ProjectQuotesProps) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuotes();
    // Poll for new quotes every 10 seconds
    const interval = setInterval(fetchQuotes, 10000);
    return () => clearInterval(interval);
  }, [projectId]);

  const fetchQuotes = async () => {
    try {
      const response = await fetch(`/api/creator/project-quotes?projectId=${projectId}`);
      if (response.ok) {
        const data = await response.json();
        setQuotes(data);
      }
    } catch (error) {
      console.error("Error fetching quotes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptQuote = async (quoteId: string) => {
    try {
      const response = await fetch("/api/creator/accept-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quoteId, projectId }),
      });

      if (response.ok) {
        toast({
          title: "✅ Quote Accepted",
          description: "The maker has been notified and will begin working on your project.",
        });
        fetchQuotes();
        onQuoteAccepted?.();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept quote",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
        </CardContent>
      </Card>
    );
  }

  if (quotes.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No quotes received yet</p>
          <p className="text-xs text-muted-foreground mt-1">Makers will send quotes soon</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-purple-600" />
          Quotes for {projectTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {quotes.map((quote) => (
          <div key={quote.id} className="p-4 border rounded-lg space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">{quote.manufacturerProfile.businessName}</span>
                </div>
                {quote.manufacturerProfile.city && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <MapPin className="w-3 h-3" />
                    <span>{quote.manufacturerProfile.city}, {quote.manufacturerProfile.state}</span>
                  </div>
                )}
              </div>
              <Badge className={
                quote.status === "ACCEPTED" 
                  ? "bg-green-100 text-green-800 border-green-200"
                  : quote.status === "REJECTED"
                  ? "bg-red-100 text-red-800 border-red-200"
                  : "bg-yellow-100 text-yellow-800 border-yellow-200"
              }>
                {quote.status === "ACCEPTED" && <CheckCircle className="w-3 h-3 mr-1" />}
                {quote.status}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-purple-600">
                ${typeof quote.price === "string" ? parseFloat(quote.price).toFixed(2) : quote.price.toFixed(2)}
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                {quote.estimatedDeliveryDays && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {quote.estimatedDeliveryDays} days
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDistanceToNow(new Date(quote.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>

            {quote.notes && (
              <div className="p-3 bg-gray-50 rounded-md text-sm">
                {quote.notes}
              </div>
            )}

            {quote.status === "PENDING" && (
              <div className="flex items-center gap-2 pt-2">
                <Button
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={() => handleAcceptQuote(quote.id)}
                >
                  Accept Quote
                </Button>
                <Button size="sm" variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Message Maker
                </Button>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}