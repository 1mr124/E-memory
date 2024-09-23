// src/components/DeleteTopic/DeleteTopic.jsx
import React, { useState } from 'react';
import styled from 'styled-components';

const DeleteTopic = ({ topics, setTopics }) => {
    const [titleToDelete, setTitleToDelete] = useState('');

    const handleDeleteTopic = (e) => {
        e.preventDefault();
        if (titleToDelete.trim() === '') {
            alert('Please enter a topic title to delete.');
            return;
        }
        const topicExists = topics.some(topic => topic.title === titleToDelete);
        if (!topicExists) {
            alert('Topic not found.');
            return;
        }
        setTopics(topics.filter(topic => topic.title !== titleToDelete));
        setTitleToDelete('');
        console.log('Deleted Topic:', titleToDelete);
    };

    return (
        <Form onSubmit={handleDeleteTopic}>
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
