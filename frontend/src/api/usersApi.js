import api from '../utils/axios';
const BASE_URL = '/admin/allUsers';

const getAllUsers = async (signal , page , limit = 10 , search=" ") => {
  const response = await api.get(`${BASE_URL}?page=${page}&limit=${limit}&search=${search}`, {
    signal,
  });

  return response.data;
};

export const usersApi = {
  getAllUsers,
};




