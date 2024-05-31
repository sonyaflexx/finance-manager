import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { instance } from '../../api/auth';

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get('/api/categories');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addCategory = createAsyncThunk(
  'categories/addCategory',
  async (category, { rejectWithValue }) => {
    try {
      const response = await instance.post('/api/categories', category);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const editCategory = createAsyncThunk(
  'categories/editCategory',
  async ({ id, updatedCategory }, { rejectWithValue }) => {
    try {
      const response = await instance.put(`/api/categories/${id}`, updatedCategory);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id, { rejectWithValue }) => {
    try {
      await instance.delete(`/api/categories/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: ['Еда', 'Пиво', 'Мсяо'],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.fulfilled, (state, action) => {
        return action.payload;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.push(action.payload);
      })
      .addCase(editCategory.fulfilled, (state, action) => {
        const index = state.findIndex((category) => category.id === action.payload.id);
        if (index !== -1) {
          state[index] = action.payload;
        }
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        return state.filter((category) => category.id !== action.payload);
      });
  },
});

export default categoriesSlice.reducer;
