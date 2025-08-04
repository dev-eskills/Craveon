const RestaurantDelivery = ({ singleRestaurant }) => {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Delivery Settings */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Delivery Settings</h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex justify-between">
              <h4 className="text-sm font-medium text-gray-500">Delivery Available</h4>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  singleRestaurant?.deliverySettings.isDeliveryAvailable
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {singleRestaurant?.deliverySettings.isDeliveryAvailable ? 'Yes' : 'No'}
              </span>
            </div>
            <hr className="border-gray-200" />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Delivery Radius</h4>
                <p className="mt-1 text-sm text-gray-900">
                  {singleRestaurant?.deliverySettings.deliveryRadius} km
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Delivery Fee</h4>
                <p className="mt-1 text-sm text-gray-900">
                  ₹{singleRestaurant?.deliverySettings.deliveryFee}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Minimum Order</h4>
                <p className="mt-1 text-sm text-gray-900">
                  {singleRestaurant?.deliverySettings.minimumOrderAmount > 0
                    ? `₹${singleRestaurant?.deliverySettings.minimumOrderAmount}`
                    : 'No minimum'}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Free Delivery Above</h4>
                <p className="mt-1 text-sm text-gray-900">
                  {singleRestaurant?.deliverySettings.freeDeliveryThreshold
                    ? `₹${singleRestaurant?.deliverySettings.freeDeliveryThreshold}`
                    : 'Not available'}
                </p>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Estimated Delivery Time</h4>
              <p className="mt-1 text-sm text-gray-900">
                {singleRestaurant?.deliverySettings.estimatedDeliveryTime
                  ? `${singleRestaurant?.deliverySettings.estimatedDeliveryTime} minutes`
                  : 'Not specified'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pickup Settings */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Pickup Settings</h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex justify-between">
              <h4 className="text-sm font-medium text-gray-500">Pickup Available</h4>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  singleRestaurant?.pickupSettings.isPickupAvailable
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {singleRestaurant?.pickupSettings.isPickupAvailable ? 'Yes' : 'No'}
              </span>
            </div>
            <hr className="border-gray-200" />
            <div>
              <h4 className="text-sm font-medium text-gray-500">Estimated Pickup Time</h4>
              <p className="mt-1 text-sm text-gray-900">
                {singleRestaurant?.pickupSettings.estimatedPickupTime
                  ? `${singleRestaurant?.pickupSettings.estimatedPickupTime} minutes`
                  : 'Not specified'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Settings */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Additional Settings</h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Packaging Charge</h4>
              <p className="mt-1 text-sm text-gray-900">
                {singleRestaurant?.packagingCharge > 0
                  ? `₹${singleRestaurant?.packagingCharge}`
                  : 'No packaging charge'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDelivery;
