import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import topicService from '../services/topicService';
import authApi from '../api/authApi';
import Breadcrumb from './Breadcrumb';

const TopicTreeView = ({ topicId, onNavigate }) => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSubtopicTitle, setNewSubtopicTitle] = useState('');
  const [createMessage, setCreateMessage] = useState({ message: '', success: false });

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await topicService.getTopicChildren(topicId);
        setData(result);
      } catch (err) {
        if (err.response?.status === 404) {
          navigate('/topics');
        } else {
          setError('Failed to load topic children');
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    if (topicId) {
      fetchChildren();
    }
  }, [topicId, navigate]);

  const handleCreateSubtopic = async (e) => {
    e.preventDefault();

    if (newSubtopicTitle.trim() === '') {
      setCreateMessage({ message: 'Topic title cannot be empty.', success: false });
      setTimeout(() => setCreateMessage({ message: '', success: false }), 3000);
      return;
    }

    try {
      const response = await authApi.post('/api/v1/topic/create', {
        title: newSubtopicTitle,
        parent: data.topic.name,
      });

      if (response.status === 201) {
        setCreateMessage({ message: 'Subtopic created successfully!', success: true });
        setNewSubtopicTitle('');
        setShowAddForm(false);

        // Refresh children list
        const updatedData = await topicService.getTopicChildren(topicId);
        setData(updatedData);

        setTimeout(() => setCreateMessage({ message: '', success: false }), 3000);
      }
    } catch (err) {
      setCreateMessage({ message: 'Failed to create subtopic.', success: false });
      console.error(err);
      setTimeout(() => setCreateMessage({ message: '', success: false }), 3000);
    }
  };

  if (loading) {
    return <Container>Loading...</Container>;
  }

  if (error) {
    return <Container>{error}</Container>;
  }

  if (!data) {
    return <Container>No data</Container>;
  }

  const { topic, breadcrumb, subtopics, infos } = data;

  const hasSubtopics = subtopics && subtopics.length > 0;
  const hasInfos = infos && infos.length > 0;
  const isEmpty = !hasSubtopics && !hasInfos;

  return (
    <Container>
      {breadcrumb && breadcrumb.length > 0 && <Breadcrumb items={breadcrumb} />}

      <TopicHeader>{topic.name}</TopicHeader>

      <AddSubtopicButton onClick={() => setShowAddForm(!showAddForm)}>
        {showAddForm ? '✕ Cancel' : '+ Add Subtopic'}
      </AddSubtopicButton>

      {showAddForm && (
        <AddForm onSubmit={handleCreateSubtopic}>
          <FormInput
            type="text"
            placeholder="Subtopic Name"
            value={newSubtopicTitle}
            onChange={(e) => setNewSubtopicTitle(e.target.value)}
            required
          />
          <FormButton type="submit">Create</FormButton>
          {createMessage.message && (
            <FormFeedback $success={createMessage.success}>
              {createMessage.message}
            </FormFeedback>
          )}
        </AddForm>
      )}

      {isEmpty && (
        <EmptyMessage>This topic has no subtopics or entries.</EmptyMessage>
      )}

      {hasSubtopics && (
        <Section>
          <SectionTitle>Subtopics</SectionTitle>
          <ItemList>
            {subtopics.map((subtopic) => (
              <ListItem key={subtopic.id}>
                <ItemLink onClick={() => onNavigate(subtopic.id)}>
                  {subtopic.has_children && <FolderIcon>📁</FolderIcon>}
                  {!subtopic.has_children && <FileIcon>📄</FileIcon>}
                  {subtopic.name}
                </ItemLink>
              </ListItem>
            ))}
          </ItemList>
        </Section>
      )}

      {hasInfos && (
        <Section>
          <SectionTitle>Entries</SectionTitle>
          <ItemList>
            {infos.map((info) => (
              <ListItem key={info.id}>
                <EntryItem>{info.key}</EntryItem>
              </ListItem>
            ))}
          </ItemList>
        </Section>
      )}
    </Container>
  );
};

const Container = styled.div`
  padding: 20px;
`;

const TopicHeader = styled.h2`
  margin: 0 0 20px 0;
  color: #ecf0f1;
`;

const Section = styled.div`
  margin-bottom: 30px;
`;

const SectionTitle = styled.h3`
  color: #3498db;
  border-bottom: 2px solid #3498db;
  padding-bottom: 10px;
  margin-bottom: 15px;
`;

const ItemList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ListItem = styled.li`
  margin-bottom: 8px;
`;

const ItemLink = styled.button`
  background: none;
  border: none;
  color: #ecf0f1;
  cursor: pointer;
  font-size: 1em;
  padding: 8px;
  text-align: left;
  width: 100%;
  transition: background-color 0.2s;

  &:hover {
    background-color: #34495e;
    border-radius: 4px;
  }
`;

const FolderIcon = styled.span`
  margin-right: 8px;
`;

const FileIcon = styled.span`
  margin-right: 8px;
`;

const EntryItem = styled.div`
  color: #95a5a6;
  padding: 8px;
  font-size: 0.95em;
`;

const EmptyMessage = styled.p`
  color: #95a5a6;
  font-style: italic;
  padding: 20px;
  text-align: center;
`;

const AddSubtopicButton = styled.button`
  background-color: #27ae60;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.95em;
  margin-bottom: 15px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #229954;
  }
`;

const AddForm = styled.form`
  background-color: #34495e;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FormInput = styled.input`
  padding: 8px;
  border: none;
  border-radius: 4px;
  font-size: 0.95em;
  background-color: #2c3e50;
  color: #ecf0f1;

  &::placeholder {
    color: #95a5a6;
  }
`;

const FormButton = styled.button`
  background-color: #27ae60;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.95em;
  transition: background-color 0.2s;

  &:hover {
    background-color: #229954;
  }
`;

const FormFeedback = styled.p`
  color: ${props => (props.$success ? '#27ae60' : '#e74c3c')};
  margin: 0;
  font-size: 0.9em;
`;

export default TopicTreeView;
