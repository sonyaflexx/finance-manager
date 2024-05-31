import React, { useState } from 'react';
import { TextField, Button, Container, Typography, CircularProgress, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../store/reducers/authSlice';

function Register() {
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch = useDispatch();
  const { registerLoading, registerError } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setPasswordMatchError(true);
      return;
    }
    setPasswordMatchError(false);
    dispatch(register({ email: formData.email, password: formData.password }));
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Container maxWidth="sm" className="mt-10">
      <Typography variant="h4" component="h1" gutterBottom>
        Регистрация
      </Typography>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        {!passwordMatchError && registerError && <span className='text-red-600'>Некорректные данные!</span>}
        <TextField
          label="Электронная почта"
          variant="outlined"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={registerError ? true : false}
        />
        <TextField
          label="Пароль"
          variant="outlined"
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={registerError || passwordMatchError ? true : false}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end" className='pr-2'>
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Подтверждение пароля"
          variant="outlined"
          type={showConfirmPassword ? 'text' : 'password'}
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={passwordMatchError ? true : false}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end" className='pr-2'>
                <IconButton
                  aria-label="toggle confirm password visibility"
                  onClick={handleClickShowConfirmPassword}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {passwordMatchError && <span className='!mt-0.5 text-red-600'>Пароли не совпадают!</span>}
        <Button type="submit" variant="contained" color="primary" disabled={registerLoading}>
          {registerLoading ? <CircularProgress size={24} /> : 'Зарегистрироваться'}
        </Button>
        <Typography>
          Уже есть аккаунт? <Link to="/login" className="underline">Войти</Link>
        </Typography>
      </form>
    </Container>
  );
}

export default Register;