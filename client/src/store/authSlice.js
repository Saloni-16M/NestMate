import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '../lib/api';

// Get token from localStorage
const token = localStorage.getItem('token');

// Create async thunks for authentication actions
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await apiRequest('POST', '/api/auth/register', userData);
      const data = await response.json();
      
      // Save token to localStorage
      localStorage.setItem('token', data.token);
      
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Registration failed');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await apiRequest('POST', '/api/auth/login', credentials);
      const data = await response.json();
      
      // Save token to localStorage
      localStorage.setItem('token', data.token);
      
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Login failed');
    }
  }
);

export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { rejectWithValue }) => {
    // If no token, don't make the request
    if (!localStorage.getItem('token')) {
      return rejectWithValue('No token');
    }
    
    try {
      const response = await apiRequest('GET', '/api/auth/user');
      const data = await response.json();
      return data;
    } catch (err) {
      // Remove token if it's invalid
      localStorage.removeItem('token');
      return rejectWithValue(err.message || 'Failed to load user');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await apiRequest('PUT', '/api/auth/user', profileData);
      const data = await response.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update profile');
    }
  }
);

const initialState = {
  token: token,
  isAuthenticated: !!token,
  user: null,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Load User
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        // Don't set error here because this might happen on initial load when user isn't logged in
      })
      
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...state.user, ...action.payload };
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { logout, clearError } = authSlice.actions;

export default authSlice.reducer;
