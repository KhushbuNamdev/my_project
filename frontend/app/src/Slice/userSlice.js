import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userApi from '../Api/userApi';

// Async Thunks
export const fetchCurrentUser = createAsyncThunk(
    'user/fetchCurrentUser',
    async (_, { rejectWithValue }) => {
        try {
            const response = await userApi.getCurrentUser();
            return response.data || response; // Handle both response structures
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const getAllUsers = createAsyncThunk(
    'user/getAllUsers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await userApi.getAllUsers();
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
        }
    }
);

// Initial state
const initialState = {
    users: [],
    currentUser: null,
    loading: false,
    error: null,
    success: false,
};

// Create slice
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearUserError: (state) => {
            state.error = null;
        },
        resetUserState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        },
        resetUserSuccess: (state) => {
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        // Handle fulfilled states first
        builder
            .addCase(fetchCurrentUser.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.currentUser = payload?.data || payload;
                state.success = true;
            })
            .addCase(getAllUsers.fulfilled, (state, { payload }) => {
                state.users = payload?.data;
                state.loading = false;
                state.success = true;
            });

        // Handle pending and rejected states using addMatcher
        builder
            .addMatcher(
                (action) => [
                    fetchCurrentUser.pending,
                    getAllUsers.pending,
                ].includes(action.type),
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                (action) => [
                    fetchCurrentUser.rejected,
                    getAllUsers.rejected,
                ].includes(action.type),
                (state, { payload }) => {
                    state.loading = false;
                    state.error = payload || 'Something went wrong';
                }
            );
    },
});

// Export actions
export const { clearUserError, resetUserState, resetUserSuccess } = userSlice.actions;

// Export reducer
export default userSlice.reducer;