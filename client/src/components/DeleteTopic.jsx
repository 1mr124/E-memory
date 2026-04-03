// src/components/DeleteTopic/DeleteTopic.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import authApi from '../api/authApi';

const DeleteTopic = ({ topics, setTopics }) => {
    const [titleToDelete, setTitleToDelete] = useState('');
    const [error, setError] = useState('');

    const handleDeleteTopic = async (e) => {
        e.preventDefault();
        setError('');
        
        if (titleToDelete.trim() === '') {
            setError('Please enter a topic title to delete.');
            return;
        }
        const topic = topics.find(t => t.title === titleToDelete);
        if (!topic) {
            setError('Topic not found.');
            return;
        }
        
        try {
            const response = await authApi.post('/api/v1/delete', { topic_id: topic.id });
            if (response.status === 200) {
                setTopics(topics.filter(t => t.id !== topic.id));
                setTitleToDelete('');
            }
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to delete topic';
            setError(message);
        }
    };

    return (
        <Form onSubmit={handleDeleteTopic}>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <Input
                type="text"
                placeholder="Topic to delete"
                value={titleToDelete}
                onChange={(e) => setTitleToDelete(e.target.value)}
                required
            />
            <SubmitButton type="submit">Delete Topic</SubmitButton>
        </Form>
    );
};

const ErrorMessage = styled.div`
    color: #ff6b6b;
    margin-bottom: 10px;
    padding: 10px;
    background-color: rgba(255, 107, 107, 0.1);
    border-radius: 5px;
`;

// Styled Components
const Form = styled.form`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const Input = styled.input`
    padding: 10px;
    margin-bottom: 15px;
    border: none;
    border-radius: 5px;
    outline: none;
    font-size: 1em;
    background-color: #34495e;
    color: #e0f7fa;
`;

const SubmitButton = styled.button`
    padding: 10px 20px;
    background-color: #c0392b;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1em;
    transition: background-color 0.3s;

    &:hover {
        background-color: #a93226;
    }
`;

export default DeleteTopic;
