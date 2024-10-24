// sharedStyles.js
import styled from 'styled-components';

// Shared Container Style
export const Container = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow: hidden; 
`;

// Shared ButtonsContainer Style
export const ButtonsContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 10px;
    margin: auto;
    justify-content: center;
`;

// Shared Wrapper (for LinkWrapper and PicWrapper)
export const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    justify-content: center;
    width: 80%;
`;

// Shared Input
export const Input = styled.input`
    width: 80%;
    background-color: ${(props) => props.bgColor || '#15202b'};
    color: ${(props) => props.color || '#e0f7fa'};
    border: none;
    outline: none;
    padding: 10px;
    text-align: center;
    font-weight: bold;
    font-size: 1.2em;
`;

// Shared Headline (can be used for both Header and Headline)
export const Headline = styled.h4`
    color: #e0f7fa;
    margin: 0;
    font-weight: bold;
    text-align: center;
`;

// Shared Paragraph style
export const Paragraph = styled.p`
    color: #ccc;
`;

// Shared Comment style
export const Comment = styled.em`
    color: #888;
    display: block;
    margin-top: 5px;
`;

// Shared Add Button Style
export const AddButton = styled.button`
    background-color: #1da1f2;
    color: white;
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    width: 120px;
    align-self: center;

    &:hover {
        background-color: #0d86d1;
    }
`;

// Shared Delete Button Style
export const DeleteButton = styled.button`
    background-color: transparent;
    border: none;
    cursor: pointer;
    color: #e0f7fa;
    margin-top: 3px;

    &:hover {
        color: #ff4d4d;
    }
`;
