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

  console.log('University Trails Data:', data);
  if (error) {
    console.error('Trail Dropdown Error:', error);
    return <p className="text-red-500">Error loading trails: {error.message}</p>;
  }

  if (isLoading) return <p>Loading trails...</p>;

  return (
    <select 
      className="w-full p-2 mb-4 border rounded" 
      onChange={(e) => {
        console.log('Selected Trail Value:', e.target.value);
        onSelect(e.target.value);
      }}
    >
      <option value="">Please select your trail</option>
      {data?.data?.map((trail: any) => {
        console.log('Trail Option:', { id: trail.id, name: trail.name });
        return (
          <option key={trail.id} value={trail.id}>{trail.name}</option>
        );
      })}
    </select>
  );
};

export default TrailDropdown;
