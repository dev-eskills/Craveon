import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { orderApi } from '../api/orderApi';
import toast from 'react-hot-toast';
import api from '../utils/axios';
import { useAuthStore } from '../stores/authStore';
import { useCartStore } from '../stores/cartStore';
import { useDebounce } from './useDebounce';
import useSearchStore from '../stores/searchStore';

export const useOrder = (restaurantId, currentPage, limit = 5 , status='' , date , days , userId , orderId) => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore((state) => state);    
  const { setOrderSuccess } = useCartStore((state) => state);
  const searchTerm = useSearchStore((state) => state.searchTerm);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const adminOrders = useQuery({
    queryKey: ['adminOrders', debouncedSearchTerm, currentPage, limit, status, date],
    queryFn: ({ signal }) =>
      orderApi.getAdminOrders(signal, debouncedSearchTerm, currentPage, limit, status, date),
    enabled: user?.role === 'admin',
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to fetch orders');
    },
  });

  const adminRevenue = useQuery({
    queryKey: ['revenue', days],
    queryFn: () => orderApi.dashboardRevenue(days),
  });``

  const fetchOrder = useQuery({
    queryKey: ['singleOrder', orderId],
    queryFn: () => orderApi.getSingleOrder(orderId),
    enabled:!!orderId
  });

  const createOrder = useMutation({
    mutationFn: orderApi.createOrder,
    onSuccess: async (response, variables) => {
      const { paymentMode } = variables;

      // Handle COD success
      if (paymentMode === 'COD' && response.success) {
        toast.success('Order Placed Successfully');
        setOrderSuccess(true);
        queryClient.invalidateQueries(['cart']);
        return;
      }

      // Handle Razorpay
      if (paymentMode === 'ONLINE' && response.paymentDetails) {
        const { order, paymentDetails } = response;

        const options = {
          key: paymentDetails.keyId,
          amount: paymentDetails.amount * 100, // in paise
          currency: paymentDetails.currency,
          name: 'Craveon',
          description: `Order #${order.orderNumber}`,
          order_id: paymentDetails.orderId,
          handler: async function (razorpayResponse) {
            try {
              await api.post('/order/verify-payment', {
                paymentId: razorpayResponse.razorpay_payment_id,
                razorpayOrderId: razorpayResponse.razorpay_order_id,
                signature: razorpayResponse.razorpay_signature,
                orderId: order._id,
              });

              toast.success('Payment Successful & Order Placed');
              setOrderSuccess(true);
              queryClient.invalidateQueries(['cart']);
            } catch (err) {
              toast.error('Payment verification failed. Please contact support.');
              console.error('Payment verification failed:', err);
            }
          },
          prefill: {
            name: user.name,
            email: user.email,
            contact: user.number,
          },
          theme: {
            color: '#F37254',
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Order failed');
    },
  });

  const restaurantOrders = useQuery({
    queryKey: ['restaurantOrders', restaurantId],
    queryFn: ({ signal }) => orderApi.getRestaurantOrders(restaurantId, signal),
    enabled: !!restaurantId,
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to fetch orders');
    },
  });

  const getOrders = useQuery({
    queryKey: ['orders' , userId],
    queryFn: () => orderApi.getOrders(userId),
    enabled: !!userId,
  });

  const getOrdersView = useQuery({
    queryKey: ['ordersOverview'],
    queryFn: () => orderApi.getOrderOverview(),
    enabled: user?.role === 'admin',
  });

  const assigningOrder = useMutation({
    mutationFn: orderApi.assignOrder,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['orders']);
      toast.success(data.message || 'Something went wrong. Please try again.');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to assign order');
    },
  });



  return {
    createOrderFn: createOrder.mutate,
    createOrderLoading : createOrder.isPending,
    createdSuccess: createOrder.isSuccess,
    createdError: createOrder.isError,
    resetCreatedOrder: createOrder.reset,
    restaurantOrder: restaurantOrders.data,
    restaurantOrderLoading :restaurantOrders.isPending,
    adminOrder: adminOrders.data,
    adminOrderLoading :adminOrders.isPending,
    orders: getOrders.data,
    isOrdersLoading: getOrders.isLoading,
    overview: getOrdersView.data,
    overviewLoading:getOrdersView.isPending,
    orderAssignFn: assigningOrder.mutate,
    dashRevenue : adminRevenue.data,
    singleOrder :fetchOrder.data,
    singleOrderLoading :fetchOrder.isPending
  };
};
