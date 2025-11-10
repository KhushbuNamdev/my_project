import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productApi from '../Api/productApi';

// Async thunks
export const fetchAllProducts = createAsyncThunk(
  'products/fetchAll',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await productApi.getProducts(filters);
      if (response.success) {
        // Return the data in the format the slice expects
        return {
          products: response.data.data || [], // Access the nested data array
          totalItems: response.data.total || response.data.data?.length || 0,
          totalPages: response.data.totalPages || 1,
          currentPage: response.data.page || 1
        };
      }
      return rejectWithValue(response.error || 'Failed to fetch products');
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch products');
    }
  }
);

export const fetchProduct = createAsyncThunk(
  'products/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await productApi.getProductById(id);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.error || 'Product not found');
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch product');
    }
  }
);

export const createNewProduct = createAsyncThunk(
  'products/create',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await productApi.createProduct(productData);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.error || 'Failed to create product');
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create product');
    }
  }
);

export const updateExistingProduct = createAsyncThunk(
  'products/update',
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      console.log('Updating product with ID:', id);
      console.log('Update data:', updateData);
      
      const response = await productApi.updateProduct(id, updateData);
      
      if (response.success) {
        console.log('Update successful, response:', response);
        return response.data;
      }
      
      console.error('Update failed, response:', response);
      return rejectWithValue({
        message: response.error || 'Failed to update product',
        data: response.data
      });
      
    } catch (error) {
      console.error('Update error:', error);
      return rejectWithValue({
        message: error.response?.data?.message || error.message || 'Failed to update product',
        data: error.response?.data
      });
    }
  }
);

export const removeProduct = createAsyncThunk(
  'products/delete',
  async (id, { rejectWithValue }) => {
    if (!id) {
      return rejectWithValue('Product ID is required');
    }
    
    try {
      const response = await productApi.deleteProduct(id);
      console.log('Delete API response:', response);
      
      if (response && response.success) {
        return { id, ...response.data };
      }
      
      return rejectWithValue(response?.error || 'Failed to delete product');
    } catch (error) {
      console.error('Delete product error:', error);
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Failed to delete product'
      );
    }
  }
);

export const uploadProductImage = createAsyncThunk(
  'products/uploadImage',
  async (file, { rejectWithValue }) => {
    try {
      const response = await productApi.uploadImage(file);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.error || 'Failed to upload image');
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to upload image');
    }
  }
);

const initialState = {
  products: [],
  currentProduct: null,
  loading: false,
  error: null,
  success: false,
  totalItems: 0,
  totalPages: 1,
  currentPage: 1
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    resetProductState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.currentProduct = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Reset loading and error states at the start of any async operation
    const handlePending = (state) => {
      state.loading = true;
      state.error = null;
    };

    const handleRejected = (state, action) => {
      state.loading = false;
      state.error = action.payload;
    };

    // Fetch all products
    builder
      .addCase(fetchAllProducts.pending, handlePending)
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products || [];
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchAllProducts.rejected, handleRejected)

      // Fetch single product
      .addCase(fetchProduct.pending, handlePending)
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProduct.rejected, handleRejected)

      // Create product
      .addCase(createNewProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createNewProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.products.unshift(action.payload);
      })
      .addCase(createNewProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Update product
      .addCase(updateExistingProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateExistingProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const index = state.products.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        if (state.currentProduct?._id === action.payload._id) {
          state.currentProduct = action.payload;
        }
      })
      .addCase(updateExistingProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Delete product
      .addCase(removeProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(product => product._id !== action.payload);
        if (state.currentProduct?._id === action.payload) {
          state.currentProduct = null;
        }
      })
      .addCase(removeProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Upload product image
      .addCase(uploadProductImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadProductImage.fulfilled, (state, action) => {
        state.loading = false;
        // Handle the uploaded image data as needed
      })
      .addCase(uploadProductImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { resetProductState, clearError } = productSlice.actions;
export default productSlice.reducer;