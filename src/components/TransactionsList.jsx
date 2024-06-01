import React, { useState } from 'react';
import { TextField, IconButton, CircularProgress, MenuItem, Select, InputLabel, FormControl, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CategorySelect from './CategorySelect';
import { useDispatch } from 'react-redux';
import { deleteTransaction, editTransaction } from '../store/reducers/transactionsSlice';

function TransactionsList({ transactions, className, editable }) {
  const [editedTransaction, setEditedTransaction] = useState({});
  const [editingTransactionId, setEditingTransactionId] = useState(null);
  const { loading, error } = false
  const dispatch = useDispatch();

  const handleEditClick = (transaction) => {
    setEditedTransaction({ ...transaction });
    setEditingTransactionId(transaction.id);
  };

  const handleCancelEdit = () => {
    setEditedTransaction({});
    setEditingTransactionId(null);
  };

  const handleSaveEdit = () => {
    dispatch(editTransaction(editingTransactionId, editedTransaction))
    setEditedTransaction({});
    setEditingTransactionId(null);
  };

  const handleChange = (e) => {
    setEditedTransaction({ ...editedTransaction, [e.target.name]: e.target.value });
  };

  return (
    <ul className={`h-56 overflow-y-auto flex flex-col gap-1 max-sm:text-xs ${className}`}>
      { loading ? (
        <div className='mx-auto'>
          <CircularProgress size={24} />
        </div>
      ) : error ? (
        <div className='mx-auto'>Ошибка загрузки.</div>
      ) : transactions.length > 0 ? (
        transactions.map(transaction => (
          <>
          <li key={transaction.id} className={`w-full bg-white grid ${editable ? 'grid-cols-12' : 'grid-cols-6'} ${editingTransactionId === transaction.id && '!hidden'} px-4 py-2 border rounded-xl items-center`}>
            <div className={`${editable ? 'col-span-2' : 'col-span-1'} font-medium overflow-x-hidden text-ellipsis`}>{transaction.category}</div>
            <div className={`${editable ? 'col-span-5' : 'col-span-2'} pl-2 overflow-x-hidden text-ellipsis`}>{transaction.description}</div>
            <div className={`col-span-2 text-end`}>{new Date(transaction.datetime).toLocaleString()}</div>
            <div className={`${editable ? 'col-span-2' : 'col-span-1'} font-medium text-end pr-2 ${transaction.type === 'expense' ? 'text-red-500' : 'text-green-500'}`}>
              {transaction.type === 'expense' ? '-' : '+'}{transaction.amount} ₽
            </div>
            { editable && (              
              <div className='col-span-1 flex flex-wrap justify-end'>
                <div className=''>
                  <IconButton aria-label="edit" onClick={() => handleEditClick(transaction)}>
                    <EditIcon />
                  </IconButton>
                </div>
                <div className=''>
                  <IconButton aria-label="delete" color='error' onClick={() => dispatch(deleteTransaction(transaction.id))}>
                    <DeleteIcon />
                  </IconButton>
                </div>
              </div>
            )}
          </li>
          { editingTransactionId === transaction.id && (
            <div className="grid grid-cols-12 gap-1 px-4 py-2 border rounded-xl items-center">
              <div className='col-span-2'>
                <CategorySelect
                  value={editedTransaction.category}
                  onChange={handleChange}
                />
              </div>
              <TextField
                label="Описание операции"
                variant="outlined"
                name="description"
                value={editedTransaction.description}
                onChange={handleChange}
                className='bg-white col-span-5'
              />
              <TextField
                label="Дата и время"
                variant="outlined"
                type="datetime-local"
                name="datetime"
                value={editedTransaction.datetime}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                className='bg-white col-span-2'
              />
              <FormControl variant="outlined" className='col-span-1'>
                <InputLabel id="transaction-type-label">Тип операции</InputLabel>
                <Select
                  labelId="transaction-type-label"
                  label="Тип операции"
                  name="type"
                  value={editedTransaction.type}
                  onChange={handleChange}
                  className='bg-white'
                >
                  <MenuItem value="income">+</MenuItem>
                  <MenuItem value="expense">-</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Кол-во денег, ₽"
                variant="outlined"
                type="number"
                name="amount"
                error={error}
                required
                value={editedTransaction.amount}
                onChange={handleChange}
                className='bg-white'
              />
              <div className='col-span-1 flex flex-wrap items-center justify-between max-h-full'>
                <Button variant="contained" color="primary" onClick={handleSaveEdit} className='text-center flex-1 h-7'>V</Button>
                <Button variant="contained" color="secondary" onClick={handleCancelEdit} className='text-center flex-1 h-7'>X</Button>
              </div>
            </div>
          )}
          </>
        ))
        ) : (
          <div className='mx-auto'>Операций не найдено.</div>
      )}
    </ul>
  );
}

export default TransactionsList;
