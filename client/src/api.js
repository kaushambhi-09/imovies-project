import axios from 'axios';

// Automatically handle environment variable, trimming trailing slashes
const rawBaseURL = import.meta.env.VITE_API_URL;
const baseURL = rawBaseURL
  ? (rawBaseURL.endsWith('/') ? rawBaseURL.slice(0, -1) : rawBaseURL)
  : (import.meta.env.DEV ? 'http://localhost:8000/api' : '/api');

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('imovies_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const errMsg = (e) => e?.response?.data?.message || e?.message || 'Something went wrong';
export default api;
