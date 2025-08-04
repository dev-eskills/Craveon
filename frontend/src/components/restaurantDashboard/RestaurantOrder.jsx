import { useEffect, useState } from 'react';
import { useOrder } from '../../hooks/useOrder';
import { useAuthStore } from '../../stores/authStore';
import { useNavigate } from 'react-router-dom';
import AdminOrdersSkeleton from '../skeleton/AdminOrdersSkeleton';

// Orders Component
const RestaurantOrders = ({ isDashboard = false }) => {
  const user = useAuthStore((state) => state.user);
  const { restaurantOrder, orderAssignFn, restaurantOrderLoading } = useOrder(user?.id);


  const navigate = useNavigate()

  const [statusMap, setStatusMap] = useState({});

  useEffect(() => {
    if (restaurantOrder) {
      const initialStatuses = {};
      restaurantOrder?.orders?.forEach((order) => {
        initialStatuses[order?.orderNumber] = order?.status;
      });
      setStatusMap(initialStatuses);
    }
  }, [restaurantOrder]);

  const handleStatusChange = (newStatus, orderId) => {
    if (newStatus === 'REJECTED') {
      const confirmed = window.confirm('Are you sure you want to reject this order?');
      if (!confirmed) return;
    }

    setStatusMap((prev) => ({
      ...prev,
      [orderId]: newStatus,
    }));

    orderAssignFn({ status: newStatus, orderId: orderId });
  };

  return (
    <div className=" w-full">
      {restaurantOrderLoading ? (
        <AdminOrdersSkeleton />
      ) : (
        <div className="bg-white rounded-lg shadow overflow-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-500">
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">items</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(isDashboard ? restaurantOrder?.orders?.slice(0, 5) : restaurantOrder?.orders)?.map((order, index) => (
                <tr key={index} className="border-t">
                  <td className="p-4 font-medium">{order?.orderNumber}</td>
                  <td className="p-4">{order?.user.name}</td>
                  <td className="p-4">{order?.items.length}items</td>
                  <td className="p-4">₹{order?.finalTotal}</td>
                  <td className="p-4">
                    <td className="p-2">
                      <select
                        value={statusMap[order._id] || order.status}
                        onChange={(e) => handleStatusChange(e.target.value, order._id)}
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                      >
                        {!['ACCEPTED', 'REJECTED', 'PREPARING', 'READY_FOR_PICKUP'].includes(
                          order.status
                        ) && <option value={order.status}>{order?.status}</option>}
                        {['ACCEPTED', 'REJECTED', 'PREPARING', 'READY_FOR_PICKUP'].map((status) => (
                          <option key={status} value={status}>
                            {status?.charAt(0) + status?.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                  </td>
                  <td className="p-4">
                    {new Date(order?.createdAt).toLocaleDateString('en-US', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>

                  <td className="p-4">
                    <button
                      className="text-blue-500 hover:underline mr-2"
                      onClick={() => navigate(`/restaurant/orders/${order._id}`)}
                    >
                      View
                    </button>

                    {/* <button className="text-green-500 hover:underline">Update</button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RestaurantOrders;
