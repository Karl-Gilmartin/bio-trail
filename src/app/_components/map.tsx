"use client";

import { useEffect, useState } from "react";
import { GoogleMap, useLoadScript, Marker, Polyline } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%",
};

interface MapComponentProps {
  selectedUniversity: string;
}

interface Route {
  geojson: {
    type: string;
    features: { geometry: { type: string; coordinates: [number, number][] } }[];
  };
}

interface MarkerData {
  name: string;
  description: string;
  latitude: number;
  longitude: number;
}

export default function MapComponent({ selectedUniversity }: MapComponentProps) {
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const [center, setCenter] = useState({ lat: 51.505, lng: -0.09 });
  const [routeData, setRouteData] = useState<Route[]>([]);
  const [markers, setMarkers] = useState<MarkerData[]>([]);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: googleMapsApiKey || "",
  });

  useEffect(() => {
    if (!selectedUniversity) return;

    // Fetch university center location
    fetch(`/api/universities/center?name=${selectedUniversity}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.latitude && data?.longitude) {
          setCenter({ lat: data.latitude, lng: data.longitude });
        }
      })
      .catch((err) => console.error("Error fetching university center:", err));

    // Fetch university routes
    fetch(`/api/universities/trails?name=${selectedUniversity}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRouteData(data);
        }
      })
      .catch((err) => console.error("Error fetching university routes:", err));
  }, [selectedUniversity]);

  useEffect(() => {
    if (!selectedUniversity) return;

    // Fetch markers for the selected university
    fetch(`/api/universities/markers?name=${selectedUniversity}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMarkers(data);
        }
      })
      .catch((err) => console.error("Error fetching university markers:", err));
  }, [selectedUniversity]);

  if (loadError) return <p>Error loading maps</p>;
  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13}>
      {/* Render Routes */}
      {routeData.map((route, index) => (
        route.geojson.features.map((feature, featureIndex) => {
          if (feature.geometry.type === "LineString") {
            return (
              <Polyline
                key={`${index}-${featureIndex}`}
                path={feature.geometry.coordinates.map((coord) => ({
                  lat: coord[1],
                  lng: coord[0],
                }))}
                options={{ strokeColor: "blue", strokeWeight: 5 }}
              />
            );
          }
        })
      ))}

      {/* Render Markers */}
      {markers.map((marker, index) => (
        <Marker 
          key={index} 
          position={{ lat: marker.latitude, lng: marker.longitude }} 
          onClick={() => console.log(`Marker Clicked: ${marker.name} - ${marker.description}`)}
        />
      ))}
    </GoogleMap>
  );
}
