import { Edit } from 'lucide-react';
import useRestaurants from '../../hooks/useRestaurants';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import useStoreUpdate from '../../hooks/useStoreUpdate';

const RestaurantSettings = ({ singleRestaurant }) => {
  const { updateRestaurantStatusFn } = useRestaurants();
  const { isActive, _id } = singleRestaurant;

  const navigate = useNavigate();

  const storeUpdate = useStoreUpdate();

  const handleEditRestaurant = (singleRestaurant) => {
    if (singleRestaurant.location.coordinates.length > 0) {
      storeUpdate(singleRestaurant);
      navigate(`/admin/add-restaurant?edit=true&id=${_id}`);
    } else {
      alert('Please select your location on the map.');
    }
  };

  return (
    <div className=" mx-auto p-6 bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Restaurant Status Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Restaurant Status</h2>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-800">Active Status</h3>
                <p className="text-sm text-gray-500">Enable or disable this restaurant</p>
              </div>
              <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateRestaurantStatusFn(_id, {
                      onSuccess: () => {
                        toast.success(
                          isActive
                            ? 'Restaurant Disable successfully'
                            : 'Restaurant Active successfully'
                        );
                      },
                    });
                  }}
                  className={`w-12 h-6 flex items-center rounded-full transition cursor-pointer ${
                    isActive ? 'bg-[#ff6900]' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow transform transition duration-200 ${
                      isActive ? 'translate-x-7' : 'translate-x-1'
                    } flex items-center justify-center`}
                  ></div>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-800">Featured Restaurant</h3>
                <p className="text-sm text-gray-500">Show this restaurant in featured section</p>
              </div>
              <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
                <input type="checkbox" id="featured-status" className="opacity-0 w-0 h-0" />
                <label
                  htmlFor="featured-status"
                  className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 rounded-full transition-all duration-200 before:absolute before:content-[''] before:h-4 before:w-4 before:left-1 before:bottom-1 before:bg-white before:rounded-full before:transition-all before:duration-200 peer-checked:bg-teal-500 peer-checked:before:translate-x-6"
                ></label>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Quick Actions</h2>

          <div className="space-y-4">
            <button
              onClick={() => handleEditRestaurant(singleRestaurant)}
              className="w-full flex items-center justify-center gap-2 p-3 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200"
            >
              <Edit className="w-5 h-5" />
              <span>Edit Restaurant Details</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantSettings;
