import React, { useState } from 'react';
import styled from 'styled-components';
import Navigation from './Navigation';
import Text from './Text';
import Link from './Link';
import Pic from './Pic';
import authApi from '../api/authApi';
import InfoSearchKey from './InfoSearchKey';

const InfoContainer = () => {
    const [activeInput, setActiveInput] = useState('text');
    const navItems = [
        { label: 'Text', value: 'text' },
        { label: 'Link', value: 'link' },
        { label: 'Pics', value: 'pics' },
    ];

    // State to hold text, link, and pic inputs
    const [texts, setTexts] = useState([{ headline: '', text: '', comment: '' }]);
    const [links, setLinks] = useState([{ headline: '', link: '', comment: '' }]);
    const [pics, setPics] = useState([{ headline: '', pic: null, comment: '' }]);
    const [topicId, setTopicId] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        const searchKey = document.querySelector('#searchKey').value;
    
        formData.append('key', searchKey); // Append search key
        formData.append('topic_id', topicId); // Append topic ID
    
        // Append texts and links as JSON strings
        formData.append('texts', JSON.stringify(texts));
        formData.append('links', JSON.stringify(links));
    
        // Append each image file individually with the key 'Pic-File'
        pics.forEach((item) => {
            if (item.pic) {
                formData.append('Pic-File', item.pic); // each image goes under 'Pic-File'
            }
        });
    
        try {
            const response = await authApi.post('/api/v1/info', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Info added:', response.data);

            // Reset input states after successful submission
            setTexts([{ headline: '', text: '', comment: '' }]);
            setLinks([{ headline: '', link: '', comment: '' }]);
            setPics([{ headline: '', pic: null, comment: '' }]); // Reset pics state
            setTopicId('');  // Reset topicId or set it to default if needed

            // Optionally, reset the active input state (if required)
            setActiveInput('text');
        } catch (error) {
            if (error.response) {
                console.error('Server responded with:', error.response.data);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error setting up request:', error.message);
            }
        }
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

export default InfoContainer;
