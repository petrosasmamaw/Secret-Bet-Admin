import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';

const BASE_URL = API_BASE_URL; 
const AUTH_URL = `${BASE_URL}/auth`;

export const register = createAsyncThunk('auth/register', async (payload, thunkAPI) => {
  try {
    const res = await axios.post(`${AUTH_URL}/register`, payload);
    return res.data;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data || e.message);
  }
});

export const login = createAsyncThunk('auth/login', async (payload, thunkAPI) => {
  try {
    const res = await axios.post(`${AUTH_URL}/login`, payload);
    return res.data;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data || e.message);
  }
});

export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    const res = await axios.post(`${AUTH_URL}/logout`);
    return res.data;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data || e.message);
  }
});

export const getSession = createAsyncThunk('auth/session', async (_, thunkAPI) => {
  try {
    const res = await axios.get(`${AUTH_URL}/session`);
    return res.data;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data || e.message);
  }
});

export const forgotPassword = createAsyncThunk('auth/forgotPassword', async (payload, thunkAPI) => {
  try {
    const res = await axios.post(`${AUTH_URL}/forgot-password`, payload);
    return res.data;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data || e.message);
  }
});

const slice = createSlice({
  name: 'auth',
  initialState: { user: null, loading: false, error: null, message: null },
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(register.pending, state => { state.loading = true; state.error = null; })
      .addCase(register.fulfilled, (state, action) => { state.loading = false; state.message = action.payload.message; })
      .addCase(register.rejected, (state, action) => { state.loading = false; state.error = action.payload || action.error?.message; })

      .addCase(login.pending, state => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => { state.loading = false; state.user = action.payload.user; })
      .addCase(login.rejected, (state, action) => { state.loading = false; state.error = action.payload || action.error?.message; })

      .addCase(logout.pending, state => { state.loading = true; state.error = null; })
      .addCase(logout.fulfilled, state => { state.loading = false; state.user = null; state.message = null; })
      .addCase(logout.rejected, (state, action) => { state.loading = false; state.error = action.payload || action.error?.message; })

      .addCase(getSession.pending, state => { state.loading = true; state.error = null; })
      .addCase(getSession.fulfilled, (state, action) => { state.loading = false; state.user = action.payload.user; })
      .addCase(getSession.rejected, (state, action) => { state.loading = false; state.user = null; state.error = action.payload || action.error?.message; })

      .addCase(forgotPassword.pending, state => { state.loading = true; state.error = null; })
      .addCase(forgotPassword.fulfilled, (state, action) => { state.loading = false; state.message = action.payload.message; })
      .addCase(forgotPassword.rejected, (state, action) => { state.loading = false; state.error = action.payload || action.error?.message; });
  },
});

export const { clearAuthError } = slice.actions;
export default slice.reducer;
