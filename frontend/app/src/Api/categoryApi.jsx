// src/Api/categoryApi.jsx
import api from '../service/axiosService';

// Get all categories
export const getAllCategories = async (filters = {}) => {
  try {
    const response = await api.get('/categories', { params: filters });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get category by ID
export const getCategoryById = async (id) => {
  try {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create new category
export const createCategory = async (categoryData) => {
  try {
    const response = await api.post('/categories', categoryData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update category
export const updateCategory = async (id, updateData) => {
  try {
    const response = await api.put(`/categories/${id}`, updateData);
    return response.data;
  } catch (error) {
    throw error;
  }
};


// Delete category (soft delete)
export const deleteCategory = async (id) => {
  try {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get all subcategories for a parent category
export const getSubcategories = async (parentId) => {
  try {
    const response = await api.get(`/categories/${parentId}/subcategories`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
