import axios from 'axios';
import authService from '../services/authService'; // Import the auth service
import { navigateToLogin } from '../utils/navigation';

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
    // If no token is present, gracefully handle the missing token
    navigateToLogin(); // Redirect to login page
    return Promise.reject(new Error('No token available, user needs to log in')); // Cancel the request
  }

  // If token exists, set Authorization header
  config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (error) => {
  return Promise.reject(error);
});


// Add response interceptor to handle token expiration and refresh the token if needed
authApi.interceptors.response.use(
  (response) => {
    return response; // Return the response if successful
  },
  async (error) => {
    // Check if the error response is a 401 Unauthorized
    if (error.response && error.response.status === 401) {
      try {
        // Try refreshing the access token        
        const refreshed = await authService.refreshAccessToken();        // If refresh is successful, retry the original request
        if (refreshed) {
          const token = authService.getToken(); // Get the new token

          // Update the Authorization header with the new token
          error.config.headers.Authorization = `Bearer ${token}`;

          // Retry the original request with the new token
          return authApi.request(error.config);
        } else {
          // If refresh fails, redirect to the login page
          authService.removeToken();
          navigateToLogin(); // Redirect to login page
        }
      } catch (refreshError) {
        // Handle errors from the token refresh process
        console.error('Error refreshing token', refreshError);
        authService.removeToken();
        navigateToLogin(); // Redirect to login page
      }
    }

    // If the error is not 401, or if token refresh fails, reject the error
    return Promise.reject(error);
  }
);


export default authApi;