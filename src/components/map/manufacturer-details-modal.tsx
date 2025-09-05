"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  X,
  Star,
  MapPin,
  Clock,
  MessageCircle,
  Phone,
  Globe,
  Verified,
  Package,
  Heart,
  Share2,
} from "lucide-react";

interface ManufacturerDetailsModalProps {
  manufacturer: any;
  onClose: () => void;
  userLocation: { lat: number; lng: number } | null;
}

export function ManufacturerDetailsModal({
  manufacturer,
  onClose,
  userLocation,
}: ManufacturerDetailsModalProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isFavorited, setIsFavorited] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "text-green-400";
      case "busy":
        return "text-yellow-400";
      case "offline":
        return "text-gray-400";
      default:
        return "text-mana-mint";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "Available Now";
      case "busy":
        return "Busy - Responds in 2-4 hours";
      case "offline":
        return "Offline - Will respond tomorrow";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center ">
      <div className="bg-mana-black border border-mana-gray-light/20 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col justify-between  p-8">
        {/* Header */}
        <div className="relative p-6 border-b border-mana-gray-light/20">
          <Button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-mana-gray/20 text-mana-text hover:bg-mana-gray/40 p-0"
          >
            <X className="w-5 h-5" />
          </Button>

          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="relative">
              <Image
                src={manufacturer.avatar || "/assets/placeholders/placeholder.svg"}
                alt={manufacturer.businessName}
                width={80}
                height={80}
                className="rounded-2xl"
              />
              {manufacturer.verified && (
                <div className="absolute -bottom-2 -right-2 bg-mana-mint rounded-full p-1">
                  <Verified className="w-4 h-4 text-mana-black fill-current" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-2xl font-bold text-mana-text">
                  {manufacturer.businessName}
                </h2>
                <Badge
                  className={`${getStatusColor(
                    manufacturer.status,
                  )} bg-transparent border-current`}
                >
                  ● {getStatusText(manufacturer.status)}
                </Badge>
              </div>

              <p className="text-mana-text-secondary mb-3">
                {manufacturer.tagline}
              </p>

              {/* Stats */}
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-mana-text">{manufacturer.rating}</span>
                  <span className="text-mana-text-secondary">
                    ({manufacturer.reviewCount} reviews)
                  </span>
                </div>
                <div className="flex items-center gap-1 text-mana-text-secondary">
                  <MapPin className="w-4 h-4" />
                  <span>{manufacturer.distance} away</span>
                </div>
                <div className="flex items-center gap-1 text-mana-text-secondary">
                  <Clock className="w-4 h-4" />
                  <span>Avg {manufacturer.avgTurnaround}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <Button
                onClick={() => setIsFavorited(!isFavorited)}
                variant="outline"
                size="sm"
                className={`${
                  isFavorited
                    ? "text-red-400 border-red-400"
                    : "border-mana-gray-light/30"
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`}
                />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-mana-gray-light/30"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="h-full flex flex-col"
          >
            <TabsList className="grid w-full grid-cols-4 bg-mana-gray/20 mx-6 mt-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-6">
                  <TabsContent value="overview" className="space-y-6 mt-0">
                    {/* About */}
                    <div>
                      <h3 className="font-semibold text-mana-text mb-3">
                        About
                      </h3>
                      <p className="text-mana-text-secondary leading-relaxed">
                        {manufacturer.description}
                      </p>
                    </div>

                    {/* Specialties */}
                    <div>
                      <h3 className="font-semibold text-mana-text mb-3">
                        Specialties
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {manufacturer.specialties.map((specialty: string) => (
                          <Badge key={specialty} variant="secondary">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Equipment */}
                    <div>
                      <h3 className="font-semibold text-mana-text mb-3">
                        Equipment
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {manufacturer.equipment.map((item: any) => (
                          <div
                            key={item.name}
                            className="bg-mana-gray/20 rounded-lg p-3"
                          >
                            <div className="font-medium text-mana-text">
                              {item.name}
                            </div>
                            <div className="text-sm text-mana-text-secondary">
                              {item.specs}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="services" className="space-y-6 mt-0">
                    {/* Services */}
                    <div className="space-y-4">
                      {manufacturer.services.map((service: any) => (
                        <div
                          key={service.name}
                          className="border border-mana-gray-light/20 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-mana-text">
                              {service.name}
                            </h4>
                            <span className="text-mana-mint font-semibold">
                              {service.price}
                            </span>
                          </div>
                          <p className="text-mana-text-secondary text-sm mb-3">
                            {service.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-mana-text-secondary">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{service.turnaround}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Package className="w-4 h-4" />
                              <span>{service.materials.join(", ")}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="portfolio" className="mt-0">
                    {/* Portfolio Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      {manufacturer.portfolio.map(
                        (item: any, index: number) => (
                          <div
                            key={index}
                            className="relative group cursor-pointer"
                          >
                            <Image
                              src={item.image || "/assets/placeholders/placeholder.svg"}
                              alt={item.title}
                              width={200}
                              height={200}
                              className="w-full h-40 object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                              <div className="text-center text-white">
                                <div className="font-medium">{item.title}</div>
                                <div className="text-sm opacity-80">
                                  {item.material}
                                </div>
                              </div>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="reviews" className="space-y-4 mt-0">
                    {/* Reviews */}
                    {manufacturer.reviews.map((review: any) => (
                      <div
                        key={review.id}
                        className="border border-mana-gray-light/20 rounded-lg p-4"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <Image
                            src={review.avatar || "/assets/placeholders/placeholder.svg"}
                            alt={review.name}
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                          <div>
                            <div className="font-medium text-mana-text">
                              {review.name}
                            </div>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < review.rating
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-400"
                                  }`}
                                />
                              ))}
                              <span className="text-sm text-mana-text-secondary ml-1">
                                {review.date}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-mana-text-secondary">
                          {review.comment}
                        </p>
                      </div>
                    ))}
                  </TabsContent>
                </div>
              </ScrollArea>
            </div>
          </Tabs>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-mana-gray-light/20 flex gap-3">
          <Button className="flex-1 bg-mana-mint text-mana-black hover:bg-mana-mint/90">
            <MessageCircle className="w-4 h-4 mr-2" />
            Message on Mana
          </Button>
          <Button variant="outline" className="border-mana-gray-light/30">
            <Phone className="w-4 h-4 mr-2" />
            Call
          </Button>
          <Button variant="outline" className="border-mana-gray-light/30">
            <Globe className="w-4 h-4 mr-2" />
            Website
          </Button>
        </div>
      </div>
    </div>
  );
}
