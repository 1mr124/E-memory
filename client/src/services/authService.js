// src/services/authService.js
const authService = {
    getToken: () => sessionStorage.getItem('token'),
    setToken: (token) => sessionStorage.setItem('token', token),
    removeToken: () => sessionStorage.removeItem('token'),
    isAuthenticated: () => !!sessionStorage.getItem('token'),
  };
  
  export default authService;
  