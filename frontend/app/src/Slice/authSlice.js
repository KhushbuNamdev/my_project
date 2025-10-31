import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../Api/authApi';

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      localStorage.setItem('token', response.token);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authApi.register(userData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.getCurrentUser();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
    }
  }
);

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = {
        id: action.payload._id,
        name: action.payload.name,
        email: action.payload.email,
        role: action.payload.role
      };
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Register
    builder.addCase(register.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(register.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Get current user
    builder.addCase(getCurrentUser.fulfilled, (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    });
    builder.addCase(getCurrentUser.rejected, (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;