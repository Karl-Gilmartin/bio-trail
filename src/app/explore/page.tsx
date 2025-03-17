"use client";

import { useState } from "react";
import NavBar from "../_components/navbar";
import MapComponent from "../_components/map";
import UniversityDropdown from "../_components/university_dropdown";

export default function ExplorePage() {
  const [selectedUniversity, setSelectedUniversity] = useState("");

  return (
    <div className="flex flex-col h-screen">
      {/* Navigation Bar */}
      <NavBar />

      {/* Main Content: Map & Sidebar */}
      <div className="flex flex-1 bg-gray-100 p-6">
        {/* Map Container */}
        <div className="flex-1 h-[500px] bg-gray-300 rounded-lg">
          <MapComponent selectedUniversity={selectedUniversity} />
        </div>

        {/* Sidebar */}
        <div className="w-1/3 bg-gray-200 p-6 rounded-lg ml-6">
          <UniversityDropdown onSelect={setSelectedUniversity} />

          <div className="text-lg font-bold mt-4">
            {selectedUniversity ? `Selected University: ${selectedUniversity}` : "Select a university to view routes"}
          </div>

          <div className="mt-4">
            <h3 className="text-xl font-semibold">Information about the pins on the map</h3>
            <p>Details will appear here once a university and route are selected.</p>
          </div>
        </div>
      </div>
    </div>
  );
}