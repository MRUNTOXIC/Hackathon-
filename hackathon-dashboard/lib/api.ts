import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  timeout: 10000, // Global 10s timeout
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Handle timeouts
    if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
      console.error('API Request Timeout:', err.config?.url);
    }

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
