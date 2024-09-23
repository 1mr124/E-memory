// src/components/AddTopicForm/AddTopicForm.jsx
import React, { useState } from 'react';
import styled from 'styled-components';

const AddTopicForm = ({ topics, setTopics }) => {
    const [newTopic, setNewTopic] = useState({ title: '', description: '' });

    const handleAddTopic = (e) => {
        e.preventDefault();
        if (newTopic.title.trim() === '') {
            alert('Topic title cannot be empty.');
            return;
        }
        setTopics([...topics, newTopic]);
        setNewTopic({ title: '', description: '' });
        console.log('Added Topic:', newTopic);
    };

    return (
        <Form onSubmit={handleAddTopic}>
            <Input
                type="text"
                placeholder="Topic Name"
                value={newTopic.title}
                onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
                required
            />
            <Input
                type="text"
                placeholder="Parent"
                value={newTopic.description}
                onChange={(e) => setNewTopic({ ...newTopic, description: e.target.value })}
            />
            <SubmitButton type="submit">Add Topic</SubmitButton>
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
    background-color: #0056b3;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1em;
    transition: background-color 0.3s;

    &:hover {
        background-color: #003d80;
    }
`;

export default AddTopicForm;
