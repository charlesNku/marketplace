import axios from 'axios';

// Determine base URL — never use http:// when page is on https:// (mixed content)
const envUrl = import.meta.env.VITE_API_BASE_URL;
const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
const baseURL = (envUrl && !(isHttps && envUrl.startsWith('http://')))
  ? envUrl
  : (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

const api = axios.create({
  baseURL,
});

// For images and static assets, we need the backend root
export const BASE_URL = baseURL.replace(/\/api$/, '');

api.interceptors.request.use(
  (config) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
