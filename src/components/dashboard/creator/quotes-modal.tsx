"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DollarSign,
  Clock,
  Building,
  MapPin,
  Calendar,
  Loader2,
  MessageSquare,
  CheckCircle,
  User,
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
  manufacturerProfile?: {
    businessName: string;
    city?: string;
    state?: string;
    country?: string;
    description?: string;
  };
}

interface QuotesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  projectTitle: string;
}

export function QuotesModal({
  open,
  onOpenChange,
  projectId,
  projectTitle,
}: QuotesModalProps) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [acceptingQuote, setAcceptingQuote] = useState<string | null>(null);

  useEffect(() => {
    if (open && projectId) {
      fetchQuotes();
      // Poll for new quotes every 10 seconds while modal is open
      const interval = setInterval(fetchQuotes, 10000);
      return () => clearInterval(interval);
    }
  }, [open, projectId]);

  const fetchQuotes = async () => {
    try {
      const response = await fetch(`/api/creator/project-quotes?projectId=${projectId}`);
      if (response.ok) {
        const data = await response.json();
        setQuotes(data);
      }
    } catch (error) {
      console.error("Error fetching quotes:", error);
      toast({
        title: "Error",
        description: "Failed to load quotes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptQuote = async (quoteId: string) => {
    setAcceptingQuote(quoteId);
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
        // Close modal after accepting
        setTimeout(() => onOpenChange(false), 2000);
      } else {
        throw new Error("Failed to accept quote");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept quote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAcceptingQuote(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-xl">
            Quotes for {projectTitle}
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Compare quotes from local makers and choose the best option for your project
          </p>
        </DialogHeader>

        <ScrollArea className="h-[500px] px-6 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : quotes.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-muted-foreground">No quotes received yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Makers in your area will send quotes soon
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {quotes.map((quote) => {
                const price = typeof quote.price === "string" 
                  ? parseFloat(quote.price) 
                  : quote.price;
                const businessName = quote.manufacturerProfile?.businessName || 
                  `${quote.manufacturer.firstName || ""} ${quote.manufacturer.lastName || ""}`.trim() || 
                  "Maker";

                return (
                  <div
                    key={quote.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{businessName}</h4>
                          {quote.manufacturerProfile?.description && (
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {quote.manufacturerProfile.description}
                            </p>
                          )}
                          {quote.manufacturerProfile?.city && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                              <MapPin className="w-3 h-3" />
                              <span>
                                {quote.manufacturerProfile.city}
                                {quote.manufacturerProfile.state && `, ${quote.manufacturerProfile.state}`}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      {quote.status === "ACCEPTED" && (
                        <Badge className="bg-green-100 text-green-700 border-green-200">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Accepted
                        </Badge>
                      )}
                    </div>

                    {/* Price and Timeline */}
                    <div className="flex items-center justify-between mb-3 p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Quote Price</p>
                        <p className="text-2xl font-bold text-blue-600">
                          ${price.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground mb-1">Delivery Time</p>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">
                            {quote.estimatedDeliveryDays || 5} days
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    {quote.notes && (
                      <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Message: </span>
                          {quote.notes}
                        </p>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t">
                      <span className="text-xs text-muted-foreground">
                        Received {formatDistanceToNow(new Date(quote.createdAt), { addSuffix: true })}
                      </span>
                      {quote.status === "PENDING" && (
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Message
                          </Button>
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={() => handleAcceptQuote(quote.id)}
                            disabled={acceptingQuote === quote.id}
                          >
                            {acceptingQuote === quote.id ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Accepting...
                              </>
                            ) : (
                              "Accept Quote"
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}