import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import profileApi from '../api/profileApi';
import { handleError } from '../utils/errorHandler';

export const useAddresses = () => {
  const queryClient = useQueryClient();

  const getAddress = useQuery({
    queryKey: ['userAddresses'],
    queryFn: profileApi.getAddress,
  });

  const removeAddress = useMutation({
    mutationFn: (id) => profileApi.removeAddress(id),

    onSuccess: () => {
      queryClient.invalidateQueries(['userAddresses']);
    },

    onError: handleError,
  });

  const editAddress = useMutation({
    mutationFn: (formData) => profileApi.updateAddress(formData),

    onSuccess: () => {
      queryClient.invalidateQueries(['userAddresses']);
    },

    onError: handleError,
  });

  const useAddAddress = useMutation({
    mutationFn: profileApi.addAddress,

    onSuccess: () => {
      queryClient.invalidateQueries(['userAddresses']);
    },

    onError: handleError,
  });

  return {
    getAddress: getAddress.data,
    isgetAddressPending: getAddress.isPending,
    addAddressFn: useAddAddress.mutate,
    isAddAddressPending: useAddAddress.isPending,
    removeAddressFn: removeAddress,
    isRemoveAddressPending: removeAddress.isPending,
    editAddressFn: editAddress.mutate,
    isEditAddressPending: editAddress.isPending,
  };
};

export const useUpdateUserDetail = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }) => profileApi.EditUserDetail(id, formData),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['userUpdateDetails']);

      if (options.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: (error) => {
      handleError(error);

      if (options.onError) {
        options.onError(error);
      }
    },
  });
};

export const useUserDetail = (id) => {
  return useQuery({
    queryKey: ['userUpdateDetails', id],
    queryFn: () => profileApi.getUserDetail(id),
  });
};
