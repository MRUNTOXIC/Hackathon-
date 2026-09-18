import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  timeout: 30000, // 30s — MongoDB Atlas cold starts can take 5-15s
});

// Routes that are allowed to return 401 without triggering a redirect to /login
const AUTH_ROUTE_PATTERNS = [
  '/auth/login',
  '/auth/register',
  '/auth/me',
  '/auth/logout',
  '/auth/send-reg-otp',
  '/auth/verify-reg-otp',
  '/auth/forgot-password',
  '/auth/verify-reset-otp',
  '/auth/reset-password',
  '/auth/send-otp',
  '/auth/verify-otp',
];

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Handle timeouts
    if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
      console.error('API Request Timeout:', err.config?.url);
    }

    if (err.response?.status === 401 && typeof window !== 'undefined') {
      const url: string = err.config?.url ?? '';

      const isAuthRoute = AUTH_ROUTE_PATTERNS.some((pattern) => url.includes(pattern));
      const isReveal = url.includes('/internet/reveal');
      const isAdminRoute = url.includes('/admin');

      // Only redirect to login for protected app routes, never for auth/OTP routes
      if (!isAuthRoute && !isReveal && !isAdminRoute) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(err);
  }
);

export default api;
