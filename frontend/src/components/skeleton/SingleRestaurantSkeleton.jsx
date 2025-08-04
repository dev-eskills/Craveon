// components/admin/RestaurantSkeleton.jsx
const SingleRestaurantSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* Cover Image Skeleton */}
      <div className="h-64 w-full bg-gray-200 relative rounded-b-md overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        {/* Logo + Name + Description */}
        <div className="absolute bottom-0 left-0 p-6 flex items-end">
          {/* Logo Skeleton */}
          <div className="w-20 h-20 bg-gray-300 rounded-lg shadow mr-4" />
          <div>
            <div className="w-40 h-6 bg-gray-300 rounded mb-2" />
            <div className="w-60 h-4 bg-gray-300 rounded" />
          </div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="px-4 sm:px-6 lg:px-8 border-b border-gray-200 mt-2">
        <div className="flex space-x-4 overflow-x-auto pt-4 pb-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-24 h-6 bg-gray-200 rounded" />
          ))}
        </div>
      </div>

      {/* Overview Cards Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 px-4 sm:px-6 lg:px-8">
        <div className="h-48 bg-gray-200 rounded-lg" />
        <div className="h-48 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
};

export default SingleRestaurantSkeleton;
