import axios from 'axios';
import authService from '../services/authService'; // Import the auth service

const apiUrl = process.env.REACT_APP_API_URL;

// Create Axios instance
const publicApi = axios.create({
  baseURL: apiUrl,
  withCredentials: true, // Enable credentials to send cookies with requests
});

// Add request interceptor to include the token in the Authorization header
publicApi.interceptors.request.use((config) => {
  const token = authService.getToken(); // Get token from authService
  
  // If token exists, set Authorization header
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add response interceptor to handle token expiration and redirect the user to the login route
publicApi.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response && error.response.status === 401) {
    authService.removeToken(); // Remove token via auth service
    // Redirect to login
    window.location.href = '/account';
  }
  return Promise.reject(error);
});

export default publicApi;
