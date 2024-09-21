import React, { useState } from 'react';
import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa'; // Search icon

// Navigation Component
const Navigation = ({ activeInput, setActiveInput }) => {
    const navItems = [
        { label: 'Search', value: 'search' },
        { label: 'Add Topic', value: 'add' },
        { label: 'Delete Topic', value: 'delete' }
    ];

    return (
        <Nav>
            {navItems.map((item) => (
                <NavItem
                    key={item.value}
                    onClick={() => setActiveInput(item.value)}
                    active={activeInput === item.value}
                >
                    {item.label}
                </NavItem>
            ))}
        </Nav>
    );
};

const Nav = styled.nav`
    display: flex;
    justify-content: space-around;
    width: 100%;
    margin-bottom: 15px;
    background-color: #34495e;
    padding: 10px 0;
    border-radius: 8px 8px 0 0;
    font-weight: bold;
    font-size: 1.4em;
`;

const NavItem = styled.div`
    cursor: pointer;
    padding: 10px 20px;
    color: ${({ active }) => (active ? '#fff' : 'black')};
`;

// Main TopicsContainer Component
const TopicsContainer = () => {
    const [activeInput, setActiveInput] = useState('search');
    const [topics, setTopics] = useState([{ title: '', description: '' }]);
    const [searchTerm, setSearchTerm] = useState('');

    const renderInput = () => {
        switch (activeInput) {
            case 'search':
                return (
                    <SearchInput
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                    />
                );
            case 'add':
                return <AddTopicForm topics={topics} setTopics={setTopics} />;
            case 'delete':
                return <DeleteTopic topics={topics} setTopics={setTopics} />;
            default:
                return null;
        }
    };

    return (
        <Container>
            <Navigation activeInput={activeInput} setActiveInput={setActiveInput} />
            <Form>{renderInput()}</Form>
        </Container>
    );
};

// Search Input Component
const SearchInput = ({ searchTerm, setSearchTerm }) => {
    return (
        <InputContainer>
            <Input
                type="text"
                placeholder="Search topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SubmitButton type="submit">Search Topic</SubmitButton>

        </InputContainer>
    );
};

const InputContainer = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    flex-direction: column;
`;

const Input = styled.input`
    flex: 1;
    background-color: #34495e;
    color: #e0f7fa;
    border: none;
    outline: none;
    padding: 10px;
    margin-bottom: 10px;
`;

const SearchIcon = styled(FaSearch)`
    color: #e0f7fa;
    cursor: pointer;
    font-size: 1.4em;
    margin-left: 10px;
`;

// Add Topic Form Component
const AddTopicForm = ({ topics, setTopics }) => {
    const [newTopic, setNewTopic] = useState({ title: '', description: '' });

    const handleAddTopic = (e) => {
        e.preventDefault();
        setTopics([...topics, newTopic]);
        setNewTopic({ title: '', description: '' });
    };

    return (
        <Form onSubmit={handleAddTopic}>
            <Input
                type="text"
                placeholder="Topic Name"
                value={newTopic.title}
                onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
            />
            <Input
                type="text"
                placeholder="Parent"
                value={newTopic.description}
                onChange={(e) => setNewTopic({ ...newTopic, description: e.target.value })}
            />
            <SubmitButton type="submit">Add Topic</SubmitButton>
        </Form>
    );
};

// Delete Topic Component
const DeleteTopic = ({ topics, setTopics }) => {
    const [titleToDelete, setTitleToDelete] = useState('');

    const handleDeleteTopic = (e) => {
        e.preventDefault();
        setTopics(topics.filter(topic => topic.title !== titleToDelete));
        setTitleToDelete('');
    };

    return (
        <Form onSubmit={handleDeleteTopic}>
            <Input
                type="text"
                placeholder="Topic to delete"
                value={titleToDelete}
                onChange={(e) => setTitleToDelete(e.target.value)}
            />
            <SubmitButton type="submit">Delete Topic</SubmitButton>
        </Form>
    );
};

// Styled components for TopicsContainer
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

export default TopicsContainer;
