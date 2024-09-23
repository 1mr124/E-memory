// AccountContainer.jsx
import React, { useState } from 'react';
import { Container, Nav, NavItem } from './StyledComponents';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';

const AccountNavigation = ({ activeTab, setActiveTab }) => {
    const navItems = [
        { label: 'Sign In', value: 'signin' },
        { label: 'Sign Up', value: 'signup' },
    ];

    return (
        <Nav>
            {navItems.map((item) => (
                <NavItem
                    key={item.value}
                    onClick={() => setActiveTab(item.value)}
                    $active={activeTab === item.value} // Using transient prop
                >
                    {item.label}
                </NavItem>
            ))}
        </Nav>
    );
};

const AccountContainer = () => {
    const [activeTab, setActiveTab] = useState('signin');

    const renderForm = () => {
        switch (activeTab) {
            case 'signin':
                return <SignInForm />;
            case 'signup':
                return <SignUpForm />;
            default:
                return null;
        }
    };

    return (
        <Container>
            <AccountNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
            {renderForm()}
        </Container>
    );
};

export default AccountContainer;
