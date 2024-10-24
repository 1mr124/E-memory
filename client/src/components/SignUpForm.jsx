import React, { useState, useEffect } from 'react';
import { Form, Label, Input, SubmitButton } from './StyledComponents';
import { sanitizeInput } from '../utils/inputSanitization';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const SignUpForm = () => {
    const [userInfo, setUserInfo] = useState({ name: '', email: '', password: '', repeatPassword: '' });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Sanitize inputs
        const sanitizedUsername = sanitizeInput(userInfo.name, { maxLength: 50, type: 'username' });
        const sanitizedEmail = sanitizeInput(userInfo.email, { maxLength: 100, type: 'email' });
        const sanitizedPassword = sanitizeInput(userInfo.password, { maxLength: 128, type: 'password' });
        const sanitizedRepeatPassword = sanitizeInput(userInfo.repeatPassword, { maxLength: 128, type: 'password' });

        // If any input is invalid, show error and exit
        if (!sanitizedUsername || !sanitizedEmail || !sanitizedPassword || !sanitizedRepeatPassword) {
            setError('Invalid input. Please check your username, email, or password.');
            return;
        }

        // Check if password and repeatPassword match
        if (sanitizedPassword !== sanitizedRepeatPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            // Send the sanitized data to the backend
            const response = await api.post('/register', {
                userName: sanitizedUsername,
                email: sanitizedEmail,
                password: sanitizedPassword,
            },
            {
            headers: {
                'Content-Type': 'multipart/form-data', // Form data type
            }
          });
          
            if (response.data.message === "User registered successfully") {
                // Redirect on success
                navigate('/info');
            } else {
                // Handle failed registration (backend returns success 200 but failure in message)
                setError(response.data.message || 'Registration failed. Please try again.');
            }
        } catch (err) {
            setError('An error occurred during registration. Please try again.');
            console.error('Registration error:', err);
        }
    };

    useEffect(() => {
        // Clear error on user input change
        setError(null);
    }, [userInfo]);

    return (
        <Form onSubmit={handleSubmit}>
            <Label htmlFor="signup-name">Name:</Label>
            <Input
                id="signup-name"
                type="text"
                value={userInfo.name}
                onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                required
            />

            <Label htmlFor="signup-email">Email:</Label>
            <Input
                id="signup-email"
                type="email"
                value={userInfo.email}
                onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                required
            />

            <Label htmlFor="signup-password">Password:</Label>
            <Input
                id="signup-password"
                type="password"
                value={userInfo.password}
                onChange={(e) => setUserInfo({ ...userInfo, password: e.target.value })}
                required
            />

            <Label htmlFor="signup-repeat-password">Repeat Password:</Label>
            <Input
                id="signup-repeat-password"
                type="password"
                value={userInfo.repeatPassword}
                onChange={(e) => setUserInfo({ ...userInfo, repeatPassword: e.target.value })}
                required
            />

            <SubmitButton type="submit">Sign Up</SubmitButton>
            {error && <p>{error}</p>}
        </Form>
    );
};

export default SignUpForm;
