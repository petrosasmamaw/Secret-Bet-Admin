import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';

const BASE_URL = API_BASE_URL; 
const DEPOSITS_URL = `${BASE_URL}/deposits`;

export const fetchDeposits = createAsyncThunk('deposits/fetchAll', async (_, thunkAPI) => {
  try {
    const res = await axios.get(DEPOSITS_URL);
    return res.data;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data || e.message);
  }
});

export const fetchDepositsBySupabaseId = createAsyncThunk('deposits/fetchBySupabase', async (supabaseId, thunkAPI) => {
  try {
    const res = await axios.get(`${DEPOSITS_URL}/supabase/${supabaseId}`);
    return res.data;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data || e.message);
  }
});

export const createDeposit = createAsyncThunk('deposits/create', async (payload, thunkAPI) => {
  try {
    const res = await axios.post(DEPOSITS_URL, payload);
    return res.data;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data || e.message);
  }
});

export const updateDeposit = createAsyncThunk('deposits/update', async ({ id, data }, thunkAPI) => {
  try {
    const res = await axios.put(`${DEPOSITS_URL}/${id}`, data);
    return res.data;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data || e.message);
  }
});

export const deleteDeposit = createAsyncThunk('deposits/delete', async (id, thunkAPI) => {
  try {
    await axios.delete(`${DEPOSITS_URL}/${id}`);
    return id;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data || e.message);
  }
});

const slice = createSlice({
  name: 'deposits',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchDeposits.pending, state => { state.loading = true; state.error = null; })
      .addCase(fetchDeposits.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchDeposits.rejected, (state, action) => { state.loading = false; state.error = action.payload || action.error?.message; })

      .addCase(fetchDepositsBySupabaseId.pending, state => { state.loading = true; state.error = null; })
      .addCase(fetchDepositsBySupabaseId.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchDepositsBySupabaseId.rejected, (state, action) => { state.loading = false; state.error = action.payload || action.error?.message; })

      .addCase(createDeposit.pending, state => { state.loading = true; state.error = null; })
      .addCase(createDeposit.fulfilled, (state, action) => { state.loading = false; state.items.push(action.payload); })
      .addCase(createDeposit.rejected, (state, action) => { state.loading = false; state.error = action.payload || action.error?.message; })

      .addCase(updateDeposit.pending, state => { state.loading = true; state.error = null; })
      .addCase(updateDeposit.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.items.findIndex(i => i._id === action.payload._id || i.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateDeposit.rejected, (state, action) => { state.loading = false; state.error = action.payload || action.error?.message; })

      .addCase(deleteDeposit.pending, state => { state.loading = true; state.error = null; })
      .addCase(deleteDeposit.fulfilled, (state, action) => { state.loading = false; state.items = state.items.filter(i => i._id !== action.payload && i.id !== action.payload); })
      .addCase(deleteDeposit.rejected, (state, action) => { state.loading = false; state.error = action.payload || action.error?.message; });
  },
});

export default slice.reducer;
