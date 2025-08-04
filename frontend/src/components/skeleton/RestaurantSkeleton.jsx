const RestaurantSkeleton = ({ count = 3, className }) => {
  return (
    <div className="mx-auto py-6 px-4">
      <div className={`grid grid-cols-1 gap-6 ${className}`}>
        {Array(count)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="bg-white rounded-xl overflow-hidden shadow animate-pulse">
              <div className="flex flex-col lg:flex-row">
                {/* Restaurant Image Skeleton */}
                <div className="lg:w-64 h-40 lg:max-h-full relative bg-gray-200"></div>

                {/* Restaurant Info Skeleton */}
                <div className="flex-1 p-3">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    {/* Restaurant Name Skeleton */}
                    <div className="h-8 bg-gray-200 rounded w-2/3 mb-2"></div>

                    {/* Open/Closed Status Skeleton */}
                    <div className="h-6 bg-gray-200 rounded-full w-24"></div>
                  </div>

                  {/* Description Skeleton */}
                  <div className="mt-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>

                  {/* Address Skeleton */}
                  <div className="mt-2 flex items-start">
                    <div className="w-5 h-5 mr-2 bg-gray-200 rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>

                  {/* Action Button Skeleton */}
                  <div className="mt-2">
                    <div className="h-10 bg-gray-200 rounded-lg w-32"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default RestaurantSkeleton;
