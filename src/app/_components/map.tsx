"use client";

import { useEffect, useState } from "react";
import { GoogleMap, useLoadScript, Marker, Polyline } from "@react-google-maps/api";
import { api } from "~/trpc/react";

const containerStyle = {
  width: "100%",
  height: "100%",
};

interface MapComponentProps {
  selectedUniversity: string;
}

interface GeoJSONFeature {
  geometry: {
    type: string;
    coordinates: [number, number][];
  };
}

interface GeoJSON {
  type: string;
  features: GeoJSONFeature[];
}

interface Route {
  geojson: GeoJSON;
}

interface MarkerData {
  name: string;
  description: string;
  latitude: number;
  longitude: number;
}

export default function MapComponent({ selectedUniversity }: MapComponentProps) {
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const [center, setCenter] = useState({ lat:53.347274403672664, lng:-6.259284295151906 });
  const [routeData, setRouteData] = useState<Route[]>([]);
  const [markers, setMarkers] = useState<MarkerData[]>([]);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: googleMapsApiKey || "",
  });

  // Fetch university center location
  const { data: centerData } = api.universities.getCenter.useQuery(
    { name: selectedUniversity },
    { enabled: !!selectedUniversity }
  );

  // Fetch university markers
  const { data: markersData } = api.universities.getMarkers.useQuery(
    { name: selectedUniversity },
    { enabled: !!selectedUniversity }
  );

  // Fetch university trails
  const { data: universityData } = api.universities.getByName.useQuery(
    { name: selectedUniversity },
    { enabled: !!selectedUniversity }
  );

  // Update center when data changes
  useEffect(() => {
    if (centerData?.data) {
      setCenter({ 
        lat: centerData.data.latitude, 
        lng: centerData.data.longitude 
      });
    }
  }, [centerData]);

  // Update markers when data changes
  useEffect(() => {
    if (markersData?.data) {
      setMarkers(markersData.data);
    }
  }, [markersData]);

  // Update routes when data changes
  useEffect(() => {
    if (universityData?.data?.trails) {
      const routes = universityData.data.trails
        .map(trail => {
          const geojson = trail.geojson as unknown as GeoJSON;
          if (!geojson?.type || !geojson?.features) {
            console.warn('Invalid GeoJSON data:', trail.geojson);
            return null;
          }
          return { geojson };
        })
        .filter((route): route is Route => route !== null);
      
      setRouteData(routes);
    }
  }, [universityData]);

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
