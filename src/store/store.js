import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authSlice'
import transactionsReducer from './reducers/transactionsSlice';
import budgetReducer from './reducers/budgetSlice';
import categoriesReducer from './reducers/categoriesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    transactions: transactionsReducer,
    budget: budgetReducer,
    categories: categoriesReducer
  },
});