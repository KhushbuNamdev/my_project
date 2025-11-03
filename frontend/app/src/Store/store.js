import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../Slice/authSlice';
import userReducer from '../Slice/userSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    // Add other reducers here if needed
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for non-serializable values
    }),
});

export default store;