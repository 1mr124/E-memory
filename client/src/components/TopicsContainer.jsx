// src/components/TopicsContainer/TopicsContainer.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import Navigation from './Navigation';
import SearchInput from './SearchInput';
import AddTopicForm from './AddTopicForm';
import DeleteTopic from './DeleteTopic';

const TopicsContainer = () => {
    const navItems = [
        { label: 'Search', value: 'search' },
        { label: 'Add', value: 'add' },
        { label: 'Delete', value: 'delete' }
    ];
    const [activeInput, setActiveInput] = useState('search');

    const renderInput = () => {
        switch (activeInput) {
            case 'search':
                return <SearchInput />;
            case 'add':
                return <AddTopicForm />;
            case 'delete':
                return <DeleteTopic />;
            default:
                return null;
        }
    };

    return (
        <Container>
            <Navigation activeInput={activeInput} setActiveInput={setActiveInput} navItems={navItems} />
            {renderInput()} {/* Removed the Form wrapper */}
        </Container>
    );
};

// Styled Component
const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 90%;
    max-width: 800px;
    height: auto;
    background-color: #1c2a39;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    margin: auto;
    height: 710px;
    padding: 20px; /* Added padding for better spacing */
`;

export default TopicsContainer;
