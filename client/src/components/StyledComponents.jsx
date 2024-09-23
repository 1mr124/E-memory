// StyledComponents.js
import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 90%;
    max-width: 400px;
    background-color: #1c2a39;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    margin: 50px auto;
    padding: 20px;
    color: #e0f7fa;
`;

export const Nav = styled.nav`
    display: flex;
    justify-content: space-around;
    width: 100%;
    margin-bottom: 20px;
    background-color: #34495e;
    padding: 10px 0;
    border-radius: 8px;
    font-weight: bold;
    font-size: 1.2em;
`;

export const NavItem = styled.div`
    cursor: pointer;
    padding: 10px 20px;
    color: ${({ $active }) => ($active ? '#fff' : '#bdc3c7')};
    border-bottom: ${({ $active }) => ($active ? '2px solid #e0f7fa' : 'none')};
    transition: color 0.3s, border-bottom 0.3s;

    &:hover {
        color: #fff;
    }
`;

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

export const Label = styled.label`
    margin-bottom: 5px;
    font-size: 1em;
`;

export const Input = styled.input`
    padding: 10px;
    margin-bottom: 15px;
    border: none;
    border-radius: 5px;
    outline: none;
    font-size: 1em;
`;

export const SubmitButton = styled.button`
    padding: 10px;
    background-color: #0056b3;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1em;
    transition: background-color 0.3s;

    &:hover {
        background-color: #003d80;
    }
`;
