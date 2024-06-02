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

export const editTransaction = createAsyncThunk(`transactions/editTransaction`, async ({ editingTransactionId, editedTransaction }) => {
  const response = await instance.put(`/api/transactions/${editingTransactionId}`, editedTransaction);
  return response.data;
});

const initialState = {
  transactions: [],
  loading: false,
  error: null,
};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    transactionUpdated: (state, action) => {
      const { id, updatedTransaction } = action.payload;
      const index = state.transactions.findIndex(transaction => transaction.id === id);
      if (index !== -1) {
        state.transactions[index] = { ...state.transactions[index], ...updatedTransaction };
      }
    },
  },
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
export const { transactionUpdated } = transactionsSlice.actions;
export default transactionsSlice.reducer;