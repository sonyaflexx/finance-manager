import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Registration logic here
    console.log(formData);
  };

  return (
    <Container maxWidth="sm" className="mt-10">
      <Typography variant="h4" component="h1" gutterBottom>
        Регистрация
      </Typography>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <TextField
          label="Имя пользователя"
          variant="outlined"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
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
          Создать аккаунт
        </Button>
        <Typography>
          Уже есть аккаунт? <Link to="/login" className='underline'>Войти</Link>
        </Typography>
      </form>
    </Container>
  );
}

export default Register;