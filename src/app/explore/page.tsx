import React from "react";
import NavBar from "../_components/navbar";
import MapComponent from "../_components/map";

export default async function ExplorePage() {
  return (
    <div className="flex flex-col h-screen">
      {/* Navigation Bar */}
      <NavBar />

      {/* Main Content: Map & Sidebar */}
      <div className="flex flex-1 bg-gray-100 p-6">
        {/* Map Container */}
        <div className="flex-1 h-[500px] bg-gray-300 rounded-lg">
          <MapComponent />
          </div>

        {/* Sidebar */}
        <div className="w-1/3 bg-gray-200 p-6 rounded-lg ml-6">
          <select className="w-full p-2 mb-4 border rounded">
            <option value="">Please select your university</option>
            <option value="uni1">University 1</option>
            <option value="uni2">University 2</option>
          </select>

          <div className="text-lg font-bold">
            Information about the pins on the map
          </div>
        </div>
      </div>
    </div>
  );
};


