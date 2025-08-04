import { useQuery } from '@tanstack/react-query';
import { adminDashboard } from '../api/adminDashboard';

export function useAdminDashboard() {
  const fetchAdminDashboard = useQuery({
    queryKey: ['adminDashboard'],
    queryFn: adminDashboard.getAdminDashboard,
  });

  return {
    adminDashboard: fetchAdminDashboard.data,
    adminDasboardLoading: fetchAdminDashboard.isPending
  };
}
