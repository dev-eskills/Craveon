import api from '../utils/axios';

const BASE_URL = '/user/Address';

const getAddress = async () => {
  const response = await api.get(BASE_URL);
  console.log(response.data);
  return response.data;
};

const addAddress = async (formData) => {
  const response = await api.post(BASE_URL, formData);
  return response.data;
};

const removeAddress = async (id) => {
  const response = await api.delete(`${BASE_URL}/${id}`);
  return response.data;
};

const updateAddress = async (formData) => {
  const response = await api.post('/user/Address/EditAddress', formData);
  return response.data;
};

const EditUserDetail = async (id, formData) => {
  const response = await api.put(`/user/${id}`, formData);
  return response.data;
};

const getUserDetail = async (id) => {
  const response = await api.get(`/user/${id}`);
  return response.data;
};

const profileApi = {
  addAddress,
  getAddress,
  removeAddress,
  updateAddress,
  EditUserDetail,
  getUserDetail,
};

export default profileApi;
