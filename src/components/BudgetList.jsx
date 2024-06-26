import { IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteBudget } from "../store/reducers/budgetSlice";

export default function BudgetList({ plans, deletable }) {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories)
  const transactions = useSelector((state) => state.transactions.transactions);
  const [filterPeriod, setFilterPeriod] = useState("month");

  const categoryTotals = transactions.reduce((acc, transaction) => {
    const amount = transaction.type === 'expense' ? Number(transaction.amount) : 0;
    const transactionDate = new Date(transaction.date);
    const budgetStartDate = new Date();
    const budgetEndDate = new Date();

    if (filterPeriod === "day") {
      budgetStartDate.setHours(0, 0, 0, 0);
      budgetEndDate.setHours(23, 59, 59, 999);
    } else if (filterPeriod === "month") {
      budgetStartDate.setDate(1);
      budgetStartDate.setHours(0, 0, 0, 0);
      budgetEndDate.setMonth(budgetEndDate.getMonth() + 1, 0);
      budgetEndDate.setHours(23, 59, 59, 999);
    } else if (filterPeriod === "year") {
      budgetStartDate.setMonth(0, 1);
      budgetStartDate.setHours(0, 0, 0, 0);
      budgetEndDate.setMonth(11, 31);
      budgetEndDate.setHours(23, 59, 59, 999);
    }

    if (transactionDate >= budgetStartDate && transactionDate <= budgetEndDate) {
      acc[transaction.category_id] = (acc[transaction.category_id] || 0) + amount;
    }

    return acc;
  }, {});

  const filteredPlans = plans.filter(plan => plan.period === filterPeriod);

  const handleDelete = (id) => {
    dispatch(deleteBudget(id));
  };

  const getCategoryTitle = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.title : '';
  };


  return (
    <div className="p-6 bg-white shadow-md rounded-xl mt-6">
      <h2 className="text-2xl font-semibold mb-4">Планы расходов по категориям</h2>
      <div className="mb-4">
        <label htmlFor="filterPeriod" className="mr-2">Фильтр по периоду:</label>
        <select id="filterPeriod" value={filterPeriod} onChange={(e) => setFilterPeriod(e.target.value)}>
          <option value="day">День</option>
          <option value="month">Месяц</option>
          <option value="year">Год</option>
        </select>
      </div>
      <ul className="h-56 overflow-y-auto flex flex-col gap-1">
        {filteredPlans && filteredPlans.length > 0 ? (
          filteredPlans.map(plan => {
            const totalAmount = categoryTotals[plan.category_id] || 0;
            const exceedsGoal = totalAmount > plan.goal;

            return (
              <li key={plan.id} className="w-full flex justify-between px-4 py-2 border rounded-xl items-center">
                <div className='font-medium'>{getCategoryTitle(plan.category_id)}</div>
                <div className={`font-medium ${exceedsGoal ? 'text-red-600' : 'text-green-600'} flex items-center gap-4`}>
                  {totalAmount}₽ / {plan.goal}₽
                  {deletable && (
                    <div>
                      <IconButton aria-label="delete" color='error' onClick={() => handleDelete(plan.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  )}
                </div>
              </li>
            );
          })
        ) : (
          <div className='mx-auto'>Планов не найдено.</div>
        )}
      </ul>
    </div>
  );
}
