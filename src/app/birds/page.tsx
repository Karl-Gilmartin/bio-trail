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
  const [newBirdName, setNewBirdName] = useState("");
  const [selectedBirdId, setSelectedBirdId] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Get user's location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  // Get all birds
  const { data: birdsData } = api.birds.getAll.useQuery(
    undefined,
    { enabled: !!selectedUniversity }
  );

  // Get university ID from name
  const { data: universityData } = api.university.getByName.useQuery(
    { name: selectedUniversity },
    { enabled: !!selectedUniversity }
  );

  // Record sighting mutation
  const recordSighting = api.birds.recordSighting.useMutation({
    onSuccess: () => {
      // Reset form
      setSelectedBirdId(null);
      setNewBirdName("");
      setNotes("");
      setImageFile(null);
      setIsUploading(false);
    },
  });

  const createBird = api.birds.create.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!latitude || !longitude || !universityData?.data?.id) return;

    setIsUploading(true);

    try {
      let birdId = selectedBirdId;
      if (!birdId && newBirdName) {
        // Create new bird if needed
        const newBird = await createBird.mutateAsync({ name: newBirdName });
        birdId = newBird.data.id;
      }

      if (!birdId) return;

      // Handle image upload if there's an image
      let imageUrl: string | undefined;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      await recordSighting.mutateAsync({
        birdId,
        universityId: universityData.data.id,
        latitude,
        longitude,
        imageUrl,
        notes,
      });
    } catch (error) {
      console.error("Error recording sighting:", error);
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Record Bird Sighting</h1>
        
        <form onSubmit={handleSubmit} className="max-w-md space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Select University
            </label>
            <UniversityDropdown onSelect={setSelectedUniversity} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Select Bird
            </label>
            <select
              className="w-full p-2 border rounded"
              value={selectedBirdId || ""}
              onChange={(e) => setSelectedBirdId(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">Select a bird</option>
              {birdsData?.data?.map((bird: { id: number; name: string }) => (
                <option key={bird.id} value={bird.id}>
                  {bird.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Or Enter New Bird Name
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={newBirdName}
              onChange={(e) => setNewBirdName(e.target.value)}
              placeholder="Enter bird name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Notes
            </label>
            <textarea
              className="w-full p-2 border rounded"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about the sighting"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Upload Image (Optional)
            </label>
            <input
              type="file"
              className="w-full p-2 border rounded"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={!selectedUniversity || (!selectedBirdId && !newBirdName) || isUploading}
          >
            {isUploading ? "Recording..." : "Record Sighting"}
          </button>
        </form>
      </main>
    </div>
  );
} 