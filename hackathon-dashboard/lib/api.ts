import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  timeout: 30000, // 30s — MongoDB Atlas cold starts can take 5-15s
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Handle timeouts
    if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
      console.error('API Request Timeout:', err.config?.url);
    }

    const url = err.config?.url ?? '';
    // Never redirect to login for any auth-related route or special routes
    const isAuthRoute = url.includes('/auth/');
    const isReveal = url.includes('/internet/reveal');
    const isAdminRoute = url.includes('/admin');

    // Redirect to login only for 401s on user-facing routes
    if (
      err.response?.status === 401 &&
      !isAuthRoute &&
      !isReveal &&
      !isAdminRoute &&
      typeof window !== 'undefined'
    ) {
      window.location.href = '/login';
    }

    return Promise.reject(err);
  }
);

export default api;
