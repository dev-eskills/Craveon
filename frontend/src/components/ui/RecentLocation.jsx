import React from "react";

const RecentLocation = () => {
  return (
    <div className="py-2">
      <div className="px-4 py-2 text-sm text-gray-500">RECENT LOCATIONS</div>
      {[
        "Mhow Gaon, Madhya Pradesh",
        "Indore, Madhya Pradesh",
        "Bhopal, Madhya Pradesh",
      ].map((location) => (
        <button
          key={location}
          className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
        >
          <div className="text-gray-700">{location}</div>
          <div className="text-sm text-gray-500">Madhya Pradesh, India</div>
        </button>
      ))}
    </div>
  );
};

export default RecentLocation;
