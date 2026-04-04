// src/components/DeleteTopic/DeleteTopic.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import authApi from '../api/authApi';
import topicService from '../services/topicService';

const DeleteTopic = ({ topics, setTopics }) => {
    const [titleToDelete, setTitleToDelete] = useState('');
    const [error, setError] = useState('');
    const [showDeleteChoice, setShowDeleteChoice] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [selectedDeleteMode, setSelectedDeleteMode] = useState('cascade');

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
            const childrenData = await topicService.getTopicChildren(topic.id);
            const hasChildren =
                (childrenData.subtopics && childrenData.subtopics.length > 0) ||
                (childrenData.infos && childrenData.infos.length > 0);

            if (hasChildren) {
                setSelectedTopic(topic);
                setShowDeleteChoice(true);
                return;
            }

            performDelete(topic.id, 'cascade');
        } catch (err) {
            performDelete(topic.id, 'cascade');
        }
    };

    const performDelete = async (topicId, deleteMode) => {
        try {
            const response = await authApi.post('/api/v1/delete', {
                topic_id: topicId,
                delete_mode: deleteMode
            });
            if (response.status === 200) {
                setTopics(topics.filter(t => t.id !== topicId));
                setTitleToDelete('');
                setShowDeleteChoice(false);
                setSelectedTopic(null);
            }
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to delete topic';
            setError(message);
        }
    };

    if (showDeleteChoice && selectedTopic) {
        return (
            <ConfirmDialog>
                <DialogTitle>Delete topic with children?</DialogTitle>
                <DialogMessage>
                    "{selectedTopic.title}" has subtopics or entries. Choose how to delete it:
                </DialogMessage>
                <ButtonGroup>
                    <ConfirmButton
                        selected={selectedDeleteMode === 'promote'}
                        onClick={() => setSelectedDeleteMode('promote')}
                    >
                        Promote children to parent
                    </ConfirmButton>
                    <ConfirmButton
                        selected={selectedDeleteMode === 'cascade'}
                        onClick={() => setSelectedDeleteMode('cascade')}
                    >
                        Delete everything
                    </ConfirmButton>
                </ButtonGroup>
                <ActionButtons>
                    <ConfirmDeleteButton onClick={() => performDelete(selectedTopic.id, selectedDeleteMode)}>
                        {selectedDeleteMode === 'promote' ? 'Promote & Delete' : 'Delete All'}
                    </ConfirmDeleteButton>
                    <CancelButton onClick={() => setShowDeleteChoice(false)}>
                        Cancel
                    </CancelButton>
                </ActionButtons>
            </ConfirmDialog>
        );
    }

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

const ConfirmDialog = styled.div`
    background-color: #34495e;
    padding: 20px;
    border-radius: 8px;
    border-left: 4px solid #e74c3c;
`;

const DialogTitle = styled.h3`
    color: #e74c3c;
    margin: 0 0 10px 0;
`;

const DialogMessage = styled.p`
    color: #ecf0f1;
    margin: 0 0 15px 0;
`;

const ButtonGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 15px;
`;

const ConfirmButton = styled.button`
    background-color: ${props => (props.selected ? '#3498db' : '#2c3e50')};
    color: #ecf0f1;
    border: 2px solid ${props => (props.selected ? '#3498db' : '#7f8c8d')};
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    text-align: left;
    transition: all 0.2s;

    &:hover {
        border-color: #3498db;
    }
`;

const ActionButtons = styled.div`
    display: flex;
    gap: 10px;
    justify-content: flex-end;
`;

const ConfirmDeleteButton = styled.button`
    background-color: #c0392b;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: #a93226;
    }
`;

const CancelButton = styled.button`
    background-color: #7f8c8d;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: #5d6d7b;
    }
`;

export default DeleteTopic;
