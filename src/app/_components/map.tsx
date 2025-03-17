"use client";

import { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker, Polyline } from "@react-google-maps/api";
import { routeGeoJSON } from "../_data/routeData";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: 51.505,
  lng: -0.09,
};

const MapComponent = () => {
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState<string | null>(null);

  useEffect(() => {
    // Fetch API key from environment variables
    setGoogleMapsApiKey(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || null);
  }, []);

  if (!googleMapsApiKey) {
    return <p>Loading map...</p>;
  }

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
    <LoadScript googleMapsApiKey={googleMapsApiKey}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13}>
        {/* Render Markers from GeoJSON */}
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={{
              lat: marker.geometry.coordinates[1],
              lng: marker.geometry.coordinates[0],
            }}
            onClick={() => handleMarkerClick(marker.properties.name)}
          />
        ))}

        {/* Render Route from GeoJSON */}
        {routeLine && (
          <Polyline
            path={routeLine.geometry.coordinates.map((coord) => ({
              lat: coord[1],
              lng: coord[0],
            }))}
            options={{ strokeColor: "blue", strokeWeight: 5 }}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
