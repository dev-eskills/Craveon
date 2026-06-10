import api from '../utils/axios';

const BASE_URL = '/admin/restaurant';

const getDashboardRestaurants = async (signal) => {
  const response = await api.get('/restaurant', { signal });
  return response.data.data;
};

const getRestaurants = async (page, pageSize, signal, lon, lat, name = '', isActive) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: pageSize.toString(),
  });

  if (lat && lon) {
    params.append('longitude', lon);
    params.append('latitude', lat);
    params.append('mxRadius', '5000');
  }

  if (name) {
    params.append('search', name);
  }

  if (isActive !== undefined && isActive !== null) {
    params.append('isActive', isActive);
  }

  const response = await api.get(`/admin/restaurant/all?${params.toString()}`, {
    signal,
  });

  return response.data;
};

const getRestaurant = async (signal, id) => {
  const response = await api.get(`${BASE_URL}/${id}`, { signal });
  return response.data;
};

const updateSetRestroStatus = async (id) => {
  const res = await api.patch(`${BASE_URL}/${id}/toggle-status`);
  return res.data;
};

const createRestaurant = async (formData) => {
  const response = await api.post(BASE_URL, formData);
  return response.data;
};

const updateRestaurant = async ({ data, editId }) => {
  const response = await api.put(`${BASE_URL}/${editId}`, data);
  return response.data;
};

const removeRestaurant = async (id) => {
  const response = await api.delete(BASE_URL + '/' + id);
  return response.data;
};

const updateRestaurantImage = async ({ formData, id }) => {
  const response = await api.put(`${BASE_URL}/${id}/update-images`, formData);
  return response.data;
};

const getBuissnessHours = async (id) => {
  const response = await api.get(`${BASE_URL}/${id}/business-hours`);
  return response.data;
};

const updateRestaurantBusinessHour = async ({ businessHours, id }) => {
  const response = await api.put(`${BASE_URL}/${id}/business-hours`, { businessHours });
  return response.data;
};

// Get Gst

const getGst = async (signal) => {
  const response = await api.get(`/settings`, { signal });
  return response.data;
};

const updateGst = async (formData) => {
  const response = await api.post(`/settings`, formData);
  return response.data;
};

const getRevenue = async () => {
  const response = await api.get(`restaurant/revenue`);
  return response.data;
};

const restaurantReport = async () => {
  const response = await api.get(`restaurant/report`);
  return response.data;
};
export const restaurantsApi = {
  getRestaurants,
  getRestaurant,
  createRestaurant,
  removeRestaurant,
  updateRestaurantImage,
  getBuissnessHours,
  updateRestaurantBusinessHour,
  updateSetRestroStatus,
  updateRestaurant,
  getGst,
  updateGst,
  getDashboardRestaurants,
  getRevenue,
  restaurantReport,
};
