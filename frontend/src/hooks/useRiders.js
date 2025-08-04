import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ridersApi } from '../api/ridersApi';
import { useDebounce } from './useDebounce';

export function useRiders(params = {}) {
  const { page = 1, limit = 10, searchQuery = '' } = params;

  const debouncedSearch = useDebounce(searchQuery, 500);
  const queryClient = useQueryClient();

  const getRiders = useQuery({
    queryKey: ['riders', page, limit, debouncedSearch],
    queryFn: ({ signal }) => ridersApi.getRider(page, limit, debouncedSearch),
  });

  const riderToggle = useMutation({
    mutationFn: (userId) => ridersApi.toggleRider(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['riders'] });
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
    },
  });

  return {
    riders: getRiders.data,
    isLoading: getRiders.isPending,
    toggleRider: riderToggle.mutate,
    isToggling: riderToggle.isPending,
  };
}
