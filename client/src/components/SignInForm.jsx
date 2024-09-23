// SignInForm.jsx
import React, { useState } from 'react';
import { Form, Label, Input, SubmitButton } from './StyledComponents';

const SignInForm = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Implement sign-in logic here
        console.log('Signing in with:', credentials);
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Label htmlFor="signin-email">Email:</Label>
            <Input
                id="signin-email"
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
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
        </Form>
    );
};

export default SignInForm;
