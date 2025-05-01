"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import NavBar from "../_components/navbar";
import Footer from "../_components/footer";
import DottedBackground from "../_components/dotted_background";

type CreationType = "university" | "trail" | "marker" | null;

// University Form Component
function UniversityForm({ pin }: { pin: string }) {
  const [formData, setFormData] = useState({
    name: "",
    latitude: "",
    longitude: "",
  });

  const createUniversity = api.creation.createUniversity.useMutation({
    onSuccess: () => {
      alert("University created successfully!");
      setFormData({ name: "", latitude: "", longitude: "" });
    },
    onError: (error) => alert(error.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createUniversity.mutate({
      pin,
      name: formData.name,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-semibold">Create University</h3>
      <div>
        <label className="block text-sm font-medium mb-1">University Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Latitude</label>
        <input
          type="number"
          step="any"
          value={formData.latitude}
          onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Longitude</label>
        <input
          type="number"
          step="any"
          value={formData.longitude}
          onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-cambridgeBlue text-white py-2 rounded hover:bg-darkSlateGray transition-colors"
        disabled={createUniversity.isPending}
      >
        {createUniversity.isPending ? "Creating..." : "Create University"}
      </button>
    </form>
  );
}

// Trail Form Component
function TrailForm({ pin }: { pin: string }) {
  const [formData, setFormData] = useState({
    name: "",
    universityId: "",
    description: "",
    geojson: "",
  });

  const { data: universities } = api.creation.getUniversities.useQuery();

  const createTrail = api.creation.createTrail.useMutation({
    onSuccess: () => {
      alert("Trail created successfully!");
      setFormData({ name: "", universityId: "", description: "", geojson: "" });
    },
    onError: (error) => alert(error.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const geojsonParsed = JSON.parse(formData.geojson);
      createTrail.mutate({
        pin,
        name: formData.name,
        universityId: parseInt(formData.universityId),
        description: formData.description,
        geojson: geojsonParsed,
      });
    } catch (error) {
      alert("Invalid GeoJSON format");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-semibold">Create Trail</h3>
      <div>
        <label className="block text-sm font-medium mb-1">Trail Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">University</label>
        <select
          value={formData.universityId}
          onChange={(e) => setFormData({ ...formData, universityId: e.target.value })}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select a university</option>
          {universities?.data?.map((uni) => (
            <option key={uni.id} value={uni.id}>
              {uni.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full p-2 border rounded"
          rows={3}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">GeoJSON</label>
        <textarea
          value={formData.geojson}
          onChange={(e) => setFormData({ ...formData, geojson: e.target.value })}
          className="w-full p-2 border rounded"
          rows={5}
          required
          placeholder="Paste GeoJSON data here"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-cambridgeBlue text-white py-2 rounded hover:bg-darkSlateGray transition-colors"
        disabled={createTrail.isPending}
      >
        {createTrail.isPending ? "Creating..." : "Create Trail"}
      </button>
    </form>
  );
}

// Marker Form Component
function MarkerForm({ pin }: { pin: string }) {
  const [formData, setFormData] = useState({
    name: "",
    trailId: "",
    description: "",
    latitude: "",
    longitude: "",
    images: [] as string[],
    videos: [] as string[],
  });

  const [selectedUniversity, setSelectedUniversity] = useState("");
  const { data: universities } = api.creation.getUniversities.useQuery();
  const { data: trails } = api.creation.getTrailsByUniversity.useQuery(
    { universityId: parseInt(selectedUniversity) },
    { enabled: !!selectedUniversity }
  );

  const createMarker = api.creation.createMarker.useMutation({
    onSuccess: () => {
      alert("Marker created successfully!");
      setFormData({
        name: "",
        trailId: "",
        description: "",
        latitude: "",
        longitude: "",
        images: [],
        videos: [],
      });
    },
    onError: (error) => alert(error.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMarker.mutate({
      pin,
      trailId: parseInt(formData.trailId),
      name: formData.name,
      description: formData.description,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
      images: formData.images,
      videos: formData.videos,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-semibold">Create Marker</h3>
      <div>
        <label className="block text-sm font-medium mb-1">University</label>
        <select
          value={selectedUniversity}
          onChange={(e) => {
            setSelectedUniversity(e.target.value);
            setFormData({ ...formData, trailId: "" });
          }}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select a university</option>
          {universities?.data?.map((uni) => (
            <option key={uni.id} value={uni.id}>
              {uni.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Trail</label>
        <select
          value={formData.trailId}
          onChange={(e) => setFormData({ ...formData, trailId: e.target.value })}
          className="w-full p-2 border rounded"
          required
          disabled={!selectedUniversity}
        >
          <option value="">Select a trail</option>
          {trails?.data?.map((trail) => (
            <option key={trail.id} value={trail.id}>
              {trail.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Marker Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full p-2 border rounded"
          rows={3}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Latitude</label>
        <input
          type="number"
          step="any"
          value={formData.latitude}
          onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Longitude</label>
        <input
          type="number"
          step="any"
          value={formData.longitude}
          onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Image URLs (one per line)</label>
        <textarea
          value={formData.images.join("\n")}
          onChange={(e) => setFormData({ ...formData, images: e.target.value.split("\n").filter(Boolean) })}
          className="w-full p-2 border rounded"
          rows={3}
          placeholder="Enter image URLs, one per line"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Video URLs (one per line)</label>
        <textarea
          value={formData.videos.join("\n")}
          onChange={(e) => setFormData({ ...formData, videos: e.target.value.split("\n").filter(Boolean) })}
          className="w-full p-2 border rounded"
          rows={3}
          placeholder="Enter video URLs, one per line"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-cambridgeBlue text-white py-2 rounded hover:bg-darkSlateGray transition-colors"
        disabled={createMarker.isPending}
      >
        {createMarker.isPending ? "Creating..." : "Create Marker"}
      </button>
    </form>
  );
}

export default function CreateYourTrailPage() {
  const [pin, setPin] = useState("");
  const [creationType, setCreationType] = useState<CreationType>(null);
  const [isPinVerified, setIsPinVerified] = useState(false);

  const verifyPin = api.creation.verifyPin.useMutation({
    onSuccess: () => setIsPinVerified(true),
    onError: (error) => alert(error.message),
  });

  const renderForm = () => {
    switch (creationType) {
      case "university":
        return <UniversityForm pin={pin} />;
      case "trail":
        return <TrailForm pin={pin} />;
      case "marker":
        return <MarkerForm pin={pin} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen relative">
      <DottedBackground />
      <NavBar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">
            Create Your Trail
          </h1>

          {!isPinVerified ? (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-2xl font-semibold">Enter Access PIN</h2>
                <div className="relative group">
                  <button
                    type="button"
                    className="text-gray-500 hover:text-gray-700"
                    aria-label="Help"
                  >
                    ?
                  </button>
                  <div className="absolute right-0 top-full mt-2 p-2 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-64 z-50">
                    The PIN is issued upon request please fill out contact form in the contact page.
                  </div>
                </div>
              </div>
              {/* tooltip */}
              <div className="relative">
                <input
                  type="text"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full p-2 border rounded mb-4"
                  placeholder="Enter your PIN"
                />
                <button
                  onClick={() => verifyPin.mutate({ pin })}
                  className="w-full bg-cambridgeBlue text-white py-2 rounded hover:bg-darkSlateGray transition-colors"
                >
                  Verify PIN
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">What would you like to create?</h2>
              <div className="grid grid-cols-1 gap-4 mb-8">
                <button
                  onClick={() => setCreationType("university")}
                  className={`p-4 border rounded hover:bg-gray-50 transition-colors ${
                    creationType === "university" ? "bg-gray-100 border-cambridgeBlue" : ""
                  }`}
                >
                  Create a University
                </button>
                <button
                  onClick={() => setCreationType("trail")}
                  className={`p-4 border rounded hover:bg-gray-50 transition-colors ${
                    creationType === "trail" ? "bg-gray-100 border-cambridgeBlue" : ""
                  }`}
                >
                  Create a Trail
                </button>
                <button
                  onClick={() => setCreationType("marker")}
                  className={`p-4 border rounded hover:bg-gray-50 transition-colors ${
                    creationType === "marker" ? "bg-gray-100 border-cambridgeBlue" : ""
                  }`}
                >
                  Create a Marker
                </button>
              </div>

              {renderForm()}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
