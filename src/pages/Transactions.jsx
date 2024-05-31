import React, { useEffect } from 'react';
import TransactionsForm from '../components/TransactionsForm';
import TransactionsList from '../components/TransactionsList';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions } from '../store/reducers/transactionsSlice';

function Transactions() {
  const dispatch = useDispatch();
  const transactions = useSelector((state) => state.transactions.transactions);

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  return (
    <div className='flex flex-col items-center py-16 gap-10'>
      <h1 className='font-bold text-3xl'>Учёт операций</h1>
      <TransactionsForm />
      <div className='w-full max-w-[1150px] p-6 rounded-2xl h-auto max-h-92 bg-white'>
        <h2 className='text-xl font-bold mb-3'>История операций</h2>
        <TransactionsList transactions={transactions} editable={true} className='h-72 pb-1' />
      </div>
    </div>
  );
}

export default Transactions;
