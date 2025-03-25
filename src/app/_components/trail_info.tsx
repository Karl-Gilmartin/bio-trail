"use client";

import { useEffect, useState } from "react";
import { api } from "~/trpc/react";

interface TrailInfoProps {
  selectedTrail: string;
  selectedUniversity: string;
}

const TrailInfo = ({ selectedTrail, selectedUniversity }: TrailInfoProps) => {
  const [trailData, setTrailData] = useState<{
    name: string;
    description: string | null;
    markers: Array<{
      name: string;
      description: string;
      images: string[];
      videos: string[];
    }>;
  } | null>(null);

  const trailId = selectedTrail ? parseInt(selectedTrail) : null;
  
  console.log('Selected Trail ID:', trailId);
  
  const { data: trailResponse, isLoading } = api.trail.getById.useQuery(
    { id: trailId ?? 0 },
    { 
      enabled: !!trailId && !isNaN(trailId),
      retry: false
    }
  );

  useEffect(() => {
    console.log('Trail Response:', JSON.stringify(trailResponse, null, 2));
    if (trailResponse?.data) {
      console.log('Trail Data:', JSON.stringify(trailResponse.data, null, 2));
      console.log('Trail Description:', trailResponse.data.description);
      setTrailData({
        name: trailResponse.data.name,
        description: trailResponse.data.description,
        markers: trailResponse.data.markers,
      });
    } else {
      setTrailData(null);
    }
  }, [trailResponse]);

  if (!selectedTrail || !selectedUniversity) {
    return (
      <div className="mt-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Trail Information</h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          Select a university and trail to view details.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mt-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Loading Trail Info...</h3>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  console.log('Current Trail Data:', JSON.stringify(trailData, null, 2));
  console.log('Current Trail Description:', trailData?.description);

  return (
    <div className="mt-6">
      <h3 className="text-xl font-bold text-gray-900 mb-2">{trailData?.name}</h3>
      <p className="text-gray-600 text-sm leading-relaxed mb-4">
        {trailData?.description || "No description available."}
      </p>
      
      {trailData?.markers && trailData.markers.length > 0 && (
        <div className="mt-4">
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Points of Interest</h4>
          <div className="space-y-4">
            {trailData.markers.map((marker, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-medium text-gray-900">{marker.name}</h5>
                <p className="text-sm text-gray-600 mt-1">{marker.description}</p>
                {marker.images.length > 0 && (
                  <div className="mt-2 flex gap-2">
                    {marker.images.map((image, imgIndex) => (
                      <img
                        key={imgIndex}
                        src={image}
                        alt={`${marker.name} - Image ${imgIndex + 1}`}
                        className="w-20 h-20 object-cover rounded"
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrailInfo;