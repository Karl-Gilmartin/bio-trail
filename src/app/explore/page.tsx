"use client";

import { useState } from "react";
import NavBar from "../_components/navbar";
import MapComponent from "../_components/map";
import UniversityDropdown from "../_components/university_dropdown";
import TrailDropdown from "../_components/trail_dropdown";

export default function ExplorePage() {
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [selectedTrail, setSelectedTrail] = useState("");

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Bar */}
      <NavBar />

      {/* Main Content */}
      <div className="flex flex-col md:flex-row flex-1 bg-gray-50 p-4 gap-4">
        {/* Map Section */}
        <div className="flex-1 h-[300px] md:h-auto md:min-h-full bg-white rounded-2xl shadow-md overflow-hidden">
          <MapComponent selectedUniversity={selectedUniversity} />
        </div>

        {/* Sidebar Section */}
        <div className="w-full md:w-1/3 bg-white p-6 rounded-2xl shadow-md">
          <UniversityDropdown onSelect={setSelectedUniversity} />
          <TrailDropdown 
            onSelect={setSelectedTrail} 
            selectedUniversity={selectedUniversity}
          />

          <div className="mt-4 text-lg font-semibold text-gray-800">
            {selectedUniversity
              ? `Selected University: ${selectedUniversity}`
              : "Select a university to view routes"}
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Map Information
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Details will appear here once a university and route are selected.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
