import React, { useState } from 'react';
import styled from 'styled-components';
import Navigation from './Navigation'; // Import Navigation
import Text from './Text';
import Link from './Link';
import Pic from './Pic';

const InfoContainer = () => {
    const [activeInput, setActiveInput] = useState('text');

     // State to hold text, link, and pic inputs
     const [texts, setTexts] = useState([{ headline: '', text: '', comment: '' }]);
     const [links, setLinks] = useState([{ headline: '', link: '', comment: '' }]);
     const [pics, setPics] = useState([{ headline: '', pic: '', comment: '' }]); // If you have a pic component
 
     const renderInput = () => {
         switch (activeInput) {
             case 'text':
                 return <Text texts={texts} setTexts={setTexts} />;
             case 'link':
                 return <Link links={links} setLinks={setLinks} />;
             case 'pics':
                 return <Pic pics={pics} setPics={setPics} />;
             default:
                 return null;
         }
     };
 
     return (
         <Container>
             <Navigation activeInput={activeInput} setActiveInput={setActiveInput} />
             <Form>{renderInput()}</Form>
             <SubmitButton type="submit">Add Info</SubmitButton>
         </Container>
     );
 };

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start; /* Change to flex-start */
    width: 90%; /* 90% of the viewport width */
    max-width: 800px; /* Max width for larger screens */
    height: auto; /* Adjust height automatically */
    background-color: #1c2a39; // Light background
    border-radius: 8px; /* Rounded corners */
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Subtle shadow */
    margin: auto; /* Center horizontally */
    height:665px;
`;

const Nav = styled.nav`
    display: flex;
    justify-content: space-around;
    width: 100%;
    margin-bottom: 20px;
`;

const NavItem = styled.div`
    cursor: pointer;
    padding: 10px 20px;
    background-color: transparent;
    transition: background-color 0.3s;
    
    &:hover {
        background-color: #1da1f2; /* Hover color */
        color: white; /* Change text color on hover */
    }
`;

const Form = styled.form`
    width: 100%;
`;

const SubmitButton = styled.button`
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #0056b3;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom:20px;

    
`;

export default InfoContainer;
