import api from '../utils/axios';

// Get All Restaurants in User Panel
const BASE_URL = '/user/restaurant';

const getAllRestaurants = async () => {
  const response = await api.get(BASE_URL);
  return response.data;
};


export const userRestaurantApi = {
  getAllRestaurants,
};
