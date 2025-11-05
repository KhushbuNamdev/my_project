import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllCategories as fetchAllCategories,
  getCategoryById as fetchCategoryById,
  createCategory as createCategoryApi,
  updateCategory as updateCategoryApi,
  deleteCategory as deleteCategoryApi
} from '../Api/categoryApi';

// Async thunks
export const fetchCategories = createAsyncThunk(
  'categories/fetchAll',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await fetchAllCategories(filters);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

export const fetchCategory = createAsyncThunk(
  'categories/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetchCategoryById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Category not found');
    }
  }
);

export const createNewCategory = createAsyncThunk(
  'categories/create',
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await createCategoryApi(categoryData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create category');
    }
  }
);

export const updateExistingCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const response = await updateCategoryApi(id, updateData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update category');
    }
  }
);

export const removeCategory = createAsyncThunk(
  'categories/delete',
  async (id, { rejectWithValue }) => {
    try {
      await deleteCategoryApi(id);
      return id; // Return the ID of the deleted category
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete category');
    }
  }
);

const initialState = {
  categories: [],
  currentCategory: null,
  loading: false,
  error: null,
  success: false
};

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    resetCategoryState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.currentCategory = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch all categories
    builder.addCase(fetchCategories.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.loading = false;
      // Handle both array response and object with data property
      state.categories = Array.isArray(action.payload) 
        ? action.payload 
        : action.payload.data || [];
    });
    builder.addCase(fetchCategories.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Fetch single category
    builder.addCase(fetchCategory.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCategory.fulfilled, (state, action) => {
      state.loading = false;
      state.currentCategory = action.payload;
    });
    builder.addCase(fetchCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Create category
    builder.addCase(createNewCategory.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(createNewCategory.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      // Add the new category to the beginning of the array
      state.categories = [action.payload, ...state.categories];
    });
    builder.addCase(createNewCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Update category
    builder.addCase(updateExistingCategory.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(updateExistingCategory.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      const index = state.categories.findIndex(cat => cat._id === action.payload._id);
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
      if (state.currentCategory?._id === action.payload._id) {
        state.currentCategory = action.payload;
      }
    });
    builder.addCase(updateExistingCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Delete category
    builder.addCase(removeCategory.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(removeCategory.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.categories = state.categories.filter(cat => cat._id !== action.payload);
      if (state.currentCategory?._id === action.payload) {
        state.currentCategory = null;
      }
    });
    builder.addCase(removeCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
});

export const { resetCategoryState, clearError } = categorySlice.actions;
export default categorySlice.reducer;