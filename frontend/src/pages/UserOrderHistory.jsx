import { useState } from 'react';
import { CheckCircle, ChevronDown, ChevronUp, X } from 'lucide-react';
import ContentWrapper from '../components/ui/ContentWrapper';
import BackButton from '../components/ui/BackButton';
import { useOrder } from '../hooks/useOrder';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import OrderSkeleton from '../components/skeleton/OrderSkeleton';

const UserOrderHistory = () => {
  const user = useAuthStore((state) => state.user);
  const { id } = useParams();
  const [expanded, setExpanded] = useState(null);
  const { orders, orderAssignFn, isOrdersLoading } = useOrder(null, null, null, '', null, null, id);

  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };
  console.log("orders: ", orders);
  return (
    <ContentWrapper className="bg-white">
      <div className="mx-auto p-4 bg-white min-h-screen">
        {/* <BackButton text={'Recent Orders'} /> */}
        <div>
          {isOrdersLoading ? (
            <>
              <OrderSkeleton />
            </>
          ) : (
            <>
              {orders?.length <= 0 ? (
                <div>
                  <p className="text-gray-500 px-7">No Orders Found Yet!</p>
                </div>
              ) : (
                <div>
                  {' '}
                  {orders?.map((order) => (
                    <div key={order._id} className="bg-white p-4 rounded shadow mb-4">
                      <div
                        className="flex justify-between items-center cursor-pointer"
                        onClick={() => toggleExpand(order._id)}
                      >
                        <div>
                          <h3 className="font-semibold">{order.restaurant.name}</h3>
                          <p className="text-sm text-gray-500">Order #{order.orderNumber}</p>
                          <p
                            className={`flex items-center font-medium ${order.status === 'PENDING'
                              ? 'text-yellow-500'
                              : order.status === 'REJECTED'
                                ? 'text-red-600'
                                : order.status === 'CANCELLED'
                                  ? 'text-orange-600'
                                  : 'text-green-600'
                              }`}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" /> {order.status}
                          </p>
                          <div className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2 border border-gray-200">
                            {/* Avatar / Icon */}
                            {/* <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold">
                              🏍️
                            </div> */}

                            {/* Rider Info */}
                            <div className="flex flex-col">
                              <p className="text-sm font-medium text-gray-800">
                                {order?.deliveryPartner?.name || "Rider Not Assigned"}
                              </p>
                              <p className="text-xs text-gray-500">
                                {order?.deliveryPartner?.number || "NA"}
                              </p>
                            </div>

                            {/* Status badge (optional) */}
                            <span className="ml-auto rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                              On Delivery
                            </span>
                          </div>


                        </div>
                        <div className="flex items-center">
                          {expanded === order._id ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </div>
                      </div>

                      {expanded === order._id && (
                        <div className="mt-4 border-t border-gray-300">
                          {/* <div className="mt-4">
                        <h4 className="font-medium">Order Details</h4>

                        <div className="flex justify-between text-sm text-gray-600 py-1">
                          <span>{order.totalQuantity}</span>
                          <span>{order.finalTotal}</span>
                        </div>
                      </div> */}
                          <div className="mt-4">
                            <h4 className="font-medium">Order Details</h4>
                            {order.items.map((item) => (
                              <div
                                key={item._id}
                                className="flex items-start justify-between text-sm text-gray-700 py-2 border-b border-gray-200"
                              >
                                <div className="flex gap-3">
                                  <img
                                    src={item.product.image}
                                    alt={item.product.name}
                                    className="w-16 h-16 object-cover rounded"
                                  />
                                  <div>
                                    <p className="font-medium">{item.product.name}</p>
                                    <p className="text-xs text-gray-500">
                                      {item.product.description?.slice(0, 60)}...
                                    </p>
                                    <p className="text-xs">
                                      Quantity:{' '}
                                      <span className="font-semibold">{item.quantity}</span>
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-semibold">
                                    ₹{item.product.discountedPrice}
                                  </p>
                                  {item.product.discountedPrice !== item.product.price && (
                                    <p className="text-xs line-through text-gray-400">
                                      ₹{item.product.price}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}

                            <div className="flex items-center justify-between py-3">
                              <h1 className="font-semibold">Final Total :</h1>
                              <span>₹{order.finalTotal}</span>
                            </div>
                          </div>

                          <div className="mt-4">
                            <h4 className="font-medium">Delivery Information</h4>
                            <p className="text-sm text-gray-600">
                              {order.deliveryAddress.addressLine1},{' '}
                              {order.deliveryAddress.addressLine2}, {order.deliveryAddress.city}
                            </p>
                            <p className="text-sm text-gray-500">
                              {order.deliveryAddress.state}, {order.deliveryAddress.postalCode}
                            </p>
                          </div>
                          <div className="flex justify-end">
                            {order.status !== 'CANCELLED' &&
                              order.status !== 'DELIVERED' &&
                              user?.role !== 'admin' && (
                                <button
                                  onClick={() => {
                                    const confirmCancel = window.confirm(
                                      'Are you sure you want to cancel this order?'
                                    );
                                    if (confirmCancel) {
                                      orderAssignFn({ status: 'CANCELLED', orderId: order._id });
                                    }
                                  }}
                                  className="px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 flex items-center text-sm space-x-1"
                                >
                                  <X size={16} />
                                  <p>Cancel Order</p>
                                </button>
                              )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </ContentWrapper>
  );
};

export default UserOrderHistory;
