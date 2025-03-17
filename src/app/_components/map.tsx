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

export default function MapComponent({ selectedUniversity }: MapComponentProps) {
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const [center, setCenter] = useState({ lat: 51.505, lng: -0.09 });
  const [routeData, setRouteData] = useState<any>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: googleMapsApiKey || "",
  });

  useEffect(() => {
    if (!selectedUniversity) return;

    // Fetch university center location
    fetch(`/api/universities/center?name=${selectedUniversity}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.latitude && data.longitude) {
          setCenter({ lat: data.latitude, lng: data.longitude });
        }
      })
      .catch((err) => console.error("Error fetching university center:", err));

    // Fetch university routes
    fetch(`/api/universities/routes?name=${selectedUniversity}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRouteData(data);
        }
      })
      .catch((err) => console.error("Error fetching university routes:", err));
  }, [selectedUniversity]);

  if (loadError) return <p>Error loading maps</p>;
  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13}>
      {/* Render Routes */}
      {routeData?.map((route: any, index: number) => (
        route.geojson.features.map((feature: any, featureIndex: number) => {
          if (feature.geometry.type === "Point") {
            return (
              <Marker
                key={`${index}-${featureIndex}`}
                position={{
                  lat: feature.geometry.coordinates[1],
                  lng: feature.geometry.coordinates[0],
                }}
              />
            );
          } else if (feature.geometry.type === "LineString") {
            return (
              <Polyline
                key={`${index}-${featureIndex}`}
                path={feature.geometry.coordinates.map((coord: [number, number]) => ({
                  lat: coord[1],
                  lng: coord[0],
                }))}
                options={{ strokeColor: "blue", strokeWeight: 5 }}
              />
            );
          }
        })
      ))}
    </GoogleMap>
  );
}