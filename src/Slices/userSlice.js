import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';

const BASE_URL = API_BASE_URL; 
const USERS_URL = `${BASE_URL}/users`;

export const fetchUsers = createAsyncThunk('users/fetchAll', async (_, thunkAPI) => {
  try {
    const res = await axios.get(USERS_URL);
    return res.data;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data || e.message);
  }
});

export const fetchUserBySupabaseId = createAsyncThunk('users/fetchBySupabase', async (supabaseId, thunkAPI) => {
  try {
    const res = await axios.get(`${USERS_URL}/supabase/${supabaseId}`);
    return res.data;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data || e.message);
  }
});

export const createUser = createAsyncThunk('users/create', async (payload, thunkAPI) => {
  try {
    const res = await axios.post(USERS_URL, payload);
    return res.data;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data || e.message);
  }
});

export const updateUser = createAsyncThunk('users/update', async ({ id, data }, thunkAPI) => {
  try {
    const res = await axios.put(`${USERS_URL}/${id}`, data);
    return res.data;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data || e.message);
  }
});

export const deleteUser = createAsyncThunk('users/delete', async (id, thunkAPI) => {
  try {
    await axios.delete(`${USERS_URL}/${id}`);
    return id;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data || e.message);
  }
});

const slice = createSlice({
  name: 'users',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchUsers.pending, state => { state.loading = true; state.error = null; })
      .addCase(fetchUsers.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchUsers.rejected, (state, action) => { state.loading = false; state.error = action.payload || action.error?.message; })

      .addCase(fetchUserBySupabaseId.pending, state => { state.loading = true; state.error = null; })
      .addCase(fetchUserBySupabaseId.fulfilled, (state, action) => { state.loading = false; state.items = action.payload ? [action.payload] : []; })
      .addCase(fetchUserBySupabaseId.rejected, (state, action) => { state.loading = false; state.error = action.payload || action.error?.message; })

      .addCase(createUser.pending, state => { state.loading = true; state.error = null; })
      .addCase(createUser.fulfilled, (state, action) => { state.loading = false; state.items.push(action.payload); })
      .addCase(createUser.rejected, (state, action) => { state.loading = false; state.error = action.payload || action.error?.message; })

      .addCase(updateUser.pending, state => { state.loading = true; state.error = null; })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.items.findIndex(i => i._id === action.payload._id || i.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => { state.loading = false; state.error = action.payload || action.error?.message; })

      .addCase(deleteUser.pending, state => { state.loading = true; state.error = null; })
      .addCase(deleteUser.fulfilled, (state, action) => { state.loading = false; state.items = state.items.filter(i => i._id !== action.payload && i.id !== action.payload); })
      .addCase(deleteUser.rejected, (state, action) => { state.loading = false; state.error = action.payload || action.error?.message; });
  },
});

export default slice.reducer;
