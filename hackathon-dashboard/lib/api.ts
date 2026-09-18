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

    // Never auto-redirect here — let each page/layout handle 401s themselves.
    // Previously this redirected to /login on 401, which broke OTP pages.

    return Promise.reject(err);
  }
);

export default api;
