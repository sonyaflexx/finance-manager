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
    {
      id: 1,
      category: 'Общее',
      goal: 1000,
      period: 'month'
    },
    {
      id: 2,
      category: 'Еда',
      goal: 150000,
      period: 'year'
    },
    {
      id: 3,
      category: 'Развлечения',
      goal: 500,
      period: 'day'
    },
    {
      id: 4,
      category: 'Еда',
      goal: 1000,
      period: 'day'
    },
    {
      id: 5,
      category: 'Общее',
      goal: 500,
      period: 'day'
    },
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