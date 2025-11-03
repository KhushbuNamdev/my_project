import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login as loginApi, logout as logoutApi, isAuthenticated } from '../Api/authApi';
import Cookies from 'js-cookie';

// ✅ Thunk for login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ phoneNumber, password }, { rejectWithValue }) => {
    try {
      const response = await loginApi(phoneNumber, password);

      // ✅ Save token in cookies
      if (response.token) {
        Cookies.set('token', response.token, { expires: 7 });
      }

      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// ✅ Thunk for logout
export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  logoutApi(); // this clears cookie and redirects
});

const initialState = {
  user: null,
  token: Cookies.get('token') || null,
  isAuthenticated: isAuthenticated(),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || null;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // ✅ LOGOUT
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError } = authSlice.actions;

// ✅ Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthError = (state) => state.auth.error;
export const selectAuthLoading = (state) => state.auth.loading;

export default authSlice.reducer;
