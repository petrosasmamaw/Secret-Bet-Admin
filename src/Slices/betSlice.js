import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';

const BASE_URL = API_BASE_URL; 
const BETS_URL = `${BASE_URL}/bets`;

export const fetchBets = createAsyncThunk('bets/fetchAll', async (_, thunkAPI) => {
  try {
    const res = await axios.get(BETS_URL);
    return res.data;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data || e.message);
  }
});

export const fetchBetsBySupabaseId = createAsyncThunk('bets/fetchBySupabase', async (supabaseId, thunkAPI) => {
  try {
    const res = await axios.get(`${BETS_URL}/supabase/${supabaseId}`);
    return res.data;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data || e.message);
  }
});

export const createBet = createAsyncThunk('bets/create', async (payload, thunkAPI) => {
  try {
    const res = await axios.post(BETS_URL, payload);
    return res.data;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data || e.message);
  }
});

export const updateBet = createAsyncThunk('bets/update', async ({ id, data }, thunkAPI) => {
  try {
    const res = await axios.put(`${BETS_URL}/${id}`, data);
    return res.data;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data || e.message);
  }
});

export const deleteBet = createAsyncThunk('bets/delete', async (id, thunkAPI) => {
  try {
    await axios.delete(`${BETS_URL}/${id}`);
    return id;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data || e.message);
  }
});

const slice = createSlice({
  name: 'bets',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchBets.pending, state => { state.loading = true; state.error = null; })
      .addCase(fetchBets.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchBets.rejected, (state, action) => { state.loading = false; state.error = action.payload || action.error?.message; })

      .addCase(fetchBetsBySupabaseId.pending, state => { state.loading = true; state.error = null; })
      .addCase(fetchBetsBySupabaseId.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchBetsBySupabaseId.rejected, (state, action) => { state.loading = false; state.error = action.payload || action.error?.message; })

      .addCase(createBet.pending, state => { state.loading = true; state.error = null; })
      .addCase(createBet.fulfilled, (state, action) => { state.loading = false; state.items.push(action.payload); })
      .addCase(createBet.rejected, (state, action) => { state.loading = false; state.error = action.payload || action.error?.message; })

      .addCase(updateBet.pending, state => { state.loading = true; state.error = null; })
      .addCase(updateBet.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.items.findIndex(i => i._id === action.payload._id || i.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateBet.rejected, (state, action) => { state.loading = false; state.error = action.payload || action.error?.message; })

      .addCase(deleteBet.pending, state => { state.loading = true; state.error = null; })
      .addCase(deleteBet.fulfilled, (state, action) => { state.loading = false; state.items = state.items.filter(i => i._id !== action.payload && i.id !== action.payload); })
      .addCase(deleteBet.rejected, (state, action) => { state.loading = false; state.error = action.payload || action.error?.message; });
  },
});

export default slice.reducer;
