import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { handleError } from '../utils/errorHandler';
import cartApi from '../api/cartApi';
import toast from 'react-hot-toast';

export const useCart = () => {
  const queryClient = useQueryClient();

  const useGetCart = useQuery({
    queryKey: ['cart'],
    queryFn: cartApi.getCartItem,
  });

  const useAddCart = useMutation({
    mutationFn: cartApi.addCart,

    onSuccess: () => {
      queryClient.invalidateQueries(['cart']);
      toast.success('Product added successfully');
    },
 
    onError: handleError,
  });

  const useUpdateCart = useMutation({
    mutationFn: cartApi.updateCart,
    onSuccess: () => {
      queryClient.invalidateQueries(['cart']);
    },
    onError: handleError,
  });

  const useRemoveCart = useMutation({
    mutationFn: cartApi.removeCart,
    onSuccess: () => {
      toast.success('Product removed successfully');
      queryClient.invalidateQueries(['cart']);
    },
    onError: handleError,
  });

  return {
    addCartFn: useAddCart.mutate,
    isAddCartPending: useAddCart.isPending,
    cartItems: useGetCart.data?.data ?? [],
    cartItemsLoading :useGetCart.isPending,
    updateCartFn: useUpdateCart.mutate,
    isUpdateCartPending: useUpdateCart.isPending,
    removeCartFn: useRemoveCart.mutate,
    removeCartPending : useRemoveCart.isPending
  };
};
