import api from '../service/axiosService';
import Cookies from 'js-cookie';

// User login
export const login = async (phoneNumber, password) => {
  try {
    const response = await api.post('/users/login', {
     phoneNumber,
      password
    });
    
    // Assuming the backend returns a token in response.data.token
    if (response.data.token) {
      // The token will be automatically set in the Authorization header by axiosService
      return response.data;
    }
    
    return response.data;
  } catch (error) {
    // Error handling is done by the axiosService interceptor
    throw error;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = Cookies.get('token');
  return !!token; // Returns true if token exists in cookies, false otherwise
};

// Logout user
export const logout = () => {
  // Clear token from cookies
  Cookies.remove('token');
  // Redirect to login page
  window.location.href = '/login';
};
