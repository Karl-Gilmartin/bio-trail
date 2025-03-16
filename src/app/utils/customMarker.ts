const createCustomMarker = async () => {
    if (typeof window === "undefined") return null; // ✅ Prevent SSR error
  
    const L = await import("leaflet"); // ✅ Import Leaflet dynamically
  
    return L.icon({
      iconUrl: "/marker-icon-2x-black.png", // ✅ Ensure this file exists in /public
      iconSize: [30, 45], // Width & height
      iconAnchor: [15, 45], // Positioning of the icon
      popupAnchor: [0, -40], // Position of popups
    });
  };
  
  export default createCustomMarker;
  