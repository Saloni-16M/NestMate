import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // Add other reducers here as needed
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/register/fulfilled', 'auth/login/fulfilled', 'auth/loadUser/fulfilled'],
        // Ignore these field paths in all actions
        ignoredPaths: ['auth.user.dateJoined'],
      },
    }),
});

export default store;
