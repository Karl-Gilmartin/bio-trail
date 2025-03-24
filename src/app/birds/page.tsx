"use client";

import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import NavBar from "../_components/navbar";
import UniversityDropdown from "../_components/university_dropdown";
import { uploadImage } from "../utils/upload";
import Footer from "../_components/footer";
import { FaInfoCircle, FaMapMarkerAlt, FaCamera, FaUpload } from "react-icons/fa";

export default function BirdSightingsPage() {
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [manualLat, setManualLat] = useState("");
  const [manualLng, setManualLng] = useState("");
  const [locationError, setLocationError] = useState<string | null>(null);

  const [newBirdName, setNewBirdName] = useState("");
  const [selectedBirdId, setSelectedBirdId] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // 🌍 Try to get user location on mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude);
          setLongitude(pos.coords.longitude);
          setLocationError(null);
        },
        (err) => {
          console.error("Location error:", err);
          switch (err.code) {
            case 1:
              setLocationError("Permission denied. Please enter coordinates manually.");
              break;
            case 2:
              setLocationError("Location unavailable. Try entering it manually.");
              break;
            case 3:
              setLocationError("Request timed out. Please enter coordinates manually.");
              break;
            default:
              setLocationError("Could not get location. Enter it manually.");
          }
        }
      );
    } else {
      setLocationError("Geolocation not supported by your browser.");
    }
  }, []);

  const setManualCoordinates = () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    if (!isNaN(lat) && !isNaN(lng)) {
      setLatitude(lat);
      setLongitude(lng);
      setLocationError(null);
    } else {
      setLocationError("Invalid coordinates");
    }
  };

  const { data: birdsData } = api.birds.getAll.useQuery(undefined, {
    enabled: !!selectedUniversity,
  });

  const { data: universityData } = api.university.getByName.useQuery(
    { name: selectedUniversity },
    { enabled: !!selectedUniversity }
  );

  const createBird = api.birds.create.useMutation();
  const recordSighting = api.birds.recordSighting.useMutation({
    onSuccess: () => {
      setSelectedBirdId(null);
      setNewBirdName("");
      setNotes("");
      setImageFile(null);
      setIsUploading(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      typeof latitude !== "number" ||
      typeof longitude !== "number" ||
      !universityData?.data.id
    ) {
      setLocationError("Missing location or university info.");
      return;
    }

    setIsUploading(true);

    try {
      let birdId = selectedBirdId;
      if (!birdId && newBirdName) {
        const newBird = await createBird.mutateAsync({ name: newBirdName });
        birdId = newBird.data.id;
      }

      if (!birdId) return;

      const imageUrl = imageFile ? await uploadImage(imageFile) : undefined;

      await recordSighting.mutateAsync({
        birdId,
        universityId: universityData.data.id,
        latitude,
        longitude,
        imageUrl,
        notes,
      });
    } catch (err) {
      console.error("Failed to record sighting:", err);
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavBar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <h1 className="text-3xl font-bold mb-2">Record Bird Sighting</h1>
            <p className="text-gray-600 mb-6">Share your bird observations with the community</p>

            {/* Location Accuracy Message */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
              <div className="flex items-start">
                <FaInfoCircle className="w-5 h-5 text-darkSlateGray mt-1 mr-2" />
                <p className="text-sm text-darkSlateGray">
                  For the most accurate location data, please use a mobile device with GPS enabled. 
                  If you're on desktop, you can enter coordinates manually.
                </p>
              </div>
            </div>

            {locationError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700 mb-3">{locationError}</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <input
                      type="number"
                      step="any"
                      placeholder="Latitude"
                      className="w-full p-2 border rounded"
                      value={manualLat}
                      onChange={(e) => setManualLat(e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="number"
                      step="any"
                      placeholder="Longitude"
                      className="w-full p-2 border rounded"
                      value={manualLng}
                      onChange={(e) => setManualLng(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={setManualCoordinates}
                    className="bg-darkSlateGray text-white px-4 py-2 rounded hover:bg-darkSlateGray transition-colors flex items-center justify-center gap-2"
                  >
                    <FaMapMarkerAlt className="w-4 h-4" />
                    Set Location
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select University
                </label>
                <UniversityDropdown onSelect={setSelectedUniversity} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Bird
                </label>
                <select
                  value={selectedBirdId || ""}
                  onChange={(e) => setSelectedBirdId(Number(e.target.value) || null)}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-darkSlateGray focus:border-transparent"
                >
                  <option value="">Select existing bird</option>
                  {birdsData?.data.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Or Enter New Bird
                </label>
                <input
                  value={newBirdName}
                  onChange={(e) => setNewBirdName(e.target.value)}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-darkSlateGray focus:border-transparent"
                  placeholder="e.g. Blue Jay"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-darkSlateGray focus:border-transparent"
                  rows={3}
                  placeholder="Add any observations or details about the sighting..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Image (Optional)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <FaCamera className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600 justify-center items-center gap-1">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-darkSlateGray hover:text-darkSlateGray focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-darkSlateGray flex items-center gap-1"
                      >
                        <FaUpload className="w-4 h-4" />
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          accept="image/*"
                          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </div>

              <button
                disabled={
                  !selectedUniversity ||
                  (!selectedBirdId && !newBirdName) ||
                  isUploading
                }
                type="submit"
                className="w-full bg-darkSlateGray text-white py-3 px-4 rounded-md hover:bg-darkSlateGray focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-darkSlateGray disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isUploading ? "Recording..." : "Record Sighting"}
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
