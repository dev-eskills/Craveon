import api from '../utils/axios';

const addCart = async (cartData) => {
  const response = await api.post(`/cart`, cartData);
  return response.data;
};

const getCartItem = async () => {
  const response = await api.get(`/cart`);
  return response.data;
};

const updateCart = async ({ productId, quantity }) => {
  const response = await api.patch(`/cart/item/${productId}`, { quantity });
  return response.data;
};

const removeCart = async ({ productId }) => {
  const response = await api.delete(`/cart/item/${productId}`);
  return response.data;
};

const cartApi = {
  addCart,
  getCartItem,
  updateCart,
  removeCart,
};

export default cartApi;
