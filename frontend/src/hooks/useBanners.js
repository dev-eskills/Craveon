import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bannersApi } from '../api/bannersApi';
import { handleError } from '../utils/errorHandler';
import toast from 'react-hot-toast';

export function useBanners() {
  const queryClient = useQueryClient();

  const getBanners = useQuery({
    queryKey: ['allBanners'],
    queryFn: ({ signal }) => bannersApi.getBanner(signal),
  });

  const addBanner = useMutation({
    mutationFn: bannersApi.createBanner,
    onSuccess: () => {
      queryClient.invalidateQueries(['allBanners']);
      toast.success('Banner added successfully');
    },

    onError: handleError,
  });

  const removeBanner = useMutation({
    mutationFn: bannersApi.deleteBanner,
    onSuccess: () => {
      queryClient.invalidateQueries(['allBanners']);
      toast.success('Banner removed successfully');
    },
    onMutate: async (_id) => {
      await queryClient.cancelQueries({ queryKey: ['allBanners'] });

      const previousBanner = queryClient.getQueryData(['allBanners']);

      queryClient.setQueryData(['allBanners'], (old) => old.filter((banner) => banner._id !== _id));

      return { previousBanner };
    },
    onError: (err, _id, context) => {
      handleError();
      queryClient.setQueryData(['allBanners'], context.previousBanner);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['allBanners']);
    },
  });

  return {
    allBanners: getBanners?.data ?? [],
    isAllBannerPending: getBanners.isPending,
    addBannerFn: addBanner.mutate,
    isAddBannerPending: addBanner.isPending,
    removeBannerFn: removeBanner.mutate,
    isRemoveBannerPending: removeBanner.isPending,
  };
}
