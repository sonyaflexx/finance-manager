import React, { useEffect } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCurrentToken } from './store/reducers/authSlice';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import Transactions from './pages/Transactions';
import Budget from './pages/Budget';
import Reports from './pages/Reports';
import { fetchCategories } from './store/reducers/categoriesSlice';
import { fetchBudgets } from './store/reducers/budgetSlice';
import { fetchTransactions } from './store/reducers/transactionsSlice';

const ProtectedRoute = ({ isAuthenticated, redirectPath = '/login' }) => {
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (localStorage.getItem('access_token')) {
      dispatch(fetchCurrentToken());
      dispatch(fetchCategories());
      dispatch(fetchBudgets());
      dispatch(fetchTransactions());
    }
  }, [dispatch]);

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/plans" element={<Budget />} />
          <Route path="/reports" element={<Reports />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;