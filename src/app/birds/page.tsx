"use client";

import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import NavBar from "../_components/navbar";
import UniversityDropdown from "../_components/university_dropdown";
import { uploadImage } from "../utils/upload";

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
      !universityData?.id
    ) {
      setLocationError("Missing location or university info.");
      return;
    }

    setIsUploading(true);

    try {
      let birdId = selectedBirdId;
      if (!birdId && newBirdName) {
        const newBird = await createBird.mutateAsync({ name: newBirdName });
        birdId = newBird.id;
      }

      if (!birdId) return;

      const imageUrl = imageFile ? await uploadImage(imageFile) : undefined;

      await recordSighting.mutateAsync({
        birdId,
        universityId: universityData.id,
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
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-xl">
        <h1 className="text-3xl font-bold mb-8">Record Bird Sighting</h1>

        {locationError && (
          <div className="mb-6 p-4 bg-red-100 text-sm rounded-md border border-red-300">
            <p className="text-red-700 mb-2">{locationError}</p>
            <div className="flex gap-2">
              <input
                type="number"
                step="any"
                placeholder="Latitude"
                className="p-2 border rounded w-1/2"
                value={manualLat}
                onChange={(e) => setManualLat(e.target.value)}
              />
              <input
                type="number"
                step="any"
                placeholder="Longitude"
                className="p-2 border rounded w-1/2"
                value={manualLng}
                onChange={(e) => setManualLng(e.target.value)}
              />
              <button
                onClick={setManualCoordinates}
                className="bg-blue-500 text-white px-3 rounded hover:bg-blue-600"
              >
                Set
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-medium">Select University</label>
            <UniversityDropdown onSelect={setSelectedUniversity} />
          </div>

          <div>
            <label className="block font-medium">Select Bird</label>
            <select
              value={selectedBirdId || ""}
              onChange={(e) => setSelectedBirdId(Number(e.target.value) || null)}
              className="w-full border p-2 rounded"
            >
              <option value="">Select existing bird</option>
              {birdsData?.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium">Or Enter New Bird</label>
            <input
              value={newBirdName}
              onChange={(e) => setNewBirdName(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="e.g. Blue Jay"
            />
          </div>

          <div>
            <label className="block font-medium">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border p-2 rounded"
              rows={3}
            />
          </div>

          <div>
            <label className="block font-medium">Upload Image (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full"
            />
          </div>

          <button
            disabled={
              !selectedUniversity ||
              (!selectedBirdId && !newBirdName) ||
              isUploading
            }
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isUploading ? "Uploading..." : "Record Sighting"}
          </button>
        </form>
      </main>
    </div>
  );
}
