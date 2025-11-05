import api from '../service/axiosService';

const PRODUCTS_API = '/products';

export const productApi = {
  // Create a new product
  createProduct: async (productData) => {
    try {
      const { data } = await api.post(PRODUCTS_API, productData);
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || error.message 
      };
    }
  },

  // Get all products with optional filters
  getProducts: async (filters = {}) => {
  try {
    const { status, categoryId, search, page = 1, limit = 10, ...restFilters } = filters || {};
    const params = new URLSearchParams();
    
    // Add standard filters
    if (status) params.append('status', status);
    if (categoryId) params.append('categoryId', categoryId);
    if (search) params.append('search', search);
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    // Add any additional filters
    Object.entries(restFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
    
    const { data } = await api.get(`${PRODUCTS_API}?${params.toString()}`);
    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || error.message 
    };
  }
},

  // Get single product by ID
  getProductById: async (id) => {
    try {
      const { data } = await api.get(`${PRODUCTS_API}/${id}`);
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || error.message 
      };
    }
  },

  // Update a product
  updateProduct: async (id, updateData) => {
    try {
      const { data } = await api.patch(`${PRODUCTS_API}/${id}`, updateData);
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || error.message 
      };
    }
  },

  // Delete a product (soft delete)
  deleteProduct: async (id) => {
    try {
      await api.delete(`${PRODUCTS_API}/${id}`);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || error.message 
      };
    }
  },

  // Upload product image
  uploadImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const { data } = await api.post(`${PRODUCTS_API}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || error.message 
      };
    }
  },
};

export default productApi;