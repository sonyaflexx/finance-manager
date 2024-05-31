import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { instance } from '../../api/auth';

export const fetchTransactions = createAsyncThunk('transactions/fetchTransactions', async () => {
  const response = await instance.get('/api/transactions');
  return response.data;
});

export const addTransaction = createAsyncThunk('transactions/addTransaction', async (transaction) => {
  const response = await instance.post('/api/transactions', transaction);
  return response.data;
});

export const deleteTransaction = createAsyncThunk('transactions/deleteTransaction', async (transactionId) => {
  await instance.delete(`/api/transactions/${transactionId}`);
  return transactionId;
});

export const editTransaction = createAsyncThunk('transactions/editTransaction', async ({ id, updatedTransaction }) => {
  const response = await instance.put(`/api/transactions/${id}`, updatedTransaction);
  return response.data;
});

const initialState = {
  transactions: [
    // {
    //   type: 'expense',
    //   description: '22',
    //   amount: 22,
    //   category: 'Общее',
    //   datetime: '2024-06-01',
    // }
  ],
  loading: false,
  error: null,
};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.transactions.push(action.payload);
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.transactions = state.transactions.filter(
          (transaction) => transaction.id !== action.payload
        );
      })
      .addCase(editTransaction.fulfilled, (state, action) => {
        const index = state.transactions.findIndex((transaction) => transaction.id === action.payload.id);
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
      });
  },
});

export default transactionsSlice.reducer;