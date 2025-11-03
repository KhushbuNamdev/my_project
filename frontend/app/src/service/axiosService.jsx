// src/service/axiosService.js
import axios from 'axios';
import Cookies from 'js-cookie';

const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

// ✅ Create axios instance
const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// ✅ Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Skip adding token for login/register
    if (config.url.includes('/login') || config.url.includes('/register')) {
      return config;
    }

    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized! Logging out...');
      Cookies.remove('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
