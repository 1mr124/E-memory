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

const TextContainer = styled.div`

    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 10px;
    margin: auto;
    justify-content: center;


`

const TextWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    justify-content: center;
`;

const Headline = styled.input`
    width: 80%;
    background-color: transparent;
    color: #e0f7fa;
    border: none;
    outline: none;
    padding: 10px;
    text-align: center;
`;

const Comment = styled.input`
    width: 80%;
    background-color: transparent;
    color: #e0f7fa;
    border: none;
    outline: none;
    padding: 10px;
    text-align: center;
`;

const TextArea = styled.textarea`
    width: 80%;
    background-color: transparent;
    color: #e0f7fa;
    border: none;
    outline: none;
    padding: 10px;
    resize: none;
    text-align: center;
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

const TextRow = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    gap: 5px;
`;

const CollapsedContainer = styled.div`
    display: flex;
    align-items: center;
    flex-direction: row;
    background-color: #34495e;
    color: #e0f7fa;
    cursor: pointer;
    height:35px;
    border-radius: 5px;
`;

const ButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 10px;
`;

const Text = () => {
    const [texts, setTexts] = useState([{ headline: '', text: '', comment: '' }]);
    const [visibleIndex, setVisibleIndex] = useState(0);

    const handleChange = (index, field, value) => {
        const newTexts = [...texts];
        newTexts[index][field] = value;
        setTexts(newTexts);
    };

    const addText = () => {
        setTexts([...texts, { headline: '', text: '', comment: '' }]);
        setVisibleIndex(texts.length); // Show the new text input
    };

    const toggleVisible = (index) => {
        setVisibleIndex(index);
    };

    const deleteText = (index) => {
        const newTexts = texts.filter((_, i) => i !== index);
        setTexts(newTexts);
        if (visibleIndex >= index) {
            setVisibleIndex(visibleIndex - 1);
        }
    };

    return (
        <Container>
            <ButtonsContainer>
    {texts.map((_, index) => (
        <CollapsedContainer key={index}>
            <CollapsedButton onClick={() => toggleVisible(index)}>
                Text {index + 1}
            </CollapsedButton>
            {index !== 0 && (
                <DeleteButton onClick={() => deleteText(index)}>
                    <FaTrashAlt />
                </DeleteButton>
            )}
        </CollapsedContainer>
    ))}
</ButtonsContainer>

            <TextContainer>
                {texts.map((text, index) => (
                    visibleIndex === index && (
                        <TextWrapper key={index}>
                            <Headline
                                value={text.headline}
                                onChange={(e) => handleChange(index, 'headline', e.target.value)}
                                placeholder="Headline"
                            />
                            <TextArea
                                value={text.text}
                                onChange={(e) => handleChange(index, 'text', e.target.value)}
                                placeholder="Text"
                            />
                            <Comment
                                value={text.comment}
                                onChange={(e) => handleChange(index, 'comment', e.target.value)}
                                placeholder="Comment"
                            />
                        </TextWrapper>
                    )
                ))}
            </TextContainer>

            <ButtonContainer>
                <AddButton onClick={addText}>Add New Text</AddButton>
            </ButtonContainer>
        </Container>
    );
};

export default Text;
