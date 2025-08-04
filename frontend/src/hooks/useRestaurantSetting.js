import { useQuery } from '@tanstack/react-query';
import { restaurantsApi } from '../api/restaurantsApi';

export function useRestaurantSetting(id) {
  return useQuery({
    queryKey: ['buissnessHours'],
    queryFn: () => restaurantsApi.getBuissnessHours(id),
  });
}
