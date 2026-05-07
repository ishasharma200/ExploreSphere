import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token from localStorage to every request if available
apiClient.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore localStorage errors
  }
  return config;
});

// On 401/403, emit a global logout event so app can react (AuthContext listens)
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401 || status === 403) {
      try {
        window.dispatchEvent(new CustomEvent('auth:logout', { detail: { reason: 'unauthorized' } }));
      } catch (e) {
        // ignore
      }
    }
    return Promise.reject(err);
  }
);

export default apiClient;
