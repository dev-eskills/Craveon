import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { restaurantsApi } from '../api/restaurantsApi';
import { toast } from 'react-hot-toast';
import { handleError } from '../utils/errorHandler';
import { useNavigate } from 'react-router-dom';
import useRestaurantStore from '../stores/addRestaurantStore';
import { productApi } from '../api/productApi';
import { localLocation } from '../stores/getLocalLocation';
import { useDebounce } from './useDebounce';
import useSearchStore from '../stores/searchStore';
import { useAuthStore } from '../stores/authStore';

export default function useRestaurants(id, page = 1, pageSize = 10, isActive) {
  const resetState = useRestaurantStore((state) => state.resetState);
  const location = localLocation((state) => state.location);
  const { user } = useAuthStore((state) => state);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const searchTerm = useSearchStore((state) => state.searchTerm);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const allRestaurants = useQuery({
    queryKey: ['restaurants', page, location, debouncedSearchTerm, isActive],
    queryFn: ({ signal }) =>
      restaurantsApi.getRestaurants(
        page,
        pageSize,
        signal,
        location?.lon,
        location?.lat,
        debouncedSearchTerm,
        isActive
      ),

    keepPreviousData: false,
    enabled: true,
  });

  const addRestaurant = useMutation({
    mutationFn: restaurantsApi.createRestaurant,
    onSuccess: () => {
      queryClient.invalidateQueries(['restaurants']);
      toast.success('Restaurant added successfully');
      resetState();
      navigate('/admin/restaurants');
    },
    onError: handleError,
  });

  const removeRestaurant = useMutation({
    mutationFn: restaurantsApi.removeRestaurant,
    onSuccess: () => {
      queryClient.invalidateQueries(['restaurants']);
      toast.success('Restaurant removed successfully');
    },
    onError: handleError,
  });

  const updateImage = useMutation({
    mutationFn: restaurantsApi.updateRestaurantImage,
    onSuccess: () => {
      toast.success('Image Updated Successfully');
    },
    onError: handleError,
  });

  const updateBusinussHour = useMutation({
    mutationFn: restaurantsApi.updateRestaurantBusinessHour,
    onSuccess: () => {
      queryClient.invalidateQueries(['restaurants']);
      toast.success('BusinessHour Updated Successfully');
    },
    onError: handleError,
  });

  const updateRestaurantStatus = useMutation({
    mutationFn: (id) => restaurantsApi.updateSetRestroStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['restaurants']);
    },
    onError: handleError,
  });

  const updateRestaurantDetail = useMutation({
    mutationFn: restaurantsApi.updateRestaurant,
    onSuccess: () => {
      toast.success('Restaurant Updated Successfully');
      queryClient.invalidateQueries(['restaurants']);
      navigate('/admin/restaurants');
    },
    onError: handleError,
  });

  const reportRestaurant = useQuery({
    queryKey: ['report'],
    queryFn: () => restaurantsApi.restaurantReport(),
    enabled: user?.role === 'restaurant',
  });

  return {
    restaurants: allRestaurants?.data ?? [],
    isAllRestaurantsPending: allRestaurants?.isPending,
    allrestaurantRefetch: allRestaurants?.refetch,
    addRestaurantFn: addRestaurant.mutate,
    removeRestaurantFn: removeRestaurant.mutate,
    isRemovingRestaurant: removeRestaurant.isPending,
    allRestaurantsQuery: allRestaurants,
    updateImageFn: updateImage,
    isUpdatingImage: updateImage?.isPending,
    updateBusinussHourFn: updateBusinussHour.mutate,
    isUpdatingBusinessHour: updateBusinussHour?.isPending,
    updateRestaurantStatusFn: updateRestaurantStatus.mutate,
    updateRestaurantDetailFn: updateRestaurantDetail.mutate,
    restaurantReport: reportRestaurant.data,
    restaurantReportLoading:reportRestaurant.isPending
  };
}

export function useUserRestaurants() {
  const getallRestaurants = useQuery({
    queryKey: ['UserRestaurants'],
    queryFn: ({ signal }) => restaurantsApi.getRestaurants(signal),
  });

  return {
    userRestaurants: getallRestaurants?.data ?? [],
  };
}
export function useAdminGst() {
  const queryClient = useQueryClient();

  const getGst = useQuery({
    queryKey: ['AdminGst'],
    queryFn: ({ signal }) => restaurantsApi.getGst(signal),
  });

  // Mutation for updating GST
  const updateGstPer = useMutation({
    mutationFn: restaurantsApi.updateGst,
    onSuccess: () => {
      toast.success('GST Updated Successfully');
      queryClient.invalidateQueries(['AdminGst']);
    },
    onError: (error) => {
      console.error('Error updating GST:', error);
      toast.error('Failed to update GST');
    },
  });

  return {
    GstQuery: getGst.data || [], // Default to an empty array if data is undefined
    updateGstFn: updateGstPer,
  };
}
export function usePaginatadRestaurants(page = 1, pageSize = 10) {
  return useQuery({
    queryKey: ['restaurant', page, pageSize],
    queryFn: ({ signal }) => restaurantsApi.getRestaurants(page, pageSize, signal),
    keepPreviousData: true,
  });
}

export function useSingleRestaurant(id) {
  const singleRestaurant = useQuery({
    queryKey: ['restaurant', id],
    queryFn: ({ signal }) => restaurantsApi.getRestaurant(signal, id),
    enabled: !!id,
  });

  return {
    singleRestaurant: singleRestaurant.data ?? null,
    singleRestrauntLoading:singleRestaurant.isPending
  };
}

export function useUserSingleRestaurant(id) {
  const singleRestaurant = useQuery({
    queryKey: ['restaurant', id],
    queryFn: () => productApi.getProducts(id),
    enabled: !!id,
  });

  return {
    userSingleRestaurent: singleRestaurant.data ?? null,
  };
}

export function useBussinessHours(id) {
  const fetchBusinessHours = useQuery({
    queryKey: ['businessHours', id],
    queryFn: () => restaurantsApi.getBuissnessHours(id),
  });

  return {
    businessHoursData: fetchBusinessHours.data,
  };
}
