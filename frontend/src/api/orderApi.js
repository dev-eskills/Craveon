import api from '../utils/axios';

const BASE_URL = '/order';

const createOrder = async (orderDetails) => {
  const response = await api.post(BASE_URL, orderDetails);
  return response.data;
};

const getRestaurantOrders = async (restaurantId, signal) => {
  const response = await api.get(`${BASE_URL}/restaurant/${restaurantId}`, { signal });
  return response.data;
};

const getAdminOrders = async (signal, name, page, limit = 5, status, date) => {
  const params = new URLSearchParams();

  if (name) params.append('orderNumber', name);
  if (page) params.append('page', page);
  if (limit) params.append('limit', limit);
  if (status) params.append('status', status);
  if (date) params.append('startDate', date);

  const response = await api.get(`${BASE_URL}?${params.toString()}`, {
    signal,
  });

  return response.data;
};

const getOrder = async (orderId) => {
  const response = await api.get(`${BASE_URL}/${orderId}`);
  return response.data;
};

const getOrders = async (userId) => {
  const response = await api.get(`${BASE_URL}/user/my-orders/${userId}`);
  return response.data;
};

const getOrdersByRestaurant = async (restaurantId) => {
  const response = await api.get(`${BASE_URL}/restaurant/${restaurantId}`);
  return response.data;
};  

const getOrderOverview = async () => {
  const response = await api.get(`${BASE_URL}/overview`);
  return response.data;
};

const assignOrder = async (formData) => {
  const response = await api.post(`${BASE_URL}/assign-delivery`, formData);
  return response.data;
};

const dashboardRevenue = async(days=7)=>{
  const response = await api.get(`${BASE_URL}/revenue?days=${days}`)
  return response.data
}

const getSingleOrder = async (orderId) => {
  const response = await api.get(`${BASE_URL}/${orderId}`);
  return response.data
};
export const orderApi = {
  createOrder,
  getRestaurantOrders,
  getAdminOrders,
  getOrder,
  getOrders,
  getOrdersByRestaurant,
  getOrderOverview,
  assignOrder,
  dashboardRevenue,
  getSingleOrder,
};
