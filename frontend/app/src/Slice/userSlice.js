import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userApi } from '../Api/userApi';

// Async thunks
export const fetchUsers = createAsyncThunk('users/fetchAll', async () => {
  const response = await userApi.getAllUsers();
  return response;
});

export const fetchUserById = createAsyncThunk('users/fetchById', async (userId) => {
  const response = await userApi.getUserById(userId);
  return response;
});

export const createUser = createAsyncThunk('users/create', async (userData) => {
  const response = await userApi.createUser(userData);
  return response;
});

export const updateUser = createAsyncThunk('users/update', async ({ userId, userData }) => {
  const response = await userApi.updateUser(userId, userData);
  return response;
});

export const deleteUser = createAsyncThunk('users/delete', async (userId) => {
  await userApi.deleteUser(userId);
  return userId;
});

const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    currentUser: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchUserById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentUser = action.payload;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        if (state.currentUser?.id === action.payload.id) {
          state.currentUser = action.payload;
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user.id !== action.payload);
        if (state.currentUser?.id === action.payload) {
          state.currentUser = null;
        }
      });
  },
});

export const { clearCurrentUser } = userSlice.actions;
export default userSlice.reducer;

// Selectors
export const selectAllUsers = (state) => state.users.users;
export const selectUserById = (state, userId) => 
  state.users.users.find(user => user.id === userId);
export const selectCurrentUser = (state) => state.users.currentUser;
export const selectUserStatus = (state) => state.users.status;
export const selectUserError = (state) => state.users.error;