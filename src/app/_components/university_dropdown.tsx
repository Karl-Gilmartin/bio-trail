"use client";

import { useEffect, useState } from "react";

const UniversityDropdown = ({ onSelect }: { onSelect: (university: string) => void }) => {
  const [universities, setUniversities] = useState<{ name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/universities")
      .then((res) => res.json())
      .then((data) => {
        setUniversities(data); 
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching universities:", err);
        setError("Failed to load universities");
        setLoading(false);
      });
  }, []);


  if (loading) return <p>Loading universities...</p>;
  if (error) return <p>{error}</p>;

  return (
    <select className="w-full p-2 mb-4 border rounded" onChange={(e) => onSelect(e.target.value)}>
  <option value="">Please select your university</option>
  {universities?.length > 0 ? (
    universities.map((uni, index) => (
      <option key={index} value={uni.name}>{uni.name}</option>
    ))
  ) : (
    <option disabled>Loading universities...</option>
  )}
</select>

  );
};

export default UniversityDropdown;
