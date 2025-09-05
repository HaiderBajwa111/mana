"use client";

import dynamic from "next/dynamic";

// Dynamically import the map component to avoid SSR issues with Leaflet
const MeetingMap = dynamic(() => import("@/components/map/MeetingMap"), {
  ssr: false,
  loading: () => <div>Loading map...</div>,
});

export default function MapPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Meetup Locations</h1>
      <p className="text-gray-600 mb-4">
        Find meeting points and Starbucks locations in San Diego
      </p>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <MeetingMap />
      </div>
    </div>
  );
}