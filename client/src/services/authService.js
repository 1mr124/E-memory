import publicApi from '../api/publicApi';

const TOKEN_KEY = 'authToken';


const authService = {
    getToken: () => sessionStorage.getItem(TOKEN_KEY),
    setToken: (token) => sessionStorage.setItem(TOKEN_KEY, token),
    removeToken: () => sessionStorage.removeItem(TOKEN_KEY),
    isAuthenticated: () => !!sessionStorage.getItem(TOKEN_KEY),

    refreshAccessToken: async () => {
        try {
            // Make a request to get the new access token
            const response = await publicApi.post('/api/v1/auth/refresh');
            
            // Extract the new access token from the response
            const newAccessToken = response.data.access_token;

            // Update the token in session storage
            authService.setToken(newAccessToken);

            return newAccessToken;
        } catch (error) {
            if (error.response && error.response.status === 401 && error.response.data.message === 'Refresh token expired') {
                authService.removeToken();
                navigateToLogin();  // Redirect to login if refresh token is expired
                return null;
            }
            console.error('Failed to refresh access token', error.response?.data || error);
            return null; // Return null if the refresh fails
        }
    }
};

export default authService;
