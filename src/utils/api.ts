import axios from 'axios';

const api = axios.create({
  // baseURL: 'https://meallan-back-production.up.railway.app/api',
  baseURL: 'http://192.168.0.203:3001/api',
  // baseURL: 'http://192.168.0.124:3001/api',
});

export default api;
