import api from '../utils/axios';

const Base_Url = '/admin/category';

const getCategories = async () => {
  const res = await api.get(Base_Url + '/all');
  return res.data;
};

const addCategory = async (formData) => {
  const res = await api.post(Base_Url, formData);
  console.log(res.data);
  return res.data;
};

const categoryStatus = async (categoryId) => {
  const response = await api.patch(`${Base_Url}/${categoryId}/toggle-status`);
  return response.data;
};

const editCategory = async (id, formData) => {
  const response = await api.put(`${Base_Url}/${id}`, formData);
  return response.data;
};

export const categoriesApi = {
  getCategories,
  addCategory,
  // getStats,
  categoryStatus,
  editCategory,
};
