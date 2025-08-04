import api from '../utils/axios';

const BASE_URL = '/admin/rider';

const getRider = async (page = 1, limit = 10, searchQuery = ' ') => {
  const response = await api.get(
    `${BASE_URL}/all?page=${page}&limit=${limit}&search=${searchQuery}`
  );
  return response.data;
};

const toggleRider = async (userId) => {
  const response = await api.post(`${BASE_URL}/toggle`, { userId });
  return response.data;
};

export const ridersApi = { getRider, toggleRider };
