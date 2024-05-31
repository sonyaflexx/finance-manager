import React, { useState } from 'react';
import { MenuItem, FormControl, InputLabel, Select, Button, Box, TextField } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { addCategory } from '../store/reducers/categoriesSlice';

function CategorySelect({ value, onChange, className }) {
  const categories = useSelector((state) => state.categories);
  const dispatch = useDispatch();

  const [newCategory, setNewCategory] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);

  const toggleAddCategory = () => {
    setAddingCategory(!addingCategory);
    setNewCategory('');
  };

  const handleAddCategory = () => {
    if (newCategory.trim() !== '') {
      dispatch(addCategory(newCategory.trim()));
      onChange({ target: { name: 'category', value: newCategory } });
      setNewCategory('');
      setAddingCategory(false);
    }
  };
  

  return (
    <FormControl variant="outlined" fullWidth className={className}>
      <InputLabel id="transaction-category-label" className={`${addingCategory ? '!hidden' : ''}`}>Категория</InputLabel>
      <Select
        labelId="transaction-category-label"
        label="Категория"
        name="category"
        value={value}
        onChange={onChange}
        className={`${addingCategory ? '!hidden' : 'bg-white'}`}
      >
        {categories.map((category, index) => (
          <MenuItem key={index} value={category}>{category}</MenuItem>
        ))}
        <MenuItem value="" onClick={toggleAddCategory}>
          + Добавить категорию
        </MenuItem>
      </Select>
      {addingCategory && (
        <Box className="flex space-x-4 mt-2">
          <TextField
            label="Новая категория"
            variant="outlined"
            name="newCategory"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className='bg-white'
            fullWidth
          />
          <Button onClick={handleAddCategory} variant="contained" color="primary">
            Добавить
          </Button>
          <Button onClick={toggleAddCategory} variant="contained" color="secondary">
            Отмена
          </Button>
        </Box>
      )}
    </FormControl>
  );
}

export default CategorySelect;
