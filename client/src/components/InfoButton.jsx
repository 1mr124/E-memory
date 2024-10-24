import React from 'react';
import styled from 'styled-components';




const KeyButton = styled.button`
    background-color: #34495e;
    color: #e0f7fa;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin: 0 3px;

    &:hover {
        background-color: #2e3d60;
    }
`;


const InfoButton = ({ info, onClick }) => {
    return (

        <KeyButton  onClick={() => onClick(info)}>
                            {info.title || info.key} {/* Display title or key if title is not available */}
        </KeyButton>

        
    );
};

export default InfoButton;
