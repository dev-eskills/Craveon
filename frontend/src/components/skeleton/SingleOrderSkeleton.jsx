const SingleOrderSkeleton = () => {
  return (
    <div className="p-6 space-y-4 animate-pulse bg-white min-h-screen">
      {/* Header Skeleton */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-2">
        <div className="h-6 bg-gray-200 w-48 rounded"></div>
        <div className="h-4 bg-gray-100 w-32 rounded"></div>
        <div className="h-6 w-24 bg-gray-100 rounded"></div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-2">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-6 space-y-2">
              <div className="h-4 bg-gray-200 w-32 rounded"></div>
              <div className="h-3 bg-gray-100 w-48 rounded"></div>
              <div className="h-3 bg-gray-100 w-40 rounded"></div>
              <div className="h-3 bg-gray-100 w-36 rounded"></div>
            </div>
          ))}
      </div>

      {/* Items List Skeleton */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="h-6 bg-gray-200 w-40 mb-4 rounded"></div>

        {Array(2)
          .fill(0)
          .map((_, idx) => (
            <div
              key={idx}
              className="flex flex-col md:flex-row gap-4 py-4 border-b border-gray-100"
            >
              <div className="w-28 h-28 bg-gray-200 rounded-md"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 w-64 bg-gray-200 rounded"></div>
                <div className="h-3 w-48 bg-gray-100 rounded"></div>
                <div className="h-3 w-32 bg-gray-100 rounded"></div>
                <div className="h-3 w-40 bg-gray-100 rounded"></div>
                <div className="h-3 w-56 bg-gray-100 rounded"></div>
                <div className="h-3 w-24 bg-gray-200 rounded mt-2"></div>
              </div>
            </div>
          ))}

        <div className="h-4 w-32 bg-gray-200 rounded mt-4"></div>
      </div>
    </div>
  );
}

export default SingleOrderSkeleton
