import SearchBar from './SearchBar';
import PaginationPage from './PaginationPage';
import { useState } from 'react';
import { useOrder } from '../../hooks/useOrder';
import {
  Package,
  Clock,
  Loader,
  ChefHat,
  CheckCircle,
  Truck,
  Hand,
  XCircle,
  Ban,
  ArrowRightToLine,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useOrderStore } from '../../stores/orderStore';
import OrderOverview from './OrderOverview';
import AdminOrdersSkeleton from '../skeleton/AdminOrdersSkeleton';

const AdminOrders = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  //  const ordersPerPage = 5;
  const { adminOrder, overview, adminOrderLoading, overviewLoading } = useOrder(
    null,
    currentPage,
    null,
    selectedStatus,
    selectedDate
  );
  const setAssignedOrder = useOrderStore((state) => state.setAssignedOrder);
  // Calculate total pages
  const totalPages = adminOrder?.totalPages || 1;
  const cards = [
    {
      icon: Package,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      title: 'Total Orders',
      value: overview?.data?.totalOrders,
    },
    {
      icon: Clock,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
      title: 'Pending Orders',
      value: overview?.data?.pendingOrders,
    },
    {
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      title: 'Accepted Orders',
      value: overview?.data?.acceptedOrders,
    },
    {
      icon: ChefHat,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
      title: 'Preparing Orders',
      value: overview?.data?.preparingOrders,
    },
    {
      icon: Hand,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50',
      title: 'Ready For Pickup',
      value: overview?.data?.readyForPickupOrders,
    },
    {
      icon: Truck,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      title: 'Assigned Orders',
      value: overview?.data?.assignedOrders,
    },
    {
      icon: Loader,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      title: 'Out For Delivery',
      value: overview?.data?.outForDeliveryOrders,
    },
    {
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      title: 'Delivered Orders',
      value: overview?.data?.completedOrders,
    },
    {
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      title: 'Cancelled Orders',
      value: overview?.data?.cancelledOrders,
    },
    {
      icon: Ban,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      title: 'Rejected Orders',
      value: overview?.data?.rejectedOrders,
    },
  ];

console.log("adminOrder: ",adminOrder);
  return (
    <div className="overflow-x-auto w-full p-6 border border-gray-100 rounded-md">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {cards.map((card, index) => (
          <OrderOverview key={index} {...card} isLoading={overviewLoading} />
        ))}
      </div>

      {/* Search Bar */}
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-start">
        {/* Search bar */}
        <SearchBar />

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:py-0 py-3">
          {/* Date Picker */}
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-auto border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Status Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-auto border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All</option>
            <option value="PENDING">PENDING</option>
            <option value="ACCEPTED">ACCEPTED</option>
            <option value="PREPARING">PREPAIRING</option>
            <option value="READY_FOR_PICKUP">READY_FOR_PICKUP</option>
            <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELED</option>
            <option value="REJECTED">REJECTED</option>
          </select>
        </div>
      </div>
      {adminOrderLoading ? (
        <AdminOrdersSkeleton/>
      ) : (
        <div className="overflow-x-auto custom-scrollbar">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className=" text-left text-sm text-gray-500 bg-gray-100">
                <th className="py-2 px-4 min-w-[120px]">Order ID</th>
                <th className="py-2 px-4 min-w-[150px]">Customer</th>
                <th className="py-2 px-4 min-w-[150px]">Restaurant</th>
                <th className="py-2 px-4 min-w-[120px]">Status</th>
                <th className="py-2 px-4 min-w-[150px]">Restaurant Amount</th>
                <th className="py-2 px-4 min-w-[120px]">Amount</th>
                <th className="py-2 px-4 min-w-[150px]">Date</th>
                <th className="py-2 px-4 min-w-[150px]">Assign</th>
              </tr>
            </thead>
            <tbody>
              {adminOrder?.docs?.map((order) => (
                <tr key={order.id} className="border-b text-sm lg:text-md border-gray-200">
                  <td className="py-3 px-4 whitespace-nowrap">{order?.orderNumber}</td>
                  <td className="py-3 px-4 whitespace-nowrap">{order?.user?.name}</td>
                  <td className="py-3 px-4 whitespace-nowrap">{order?.restaurant?.name}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        order.status === 'ACCEPTED'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">₹{order?.restaurantTotal}</td>
                  <td className="py-3 px-4 whitespace-nowrap">₹{order?.finalTotal}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {new Date(order?.createdAt).toLocaleDateString('en-US', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  {order?.status === 'READY_FOR_PICKUP'||order?.status ==="PREPARING" ? (
                    <td>
                      <Link
                        to={'/admin/riders'}
                        onClick={() => setAssignedOrder(order)}
                        className="flex space-x-2 items-center text-blue-600"
                      >
                        <p>Assign Order</p> <ArrowRightToLine size={16} />
                      </Link>
                    </td>
                  ) : (
                    ''
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Show Pagination only if there are more than 5 restaurants */}
      {totalPages > 1 && (
        <PaginationPage
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default AdminOrders;
