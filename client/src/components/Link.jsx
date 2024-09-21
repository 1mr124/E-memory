import React, { useState } from 'react';
import styled from 'styled-components';
import { FaTrashAlt } from 'react-icons/fa';

const Container = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow: hidden; // need to be Fixed
`;

const ButtonsContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 10px;
    margin: auto;
    justify-content: center;
`;

const LinkContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 10px;
    margin: auto;
    justify-content: center;
`;

const LinkWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    justify-content: center;
    width: 80%;
`;

const LinkHeadline = styled.input`
    width: 80%;
    background-color: transparent;
    color: #e0f7fa;
    border: none;
    outline: none;
    padding: 10px;
    text-align: center;
    font-weight: bold;
    font-size: 1.2em;
`;

const LinkInput = styled.input`
    width: 80%;
    background-color: #15202b;
    color: #e0f7fa;
    border: none;
    outline: none;
    padding: 10px;
    text-align: center;
    font-weight: bold;
    font-size: 1.2em;
`;

const LinkComment = styled.input`
    width: 80%;
    background-color: transparent;
    color: #e0f7fa;
    border: none;
    outline: none;
    padding: 10px;
    text-align: center;
    font-weight: bold;
    font-size: 1.2em;
`;

const CollapsedButton = styled.button`
    background-color: #34495e;
    color: #e0f7fa;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        background-color: #2e3d60;
    }
`;

const AddButton = styled.button`
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

const DeleteButton = styled.button`
    background-color: transparent;
    border: none;
    cursor: pointer;
    color: #e0f7fa;
    margin-top: 3px;

    &:hover {
        color: #ff4d4d;
    }
`;

const CollapsedContainer = styled.div`
    display: flex;
    align-items: center;
    flex-direction: row;
    background-color: #34495e;
    color: #e0f7fa;
    cursor: pointer;
    height: 35px;
    border-radius: 5px;
`;

const ButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 10px;
`;

const Link = ({ links, setLinks }) => {
    const [visibleIndex, setVisibleIndex] = useState(0);

    const handleChange = (index, field, value) => {
        const newLinks = [...links];
        newLinks[index][field] = value;
        setLinks(newLinks);
    };

    const addLink = (e) => {
        e.preventDefault(); // Prevent page reload
        setLinks([...links, { headline: '', link: '', comment: '' }]);
        setVisibleIndex(links.length); // Show the new input
    };

    const toggleVisible = (e, index) => {
        e.preventDefault(); // Prevent page reload
        setVisibleIndex(index);
    };

    const deleteLink = (e, index) => {
        e.preventDefault(); // Prevent page reload
        const newLinks = links.filter((_, i) => i !== index);
        setLinks(newLinks);
        if (visibleIndex >= index) {
            setVisibleIndex(visibleIndex - 1);
        }
    };

    return (
        <Container>
            <ButtonsContainer>
                {links.map((_, index) => (
                    <CollapsedContainer key={index}>
                        <CollapsedButton onClick={(e) => toggleVisible(e, index)}>
                            Link {index + 1}
                        </CollapsedButton>
                        {index !== 0 && (
                            <DeleteButton onClick={(e) => deleteLink(e, index)}>
                                <FaTrashAlt />
                            </DeleteButton>
                        )}
                    </CollapsedContainer>
                ))}
            </ButtonsContainer>

            <LinkContainer>
                {links.map((link, index) => (
                    visibleIndex === index && (
                        <LinkWrapper key={index}>
                            <LinkHeadline
                                value={link.headline}
                                onChange={(e) => handleChange(index, 'headline', e.target.value)}
                                placeholder="Headline"
                            />
                            <LinkInput
                                value={link.link}
                                onChange={(e) => handleChange(index, 'link', e.target.value)}
                                placeholder="Link"
                            />
                            <LinkComment
                                value={link.comment}
                                onChange={(e) => handleChange(index, 'comment', e.target.value)}
                                placeholder="Comment"
                            />
                        </LinkWrapper>
                    )
                ))}
            </LinkContainer>

            <AddButton onClick={addLink}>Add New Link</AddButton>
        </Container>
    );
};

export default Link;