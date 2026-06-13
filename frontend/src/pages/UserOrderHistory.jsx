import { useState } from 'react';
import { CheckCircle, ChevronDown, ChevronUp, X } from 'lucide-react';
import ContentWrapper from '../components/ui/ContentWrapper';
import BackButton from '../components/ui/BackButton';
import { useOrder } from '../hooks/useOrder';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import OrderSkeleton from '../components/skeleton/OrderSkeleton';
import toast from 'react-hot-toast';
import Spinner from '../components/ui/Spinner';
import { useSupport } from '../hooks/useSupport';

const UserOrderHistory = () => {
  const user = useAuthStore((state) => state.user);
  const { id } = useParams();
  const [expanded, setExpanded] = useState(null);
  const { orders, orderAssignFn, isOrdersLoading } = useOrder(null, null, null, '', null, null, id);

  // Support Hook
  const {
    history,
    isHistoryLoading: loadingDisputes,
    submitDisputeFn,
    isDisputeSubmitting: submittingDispute,
  } = useSupport(false);

  const userDisputes = history?.disputes || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedItems, setSelectedItems] = useState({}); // { productId: { name, quantity } }
  const [disputeReason, setDisputeReason] = useState('MISSING_ITEMS');
  const [disputeDescription, setDisputeDescription] = useState('');

  const openDisputeModal = (order) => {
    setSelectedOrder(order);
    setSelectedItems({});
    setDisputeReason('MISSING_ITEMS');
    setDisputeDescription('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const toggleItemSelection = (item) => {
    const pId = item.product?._id || item.product;
    setSelectedItems(prev => {
      const copy = { ...prev };
      if (copy[pId]) {
        delete copy[pId];
      } else {
        copy[pId] = {
          product: pId,
          name: item.name,
          quantity: item.quantity
        };
      }
      return copy;
    });
  };

  const updateItemQuantity = (pId, qty) => {
    setSelectedItems(prev => {
      const copy = { ...prev };
      if (copy[pId]) {
        copy[pId].quantity = qty;
      }
      return copy;
    });
  };

  const handleDisputeSubmit = async (e) => {
    e.preventDefault();
    const itemsArray = Object.values(selectedItems);
    if (itemsArray.length === 0 && (disputeReason === 'MISSING_ITEMS' || disputeReason === 'PARTIAL_DELIVERY' || disputeReason === 'WRONG_ITEMS')) {
      toast.error('Please select at least one item to dispute');
      return;
    }

    try {
      await submitDisputeFn({
        orderId: selectedOrder._id,
        disputeReason,
        disputeItems: itemsArray,
        description: disputeDescription
      });
      toast.success('Dispute raised successfully!');
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit dispute');
    }
  };

  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };
  console.log("orders: ", orders);
  console.log("selectedOrder.items: ",selectedOrder?.items);
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
                            {order?.items?.map((item) => (
                              <div
                                key={item._id}
                                className="flex items-start justify-between text-sm text-gray-700 py-2 border-b border-gray-200"
                              >
                                <div className="flex gap-3">
                                  <img
                                    src={item?.product?.image || '/placeholder-food.png'}
                                    alt={item?.product?.name || item?.name || "Product"}
                                    className="w-16 h-16 object-cover rounded"
                                  />
                                  <div>
                                    <p className="font-medium">{item?.product?.name || item?.name || "Product"}</p>
                                    <p className="text-xs text-gray-500">
                                      {item?.product?.description ? `${item.product.description.slice(0, 60)}...` : ''}
                                    </p>
                                    <p className="text-xs">
                                      Quantity:{' '}
                                      <span className="font-semibold">{item?.quantity}</span>
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-semibold">
                                    ₹{item?.product?.discountedPrice ?? item?.price ?? 0}
                                  </p>
                                  {item?.product?.discountedPrice !== item?.product?.price && item?.product?.price && (
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
                          <div className="flex justify-between items-center mt-4 border-t pt-3 border-gray-100">
                            {/* Dispute section */}
                            {order.status === 'DELIVERED' && user?.role !== 'admin' && (
                              <div className="flex items-center gap-2 w-full justify-between">
                                {loadingDisputes ? (
                                  <span className="text-xs text-gray-400">Loading dispute status...</span>
                                ) : (() => {
                                  const existing = userDisputes.find(d => d.order?._id === order._id || d.order === order._id);
                                  if (existing) {
                                    return (
                                      <div className="flex items-center justify-between w-full">
                                        <div className="flex flex-col">
                                          <span className="text-xs text-gray-500">Dispute Raised:</span>
                                          <span className={`text-xs font-semibold ${
                                            existing.status === 'PENDING' ? 'text-amber-600' :
                                            existing.status === 'UNDER_REVIEW' ? 'text-blue-600' :
                                            existing.status.startsWith('RESOLVED') ? 'text-green-600' : 'text-red-600'
                                          }`}>
                                            {existing.status.replace('_', ' ')}
                                          </span>
                                        </div>
                                        {existing.resolutionDetails && (
                                          <div className="text-[11px] bg-green-50 p-2 rounded text-green-800 border border-green-100 max-w-xs">
                                            <span className="font-semibold">Resolution: </span>
                                            {existing.resolutionDetails}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  } else {
                                    return (
                                      <button
                                        onClick={() => openDisputeModal(order)}
                                        className="px-3 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 text-xs font-medium cursor-pointer transition border border-red-200"
                                      >
                                        Dispute Order
                                      </button>
                                    );
                                  }
                                })()}
                              </div>
                            )}

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

      {/* Dispute Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 relative">
            <button onClick={closeModal} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition cursor-pointer">
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Dispute Order</h2>
            <p className="text-xs text-gray-500 mb-4">Order #{selectedOrder.orderNumber}</p>

            <form onSubmit={handleDisputeSubmit} className="space-y-4">
              {/* Item Selector */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Select items to dispute:</label>
                <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-2 bg-gray-50">
                  {selectedOrder?.items?.map((item) => {
                    const isSelected = selectedItems[item.product?._id || item.product];
                    return (
                      <div key={item._id} className="flex items-center justify-between p-2 bg-white rounded border border-gray-100 shadow-xs">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={!!isSelected}
                            onChange={() => toggleItemSelection(item)}
                            className="w-4 h-4 accent-[#ff6900] cursor-pointer"
                          />
                          <div>
                            <p className="text-xs font-medium text-gray-800">{item?.product?.name}</p>
                            <p className="text-[10px] text-gray-500">Ordered Qty: {item?.quantity}</p>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-gray-500">Qty:</span>
                            <input
                              type="number"
                              min="1"
                              max={item.quantity}
                              value={selectedItems[item.product?._id || item.product].quantity}
                              onChange={(e) => updateItemQuantity(item.product?._id || item.product, parseInt(e.target.value))}
                              className="w-12 px-1 py-0.5 border border-gray-300 rounded text-center text-xs"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Dispute Reason */}
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-gray-700">Reason for Dispute</label>
                <select
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                >
                  <option value="MISSING_ITEMS">Missing Items</option>
                  <option value="PARTIAL_DELIVERY">Partial Delivery</option>
                  <option value="WRONG_ITEMS">Wrong Items Received</option>
                  <option value="POOR_QUALITY">Poor Food Quality</option>
                  <option value="OTHER">Other Issues</option>
                </select>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-gray-700">Detailed Description</label>
                <textarea
                  value={disputeDescription}
                  onChange={(e) => setDisputeDescription(e.target.value)}
                  placeholder="Describe the issue in detail (e.g. which item was missing, packaging condition)"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs resize-none focus:outline-none focus:ring-1 focus:ring-[#ff6900]"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submittingDispute}
                className="w-full py-2 bg-[#ff6900] text-white text-sm font-semibold rounded-lg hover:bg-orange-600 transition flex items-center justify-center gap-2 cursor-pointer disabled:bg-gray-400"
              >
                {submittingDispute ? <Spinner /> : 'Submit Dispute'}
              </button>
            </form>
          </div>
        </div>
      )}
    </ContentWrapper>
  );
};

export default UserOrderHistory;
