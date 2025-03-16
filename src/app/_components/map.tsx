"use client";

import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { routeGeoJSON } from "../_data/routeData";
import { useEffect, useState } from "react";
import createCustomMarker from "../utils/customMarker";
import L, { Icon } from "leaflet";

// Dynamically import React-Leaflet components (Avoid SSR issues)
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);
const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false }
);

const MapComponent = () => {
  const [customMarker, setCustomMarker] = useState<Icon | null>(null);

  useEffect(() => {
    createCustomMarker().then((icon) => {
      if (icon) setCustomMarker(icon as Icon);
    });
  }, []);

  // Extract route coordinates for polyline
  const routeLine = routeGeoJSON.features.find(
    (feature) => feature.geometry.type === "LineString"
  );

  // Extract markers
  const markers = routeGeoJSON.features.filter(
    (feature) => feature.geometry.type === "Point"
  );

  // Handle marker click event
  const handleMarkerClick = (markerName: string) => {
    console.log(`Selected marker: ${markerName}`);
  };

  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={13}
      scrollWheelZoom={false}
      className="h-full w-full rounded-lg"
    >
      {/* OpenStreetMap Tile Layer */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Render Markers from GeoJSON */}
      {markers.map((marker, index) => (
        <Marker
          key={index}
          position={
            marker.geometry.coordinates &&
            marker.geometry.coordinates.length === 2 &&
            typeof marker.geometry.coordinates[0] === "number" &&
            typeof marker.geometry.coordinates[1] === "number"
              ? [marker.geometry.coordinates[1], marker.geometry.coordinates[0]]
              : [0, 0]
          } // Convert [lng, lat] -> [lat, lng]
          icon={customMarker || undefined} // ✅ Use dynamic marker
          eventHandlers={{
            click: () => handleMarkerClick(marker.properties.name), // ✅ Log marker click
          }}
        >
          <Popup>{marker.properties.name}</Popup>
        </Marker>
      ))}

      {/* Render Route from GeoJSON */}
      {routeLine && (
        <Polyline
          positions={(routeLine.geometry.coordinates as [number, number][]).map((coord) => [
            coord[1],
            coord[0],
          ])} // Convert [lng, lat] -> [lat, lng]
          pathOptions={{ color: "blue", weight: 5 }}
        />
      )}
    </MapContainer>
  );
};

export default MapComponent;
