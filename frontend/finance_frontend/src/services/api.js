import axios from 'axios';

// Use 127.0.0.1 instead of localhost to avoid CORS issues
const API_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor for token refresh
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  console.log('Interceptor - Token found:', token ? 'Yes' : 'No');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Authorization header set');
  } else {
    console.log('No token available');
  }
  return config;
});

export const login = (username, password) => {
    return api.post('/token/', { username, password });
};

export const register = (username, password, email) => {
    return api.post('/register/', { username, password, email });
};

export const getTransactions = () => {
    return api.get('/transactions/');
};

// Transaction CRUD
export const createTransaction = (data) => {
    return api.post('/transactions/', data);
};

export const updateTransaction = (id, data) => {
  return api.put(`/transactions/${id}/`, data);
};

export const deleteTransaction = (id) => {
  return api.delete(`/transactions/${id}/`);
};

export const getCategories = () => {
  return api.get('/categories/');
};


export default api;