import RestaurantCard from './RestaurantCard';
import Heading from '../ui/Heading';
import useRestaurants from '../../hooks/useRestaurants';
import { useState, useEffect } from 'react';
import RestaurantCardSkeleton from '../skeleton/RestaurantCardSkeleton';
import { AlertCircle } from 'lucide-react';
import ShowMore from '../ui/ShowMore';

const PopularRestaurants = () => {
  const [page, setPage] = useState(1);
  const [restaurantList, setRestaurantList] = useState([]);
  const Page_Size = 8;

  const { allRestaurantsQuery } = useRestaurants({}, page, Page_Size, true);
  const { data, isLoading } = allRestaurantsQuery;

  useEffect(() => {
    if (page === 1 && data?.restaurants) {
      setRestaurantList(data.restaurants);
    } else if (data?.restaurants) {
      setRestaurantList((prev) => {
        const uniqueRestaurants = new Map();
        [...prev, ...data.restaurants].forEach((r) => uniqueRestaurants.set(r._id, r));
        return Array.from(uniqueRestaurants.values());
      });
    }
  }, [data, page]);

  return (
    <section>
      <Heading className="my-5" text="Restaurants Near you" />

      {/* Display previously loaded restaurants */}
      {restaurantList?.length > 0 && (
        <section className="grid grid-cols-1 gap-4 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 place-items-center sm:place-items-start">
          {restaurantList.map((restaurant) => (
            <RestaurantCard restaurant={restaurant} key={restaurant._id} />
          ))}
        </section>
      )}

      {/* Show loading state for new restaurants being fetched */}
      {isLoading && (
        <section className="grid grid-cols-1 gap-4 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 place-items-center sm:place-items-start mt-4">
          {Array(Page_Size)
            .fill(0)
            .map((_, index) => (
              <RestaurantCardSkeleton key={`skeleton-${index}`} />
            ))}
        </section>
      )}

      {/* Show empty state when no restaurants are available */}
      {!isLoading && restaurantList.length === 0 && (
        <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-start text-black">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 text-orange-400" />
          <p className="text-sm text-center">
            Oops! No restaurants near you right now — but don’t worry, we’re on our way to serve
            your area soon!
          </p>
        </div>
      )}

      {/* Show more button for pagination */}
      {data?.pagination?.pages > page ? (
        <ShowMore onClick={() => setPage((prev) => prev + 1)} isLoading={isLoading} />
      ) : (
        <div className="w-full text-center my-10 flex justify-center cursor-pointer hover:bg-gray-50 py-4">
          You Reached End of List
        </div>
      )}
    </section>
  );
};

export default PopularRestaurants;
