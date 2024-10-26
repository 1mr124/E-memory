import React, { useState } from 'react';
import { Form, Label, Input, SubmitButton } from './StyledComponents';
import { sanitizeInput } from '../utils/inputSanitization'; // Import the utility function
import publicApi from '../api/publicApi';
import { useNavigate } from 'react-router-dom'; // For redirection

const SignInForm = () => {
    const [credentials, setCredentials] = useState({ identifier: '', password: '' });
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Initialize navigate hook for redirection

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Sanitize user input
        const sanitizedIdentifier = sanitizeInput(credentials.identifier, {
            maxLength: 100
        });

        const sanitizedPassword = sanitizeInput(credentials.password, { maxLength: 128 });

        if (!sanitizedIdentifier || !sanitizedPassword) {
            setError('Invalid input data');
            return;
        }

        // Check if the identifier is an email or a username
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedIdentifier);


        const payload = new FormData();
        payload.append('password', sanitizedPassword);

        if (isEmail) {
            payload.append('email', sanitizedIdentifier); // Append email if isEmail is true
        } else {
            payload.append('userName', sanitizedIdentifier); // Append username otherwise
        }

        try {
            console.log(payload);
            
            const response = await publicApi.post('/api/v1/login', payload,
                {
                headers: {
                    'Content-Type': 'multipart/form-data', // Form data type
                }
              });

            const { token, message } = response.data;
            console.log(message);
            

            // Check if the token exists and login is successful
            if (token) {
                sessionStorage.setItem('authToken', token); // Store token in session storage
                setCredentials({ identifier: '', password: '' }); // Clear input fields
                setError(null); // Clear any error messages
                console.log('Login successful:', token);

                // Redirect to /info after successful login
                navigate('/info');
            } else {
                setError(message || 'Invalid login credentials');
            }
        } catch (err) {
            setError('Login failed. Please try again.');
            console.error('Login failed:', err);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Label htmlFor="signin-identifier">Email or Username:</Label>
            <Input
                id="signin-identifier"
                type="text"
                value={credentials.identifier}
                onChange={(e) => setCredentials({ ...credentials, identifier: e.target.value })}
                required
            />

            <Label htmlFor="signin-password">Password:</Label>
            <Input
                id="signin-password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                required
            />

            <SubmitButton type="submit">Sign In</SubmitButton>

            {/* Display error message if login fails */}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </Form>
    );
};

export default SignInForm;