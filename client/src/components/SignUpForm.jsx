// SignUpForm.jsx
import React, { useState } from 'react';
import { Form, Label, Input, SubmitButton } from './StyledComponents';

const SignUpForm = () => {
    const [userInfo, setUserInfo] = useState({ name: '', email: '', password: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Implement sign-up logic here
        console.log('Signing up with:', userInfo);
    };

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

            <SubmitButton type="submit">Sign Up</SubmitButton>
        </Form>
    );
};

export default SignUpForm;
