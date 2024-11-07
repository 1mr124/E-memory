import React, { useState } from 'react';
import styled from 'styled-components';
import Navigation from './Navigation';
import Text from './Text';
import Link from './Link';
import Pic from './Pic';
import authApi from '../api/authApi';
import InfoSearchKey from './InfoSearchKey';

const InfoContainer = () => {
    const [feedbackMessage, setFeedbackMessage] = useState({ message: '', success: false });
    const [activeInput, setActiveInput] = useState('text');
    const navItems = [
        { label: 'Text', value: 'text' },
        { label: 'Link', value: 'link' },
        { label: 'Pics', value: 'pics' }
    ];

    // State to hold text, link, and pic inputs
    const [texts, setTexts] = useState([{ headline: '', text: '', comment: '' }]);
    const [links, setLinks] = useState([{ headline: '', link: '', comment: '' }]);
    const [pics, setPics] = useState([{ headline: '', pic: null, comment: '' }]);
    
    // Add state for topic ID
    const [topicId, setTopicId] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        const searchKey = document.querySelector('#searchKey').value;
        
                
        formData.append('key', searchKey); // Append search key
        
        // Check if topicId is a valid number and not empty
        if (!topicId || isNaN(topicId)) {
            setFeedbackMessage({ message: 'Failed to add topic. Please select a Valid Topic.', success: false });
            return; // Don't proceed if topicId is invalid
        }

        formData.append('topic_id', topicId); // Append topic ID

         // Create arrays to hold texts, links, and pics
        const allTexts = [];
        const allLinks = [];
        const allPics = [];

        // Collect all texts
        texts.forEach((item) => {
            allTexts.push(item);
        });

        // Collect all links
        links.forEach((item) => {
            allLinks.push(item);
        });

        // Collect all pics
        pics.forEach((item) => {
            allPics.push(item);
        });

        // Append the arrays to FormData as JSON strings
        formData.append('texts', JSON.stringify(allTexts));
        formData.append('links', JSON.stringify(allLinks));
        formData.append('files', JSON.stringify(allPics));

        // Append pic files if any
        pics.forEach((item) => {
            if (item.pic) {
                formData.append('Pic-File', item.pic); // Append actual files separately
            }
        });


        // Use axios request with .then() and .catch() instead of async/await
        authApi.post('/api/v1/info', formData, {
            headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
    .then((response) => {
        if (response.status === 200 && response.statusText === "OK" ){
            setFeedbackMessage({ message: 'Info created.', success: true });

        }

        // Reset input states after submission if needed
        if (activeInput === 'text') setTexts([{ headline: '', text: '', comment: '' }]);
        if (activeInput === 'link') setLinks([{ headline: '', link: '', comment: '' }]);
        if (activeInput === 'pics') setPics([{ headline: '', pic: null, comment: '' }]);
        setTopicId('');
    })
    .catch((error) => {
        if (error.response) {
            console.error('Server responded with:', error.response.data); // Log server response
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('Error setting up request:', error.message);
        }
    });
    
};

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
            <Navigation activeInput={activeInput} setActiveInput={setActiveInput} navItems={navItems} />
            <Form onSubmit={handleSubmit}>
                {renderInput()}
                <InfoSearchKey setTopicId={setTopicId} />
                <SubmitButton type="submit">Add Info</SubmitButton>
                
                {/* Feedback message display */}
                {feedbackMessage.message && (
                <Feedback $success={feedbackMessage.success}>{feedbackMessage.message}</Feedback>
                 )}
            
            </Form>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 90%;
    max-width: 800px;
    background-color: #1c2a39;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    margin: auto;
    height: 710px;
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
    margin-bottom: 20px;
`;


const Feedback = styled.p`
    color: ${props => props.$success ? 'green' : 'red'};
    margin-top: 8px;
`;

export default InfoContainer;
