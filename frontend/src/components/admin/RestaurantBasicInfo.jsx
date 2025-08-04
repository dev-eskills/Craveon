import { Globe, Mail, Phone, Star } from 'lucide-react';

const RestaurantBasicInfo = ({ singleRestaurant }) => {
  return (
    <div className="space-y-5">
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Description</h4>
              <p className="mt-1 text-sm text-gray-900">{singleRestaurant?.description}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Address</h4>
              <p className="mt-1 text-sm text-gray-900">
                {singleRestaurant?.address?.street}, {singleRestaurant?.address?.city},{' '}
                {singleRestaurant?.address?.state}, {singleRestaurant?.address?.zipCode},{' '}
                {singleRestaurant?.address?.country}
              </p>
              {singleRestaurant?.address?.coordinates && (
                <p className="mt-1 text-xs text-gray-500">
                  Coordinates: {singleRestaurant?.address?.coordinates.lat},{' '}
                  {singleRestaurant?.address?.coordinates.lng}
                </p>
              )}
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Contact Information</h4>
              <div className="mt-1 space-y-1">
                <div className="flex items-center text-sm">
                  <Phone size={16} className="mr-2 text-gray-400" />
                  {singleRestaurant?.contactInfo?.phones.join(', ')}
                </div>
                <div className="flex items-center text-sm">
                  <Mail size={16} className="mr-2 text-gray-400" />
                  {singleRestaurant?.contactInfo?.email}
                </div>
                {singleRestaurant?.contactInfo.website && (
                  <div className="flex items-center text-sm">
                    <Globe size={16} className="mr-2 text-gray-400" />
                    <a
                      href={singleRestaurant?.contactInfo?.website}
                      className="text-indigo-600 hover:text-indigo-500"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {singleRestaurant?.contactInfo?.website}
                    </a>
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Cuisine</h4>
                <div className="mt-1 flex flex-wrap gap-1">
                  {singleRestaurant?.cuisine.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Food Type</h4>
                <p className="mt-1 text-sm text-gray-900">{singleRestaurant?.foodType}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Price Range</h4>
                <p className="mt-1 text-sm text-gray-900">{singleRestaurant?.priceRange}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Commission Rate</h4>
                <p className="mt-1 text-sm text-gray-900">{singleRestaurant?.commissionRate}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="bg-white overflow-hidden shadow rounded-lg p-3">
        <h2 className="text-xl font-bold mt-8 mb-4">Ratings & Tags</h2>
        <div className="flex items-center mb-4">
          <div className="flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-lg">
            <Star className="w-5 h-5 fill-yellow-500 stroke-yellow-500 mr-1" />
            <span className="font-bold">{singleRestaurant?.ratings.average}</span>
            <span className="text-sm ml-1">({singleRestaurant?.ratings.count} reviews)</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {singleRestaurant?.tags.map((tag) => (
            <span key={tag} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
              {tag}
            </span>
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default RestaurantBasicInfo;
