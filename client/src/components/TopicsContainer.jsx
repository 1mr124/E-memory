// src/components/TopicsContainer/TopicsContainer.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Navigation from './Navigation';
import SearchInput from './SearchInput';
import AddTopicForm from './AddTopicForm';
import DeleteTopic from './DeleteTopic';
import authApi from '../api/authApi';

const TopicsContainer = () => {
    const navItems = [
        { label: 'Search', value: 'search' },
        { label: 'Add', value: 'add' },
        { label: 'Delete', value: 'delete' }
    ];
    const [activeInput, setActiveInput] = useState('search');
    const [topics, setTopics] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const response = await authApi.get('/api/v1/topic/all');
                setTopics(response.data.topics || []);
            } catch (error) {
                console.error('Failed to fetch topics:', error);
            }
        };
        fetchTopics();
    }, []);

    const filteredTopics = topics.filter(topic =>
        topic.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const renderInput = () => {
        switch (activeInput) {
            case 'search':
                return (
                    <>
                        <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                        <TopicsList>
                            {filteredTopics.map(topic => (
                                <TopicItem key={topic.id}>{topic.title}</TopicItem>
                            ))}
                        </TopicsList>
                    </>
                );
            case 'add':
                return <AddTopicForm />;
            case 'delete':
                return <DeleteTopic topics={topics} setTopics={setTopics} />;
            default:
                return null;
        }
    };

    return (
        <Container>
            <Navigation activeInput={activeInput} setActiveInput={setActiveInput} navItems={navItems} />
            {renderInput()}
        </Container>
    );
};

const TopicsList = styled.div`
    width: 100%;
    margin-top: 20px;
`;

const TopicItem = styled.div`
    padding: 10px;
    margin: 5px 0;
    background-color: #34495e;
    border-radius: 5px;
    color: #e0f7fa;
`;

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
    padding: 20px;
    overflow-y: auto;
`;

export default TopicsContainer;
