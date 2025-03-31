"use client";

import { api } from "~/trpc/react";

const UniversityDropdown = ({ onSelect }: { onSelect: (university: string) => void }) => {
  const { data, isLoading, error } = api.universities.getAll.useQuery();

  if (isLoading) return <p>Loading universities...</p>;
  if (error) return <p>Error loading universities</p>;

  return (
    <select 
      className="w-full p-2 mb-4 border rounded" 
      onChange={(e) => onSelect(e.target.value)}
    >
      <option value="">Please select your university</option>
      {data?.data?.map((uni) => (
        <option key={uni.id} value={uni.name}>{uni.name}</option>
      ))}
    </select>
  );
};

export default UniversityDropdown;
