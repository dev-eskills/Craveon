import { Clock } from 'lucide-react';

const RestaurantCardSkeleton = () => {
  return (
    <div className="md:w-72 w-full min-h-[400px] rounded-lg overflow-hidden shadow-lg bg-white flex flex-col animate-pulse">
      <div className="relative bg-gray-300 h-48 w-full"></div>

      <div className="p-4 flex flex-col flex-grow">
        {/* Title Placeholder */}
        <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>

        {/* Description Placeholder */}
        <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6 mb-4"></div>

        {/* Address Placeholder */}
        <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>

        {/* Business Hours Placeholder */}
        <div className="flex items-center text-sm text-gray-600 my-2">
          <Clock size={16} className="mr-1 text-gray-400" />
          <div className="h-4 bg-gray-300 rounded w-1/3"></div>
        </div>

        {/* Button Placeholder */}
        <div className="mt-auto">
          <div className="w-full py-2 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCardSkeleton;
