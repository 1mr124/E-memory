// src/components/SearchInput/SearchInput.jsx
import React from 'react';
import styled from 'styled-components';

const SearchInput = ({ searchTerm, setSearchTerm }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        // Implement search logic here
        console.log('Searching for:', searchTerm);
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Input
                type="text"
                placeholder="Search topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                required
            />
            <SubmitButton type="submit">Search Topic</SubmitButton>
        </Form>
    );
};

// Styled Components
const Form = styled.form`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const Input = styled.input`
    flex: 1;
    background-color: #34495e;
    color: #e0f7fa;
    border: none;
    outline: none;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
`;

const SubmitButton = styled.button`
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #0056b3;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 20px;
    transition: background-color 0.3s;

    &:hover {
        background-color: #003d80;
    }
`;

export default SearchInput;
