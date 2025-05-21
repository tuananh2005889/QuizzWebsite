
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',           // nhờ proxy, sẽ tới http://localhost:3001/api
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tự động thêm token nếu có
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers!['Authorization'] = `Bearer ${token}`;
  return config;
});

export default api;
