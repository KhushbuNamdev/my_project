import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userApi from '../Api/userApi';

// ✅ Create User
export const createUser = createAsyncThunk(
  'user/createUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await userApi.createUser(userData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Failed to create user'
      );
    }
  }
);

// ✅ Fetch Current User
export const fetchCurrentUser = createAsyncThunk(
  'user/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userApi.getCurrentUser();
      return response;  
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ✅ Get All Users
export const getAllUsers = createAsyncThunk(
  'user/getAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userApi.getAllUsers();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Failed to fetch users'
      );
    }
  }
);

// ✅ Update Profile
export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await userApi.updateProfile(userData);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Failed to update profile'
      );
    }
  }
);

// ✅ Change Password
export const changePassword = createAsyncThunk(
  'user/changePassword',
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const response = await userApi.changePassword(currentPassword, newPassword);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to change password');
    }
  }
);

// ✅ Update User
export const updateUser = createAsyncThunk(
  'user/updateUser',
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const response = await userApi.updateUser(userId, userData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user');
    }
  }
);

// ✅ Delete User
export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await userApi.deleteUser(userId);
      return { userId, ...response };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
    }
  }
);

// ✅ Initial State
const initialState = {
  users: [],
  currentUser: null,
  loading: false,
  error: null,
  success: false,
  message: '',
  operation: null,
};

// ✅ Slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
      state.message = '';
    },
    resetUserState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = '';
      state.operation = null;
    },
    resetUserSuccess: (state) => {
      state.success = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ createUser
      .addCase(createUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.users.push(payload.data || payload);
        state.success = true;
        state.message = 'User created successfully';
        state.operation = 'createUser';
      })

      // ✅ Other fulfilled cases
      .addCase(fetchCurrentUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.currentUser = payload?.data || payload;
        state.success = true;
        state.operation = 'fetchCurrentUser';
      })
      .addCase(getAllUsers.fulfilled, (state, { payload }) => {
        state.users = payload?.data || [];
        state.loading = false;
        state.success = true;
        state.operation = 'getAllUsers';
      })
      .addCase(updateProfile.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.currentUser = { ...state.currentUser, ...payload?.data };
        state.success = true;
        state.message = 'Profile updated successfully';
        state.operation = 'updateProfile';
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.message = 'Password changed successfully';
        state.operation = 'changePassword';
      })
      .addCase(updateUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.users = state.users.map((user) =>
          user._id === payload.data._id ? payload.data : user
        );
        state.success = true;
        state.message = 'User updated successfully';
        state.operation = 'updateUser';
      })
      .addCase(deleteUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.users = state.users.filter((user) => user._id !== payload.userId);
        state.success = true;
        state.message = 'User deleted successfully';
        state.operation = 'deleteUser';
      });

    // ✅ Pending states
    builder.addMatcher(
      (action) =>
        [
          createUser.pending,
          fetchCurrentUser.pending,
          getAllUsers.pending,
          updateProfile.pending,
          changePassword.pending,
          updateUser.pending,
          deleteUser.pending,
        ].includes(action.type),
      (state, action) => {
        state.loading = true;
        state.error = null;
        state.message = '';
        state.operation = action.type.replace('/pending', '').split('/').pop();
      }
    );

    // ✅ Rejected states
    builder.addMatcher(
      (action) =>
        [
          createUser.rejected,
          fetchCurrentUser.rejected,
          getAllUsers.rejected,
          updateProfile.rejected,
          changePassword.rejected,
          updateUser.rejected,
          deleteUser.rejected,
        ].includes(action.type),
      (state, { payload, error, type }) => {
        state.loading = false;
        state.error = payload || error.message || 'Something went wrong';
        state.success = false;
        state.operation = type.replace('/rejected', '').split('/').pop();
      }
    );
  },
});

// ✅ Export actions and reducer
export const { clearUserError, resetUserState, resetUserSuccess } = userSlice.actions;
export default userSlice.reducer;
