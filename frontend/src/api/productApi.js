import api from '../utils/axios';

const addProduct = async (formData) => {
  const response = await api.post(`/restaurant/product`, formData);
  return response.data;
};

const getProducts = async (restaurantId) => {
  const response = await api.get(`/restaurant/product/${restaurantId}`);
  return response.data.data;
};

const getCategoryProduts = async (catId) => {
  try {
    const response = await api.get(`/restaurant/product/category/${catId}`);
    return response.data.data;
  } catch (error) {
    throw new Error(error);
  }
};

const editProduct = async (id, formData) => {
  console.log(formData);
  try {
    const response = await api.put(`/restaurant/product/${id}`, formData);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const productAvailability = async (productId) => {
  const response = await api.patch(`/restaurant/product/${productId}/toggle-availability`);
  return response.data;
};

export const productApi = {
  addProduct,
  getProducts,
  editProduct,
  productAvailability,
  getCategoryProduts,
};
