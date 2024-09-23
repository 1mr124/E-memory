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

const SearchContainer = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = async (e) => {
      if (e) {
          e.preventDefault(); // Only prevent default if event is defined
      }
      if (!searchTerm) {
          setResults([]); // Clear results if search term is empty
          return;
      }
  
      try {
          console.log("Fetching results...");
          const response = await api.get(`/search?searchKey=${searchTerm}`);
            
          // Check if response contains the 'all_info' property and is an array
          if (response.data && Array.isArray(response.data.all_info)) {
            console.log(response.data.all_info);
            setResults(response.data.all_info); // Set results from 'all_info'
          } else {
              console.error('Unexpected response format:', response.data);
              setResults([]); // Clear results if format is unexpected
          }
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
                            <strong>Key:</strong> {info.key} <br />
                            <strong>Timestamp:</strong> {new Date(info.timestamp).toLocaleString()} <br />
                            <strong>Topic ID:</strong> {info.topic_id} <br />
                            <strong>User ID:</strong> {info.user_id}
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
