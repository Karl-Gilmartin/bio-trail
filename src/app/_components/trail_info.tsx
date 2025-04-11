"use client";

import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { getMarkerImageUrl } from "~/app/utils/getImage";

interface TrailInfoProps {
  selectedTrail: string;
  selectedUniversity: string;
}

interface ImageModalProps {
  imageUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

const ImageModal = ({ imageUrl, isOpen, onClose }: ImageModalProps) => {
  if (!isOpen) return null;

  // Check if the URL is valid
  const isValidUrl = imageUrl && imageUrl.startsWith('http');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="relative max-w-4xl max-h-[90vh] w-full">
        {/* Close button */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md z-10 hover:bg-gray-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>
        
        {isValidUrl ? (
          <Image
            src={imageUrl}
            alt="Marker image"
            width={1200}
            height={800}
            className="object-contain w-full h-full"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <div className="bg-gray-100 p-8 rounded-lg text-center">
            <p className="text-gray-500">Image not available</p>
          </div>
        )}
      </div>
    </div>
  );
};

const TrailInfo = ({ selectedTrail, selectedUniversity }: TrailInfoProps) => {
  const [trailData, setTrailData] = useState<{
    name: string;
    description: string | null;
    markers: Array<{
      name: string;
      description: string;
      imagePaths: string[];
      videos: string[];
    }>;
  } | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const trailId = selectedTrail ? parseInt(selectedTrail) : null;
  
  console.log('Selected Trail ID:', trailId);
  
  const { data: trailResponse, isLoading } = api.trails.getById.useQuery(
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
        markers: trailResponse.data.markers.map(marker => ({
          name: marker.name,
          description: marker.description,
          imagePaths: marker.imagePaths,
          videos: marker.videos,
        })),
      });
    } else {
      setTrailData(null);
    }
  }, [trailResponse]);

  // Add debugging for image paths
  const handleImageClick = (imagePath: string) => {
    console.log('Image path:', imagePath);
    const imageUrl = getMarkerImageUrl(imagePath);
    console.log('Generated URL:', imageUrl);
    setSelectedImage(imageUrl);
  };

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
                {marker.imagePaths && marker.imagePaths.length > 0 && (
                  <div className="mt-2 flex gap-2">
                    {marker.imagePaths.map((imagePath, imgIndex) => (
                      <button
                        key={imgIndex}
                        onClick={() => handleImageClick(imagePath)}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                      >
                        <ImageIcon className="w-5 h-5 text-gray-600" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <ImageModal
        imageUrl={selectedImage ?? ""}
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
};

export default TrailInfo;