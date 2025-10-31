import api from '../service/axiosService';

export const userApi = {
  // Get all users
  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  // Get single user by ID
  getUserById: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  // Create new user
  createUser: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  // Update existing user
  updateUser: async (userId, userData) => {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (userId) => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },

  // Update user profile
  updateProfile: async (userId, profileData) => {
    const response = await api.patch(`/users/${userId}/profile`, profileData);
    return response.data;
  },

  // Change user password
  changePassword: async (userId, passwordData) => {
    const response = await api.post(`/users/${userId}/change-password`, passwordData);
    return response.data;
  }
};

export default userApi;