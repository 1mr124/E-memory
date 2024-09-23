import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../api'; 

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


const ResultsList = styled.ul`
    list-style-type: none;
    padding: 0;
    margin-top: 10px;
    width: 80%;
    margin: auto;
`;

const ResultItem = styled.li`
    background-color: rgba(224, 247, 250, 0.5);
    padding: 10px;
    margin: 5px 0;
    border-radius: 5px;
`;

const InfoSearchKey = () => {
    const [searchKey, setSearchKey] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = async () => {
        if (!searchKey) {
            setResults([]); // Clear results if search key is empty
            return;
        }

        try {
            const response = await api.get(`/info?search=${searchKey}`); 
            setResults(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            handleSearch();
        }, 300); // Delay to prevent too many API calls

        return () => clearTimeout(delayDebounceFn); // Cleanup on unmount or when searchKey changes
    }, [searchKey]); // Fetch results whenever the search key changes


return (
        <>
            <SearchWrapper>
                <SearchKeyInput
                    type="text"
                    placeholder="Search Key"
                    value={searchKey}
                    onChange={(e) => setSearchKey(e.target.value)}
                />
            </SearchWrapper>
            <ResultsList>
                {results.map((info, index) => (
                    <ResultItem key={index}>{info.headline}: {info.text}</ResultItem>
                ))}
            </ResultsList>
        </>
    );
};

export default InfoSearchKey;
