import React, { Suspense, useEffect, useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import SearchBar from '../components/admin/SearchBar';
const AdminAllUserTable = React.lazy(() => import('../components/admin/AdminAllUserTable'));
import PaginationPage from '../components/admin/PaginationPage';
import AdminAllUserTableSkeleton from '../components/skeleton/usersSkeleton';
import { useRiders } from '../hooks/useRiders';
import useSearchStore from '../stores/searchStore';

const USERS_PER_PAGE = 12;
const AdminUserPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const searchTerm = useSearchStore((state) => state.searchTerm);

  const { allUsers, isAllUsersPending } = useUsers({
    page: currentPage,
    limit: USERS_PER_PAGE,
    searchQuery: searchTerm,
  });

  const { toggleRider } = useRiders();

  // Reset to page 1 if the search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredUsers = allUsers?.users?.filter(
    (user) => user.role === 'user' || user.role === 'delivery'
  );
  return (
    <div className="w-full mx-auto bg-white p-6 rounded-lg shadow-sm">
      {/* Search Bar */}
      <SearchBar />

      {/* User Table */}
      <Suspense fallback={<AdminAllUserTableSkeleton />}>
        <AdminAllUserTable
          users={filteredUsers}
          isAllUsersPending={isAllUsersPending}
          onToggleRider={toggleRider}
        />
        <PaginationPage
          totalPages={allUsers?.pagination?.pages || 1}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </Suspense>
      {/* Pagination */}
    </div>
  );
};

export default AdminUserPage;
