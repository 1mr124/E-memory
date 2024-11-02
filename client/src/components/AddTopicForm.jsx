import React, { useState } from 'react';
import styled from 'styled-components';
import authApi from '../api/authApi';

const AddTopicForm = () => {
    const [newTopic, setNewTopic] = useState({ title: '', parent: '' });
    const [feedbackMessage, setFeedbackMessage] = useState({ message: '', success: false });

    const handleAddTopic = async (e) => {
        e.preventDefault();
        if (newTopic.title.trim() === '') {
            setFeedbackMessage({ message: 'Topic title cannot be empty.', success: false });
            // Clear the feedback message after 3 seconds
            setTimeout(() => {
                setFeedbackMessage({ message: '', success: false });
            }, 3000);
            return;
        }

        try {
            // Send POST request to add topic
            const response = await authApi.post('/api/v1/topic/create', newTopic);

            // Check if the server responded with a 201 status
            if (response.status === 201) {
                setFeedbackMessage({ message: 'Topic added successfully!', success: true });
                
                // Reset the form fields
                setNewTopic({ title: '', parent: '' });
            } else {
                // If the response is not 201, show a generic failure message
                setFeedbackMessage({ message: 'Failed to add topic. Please try again.', success: false });
            }
        } catch (error) {
            // Display error message on request failure
            setFeedbackMessage({ message: 'Failed to add topic. Please try again.', success: false });
            console.error('Error adding topic:', error);
        } finally {
            // Clear the feedback message after 3 seconds
            setTimeout(() => {
                setFeedbackMessage({ message: '', success: false });
            }, 3000);
        }
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
                value={newTopic.parent}
                onChange={(e) => setNewTopic({ ...newTopic, parent: e.target.value })}
            />
            <SubmitButton type="submit">Add Topic</SubmitButton>
            {feedbackMessage.message && (
                <Feedback $success={feedbackMessage.success}>{feedbackMessage.message}</Feedback>
            )}
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

const Feedback = styled.p`
    color: ${props => props.$success ? 'green' : 'red'};
    margin-top: 8px;
`;

export default AddTopicForm;
