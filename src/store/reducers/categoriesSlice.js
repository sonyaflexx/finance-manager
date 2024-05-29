import { createSlice } from '@reduxjs/toolkit';

const initialState = ['Общее', 'Еда', 'Жилье', 'Одежда'];

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    addCategory(state, action) {
      state.push(action.payload);
    },
  },
});

export const { addCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;
