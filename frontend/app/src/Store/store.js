import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../Slice/authSlice';
import userReducer from '../Slice/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});