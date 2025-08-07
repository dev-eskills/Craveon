import SearchBar from './SearchBar';
import { Link } from 'react-router-dom';
import useRestaurants from '../../hooks/useRestaurants';
import GlobalPagination from '../ui/GlobalPagination';
import {
  AlertCircle,
  Clock,
  ExternalLink,
  MapPin,
  ShieldCheck,
  ShieldX,
  Trash,
} from 'lucide-react';
import RestaurantSkeleton from '../skeleton/RestaurantSkeleton';
import { useState } from 'react';
import Location from '../navbar/Location';

const AdminRestrauntPage = () => {
  // const[searchTerm , setSearchTerm] = useState('');

  const [page, setPage] = useState(1);

  const PAGE_SIZE = 2;

  const { isRemovingRestaurant, removeRestaurantFn, allRestaurantsQuery } = useRestaurants(
    {},
    page,
    PAGE_SIZE,
  );

  return (
    <div className="p-6 w-full  mx-auto shadow">
      {/* Search Bar */}
      <div className="flex justify-between items-start space-x-2 ">
        <Location />

        <SearchBar />
      </div>
      <GlobalPagination
        query={allRestaurantsQuery}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        loadingComponent={<RestaurantSkeleton />}
        emptyComponent={
          <div className="mt-4 p-2 bg-gray-50 border border-gray-200 rounded-lg flex items-center text-gray-600">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 text-gray-400" />
            <p className="text-sm">No restaurants have been uploaded yet.</p>
          </div>
        }
        extractKey="restaurants"
        renderContent={(restaurants) => {
          return (
            <div className=" mx-auto my-5 py-6 px-1">
              <div className="grid grid-cols-1 gap-10">
                {restaurants?.map((restaurant) => (
                  <div
                    key={restaurant._id}
                    className="bg-white rounded-xl overflow-hidden shadow hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="flex flex-col lg:flex-row">
                      {/* Restaurant Image */}
                      <div className="lg:w-64 h-48 lg:max-h-full object-cover relative">
                        <img
                          src={restaurant.images.logo}
                          alt={restaurant.name}
                          className="w-full h-52 object-fit "
                        />
                        <div className="absolute top-3 right-3">
                          <div className="flex space-x-1">
                            {(restaurant.foodType === 'Both' || restaurant.foodType === 'Veg') && (
                              <span className="bg-green-100 +" title="Vegetarian options available">
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 60 60"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <rect
                                    x="5"
                                    y="5"
                                    width="50"
                                    height="50"
                                    stroke="green"
                                    strokeWidth="5"
                                    fill="none"
                                  />
                                  <circle cx="30" cy="30" r="12" fill="green" />
                                </svg>
                              </span>
                            )}
                            {(restaurant.foodType === 'Both' ||
                              restaurant.foodType === 'Non-Veg') && (
                                <span
                                  className="bg-red-100 "
                                  title="Non-vegetarian options available"
                                >
                                  <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 60 60"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <rect
                                      x="5"
                                      y="5"
                                      width="50"
                                      height="50"
                                      stroke="red"
                                      strokeWidth="5"
                                      fill="none"
                                    />
                                    <polygon points="30,15 15,40 45,40" fill="red" />
                                  </svg>
                                </span>
                              )}
                          </div>
                        </div>
                      </div>

                      {/* Restaurant Info */}
                      <div className="flex-1 p-3">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <h3 className="text-2xl font-bold text-gray-900">{restaurant.name}</h3>
                          <div className="flex items-center gap-1">
                            <span
                              className={`flex items-center ${restaurant.isActive
                                ? 'text-green-700 bg-green-100'
                                : 'text-black bg-gray-200'
                                } py-1 px-3 rounded-full text-sm font-medium`}
                            >
                              {restaurant.isActive ? (
                                <ShieldCheck size={18} />
                              ) : (
                                <ShieldX size={18} />
                              )}
                              {restaurant.isActive ? 'Active' : 'Deactive'}
                            </span>
                            <span
                              className={`flex items-center ${restaurant?.isOpen
                                ? 'text-green-700 bg-green-100'
                                : 'text-red-700 bg-red-100'
                                } py-1 px-3 rounded-full text-sm font-medium`}
                            >
                              <Clock className="w-4 mr-1" />
                              {restaurant.isOpen ? 'Open' : 'Closed'}
                            </span>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="mt-1 text-gray-600">{restaurant.description}</p>

                        {/* Address */}
                        {restaurant.address && (
                          <div className="mt-2 flex items-start">
                            <MapPin className="w-5 h-5 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                            <p className="text-gray-500 text-sm">
                              {restaurant.address.street && `${restaurant.address.street}, `}
                              {restaurant.address.city && `${restaurant.address.city}, `}
                              {restaurant.address.state && `${restaurant.address.state}, `}
                              {restaurant.address.country && restaurant.address.country}
                            </p>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="mt-2 flex justify-between flex-wrap gap-3">
                          <Link
                            to={`/admin/restaurant/${restaurant._id}`}
                            className="bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition duration-300 flex items-center"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View Details
                          </Link>
                          <button
                            onClick={() => {
                              if (
                                !window.confirm('Are you sure you want to delete this restaurant')
                              )
                                return;
                              removeRestaurantFn(restaurant._id);
                            }}
                            disabled={isRemovingRestaurant}
                            className="bg-white cursor-pointer flex items-center px-2 gap-1 text-black border border-gray-300  rounded-lg hover:bg-gray-100 transition duration-300 disabled:cursor-not-allowed"
                          >
                            <Trash size={18} />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }}
      />
    </div>
  );
};

export default AdminRestrauntPage;
