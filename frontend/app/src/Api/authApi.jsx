// src/Api/authApi.js
import api from '../service/axiosService';
import Cookies from 'js-cookie';

// ✅ Login
export const login = async (phoneNumber, password) => {
  try {
    const response = await api.post('/users/login', { phoneNumber, password });
    if (response.data.token) {
      // Store token in cookies
      Cookies.set('token', response.data.token, { expires: 7 });
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ✅ Get current user info
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/users/me');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch user data');
  }
};

// ✅ Check if authenticated
export const isAuthenticated = () => {
  const token = Cookies.get('token');
  return !!token;
};

// ✅ Logout
export const logout = () => {
  Cookies.remove('token');
  window.location.href = '/login';
};
