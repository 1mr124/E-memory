import React from 'react';
import styled from 'styled-components';

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
                <option value="Option 1" />
                <option value="Option 2" />
                <option value="Option 3" />
            </datalist>
        </SearchWrapper>
    );
};

export default InfoSearchKey;
