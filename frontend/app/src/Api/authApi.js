import api from '../service/axiosService';

export const authApi = {
  login: async (credentials) => {
    const response = await api.post('/users/login', credentials);
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/users/register', userData);
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },
};