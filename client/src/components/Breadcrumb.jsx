import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Breadcrumb = ({ items }) => {
  const navigate = useNavigate();

  if (!items || items.length === 0) {
    return null;
  }

  const handleNavigate = (topicId) => {
    navigate(`/topics/${topicId}`);
  };

  return (
    <Container>
      <BreadcrumbItem onClick={() => navigate('/topics')}>
        Topics
      </BreadcrumbItem>
      {items.map((item, index) => (
        <React.Fragment key={item.id}>
          <Separator>›</Separator>
          <BreadcrumbItem
            isActive={index === items.length - 1}
            onClick={() => handleNavigate(item.id)}
          >
            {item.name}
          </BreadcrumbItem>
        </React.Fragment>
      ))}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  padding: 10px;
  background-color: #34495e;
  border-radius: 4px;
  flex-wrap: wrap;
`;

const BreadcrumbItem = styled.button`
  background: none;
  border: none;
  color: ${props => (props.isActive ? '#ecf0f1' : '#3498db')};
  cursor: ${props => (props.isActive ? 'default' : 'pointer')};
  font-size: 0.95em;
  padding: 0;
  text-decoration: ${props => (props.isActive ? 'none' : 'underline')};
  transition: color 0.2s;

  &:hover {
    color: ${props => (props.isActive ? '#ecf0f1' : '#1abc9c')};
  }
`;

const Separator = styled.span`
  color: #7f8c8d;
  margin: 0 4px;
`;

export default Breadcrumb;
