import { Clock } from 'lucide-react';
import RestaurantCardHead from '../restaurantitems/RestaurantCardHead';
import { Link } from 'react-router-dom';

const RestaurantCard = ({ restaurant }) => {
  // const { name, address, hours, imageSrc, id } = restaurant ?? {};
  return (
    <Link to={`restaurant/${restaurant.owner}`}>
      <div className="mx-auto w-72 min-h-[330px] rounded-lg overflow-hidden shadow-lg bg-white flex flex-col">
        <div className="relative">
          <img
            src={restaurant.images.logo}
            alt={restaurant.name}
            className="w-full h-40 object-cover"
          />
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <RestaurantCardHead
            isOpen={restaurant?.isOpen}
            foodType={restaurant.foodType}
            name={restaurant.name}
          />

          {/* Line Clamp for Consistent Height */}
          {/* <h3 className="text-sm text-gray-600 font-bold line-clamp-2">
            {restaurant?.description}
          </h3> */}

          <span className="flex">
            <h1 className="text-sm text-gray-600 line-clamp-1">
              {restaurant.address.street}, {restaurant.address.city}, {restaurant.address.state},
              {restaurant.address.country}
            </h1>
          </span>

          {restaurant?.isOpen && (
            <div className="flex items-center text-sm text-gray-600 my-2">
              <Clock size={16} className="mr-1" />
              <span>
                {restaurant?.businessHours?.open} - {restaurant?.businessHours?.close}
              </span>
            </div>
          )}

          {/* Button Sticks at Bottom */}
          <div className="mt-auto">
            <button className="w-full py-2 bg-black text-white font-medium rounded">
              View Menu
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
