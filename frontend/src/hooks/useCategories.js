import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { categoriesApi } from '../api/categoriesApi';
import toast from 'react-hot-toast';
import { handleError } from '../utils/errorHandler';

export function useCategories() {
  const queryClient = useQueryClient();

  const getCategories = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getCategories,
  });

  const addCategories = useMutation({
    mutationFn: categoriesApi.addCategory,
    onSuccess: () => {
      toast.success('Category Added Successfully');
      queryClient.invalidateQueries(['categories']);
    },
    onError: handleError,
  });

  const updateCategoryStatus = useMutation({
    mutationFn: (categoryId) => categoriesApi.categoryStatus(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
    },
    onError: handleError,
  });

  const updateCategory = useMutation({
    mutationFn: ({ id, data }) => categoriesApi.editCategory(id, data),
    onSuccess: () => {
      toast.success('Category Updated Successfully');
      queryClient.invalidateQueries(['categories']);
    },
    onError: handleError,
  });
  return {
    categories: getCategories?.data?.data?.categories ?? [],
    categoriesLoading:getCategories.isPending,
    addCategoriesFn: addCategories.mutate,
    isAddCategory: addCategories.isPending,
    isCategoryAdded: addCategories.isSuccess,
    updateCategoryStatusFn: updateCategoryStatus,
    IsCategoryStatus: updateCategoryStatus.isPending,
    updateCategoryFn: updateCategory.mutate,
    isUpdatingCategory: updateCategory.isPending,
  };
}
