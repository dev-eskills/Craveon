import api from '../utils/axios';

const BASE_URL = '/admin';

const getAdminDashboard = async () => {
  const response = await api.get(BASE_URL);
  return response.data;
};

export const adminDashboard = { getAdminDashboard };
