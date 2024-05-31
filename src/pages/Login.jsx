import React, { useState } from 'react';
import { TextField, Button, Container, Typography, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/reducers/authSlice';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const { loginLoading, loginError } = useSelector((state) => state.auth)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  return (
    <Container maxWidth="sm" className="mt-10">
      <Typography variant="h4" component="h1" gutterBottom>
        Авторизация
      </Typography>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        { loginError && <span className='text-red-600'>Некорректные данные!</span>}
        <TextField
          label="Электронная почта"
          variant="outlined"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={loginError ? true : false}
        />
        <TextField
          label="Пароль"
          variant="outlined"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={loginError ? true : false}
        />
        <Button type="submit" variant="contained" color="primary" disabled={loginLoading}>
          { loginLoading ? <CircularProgress size={24} /> : 'Войти' }
        </Button>
        <Typography>
          Ещё нет аккаунта? <Link to="/register" className='underline'>Создать аккаунт</Link>
        </Typography>
      </form>
    </Container>
  );
}

export default Login;