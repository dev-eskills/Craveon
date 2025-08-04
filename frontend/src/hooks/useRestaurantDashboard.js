import { useQuery } from '@tanstack/react-query';
import { restaurantsApi } from '../api/restaurantsApi';

export default function useRestaurantDashboard() {
  const restaurantDashboard = useQuery({
    queryKey: ['restaurantDashboard'],
    queryFn: ({ signal }) => restaurantsApi.getDashboardRestaurants(signal),
  });

  const restaurantRevenue = useQuery({
    queryKey: ['revenue'],
    queryFn: ({ signal }) => restaurantsApi.getRevenue(signal),
  });
  return {
    restaurantDash: restaurantDashboard.data ?? [],
    restaurnatDashLoading: restaurantDashboard.isPending,
    dashRevenue: restaurantRevenue.data,
  };
}
