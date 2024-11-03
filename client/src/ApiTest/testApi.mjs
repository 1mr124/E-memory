// testAuthServiceWithAPI.js
import axios from 'axios';

// Mock sessionStorage for testing purposes
global.sessionStorage = {
  store: {},
  getItem(key) {
    return this.store[key] || null;
  },
  setItem(key, value) {
    this.store[key] = value;
  },
  removeItem(key) {
    delete this.store[key];
  }
};

// Set up actual publicApi using Axios for real API requests
const publicApi = axios.create({
  baseURL: 'http://127.0.0.1:5001/api/v1',  
  withCredentials: true  // Include cookies with requests

});

// authService with real publicApi
const authService = {
  getToken: () => sessionStorage.getItem('authToken'),
  setToken: (token) => sessionStorage.setItem('authToken', token),
  removeToken: () => sessionStorage.removeItem('authToken'),
  

  refreshAccessToken: async () => {
    try {
      // Make a request to refresh the access token
      const response = await publicApi.post(
        '/auth/refresh',
        {},
        {
          headers: {
            Cookie: 'refresh_token=EXMAPLE.txt'
          }
        }
      );

      // Extract the new access token
      const newAccessToken = response.data.access_token;
  
      // Update the token in session storage
      authService.setToken(newAccessToken);
  
      return newAccessToken;
    } catch (error) {
      console.error('Failed to refresh access token', error);
      return null;
    }
  }
};

// Run the test
(async () => {
  console.log('Running tests with actual API...');

  try {
    // Test the refresh token functionality with actual API call
    const token = await authService.refreshAccessToken();
    console.log('Token received:', token);  // Should print the real access token
    console.log('Stored token:', authService.getToken());  // Should match the received token
  } catch (error) {
    console.error('Error during API test:', error);
  }
})();
