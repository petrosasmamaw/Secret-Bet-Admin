import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';

const BASE_URL = API_BASE_URL; 
const WITHDRAWALS_URL = `${BASE_URL}/withdrawals`;

export const fetchWithdrawals = createAsyncThunk('withdrawals/fetchAll', async (_, thunkAPI) => {
  try {
    const res = await axios.get(WITHDRAWALS_URL);
    return res.data;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data || e.message);
  }
});

export const fetchWithdrawalsBySupabaseId = createAsyncThunk('withdrawals/fetchBySupabase', async (supabaseId, thunkAPI) => {
  try {
    const res = await axios.get(`${WITHDRAWALS_URL}/supabase/${supabaseId}`);
    return res.data;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data || e.message);
  }
});

export const createWithdrawal = createAsyncThunk('withdrawals/create', async (payload, thunkAPI) => {
  try {
    const res = await axios.post(WITHDRAWALS_URL, payload);
    return res.data;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data || e.message);
  }
});

export const updateWithdrawal = createAsyncThunk('withdrawals/update', async ({ id, data }, thunkAPI) => {
  try {
    const res = await axios.put(`${WITHDRAWALS_URL}/${id}`, data);
    return res.data;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data || e.message);
  }
});

export const deleteWithdrawal = createAsyncThunk('withdrawals/delete', async (id, thunkAPI) => {
  try {
    await axios.delete(`${WITHDRAWALS_URL}/${id}`);
    return id;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data || e.message);
  }
});

const slice = createSlice({
  name: 'withdrawals',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchWithdrawals.pending, state => { state.loading = true; state.error = null; })
      .addCase(fetchWithdrawals.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchWithdrawals.rejected, (state, action) => { state.loading = false; state.error = action.payload || action.error?.message; })

      .addCase(fetchWithdrawalsBySupabaseId.pending, state => { state.loading = true; state.error = null; })
      .addCase(fetchWithdrawalsBySupabaseId.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchWithdrawalsBySupabaseId.rejected, (state, action) => { state.loading = false; state.error = action.payload || action.error?.message; })

      .addCase(createWithdrawal.pending, state => { state.loading = true; state.error = null; })
      .addCase(createWithdrawal.fulfilled, (state, action) => { state.loading = false; state.items.push(action.payload); })
      .addCase(createWithdrawal.rejected, (state, action) => { state.loading = false; state.error = action.payload || action.error?.message; })

      .addCase(updateWithdrawal.pending, state => { state.loading = true; state.error = null; })
      .addCase(updateWithdrawal.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.items.findIndex(i => i._id === action.payload._id || i.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateWithdrawal.rejected, (state, action) => { state.loading = false; state.error = action.payload || action.error?.message; })

      .addCase(deleteWithdrawal.pending, state => { state.loading = true; state.error = null; })
      .addCase(deleteWithdrawal.fulfilled, (state, action) => { state.loading = false; state.items = state.items.filter(i => i._id !== action.payload && i.id !== action.payload); })
      .addCase(deleteWithdrawal.rejected, (state, action) => { state.loading = false; state.error = action.payload || action.error?.message; });
  },
});

export default slice.reducer;
