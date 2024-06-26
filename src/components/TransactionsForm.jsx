import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Modal, Typography, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addTransaction } from '../store/reducers/transactionsSlice';
import CategorySelect from './CategorySelect';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 500,
  bgcolor: 'background.paper',  
  boxShadow: 24,
  p: 4,
};

function TransactionsForm() {
  const dispatch = useDispatch();
  const budgets = useSelector((state) => state.budget.plans);
  const transactions = useSelector((state) => state.transactions.transactions);
  const categories = useSelector((state) => state.categories);

  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingTransaction, setPendingTransaction] = useState(null);

  const now = new Date();

  const [transaction, setTransaction] = useState({
    type: 'expense',
    description: '',
    amount: '',
    category_id: categories.length > 0 ? categories[0].id : '',
    date: now,
  });

  useEffect(() => {
    if (categories.length > 0) {
      setTransaction((prev) => ({
        ...prev,
        category_id: categories[0].id,
      }));
    }
  }, [categories]);

  const handleChange = (e) => {
    setTransaction({ ...transaction, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (e) => {
    setTransaction({ ...transaction, category_id: e.target.value });
  };

  const handleConfirm = () => {
    dispatch(addTransaction(pendingTransaction));
    setModalOpen(false);
    setPendingTransaction(null);
  };

  const handleCancel = () => {
    setModalOpen(false);
    setPendingTransaction(null);
  };

  const checkBudget = () => {
    const budget = budgets.find(b => b.category_id === transaction.category_id);
    if (!budget) return true;
    
    const transactionsInCategory = transactions.filter(t => t.category_id === transaction.category_id);
    const totalAmount = transactionsInCategory.reduce((sum, t) => sum + (t.type === 'expense' ? Number(t.amount) : 0), 0);
    return totalAmount + Number(transaction.amount) <= budget.goal;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedTransaction = { ...transaction, amount: Number(transaction.amount)};
    
    if (transaction.amount && transaction.amount > 0) {
      if (!transaction.description) {
        updatedTransaction.description = 'Обычная операция.';
      }
      
      if (checkBudget()) {
        dispatch(addTransaction(updatedTransaction));
        console.log(updatedTransaction)
      } else {
        setPendingTransaction(updatedTransaction);
        setModalOpen(true);
      }
    } else {
      setError('Некорректная сумма!');
    }
  };

  return (
    <Container>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <FormControl variant="outlined" fullWidth className='bg-white'>
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
        <CategorySelect value={transaction.category_id} onChange={handleCategoryChange} />
        <TextField
          label="Описание операции"
          variant="outlined"
          name="description"
          value={transaction.description}
          onChange={handleChange}
          className="bg-white"
        />
        <TextField
          label="Кол-во денег, ₽"
          variant="outlined"
          type="number"
          name="amount"
          error={!!error}
          required
          value={transaction.amount}
          onChange={handleChange}
          className="bg-white"
        />
        <TextField
          label="Дата и время"
          variant="outlined"
          type="datetime-local"
          name="date"
          value={transaction.date}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
          className="bg-white"
        />
        <Button type="submit" variant="contained" color="primary" className='!py-3 !rounded-lg !font-semibold'>
          Добавить операцию
        </Button>
      </form>

      <Modal open={modalOpen} onClose={handleCancel}>
        <Box sx={style} className={'rounded-3xl'}>
          <Typography variant="h6" component="h2" className='!font-semibold !text-2xl'>
            Превышение бюджета
          </Typography>
          <Typography sx={{ mt: 2, mb: 4 }}>
            Добавление этой транзакции приведет к превышению бюджета. Вы уверены, что хотите продолжить?
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', gap: 1 }}>
            <Button onClick={handleConfirm} variant="contained" color="primary" className='!py-3 !rounded-xl !font-semibold'>
              Подтвердить
            </Button>
            <Button onClick={handleCancel} variant="contained" color="secondary" className='!py-3 !rounded-xl !font-semibold'>
              Отмена
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
}

export default TransactionsForm;