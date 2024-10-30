// src/services/authService.js
const authService = {
    getToken: () => sessionStorage.getItem('authToken'),
    setToken: (token) => sessionStorage.setItem('authToken', token),
    removeToken: () => sessionStorage.removeItem('authToken'),
    isAuthenticated: () => !!sessionStorage.getItem('token'),
  };
  
  export default authService;
  