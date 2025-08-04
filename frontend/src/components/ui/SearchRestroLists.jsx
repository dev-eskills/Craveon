import { Utensils } from "lucide-react";

function SearchRestroLists() {
  return (
    <div className="p-4 border-b border-gray-200">
      {[...Array(3)].map((_, idx) => (
        <button
          key={idx}
          className="w-full flex items-center gap-2 text-orange-500 hover:bg-orange-50 p-2 rounded-lg transition-colors"
        >
          <Utensils size={20} />
          <span>Temp Resturents</span>
        </button>
      ))}
    </div>
  );
}

export default SearchRestroLists;
