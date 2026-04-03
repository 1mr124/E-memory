import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import authApi from '../api/authApi';

const SearchWrapper = styled.div`
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;
    justify-content: center;
    width: 80%;
    margin: auto;
`;

const SearchKeyInput = styled.input`
    width: 80%;
    background-color: transparent;
    color: #e0f7fa;
    border: none;
    outline: none;
    padding: 10px;
    text-align: center;
    margin-bottom: 10px;
`;

const DataListInput = styled.input`
    width: 80%;
    background-color: transparent;
    color: #e0f7fa;
    border: none;
    outline: none;
    padding: 10px;
    text-align: center;
`;

const InfoSearchKey = ({ setTopicId }) => {
    const [topics, setTopics] = useState([]);

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

    return (
        <SearchWrapper>
            <SearchKeyInput id="searchKey" type="text" placeholder="Search Key" required />
            <DataListInput 
                list="data-options" 
                placeholder="Topic" 
                onChange={(e) => setTopicId(e.target.value)} 
                required 
            />
            <datalist id="data-options">
                {topics.map(topic => (
                    <option key={topic.id} value={topic.id} label={topic.title} />
                ))}
            </datalist>
        </SearchWrapper>
    );
};

export default InfoSearchKey;
