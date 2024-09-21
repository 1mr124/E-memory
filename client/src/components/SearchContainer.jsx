import React, { useState } from 'react';
import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';

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
    position: relative; /* Set position to relative */
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
    padding-right: 40px; /* Add padding for the icon space */
    text-align: left;
    margin-bottom: 10px;
    border-radius: 4px; /* Optional: add some border radius */
    font-size: 1.2em;
`;

const SearchIcon = styled(FaSearch)`
    position: absolute; /* Position it absolutely */
    right: 15px;
    top: 43%;
    transform: translateY(-50%); /* Center it properly */
    color: #e0f7fa;
    cursor: pointer;
    font-size: 1.4em;
`;

const SubmitButton = styled.button`
    padding: 10px 20px;
    background-color: #0056b3;
    color: white;
    border: none;
    border-radius: 2px;
    cursor: pointer;
    margin-bottom: 20px;
    width: 17%;
`;

const SearchContainer = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm);
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
          <SearchIcon onClick={handleSearch} />
        </InputContainer>
      </Form>
    </Container>
  );
};

export default SearchContainer;
