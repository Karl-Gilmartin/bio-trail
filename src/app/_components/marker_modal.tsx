"use client";

import React from "react";

interface MarkerModalProps {
  marker: {
    name: string;
    description: string;
    images: string[];
    videos: string[];
  };
  onClose: () => void;
}

const MarkerModal: React.FC<MarkerModalProps> = ({ marker, onClose }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-1/2 relative">
        <button className="absolute top-2 right-2 text-xl" onClick={onClose}>✖</button>
        
        <h2 className="text-2xl font-bold mb-2">{marker.name}</h2>
        <p className="text-gray-700">{marker.description}</p>

        {/* Render Images */}
        {marker.images.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Images</h3>
            <div className="grid grid-cols-2 gap-2">
              {marker.images.map((img, index) => (
                <img key={index} src={img} alt={`Marker ${index}`} className="w-full h-32 object-cover rounded-lg" />
              ))}
            </div>
          </div>
        )}

        {/* Render Videos */}
        {marker.videos.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Videos</h3>
            {marker.videos.map((video, index) => (
              <video key={index} controls className="w-full h-40 rounded-lg">
                <source src={video} type="video/mp4" />
              </video>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MarkerModal;
