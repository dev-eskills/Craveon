const RestaurantReportskeleton = () => {
  return (
    <div className="p-3 w-full space-y-6 animate-pulse">
      {/* Order Statistics */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="h-6 bg-gray-200 w-40 mb-4 rounded"></div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="h-20 bg-gray-100 rounded"></div>
            ))}
        </div>
        <div className="bg-white p-2 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <div className="h-6 w-32 bg-gray-200 rounded"></div>
            <div className="flex space-x-2">
              <div className="h-8 w-16 bg-gray-200 rounded"></div>
              <div className="h-8 w-16 bg-gray-200 rounded"></div>
            </div>
          </div>

          {/* Status filter buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="h-6 w-24 bg-gray-200 rounded"></div>
              ))}
          </div>

          {/* Chart placeholder */}
          <div className="h-64 bg-gray-100 rounded"></div>
        </div>
      </div>

      {/* Sales Overview & Top Products */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sales Overview */}
        <div className="bg-white p-4 rounded-lg shadow space-y-4">
          <div className="h-6 bg-gray-200 w-40 rounded"></div>
          <div className="flex justify-between">
            <div>
              <div className="h-4 w-24 bg-gray-200 mb-2 rounded"></div>
              <div className="h-6 w-32 bg-gray-300 rounded"></div>
            </div>
            <div>
              <div className="h-4 w-24 bg-gray-200 mb-2 rounded"></div>
              <div className="h-6 w-32 bg-gray-300 rounded"></div>
            </div>
          </div>
          <div className="h-40 bg-gray-100 rounded"></div>
        </div>

        {/* Top Products */}
        <div className="bg-white p-4 rounded-lg shadow space-y-4">
          <div className="h-6 bg-gray-200 w-40 rounded"></div>
          <div className="space-y-3">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="h-4 w-48 bg-gray-200 rounded"></div>
                  <div className="h-8 w-8 bg-orange-100 rounded-full"></div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantReportskeleton;
