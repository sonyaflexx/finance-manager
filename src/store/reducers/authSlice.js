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

const initialState = {
  isAuthenticated: true,
  user: null,
  loginLoading: false,
  loginError: null,
  registerLoading: false,
  registerError: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
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
        state.user = action.payload.user;
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
        state.user = action.payload.user;
        localStorage.setItem('access_token', action.payload.access_token);
      })
      .addCase(register.rejected, (state, action) => {
        state.registerLoading = false;
        state.registerError = action.error.message;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;