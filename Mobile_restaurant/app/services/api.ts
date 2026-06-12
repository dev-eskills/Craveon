import axios from "axios";
import { useAuthStore } from "../store/authStore";

export const api = axios.create({
    baseURL: "https://craveon-backend.onrender.com/api",
    timeout: 10000,
});

// Attach token automatically
api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);