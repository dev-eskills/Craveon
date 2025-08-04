import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productApi } from '../api/productApi';
import toast from 'react-hot-toast';
import { handleError } from '../utils/errorHandler';
import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';

export default function useProduct(catid) {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state?.user) || null;

  const queryClient = useQueryClient();
  const addProduct = useMutation({
    mutationFn: productApi.addProduct,
    onSuccess: () => {
      toast.success('Product Added Successfully');
      queryClient.invalidateQueries(['products']);
      navigate('/restaurant/products');
    },
    onError: handleError,
  });

  const fetchProducts = useQuery({
    queryKey: ['products'],
    queryFn: () => productApi.getProducts(user?.id),
  });

  const productbyCategory = useQuery({
    queryKey: ['categoryProducts', catid],
    queryFn: () => productApi.getCategoryProduts(catid),
  });

  const updateProduct = useMutation({
    mutationFn: ({ id, data }) => productApi.editProduct(id, data),
    onSuccess: () => {
      toast.success('Product Updated Successfully');
      queryClient.invalidateQueries(['products']);
    },
    onError: handleError,
  });

  const updateAvailability = useMutation({
    mutationFn: (productId) => productApi.productAvailability(productId),
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
    },
    onError: handleError,
  });
  return {
    addProductFn: addProduct.mutate,
    isProductAdding: addProduct.isPending,
    products: fetchProducts.data,
    isProduct: fetchProducts.isPending,
    updateProductFn: updateProduct.mutate,
    isProductUpdating: updateProduct.isPending,
    updateAvailabilityFn: updateAvailability.mutate,
    isUpdateAvailabilty: updateAvailability.isPending,
    productsByCategory: productbyCategory.data,
    productsCategoryLoading :productbyCategory.isPending
  };
}
