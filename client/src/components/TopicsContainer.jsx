// src/components/TopicsContainer/TopicsContainer.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import SearchInput from './SearchInput';
import AddTopicForm from './AddTopicForm';
import DeleteTopic from './DeleteTopic';
import TopicTreeView from './TopicTreeView';
import topicService from '../services/topicService';
import authApi from '../api/authApi';

const TopicsContainer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const navItems = [
        { label: 'Browse', value: 'browse' },
        { label: 'Search', value: 'search' },
        { label: 'Add', value: 'add' },
        { label: 'Delete', value: 'delete' }
    ];
    const [activeInput, setActiveInput] = useState(id ? 'browse' : 'browse');
    const [currentTopicId, setCurrentTopicId] = useState(id ? parseInt(id) : null);
    const [rootTopics, setRootTopics] = useState([]);
    const [topics, setTopics] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchRootTopics = async () => {
            try {
                const response = await topicService.getRootTopics();
                setRootTopics(response.topics || []);
            } catch (error) {
                console.error('Failed to fetch root topics:', error);
            }
        };
        fetchRootTopics();
    }, []);

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

    const handleNavigateTopic = (topicId) => {
        setCurrentTopicId(topicId);
        navigate(`/topics/${topicId}`);
    };

    const handleNavigateRoot = () => {
        setCurrentTopicId(null);
        navigate('/topics');
    };

    const renderInput = () => {
        switch (activeInput) {
            case 'browse':
                if (currentTopicId) {
                    return <TopicTreeView topicId={currentTopicId} onNavigate={handleNavigateTopic} />;
                } else {
                    return (
                        <BrowseContainer>
                            <BrowseTitle>Root Topics</BrowseTitle>
                            {rootTopics.length === 0 ? (
                                <EmptyMessage>No topics yet. Create one to get started!</EmptyMessage>
                            ) : (
                                <ItemList>
                                    {rootTopics.map(topic => (
                                        <BrowseItem key={topic.id}>
                                            <BrowseLink onClick={() => handleNavigateTopic(topic.id)}>
                                                {topic.has_children && <span>📁</span>}
                                                {!topic.has_children && <span>📄</span>}
                                                {topic.name}
                                            </BrowseLink>
                                        </BrowseItem>
                                    ))}
                                </ItemList>
                            )}
                        </BrowseContainer>
                    );
                }
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

const BrowseContainer = styled.div`
    width: 100%;
    padding: 10px;
`;

const BrowseTitle = styled.h3`
    color: #3498db;
    border-bottom: 2px solid #3498db;
    padding-bottom: 10px;
    margin-bottom: 15px;
`;

const ItemList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
`;

const BrowseItem = styled.li`
    margin-bottom: 8px;
`;

const BrowseLink = styled.button`
    background: none;
    border: none;
    color: #ecf0f1;
    cursor: pointer;
    font-size: 1em;
    padding: 8px;
    text-align: left;
    width: 100%;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    gap: 8px;

    &:hover {
        background-color: #34495e;
        border-radius: 4px;
    }
`;

const EmptyMessage = styled.p`
    color: #95a5a6;
    font-style: italic;
    padding: 20px;
    text-align: center;
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
