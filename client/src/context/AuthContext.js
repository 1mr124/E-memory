import { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService'; // auth service with token management

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check if the token exists on initial load
        const token = authService.getToken();
        setIsLoggedIn(!!token);
    }, []);

    const login = (token) => {
        authService.setToken(token); // Save token
        setIsLoggedIn(true);
    };

    const logout = () => {
        authService.removeToken(); // Clear token
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
