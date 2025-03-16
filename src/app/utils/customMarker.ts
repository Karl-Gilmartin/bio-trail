import L from "leaflet";

// Custom Marker Icon
const CustomMarkerIcon = L.icon({
  iconUrl: "/marker-icon-2x-black.png", // Ensure this file is in /public
  iconSize: [30, 45], // Width & height
  iconAnchor: [15, 45], // Positioning of the icon
  popupAnchor: [0, -40], // Position of popups
});

export { CustomMarkerIcon };
