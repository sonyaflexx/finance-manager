import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Button, Container, Select, MenuItem, InputLabel, FormControl, Box } from '@mui/material';
import { addBudget } from '../store/reducers/budgetSlice';
import BudgetList from '../components/BudgetList';
import { addCategory } from '../store/reducers/categoriesSlice';

const Budget = () => {
  const categories = useSelector((state) => state.categories);
  const dispatch = useDispatch();
  const plans = useSelector((state) => state.budget.plans);

  const [newCategory, setNewCategory] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);
  const [error, setError] = useState('')


  const [budget, setBudget] = useState({
    category_id: categories.length > 0 ? categories[0].id : '',
    period: 'month',
    goal: ''
  });

  const handleChange = (e) => {
    setBudget({ ...budget, [e.target.name]: e.target.value });
  };

  const handleAddCategory = () => {
    if (newCategory.trim() !== '') {
      dispatch(addCategory(newCategory.trim()));
      setNewCategory('');
      setBudget({ ...budget, category_id: newCategory.trim() });
      setAddingCategory(!addingCategory);
    }
  };
  
  const toggleAddCategory = () => {
    setAddingCategory(!addingCategory);
    setNewCategory('');
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (budget.goal && budget.goal > 0) {
      dispatch(addBudget({ ...budget, goal: Number(budget.goal)}));
    } else {
      setError('Некорректная сумма!');
    }
  };

  return (
    <Container className="py-16">
      <h1 className='text-3xl font-bold mx-auto text-center mb-10'>Установить бюджет</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        {addingCategory ? (
          <Box className="flex space-x-4">
            <TextField
              label="Новая категория"
              variant="outlined"
              name="newCategory"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              fullWidth
              className='bg-white'
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
            <InputLabel id="budget-category-label">Категория</InputLabel>
            <Select
              labelId="budget-category-label"
              label="Категория"
              name="category_id"
              value={budget.category_id}
              onChange={handleChange}
              className='bg-white'
              required
            >
              {categories.map((category, index) => (
                <MenuItem key={index} value={category.id}>{category.title}</MenuItem>
              ))}
              <MenuItem value="" onClick={toggleAddCategory}>
                + Добавить категорию
              </MenuItem>
            </Select>
          </FormControl>
        )}

        <FormControl variant="outlined" fullWidth>
          <InputLabel id="budget-period-label">Период</InputLabel>
          <Select
            labelId="budget-period-label"
            label="Период"
            name="period"
            value={budget.period}
            onChange={handleChange}
            className='bg-white'
          >
            <MenuItem value="day">День</MenuItem>
            <MenuItem value="month">Месяц</MenuItem>
            <MenuItem value="year">Год</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Кол-во денег, ₽"
          variant="outlined"
          type="number"
          name="goal"
          value={budget.goal}
          onChange={handleChange}
          error={error}
          required
          className='bg-white'
        />
        <Button type="submit" variant="contained" color="primary" className='!py-3 !rounded-xl !font-semibold'>
          Установить бюджет
        </Button>
      </form>

      <BudgetList plans={plans} deletable={true} />
    </Container>
  );

};

export default Budget;
