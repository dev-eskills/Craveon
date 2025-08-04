import { useQuery } from '@tanstack/react-query';
import { usersApi } from '../api/usersApi';
import { useDebounce } from './useDebounce';

export function useUsers({ page = 1, limit = 10, searchQuery = '' }) {

  const debouncedSearch = useDebounce(searchQuery ,500)
  const allUsers = useQuery({
    queryKey: ['allUsers', page, limit, debouncedSearch],
    queryFn: ({ signal }) => usersApi.getAllUsers(signal, page, limit, debouncedSearch),
    keepPreviousData: true,
  });

  return {
    allUsers: allUsers?.data ?? [],
    isAllUsersPending: allUsers?.isPending,
  };
}
