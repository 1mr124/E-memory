import React from 'react';
import styled from 'styled-components';

const Navigation = ({ activeInput, setActiveInput }) => {
    return (
        <Nav>
            <NavItem onClick={() => setActiveInput('text')} active={activeInput === 'text'}>Text</NavItem>
            <NavItem onClick={() => setActiveInput('link')} active={activeInput === 'link'}>Link</NavItem>
            <NavItem onClick={() => setActiveInput('pics')} active={activeInput === 'pics'}>Pics</NavItem>
        </Nav>
    );
};

const Nav = styled.nav`
    display: flex;
    justify-content: space-around;
    width: 100%;
    margin-bottom: 15px;
    background-color: #34495e; /* Background color for navigation */
    padding: 10px 0; /* Optional: add some padding for aesthetics */
    border-radius: 8px 8px 0 0; /* Rounded corners on top */
    font-weight:bold;
    font-size: 1.4em;
    `;


const NavItem = styled.div`
    cursor: pointer;
    padding: 10px 20px;
    color: ${({ active }) => (active ? '#fff' : 'black')};
    
    
   
`;

export default Navigation;
