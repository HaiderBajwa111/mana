"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet's default marker icon issue in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

export default function MeetingMap() {
  return (
    <div style={{ height: "500px", width: "100%" }}>
      <MapContainer
        center={[32.7157, -117.1611]} // San Diego downtown
        zoom={12}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* San Diego Starbucks / meeting points */}
        <Marker position={[32.7757, -117.0713]}>
          <Popup>Starbucks @ SDSU</Popup>
        </Marker>
        <Marker position={[32.8801, -117.234]}>
          <Popup>Starbucks @ UCSD</Popup>
        </Marker>
        <Marker position={[32.7157, -117.1611]}>
          <Popup>Starbucks Downtown San Diego</Popup>
        </Marker>
        <Marker position={[32.7341, -117.1446]}>
          <Popup>Balboa Park Meeting Point</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}