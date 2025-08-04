import api from '../utils/axios';

const sendOTP = async (phone) => {
  try {
    const response = await api.get(`/auth/otp?phone=${phone}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to send OTP');
  }
};

const verifyOTP = async (phone) => {
  try {
    const response = await api.post(`/auth/verifyOtp`, phone, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const register = async (registerData) => {
  try {
    const response = await api.post(`/auth/register`, registerData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials, {
      withCredentials: true,
    });

    return response.data; // Return response data normally if login is successful
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

const authApi = {
  sendOTP,
  verifyOTP,
  register,
  login,
};

export default authApi;
