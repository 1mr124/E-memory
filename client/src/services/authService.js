import publicApi from '../api/publicApi';

const authService = {
    getToken: () => sessionStorage.getItem('authToken'),
    setToken: (token) => sessionStorage.setItem('authToken', token),
    removeToken: () => sessionStorage.removeItem('authToken'),
    isAuthenticated: () => !!sessionStorage.getItem('authToken'),

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
            console.error('Failed to refresh access token', error);
            return null; // Return null if the refresh fails
        }
    }
};

export default authService;
