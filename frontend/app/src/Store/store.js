import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from '../Slice/authSlice';


// Persist configuration
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth'], // only auth will be persisted (user state is not persisted)
};

// Create persisted reducers
const persistedAuthReducer = persistReducer(persistConfig, authReducer);

// Configure store
export const store = configureStore({
    reducer: {
        auth: persistedAuthReducer,
       
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
});

export const persistor = persistStore(store);