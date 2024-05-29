import React, { useState } from 'react';
import { TextField, Button, Container, Select, MenuItem, InputLabel, FormControl, Box } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { addCategory } from '../store/reducers/categoriesSlice';
import { addTransaction } from '../store/reducers/transactionsSlice';

function TransactionsForm() {
  const categories = useSelector((state) => state.categories);
  const dispatch = useDispatch();

  const [newCategory, setNewCategory] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);

  const [transaction, setTransaction] = useState({
    type: 'income',
    description: '',
    amount: '',
    category: '',
    datetime: '',
  });
  
  const handleChange = (e) => {
    setTransaction({ ...transaction, [e.target.name]: e.target.value });
  };
  
  const handleAddCategory = () => {
    if (newCategory.trim() !== '') {
      dispatch(addCategory(newCategory.trim()));
      setNewCategory('');
      setTransaction({ ...transaction, category: newCategory.trim() });
      setAddingCategory(!addingCategory);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addTransaction(transaction));
  };
  
  const toggleAddCategory = () => {
    setAddingCategory(!addingCategory);
    setNewCategory('');
  };

  return (
    <Container>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <FormControl variant="outlined" fullWidth>
          <InputLabel id="transaction-type-label">Тип операции</InputLabel>
          <Select
            labelId="transaction-type-label"
            label="Тип операции"
            name="type"
            value={transaction.type}
            onChange={handleChange}
          >
            <MenuItem value="income">Доходы</MenuItem>
            <MenuItem value="expense">Расходы</MenuItem>
          </Select>
        </FormControl>
        
        {addingCategory ? (
          <Box className="flex space-x-4">
            <TextField
              label="Новая категория"
              variant="outlined"
              name="newCategory"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              fullWidth
            />
            <Button onClick={handleAddCategory} variant="contained" color="primary">
              Добавить
            </Button>
            <Button onClick={toggleAddCategory} variant="contained" color="secondary">
              Отмена
            </Button>
          </Box>
        ) : (
          <FormControl variant="outlined" fullWidth>
            <InputLabel id="transaction-category-label">Категория</InputLabel>
            <Select
              labelId="transaction-category-label"
              label="Категория"
              name="category"
              value={transaction.category}
              onChange={handleChange}
            >
              {categories.map((category, index) => (
                <MenuItem key={index} value={category}>{category}</MenuItem>
              ))}
              <MenuItem value="" onClick={toggleAddCategory}>
                + Добавить категорию
              </MenuItem>
            </Select>
          </FormControl>
        )}

        <TextField
          label="Описание операции"
          variant="outlined"
          name="description"
          value={transaction.description}
          onChange={handleChange}
        />
        <TextField
          label="Кол-во денег, ₽"
          variant="outlined"
          type="number"
          name="amount"
          value={transaction.amount}
          onChange={handleChange}
        />
        <TextField
          label="Дата и время"
          variant="outlined"
          type="datetime-local"
          name="datetime"
          value={transaction.datetime}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Button type="submit" variant="contained" color="primary">
          Добавить операцию
        </Button>
      </form>
    </Container>
  );
}

export default TransactionsForm;