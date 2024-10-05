import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';
import api from '../api'; // Import the API

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
`;

const Form = styled.form`
    width: 100%;
`;

const InputContainer = styled.div`
    position: relative;
    display: flex;
    width: 100%;
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

const Button = styled.button`
    background-color: #34495e;
    color: #e0f7fa;
    border: none;
    padding: 10px;
    margin: 5px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1em;
    &:hover {
        background-color: #2c3e50;
    }
`;

const InfoDetails = styled.div`
    margin-top: 10px;
    padding: 10px;
    border: 1px solid #e0f7fa;
    border-radius: 4px;
`;

const SearchContainer = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [expandedInfo, setExpandedInfo] = useState(null); // Track which info is expanded

    const handleSearch = async (e) => {
        if (e) {
            e.preventDefault(); // Only prevent default if event is defined
        }
        if (!searchTerm) {
            setResults([]); // Clear results if search term is empty
            return;
        }
  
        try {
            const token = sessionStorage.getItem('authToken');

            const response = await api.get(`/search?searchKey=${searchTerm}`, {
                headers: {
                    Authorization: `Bearer ${token}`  // Include the token in the Authorization header
                }
            });

            setResults(response.data); // Set results directly from the response
            setExpandedInfo(null); // Reset expanded info when new results are fetched
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            handleSearch(); // Call handleSearch after the debounce delay
        }, 500); // Delay to prevent too many API calls

        return () => clearTimeout(delayDebounceFn); // Cleanup on unmount or when searchTerm changes
    }, [searchTerm]); // Fetch results whenever the search term changes

    const handleInfoButtonClick = (infoId) => {
        // Toggle the details for the clicked info
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
            <ResultsList>
                {Array.isArray(results) && results.length > 0 ? (
                    results.map((info) => (
                        <ResultItem key={info.id}>
                            <Button onClick={() => handleInfoButtonClick(info.id)}>
                                {info.key} {/* You can change this to display another field if you prefer */}
                            </Button>
                            {/* Show details of the selected info */}
                            {expandedInfo === info.id && (
                                <InfoDetails>
                                    <h3>Details for: {info.key}</h3>
                                    <h4>Texts:</h4>
                                    {info.texts.map((text, index) => (
                                        <div key={index}>
                                            <strong>{text.header}</strong>: {text.text} <br />
                                            <em>{text.comment}</em>
                                        </div>
                                    ))}
                                    <h4>Links:</h4>
                                    {info.links.length > 0 ? (
                                        info.links.map((link, index) => (
                                            <div key={index}>
                                                <strong>{link.header}</strong>: <a href={link.path} target="_blank" rel="noopener noreferrer">{link.path}</a>
                                                <em>{link.comment}</em>
                                            </div>
                                        ))
                                    ) : (
                                        <div>No links available.</div>
                                    )}
                                    <h4>Pictures:</h4>
                                    {info.pics.length > 0 ? (
                                        info.pics.map((pic, index) => (
                                            <img key={index} src={pic.path} alt={pic.comment} style={{ width: '100px', height: '100px', margin: '5px' }} />
                                        ))
                                    ) : (
                                        <div>No pictures available.</div>
                                    )}
                                </InfoDetails>
                            )}
                        </ResultItem>
                    ))
                ) : (
                    <ResultItem>No results found.</ResultItem>
                )}
            </ResultsList>
        </Container>
    );
};

export default SearchContainer;
