import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import TransactionsList from '../components/TransactionsList';
import BudgetList from '../components/BudgetList';

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('allTime');
  const transactions = useSelector((state) => state.transactions.transactions);
  const plans = useSelector((state) => state.budget.plans);
  const dispatch = useDispatch();

  const handlePeriodChange = (event) => {
    setSelectedPeriod(event.target.value);
  };

  const getFilteredTransactions = (period) => {
    const now = new Date();
    let startDate;

    switch (period) {
      case 'last24Hours':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'lastWeek':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'lastMonth':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'lastYear':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      case 'allTime':
        startDate = new Date(0);
        break;
      default:
        startDate = new Date(0);
    }

    return transactions.filter(transaction => new Date(transaction.datetime) >= startDate);
  };

  const aggregateTransactionsByMonth = (transactions) => {
    const monthlyData = {};

    transactions.forEach(({ datetime, amount, type }) => {
      const date = new Date(datetime);
      const month = date.toLocaleString('default', { month: 'long' });
      const year = date.getFullYear();
      const key = `${month} ${year}`;

      if (!monthlyData[key]) {
        monthlyData[key] = { month: key, income: 0, expense: 0 };
      }

      if (type === 'income') {
        monthlyData[key].income += Number(amount);
      } else if (type === 'expense') {
        monthlyData[key].expense += Number(amount);
      }
    });

    return Object.values(monthlyData);
  };

  const filteredTransactions = getFilteredTransactions(selectedPeriod);
  const analysisData = aggregateTransactionsByMonth(transactions);
  
  return (
    <div className="max-w-7xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-8">Панель управления</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white shadow-md rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Операции</h2>
            <select 
              value={selectedPeriod} 
              onChange={handlePeriodChange} 
              className="p-2 border border-gray-300 rounded-lg max-sm:text-sm"
            >
              <option value="last24Hours">Последние 24 часа</option>
              <option value="lastWeek">Последняя неделя</option>
              <option value="lastMonth">Последний месяц</option>
              <option value="lastYear">Последний год</option>
              <option value="allTime">Всё время</option>
            </select>
          </div>
          <TransactionsList transactions={filteredTransactions} />
          </div>
          <div className="p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Анализ</h2>
              { transactions && transactions.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analysisData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" name="Месяц" />
                    <YAxis name="Сумма, ₽" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="income" fill="#82ca9d" name="Доходы" />
                    <Bar dataKey="expense" fill="#ff6f61" name="Расходы" />
                  </BarChart>
                </ResponsiveContainer>

              ) : (
                <div className='mx-auto text-center'>Операций не найдено.</div>
              )}
          </div>
        </div>
        <BudgetList plans={plans} />
      </div>
    );
  }
  
  export default Dashboard;