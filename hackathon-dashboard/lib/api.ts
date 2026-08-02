import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const url = err.config?.url ?? '';
    const isAuthCheck = url.includes('/auth/me') || url.includes('/auth/login') || url.includes('/auth/register');
    const isReveal = url.includes('/internet/reveal');
    const isAdminRoute = url.includes('/admin');
    if (err.response?.status === 401 && !isAuthCheck && !isReveal && !isAdminRoute && typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
