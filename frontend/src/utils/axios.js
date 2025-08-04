import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const api = axios.create({

  // baseURL: 'https://craveonapi.onrender.com/api', // for production
  baseURL:"https://craveon-backend.onrender.com/api", // eskills development
  // baseURL: 'http://localhost:3000/api', // for development
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    const user_location = localStorage.getItem('user_location');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (user_location) {
      try {
        const { lat, lon } = JSON.parse(user_location);
        config.headers['position'] = JSON.stringify({ lat, lon });
      } catch (err) {
        console.warn('Invalid user_location format in localStorage:', err);
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const state = useAuthStore.getState();

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (state.isRefreshing) return Promise.reject(error); // ✅ Prevent duplicate calls
      originalRequest._retry = true;

      try {
        state.isRefreshing = true;
        const response = await api.get('/auth/refresh', { withCredentials: true });
        state.isRefreshing = false;

        const { accessToken } = response.data;
        useAuthStore.getState().setAuth(accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        const user_location = localStorage.getItem('user_location');
        if (user_location) {
          try {
            const { lat, lon } = JSON.parse(user_location);
            originalRequest.headers['position'] = JSON.stringify({ lat, lon });
          } catch (err) {
            console.warn('Invalid user_location format in refresh:', err);
          }
        }

        return api(originalRequest);
      } catch (err) {
        state.isRefreshing = false;
        useAuthStore.getState().logout();
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
