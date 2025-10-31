import axios from 'axios';

// Environment-based configuration
const API_CONFIG = {
  // Updated to use VITE_API_URL from .env
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  TIMEOUT: 10000, // 10 seconds
  HEADERS: {
    'Content-Type': 'application/json',
  },
  // Using VITE_ENV from .env
  IS_DEV: import.meta.env.VITE_ENV === 'development',
};
// Create axios instance with base URL
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Add a request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    } catch (error) {
      if (API_CONFIG.IS_DEV) {
        console.error('Error parsing user data from localStorage:', error);
      }
    }
    return config;
  },
  (error) => {
    if (API_CONFIG.IS_DEV) {
      console.error('Request interceptor error:', error);
    }
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    if (API_CONFIG.IS_DEV) {
      console.log('API Response:', {
        url: response.config.url,
        status: response.status,
        data: response.data
      });
    }
    return response;
  },
  (error) => {
    if (API_CONFIG.IS_DEV) {
      console.error('API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: error.message,
        response: error.response?.data,
      });
    }

    // Handle network errors
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timeout. Please check your internet connection.'));
    }

    if (!error.response) {
      return Promise.reject(new Error('Network error. Please check if the server is running and accessible.'));
    }

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;