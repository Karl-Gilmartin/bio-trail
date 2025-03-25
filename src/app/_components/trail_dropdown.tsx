"use client";

import { api } from "~/trpc/react";

const TrailDropdown = ({ 
  onSelect, 
  selectedUniversity 
}: { 
  onSelect: (trail: string) => void;
  selectedUniversity: string;
}) => {
  const { data, isLoading, error } = api.trail.getByUniversity.useQuery({ 
    universityName: selectedUniversity 
  }, {
    enabled: !!selectedUniversity
  });

  if (isLoading) return <p>Loading trails...</p>;
  if (error) return <p>Error loading trails</p>;

  return (
    <select 
      className="w-full p-2 mb-4 border rounded" 
      onChange={(e) => onSelect(e.target.value)}
    >
      <option value="">Please select your trail</option>
      {data?.data?.map((trail) => (
        <option key={trail.id} value={trail.name}>{trail.name}</option>
      ))}
    </select>
  );
};

export default TrailDropdown;
