// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:5001/api/v1', // Update this if your backend URL changes
});

export default api;
