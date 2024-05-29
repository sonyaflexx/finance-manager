import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { loginUser } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser();
  };

  return (
    <Container maxWidth="sm" className="mt-10">
      <Typography variant="h4" component="h1" gutterBottom>
        Авторизация
      </Typography>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <TextField
          label="Электронная почта"
          variant="outlined"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <TextField
          label="Пароль"
          variant="outlined"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        <Button type="submit" variant="contained" color="primary">
          Войти
        </Button>
        <Typography>
          Ещё нет аккаунта? <Link to="/register" className='underline'>Создать аккаунт</Link>
        </Typography>
      </form>
    </Container>
  );
}

export default Login;