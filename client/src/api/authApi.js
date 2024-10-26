import axios from 'axios';
import authService from '../services/authService'; // Import the auth service

const apiUrl = process.env.REACT_APP_API_URL;

// Create Axios instance
const authApi = axios.create({
  baseURL: apiUrl,
});

// Add request interceptor to include the token in the Authorization header
authApi.interceptors.request.use((config) => {
  const token = authService.getToken(); // Get token from authService

  // Check if the token exists
  if (!token) {
    console.log("no token found a7a");
    
    // If no token is present, gracefully handle the missing token
    window.location.href = '/account'; // Redirect to login page
    return Promise.reject(new Error('No token available, user needs to log in')); // Cancel the request
  }

  // If token exists, set Authorization header
  config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add response interceptor to handle token expiration and redirect the user to the login route
authApi.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response && error.response.status === 401) {
    authService.removeToken(); // Remove token via auth service
    // Redirect to login
    window.location.href = '/account';
  }
  return Promise.reject(error);
});

export default authApi;