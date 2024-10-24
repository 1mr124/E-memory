// src/api.js
import axios from 'axios';

// Create Axios instance
const api = axios.create({
  baseURL: 'http://127.0.0.1:5001/api/v1',
});

// Add request interceptor to include the token in the Authorization header
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add response interceptor to handle token expiration and redirect the user to the login route
api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response && error.response.status === 401) {
    sessionStorage.removeItem('token');
    // Redirect to login
    window.location.href = '/account'; // Use window.location.href for redirection
  }
  return Promise.reject(error);
});

export default api;
