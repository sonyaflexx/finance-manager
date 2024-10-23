import axios from 'axios';

export const instance = axios.create({
  baseURL: process.env.API_URL || 'https://finance-app-backend-psi.vercel.app' || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && error.response.data.message === "Access token expired" && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshTokenResponse = await axios.post('/auth/refresh');
        const newAccessToken = refreshTokenResponse.data.access_token;

        localStorage.setItem('access_token', newAccessToken);
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        return instance(originalRequest);
      } catch (refreshTokenError) {
          console.error('Ошибка обновления токена:', refreshTokenError);
          return Promise.reject(refreshTokenError);
      }
    }
    return Promise.reject(error);
  }
);
