"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import NavBar from "../_components/navbar";
import UniversityDropdown from "../_components/university_dropdown";

export default function SightingsPage() {
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [selectedBird, setSelectedBird] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Get university ID from name
  const { data: universityData } = api.university.getByName.useQuery(
    { name: selectedUniversity },
    { enabled: !!selectedUniversity }
  );

  // Get all birds
  const { data: birdsData } = api.birds.getAll.useQuery(
    undefined,
    { enabled: !!selectedUniversity }
  );

  // Get sightings for selected university
  const { data: sightingsData } = api.birds.getSightingsByUniversity.useQuery(
    { universityId: universityData?.data?.id ?? 0 },
    { 
      enabled: !!universityData?.data?.id,
      select: (data) => {
        if (!selectedBird) return data.data;
        return data.data.filter(sighting => sighting.birdId === selectedBird);
      }
    }
  );

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Bird Sightings</h1>
        
        <div className="mb-8 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Select University
            </label>
            <UniversityDropdown onSelect={setSelectedUniversity} />
          </div>

          {birdsData?.data && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Filter by Bird Type
              </label>
              <select
                className="w-full p-2 border rounded"
                value={selectedBird || ""}
                onChange={(e) => setSelectedBird(e.target.value ? Number(e.target.value) : null)}
              >
                <option value="">All Birds</option>
                {birdsData.data.map((bird) => (
                  <option key={bird.id} value={bird.id}>
                    {bird.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {sightingsData && sightingsData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bird</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sightingsData.map((sighting) => (
                  <tr key={sighting.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {birdsData?.data.find(bird => bird.id === sighting.birdId)?.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(sighting.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <a 
                          href={`https://www.google.com/maps?q=${sighting.latitude},${sighting.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {sighting.latitude.toFixed(6)}, {sighting.longitude.toFixed(6)}
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {sighting.imageUrl ? (
                        <button
                          onClick={() => setSelectedImage(sighting.imageUrl)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </button>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {sighting.notes || "-"}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            {selectedUniversity ? "No sightings found for the selected filters." : "Please select a university to view sightings."}
          </div>
        )}

        {/* Image Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg max-w-4xl max-h-[90vh] relative">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <img
                src={selectedImage}
                alt="Bird sighting"
                className="max-w-full max-h-[80vh] object-contain"
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
