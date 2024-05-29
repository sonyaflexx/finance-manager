import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import React from 'react';

function TransactionsList({ transactions, className, deletable }) {
  return (
    <ul className={`h-56 overflow-y-auto flex flex-col gap-1 ${className}`}>
      { transactions && transactions.length > 0 ? (
      transactions.map(transaction => (
        <li key={transaction.id} className={`w-full grid ${deletable ? 'grid-cols-12' : 'grid-cols-6'} px-4 py-2 border rounded-xl items-center`}>
          <div className={`${deletable ? 'col-span-2' : 'col-span-1'} font-medium`}>{transaction.category}</div>
          <div className={`${deletable ? 'col-span-5' : 'col-span-2'}`}>{transaction.description}</div>
          <div className={`col-span-2 text-end`}>{new Date(transaction.datetime).toLocaleString()}</div>
          <div className={`${deletable ? 'col-span-2' : 'col-span-1'} font-medium text-end ${transaction.type === 'expense' ? 'text-red-500' : 'text-green-500'}`}>
            {transaction.type === 'expense' ? '-' : '+'}{transaction.amount} ₽
          </div>
          { deletable && <div className='col-span-1 justify-self-end'>
          <IconButton aria-label="delete" color='error'>
            <DeleteIcon />
          </IconButton>
          </div> }
        </li>
      ))) : (
        <div className='mx-auto'>Операций не найдено.</div>
      )}
    </ul>
  );
}

export default TransactionsList;