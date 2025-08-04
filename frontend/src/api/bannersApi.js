import api from '../utils/axios';

const BASE_URL = '/admin/banner';

const createBanner = async (formData) => {
  const response = await api.post(BASE_URL, formData);
  return response.data;
};

const getBanner = async (signal) => {
  const response = await api.get(BASE_URL, { signal });
  return response.data;
};

const deleteBanner = async (id) => {
  const response = await api.delete(`${BASE_URL}/${id}`);
  return response.data;
};

export const bannersApi = {
  createBanner,
  getBanner,
  deleteBanner,
};
