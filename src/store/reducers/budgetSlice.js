import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  plans: [],
};

const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    addBudget: (state, action) => {
      state.plans.push(action.payload);
    },
  },
});

export const { addBudget } = budgetSlice.actions;
export default budgetSlice.reducer;
