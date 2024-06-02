import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { instance } from '../../api/auth';

export const login = createAsyncThunk('auth/login', async ({ email, password }) => {
  const response = await instance.post('/api/auth/login', { email, password });
  return response.data;
});

export const register = createAsyncThunk('auth/register', async ({ email, password }) => {
  const response = await instance.post('/api/auth/register', { email, password });
  return response.data;
});

export const fetchCurrentToken = createAsyncThunk('auth/fetchCurrentToken', async () => {
  const response = await instance.get('/api/auth/current', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`
    }
  });
  return response.data;
});

const initialState = {
  isAuthenticated: false,
  token: null,
  loginLoading: false,
  loginError: null,
  registerLoading: false,
  registerError: null,
  loadingCurrentToken: false,
  currentTokenError: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.isAuthenticated = false;
      state.token = null;
      localStorage.removeItem('access_token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loginLoading = true;
        state.loginError = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loginLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.access_token;
        localStorage.setItem('access_token', action.payload.access_token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loginLoading = false;
        state.loginError = action.error.message;
      })
      .addCase(register.pending, (state) => {
        state.registerLoading = true;
        state.registerError = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.registerLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.access_token;
        localStorage.setItem('access_token', action.payload.access_token);
      })
      .addCase(register.rejected, (state, action) => {
        state.registerLoading = false;
        state.registerError = action.error.message;
      })
      .addCase(fetchCurrentToken.pending, (state) => {
        state.loadingCurrentToken = true;
        state.currentTokenError = null;
      })
      .addCase(fetchCurrentToken.fulfilled, (state, action) => {
        state.loadingCurrentToken = false;
        state.isAuthenticated = true;
        state.token = action.payload.access_token;
      })
      .addCase(fetchCurrentToken.rejected, (state, action) => {
        state.loadingCurrentToken = false;
        state.currentTokenError = action.error.message;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;