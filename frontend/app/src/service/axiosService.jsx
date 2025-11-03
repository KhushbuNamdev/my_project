import axios from 'axios';
import Cookies from 'js-cookie';

// ✅ Environment-based configuration
const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  TIMEOUT: 10000, // 10 seconds
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

// ✅ Axios instance create karte hain
const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// ✅ Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token'); // cookies se token get karo
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // har request me token bhejo
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response, // sirf response.data return karenge
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized! Please login again.');
      Cookies.remove('token'); // token invalid hone pe cookie se hata do
      window.location.href = '/login'; // login page pe redirect
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
