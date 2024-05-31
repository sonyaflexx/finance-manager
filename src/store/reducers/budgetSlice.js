import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { instance } from '../../api/auth';

export const fetchBudgets = createAsyncThunk('budget/fetchBudgets', async () => {
  const response = await instance.get('/api/budgets');
  return response.data;
});

export const addBudget = createAsyncThunk('budget/addBudget', async (budget) => {
  const response = await instance.post('/api/budgets', budget);
  return response.data;
});

export const deleteBudget = createAsyncThunk('budget/deleteBudget', async (budgetId) => {
  await instance.delete(`/api/budgets/${budgetId}`);
  return budgetId;
});

export const editBudget = createAsyncThunk('budget/editBudget', async ({ id, updatedBudget }) => {
  const response = await instance.put(`/api/budgets/${id}`, updatedBudget);
  return response.data;
});

const initialState = {
  plans: [
    // {
    //   id: 1,
    //   category: 'Общее',
    //   goal: 10,
    //   period: 'month'
    // }
  ],
  loading: false,
  error: null,
};

const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBudgets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBudgets.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload;
      })
      .addCase(fetchBudgets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addBudget.fulfilled, (state, action) => {
        state.plans.push(action.payload);
      })
      .addCase(deleteBudget.fulfilled, (state, action) => {
        state.plans = state.plans.filter(
          (budget) => budget.id !== action.payload
        );
      })
      .addCase(editBudget.fulfilled, (state, action) => {
        const index = state.plans.findIndex((budget) => budget.id === action.payload.id);
        if (index !== -1) {
          state.plans[index] = action.payload;
        }
      });
  },
});

export default budgetSlice.reducer;