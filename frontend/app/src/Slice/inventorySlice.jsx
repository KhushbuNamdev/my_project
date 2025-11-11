import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { inventoryApi } from '../Api/inventoryApi';

// Async thunks
export const fetchAllInventory = createAsyncThunk(
  'inventory/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await inventoryApi.getAllInventory(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch inventory');
    }
  }
);

export const createNewInventory = createAsyncThunk(
  'inventory/create',
  async (inventoryData, { rejectWithValue }) => {
    try {
      const response = await inventoryApi.createInventory(inventoryData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create inventory');
    }
  }
);

export const updateInventoryItem = createAsyncThunk(
  'inventory/update',
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const response = await inventoryApi.updateInventory(id, updateData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update inventory');
    }
  }
);

export const deleteInventoryItem = createAsyncThunk(
  'inventory/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await inventoryApi.deleteInventory(id);
      if (response.data && response.data.success === false) {
        throw new Error(response.data.message || 'Failed to delete inventory');
      }
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to delete inventory');
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
  currentItem: null,
  totalItems: 0,
  currentPage: 1,
  totalPages: 1
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentItem: (state, action) => {
      state.currentItem = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Fetch all inventory
    builder
      .addCase(fetchAllInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllInventory.fulfilled, (state, action) => {
        state.loading = false;
        // Check if the payload has a 'data' property (for paginated responses)
        // or if it's the direct array of items
        if (action.payload && action.payload.data) {
          state.items = Array.isArray(action.payload.data) ? action.payload.data : [];
          state.totalItems = action.payload.pagination?.total || action.payload.total || 0;
          state.currentPage = action.payload.pagination?.page || action.payload.page || 1;
          state.totalPages = action.payload.pagination?.pages || action.payload.pages || 1;
        } else {
          // Handle case where the payload is directly the array of items
          state.items = Array.isArray(action.payload) ? action.payload : [];
          state.totalItems = state.items.length;
          state.currentPage = 1;
          state.totalPages = 1;
        }
        state.error = null;
      })
      .addCase(fetchAllInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

    // Create inventory
      .addCase(createNewInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewInventory.fulfilled, (state, action) => {
        state.loading = false;
        // Add the new item to the beginning of the items array
        if (action.payload) {
          state.items = [action.payload, ...state.items];
          state.totalItems += 1;
          // Ensure we don't exceed the page size
          if (state.items.length > (state.totalItems / state.totalPages)) {
            state.items = state.items.slice(0, state.totalItems / state.totalPages);
          }
        }
        state.error = null;
      })
      .addCase(createNewInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

    // Update inventory
      .addCase(updateInventoryItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInventoryItem.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;  // Update the item in the list
        }
        if (state.currentItem?._id === action.payload._id) {
          state.currentItem = action.payload;   // Update current item if it's the one being edited
        }
      })
      .addCase(updateInventoryItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update inventory';
      })

    // Delete inventory
      .addCase(deleteInventoryItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteInventoryItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item._id !== action.payload);
        state.totalItems = Math.max(0, state.totalItems - 1);
        if (state.currentItem?._id === action.payload) {
          state.currentItem = null;
        }
      })
      .addCase(deleteInventoryItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, setCurrentItem } = inventorySlice.actions;
export default inventorySlice.reducer;