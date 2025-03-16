import React from "react";

const ComingSoon: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
      <h1 className="text-5xl font-bold text-gray-900 mb-4">Coming Soon</h1>
      <p className="text-lg text-gray-600 mb-6">Not there quite yet!</p>
      <div className="animate-pulse bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md">
        Watch this space 👀
      </div>
    </div>
  );
};

export default ComingSoon;