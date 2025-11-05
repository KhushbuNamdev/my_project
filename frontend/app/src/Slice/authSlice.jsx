// src/Slice/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login as loginApi, logout as logoutApi, getCurrentUser } from '../Api/authApi';
import Cookies from 'js-cookie';

// ✅ Check auth on app load
export const checkAuthStatus = createAsyncThunk('auth/checkStatus', async (_, { rejectWithValue }) => {
  const token = Cookies.get('token');
  console.log("🔍 Token from cookie:", token);
  if (!token) return rejectWithValue('No token found');

  try {
    const user = await getCurrentUser();
    console.log("✅ User fetched:", user);
    return { user, token };
  } catch (err) {
    console.error("❌ Token invalid or /users/me failed:", err.response?.status, err.message);
    Cookies.remove('token');
    return rejectWithValue('Token invalid');
  }
});
// ✅ Login user
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ phoneNumber, password }, { rejectWithValue }) => {
    try {
      const response = await loginApi(phoneNumber, password);

      // ✅ Store token in cookies here:
      if (response.data.token) {
        Cookies.set("token", response.data.token, {
          expires: 7,
          path: "/",      // makes cookie available everywhere
          sameSite: "Lax" // avoid cross-site blocking in localhost
        });
        console.log("Token stored in cookie:", response.data.token);
      } else {
        console.error("⚠️ No token found in response!");
      }

      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// ✅ Logout
export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  logoutApi();
  Cookies.remove('token');
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: Cookies.get('token') || null,
    isAuthenticated: !!Cookies.get('token'),
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user || null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
