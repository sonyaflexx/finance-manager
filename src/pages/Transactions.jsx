import React from 'react';
import TransactionsForm from '../components/TransactionsForm';
import TransactionsList from '../components/TransactionsList';
import { useSelector } from 'react-redux';

function Transactions() {
  const transactions = useSelector((state) => state.transactions.transactions)

  return (
    <div className='flex flex-col items-center py-16 gap-10'>
      <h1 className='font-bold text-3xl'>Учёт операций</h1>
      <TransactionsForm />
      <TransactionsList transactions={transactions} deletable={true} className='w-full max-w-[1200px] px-6 h-auto max-h-72' />
    </div>
  );
}

export default Transactions;