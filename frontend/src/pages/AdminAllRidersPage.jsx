import { Clock, UserCheck, ClipboardCheck, Truck } from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { useState, useEffect } from 'react';
import PaginationPage from '../components/admin/PaginationPage';
import { useRiders } from '../hooks/useRiders';
import SearchBar from '../components/admin/SearchBar';
import useSearchStore from '../stores/searchStore';
import { useOrderStore } from '../stores/orderStore';
import { useOrder } from '../hooks/useOrder';

const AdminAllRidersPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const ridersPerPage = 10;

  const searchQuery = useSearchStore((state) => state.searchTerm);

  const { riders, isLoading } = useRiders({
    page: currentPage,
    limit: ridersPerPage,
    searchQuery,
  });

  const { overview , overviewLoading} = useOrder();
  const { orderAssignFn } = useOrder();

  const assignedOrder = useOrderStore((state) => state.assignedOrder);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil((riders?.pagination?.total || 0) / ridersPerPage);
  const currentRiders = riders?.riders || [];

  return (
    <div className="min-h-screen w-full mx-auto bg-white p-6 rounded-lg shadow-sm">
      {Object.keys(assignedOrder || {}).length > 0 && (
        <div className="bg-white shadow-sm p-3 fixed top-18 right-6 rounded-sm ">
          <p className="font-bold">OrderId: {assignedOrder?.orderNumber}</p>
        </div>
      )}
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          icon={<UserCheck className="w-6 h-6 text-blue-500" />}
          title="Total Riders"
          value={riders?.riders?.length}
          trendUp
          isLoading={isLoading}
        />
        <StatCard
          icon={<ClipboardCheck className="w-6 h-6 text-yellow-500" />}
          title="Assigned Orders"
          value={overview?.data?.assignedOrders}
          trendUp={false}
          isLoading={isLoading}
        />
        <StatCard
          icon={<Truck className="w-6 h-6 text-yellow-400" />}
          title="Delivered Orders"
          value={overview?.data?.completedOrders}
          isLoading={isLoading}
          trendUp
        />
        <StatCard
          icon={<Clock className="w-6 h-6 text-green-500" />}
          title="Pending Orders"
          value={overview?.data?.pendingOrders}
          trendUp
          isLoading={isLoading}
        />
      </div>

      <SearchBar />

      {/* Riders Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm font-semibold">
              <th className="px-4 sm:px-6 py-4">Rider</th>
              <th className="px-4 sm:px-6 py-4">Email</th>
              <th className="px-4 sm:px-6 py-4">Phone no.</th>
              <th className="px-4 sm:px-6 py-4">Actions</th>
            </tr>
          </thead>
          {/* <tbody className="divide-y divide-gray-200">
            {currentRiders.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  {isLoading ? 'Loading riders...' : 'No riders found.'}
                </td>
              </tr>
            ) : (
              currentRiders.map((rider) => (
                <tr key={rider?.id} className="hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-4 flex items-center whitespace-nowrap">
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3 text-lg font-semibold text-gray-700">
                      {rider?.name?.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{rider?.name}</div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-sm">{rider?.email}</td>
                  <td className="px-4 sm:px-6 py-4 text-gray-700 text-sm">{rider?.number}</td>
                  <td className="px-4 sm:px-6 py-4 text-sm">
                    <button
                      onClick={async () => {
                        try {
                          await orderAssignFn({
                            orderId: assignedOrder?._id,
                            status: 'ASSIGNED',
                            riderId: rider?._id,
                          });
                          useOrderStore.getState().clearAssignedOrder();
                        } catch (error) {
                          console.error('Assignment failed:', error);
                        }
                      }}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Assign Order
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody> */}

          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-4 sm:px-6 py-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="h-3 w-28 bg-gray-200 rounded"></div>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="h-3 w-24 bg-gray-200 rounded"></div>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="h-6 w-20 bg-gray-200 rounded-md" />
                  </td>
                </tr>
              ))
            ) : currentRiders.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No riders found.
                </td>
              </tr>
            ) : (
              currentRiders.map((rider) => (
                <tr key={rider?.id} className="hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-4 flex items-center whitespace-nowrap">
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3 text-lg font-semibold text-gray-700">
                      {rider?.name?.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{rider?.name}</div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-sm">{rider?.email}</td>
                  <td className="px-4 sm:px-6 py-4 text-gray-700 text-sm">{rider?.number}</td>
                  <td className="px-4 sm:px-6 py-4 text-sm">
                    <button
                      onClick={async () => {
                        try {
                          await orderAssignFn({
                            orderId: assignedOrder?._id,
                            status: 'ASSIGNED',
                            riderId: rider?._id,
                          });
                          useOrderStore.getState().clearAssignedOrder();
                        } catch (error) {
                          console.error('Assignment failed:', error);
                        }
                      }}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Assign Order
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <PaginationPage
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default AdminAllRidersPage;
