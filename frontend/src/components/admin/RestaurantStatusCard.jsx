import { Users } from 'lucide-react';

import RestaurantBussinessHours from './RestaurantBussinessHours';

const RestaurantStatusCard = ({ singleRestaurant }) => {
  return (
    <div className="grid grid-cols-1 gap-6">
      <RestaurantBussinessHours singleRestaurant={singleRestaurant} />
      {/* <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Restaurant Status</h3>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex justify-between p-4 bg-gray-50 rounded-md">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Active Status</span>
                        <span className="mt-1 text-lg font-semibold">
                          {singleRestaurant?.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div
                        className={`flex items-center justify-center rounded-full w-10 h-10 ${
                          singleRestaurant?.isActive ? 'bg-green-100' : 'bg-red-100'
                        }`}
                      >
                        {singleRestaurant?.isActive ? (
                          <Check size={20} className="text-green-500" />
                        ) : (
                          <X size={20} className="text-red-500" />
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between p-4 bg-gray-50 rounded-md">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Verification</span>
                        <span className="mt-1 text-lg font-semibold">
                          {singleRestaurant?.isVerified ? 'Verified' : 'Unverified'}
                        </span>
                      </div>
                      <div
                        className={`flex items-center justify-center rounded-full w-10 h-10 ${
                          singleRestaurant?.isVerified ? 'bg-green-100' : 'bg-yellow-100'
                        }`}
                      >
                        {singleRestaurant?.isVerified ? (
                          <Check size={20} className="text-green-500" />
                        ) : (
                          <AlertCircle size={20} className="text-yellow-500" />
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between p-4 bg-gray-50 rounded-md">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Ordering</span>
                        <span className="mt-1 text-lg font-semibold">
                          {singleRestaurant?.isOrderingEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                      <div
                        className={`flex items-center justify-center rounded-full w-10 h-10 ${
                          singleRestaurant?.isOrderingEnabled ? 'bg-green-100' : 'bg-red-100'
                        }`}
                      >
                        {singleRestaurant?.isOrderingEnabled ? (
                          <Check size={20} className="text-green-500" />
                        ) : (
                          <X size={20} className="text-red-500" />
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between p-4 bg-gray-50 rounded-md">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Featured</span>
                        <span className="mt-1 text-lg font-semibold">
                          {singleRestaurant?.featured ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div
                        className={`flex items-center justify-center rounded-full w-10 h-10 ${
                          singleRestaurant?.featured ? 'bg-purple-100' : 'bg-gray-100'
                        }`}
                      >
                        {singleRestaurant?.featured ? (
                          <Star size={20} className="text-purple-500" />
                        ) : (
                          <Star size={20} className="text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}

      {/* Owner Information */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Owner Information</h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                <Users size={24} className="text-gray-500" />
              </div>
            </div>
            <div className="ml-4">
              <h4 className="text-lg font-medium text-gray-900">{singleRestaurant?.owner.name}</h4>
              <p className="text-sm text-gray-500">{singleRestaurant?.owner.email}</p>
              <p className="text-xs text-gray-400">ID: {singleRestaurant?.owner._id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantStatusCard;
