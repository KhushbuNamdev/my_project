// src/api/authApi.js
import axios from '../service/axiosService';
import Cookies from 'js-cookie';

export const authApi = {
  async loginUser(phoneNumber, password) {
    try {
      const response = await axios.post('/users/login', {
        phoneNumber,
        password,
      });

      if (response.data.token) {
        Cookies.set('token', response.data.token, { 
          expires: 7,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
        
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      }

      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  logout() {
    Cookies.remove('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return !!Cookies.get('token');
  }
};

export default authApi;