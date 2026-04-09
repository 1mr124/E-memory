import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';
import authApi from '../api/authApi'; // Import the API
import { media } from './sharedStyles';

import InfoDisplayControler from './InfoDisplayControler';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 90%;
    max-width: 800px;
    min-height: auto;
    background-color: #1c2a39;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    margin: auto;
    overflow-x: hidden;

    ${media.mobile`
        width: 100%;
        max-width: none;
        border-radius: 0;
        padding: 0;
    `}

    ${media.tabletPortrait`
        width: 95%;
        padding: 20px;
    `}

    ${media.desktop`
        width: 95%;
        max-width: 100%;
    `}
`;

const Form = styled.form`
    width: 100%;
`;

const InputContainer = styled.div`
    position: sticky;
    top: 0;
    z-index: 1;
    background-color: #1c2a39;
    display: flex;
    width: 100%;
    padding: 10px 0;
`;

const SearchKeyInput = styled.input`
    flex: 1;
    background-color: #34495e;
    color: #e0f7fa;
    border: none;
    outline: none;
    padding: 24px;
    padding-right: 40px;
    text-align: left;
    margin-bottom: 10px;
    border-radius: 4px;
    font-size: 1.2em;

    ${media.mobile`
        min-height: 44px;
        padding: 12px 40px 12px 12px;
        font-size: 1.1em;
    `}
`;

const SearchIcon = styled(FaSearch)`
    position: absolute;
    right: 15px;
    top: 43%;
    transform: translateY(-50%);
    color: #e0f7fa;
    cursor: pointer;
    font-size: 1.4em;
`;

const SearchContainer = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [expandedInfo, setExpandedInfo] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async (e) => {
        if (e) {
            e.preventDefault();
        }
        if (!searchTerm) {
            setResults([]);
            setHasSearched(false);
            return;
        }

        try {
            const token = sessionStorage.getItem('authToken');

            const response = await authApi.get(`/api/v1/search?searchKey=${searchTerm}`, {
            });

            setResults(response.data);
            setExpandedInfo(null);
            setHasSearched(true);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            handleSearch();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handleInfoButtonClick = (infoId) => {
        setExpandedInfo(prev => (prev === infoId ? null : infoId));
    };

    return (
        <Container>
            <Form onSubmit={handleSearch}>
                <InputContainer>
                    <SearchKeyInput
                        placeholder="Search here..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <SearchIcon onClick={() => handleSearch()} />
                </InputContainer>
            </Form>

            <InfoDisplayControler results={results} hasSearched={hasSearched} />

        </Container>
    );
};

export default SearchContainer;
