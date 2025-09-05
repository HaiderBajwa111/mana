"use client";

import { useState, useEffect } from "react";

const mockManufacturers = [
  {
    id: "1",
    businessName: "TechPrint Solutions",
    tagline: "Professional 3D printing for prototypes and production",
    avatar: "/placeholder.svg?height=80&width=80&text=TP",
    verified: true,
    status: "available",
    rating: 4.9,
    reviewCount: 127,
    distance: "0.8 miles",
    avgTurnaround: "2-4 hours",
    showRadius: true,
    serviceRadius: 60,
    recommended: true,
    description:
      "We specialize in high-quality 3D printing services for businesses and individuals. Our state-of-the-art equipment ensures precision and reliability.",
    specialties: ["Prototyping", "PLA", "ABS", "PETG", "Rapid Turnaround"],
    equipment: [
      { name: "Prusa i3 MK3S+", specs: "Build: 250×210×210mm" },
      { name: "Ultimaker S3", specs: "Build: 230×190×200mm" },
      { name: "Formlabs Form 3", specs: "Resin SLA printer" },
    ],
    services: [
      {
        name: "Standard PLA Print",
        price: "From $0.15/g",
        description: "High-quality PLA prints with standard finish",
        turnaround: "Same day",
        materials: ["PLA", "PLA+"],
      },
      {
        name: "Professional ABS Print",
        price: "From $0.20/g",
        description: "Durable ABS prints for functional parts",
        turnaround: "1-2 days",
        materials: ["ABS", "ABS+"],
      },
    ],
    portfolio: [
      {
        title: "Drone Frame",
        material: "Carbon Fiber PLA",
        image: "/placeholder.svg?height=200&width=200&text=Drone",
      },
      {
        title: "Phone Case",
        material: "TPU",
        image: "/placeholder.svg?height=200&width=200&text=Case",
      },
    ],
    reviews: [
      {
        id: "1",
        name: "Sarah Chen",
        avatar: "/placeholder.svg?height=32&width=32&text=SC",
        rating: 5,
        date: "2 days ago",
        comment:
          "Excellent quality and super fast turnaround. Highly recommended!",
      },
    ],
  },
  {
    id: "2",
    businessName: "MakerSpace Pro",
    tagline: "Community-driven 3D printing hub",
    avatar: "/placeholder.svg?height=80&width=80&text=MP",
    verified: false,
    status: "busy",
    rating: 4.7,
    reviewCount: 89,
    distance: "1.2 miles",
    avgTurnaround: "4-6 hours",
    showRadius: false,
    serviceRadius: 40,
    recommended: false,
    description:
      "A collaborative workspace offering 3D printing services with a focus on education and innovation.",
    specialties: ["Education", "Large Prints", "Multi-color", "Wood Filament"],
    equipment: [
      { name: "Ender 3 V2", specs: "Build: 220×220×250mm" },
      { name: "CR-10 V3", specs: "Build: 300×300×400mm" },
    ],
    services: [
      {
        name: "Large Format Print",
        price: "From $0.12/g",
        description: "Big prints up to 300mm³",
        turnaround: "2-3 days",
        materials: ["PLA", "PETG"],
      },
    ],
    portfolio: [
      {
        title: "Vase",
        material: "Wood PLA",
        image: "/placeholder.svg?height=200&width=200&text=Vase",
      },
    ],
    reviews: [
      {
        id: "1",
        name: "Mike Johnson",
        avatar: "/placeholder.svg?height=32&width=32&text=MJ",
        rating: 5,
        date: "1 week ago",
        comment: "Great for large prints and educational projects.",
      },
    ],
  },
  {
    id: "3",
    businessName: "Precision Prints",
    tagline: "High-precision manufacturing solutions",
    avatar: "/placeholder.svg?height=80&width=80&text=PP",
    verified: true,
    status: "available",
    rating: 4.8,
    reviewCount: 156,
    distance: "2.1 miles",
    avgTurnaround: "1-2 days",
    showRadius: true,
    serviceRadius: 80,
    recommended: false,
    description:
      "Industrial-grade 3D printing with focus on precision and quality for professional applications.",
    specialties: [
      "Industrial",
      "Metal Printing",
      "High Precision",
      "Post-Processing",
    ],
    equipment: [
      { name: "Markforged Mark Two", specs: "Carbon fiber reinforced" },
      { name: "EOS M 290", specs: "Metal 3D printer" },
    ],
    services: [
      {
        name: "Metal 3D Print",
        price: "From $2.50/g",
        description: "Stainless steel and aluminum parts",
        turnaround: "5-7 days",
        materials: ["Stainless Steel", "Aluminum"],
      },
    ],
    portfolio: [
      {
        title: "Gear",
        material: "Steel",
        image: "/placeholder.svg?height=200&width=200&text=Gear",
      },
    ],
    reviews: [
      {
        id: "1",
        name: "David Kim",
        avatar: "/placeholder.svg?height=32&width=32&text=DK",
        rating: 5,
        date: "3 days ago",
        comment: "Outstanding precision and professional service.",
      },
    ],
  },
];

export function useManufacturers(
  userLocation: { lat: number; lng: number } | null,
) {
  const [manufacturers, setManufacturers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch manufacturers
    // TODO: jumble manufacterers location from server within a radius of 1 mile for better privacy
    const fetchManufacturers = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // If user location is available, sort by distance and add location-based data
      let processedManufacturers = [...mockManufacturers];

      if (userLocation) {
        // In a real app, you'd calculate actual distances
        processedManufacturers = processedManufacturers.map(
          (manufacturer, index) => ({
            ...manufacturer,
            // Simulate distance calculation
            actualDistance: 0.5 + index * 0.7,
          }),
        );

        // Sort by distance
        processedManufacturers.sort(
          //@ts-ignore
          (a, b) => a.actualDistance - b.actualDistance,
        );
      }

      setManufacturers(processedManufacturers);
      setLoading(false);
    };

    fetchManufacturers();
  }, [userLocation]);

  return { manufacturers, loading };
}
