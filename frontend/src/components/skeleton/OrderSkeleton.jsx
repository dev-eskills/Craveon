const OrderSkeleton = () => {
  return (
    <div className="bg-white p-4 rounded shadow mb-4 animate-pulse">
      <div className="flex justify-between items-center mb-3">
        <div>
          <div className="h-4 bg-gray-300 rounded w-40 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-20"></div>
        </div>
        <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
      </div>

      <div className="mt-4 border-t border-gray-300 pt-4">
        {/* Order Items */}
        {[1, 2].map((_, i) => (
          <div key={i} className="flex items-start justify-between py-2 border-b border-gray-200">
            <div className="flex gap-3">
              <div className="w-16 h-16 bg-gray-200 rounded"></div>
              <div>
                <div className="h-4 w-32 bg-gray-300 mb-2 rounded"></div>
                <div className="h-3 w-40 bg-gray-200 mb-1 rounded"></div>
                <div className="h-3 w-24 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="text-right">
              <div className="h-4 w-10 bg-gray-300 mb-1 rounded"></div>
              <div className="h-3 w-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}

        <div className="flex justify-between items-center py-3">
          <div className="h-4 w-24 bg-gray-300 rounded"></div>
          <div className="h-4 w-12 bg-gray-300 rounded"></div>
        </div>

        {/* Delivery Info */}
        <div className="mt-4">
          <div className="h-4 w-36 bg-gray-300 mb-2 rounded"></div>
          <div className="h-3 w-64 bg-gray-200 mb-1 rounded"></div>
          <div className="h-3 w-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default OrderSkeleton;
