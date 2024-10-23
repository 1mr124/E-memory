import React from 'react';
import styled from 'styled-components';

const TextContainer = styled.div`
    margin: 10px 0;
    text-align: left;
    width: 100%;

    @media (max-width: 768px) {
        text-align: center;
    }
`;

const Header = styled.h4`
    color: #fff;
    margin: 0;
`;

const Paragraph = styled.p`
    color: #ccc;
`;

const Comment = styled.em`
    color: #888;
    display: block;
    margin-top: 5px;
`;

const TextDisplay = ({ infoTexts }) => {
    return (
        <TextContainer>
            {Array.isArray(infoTexts) && infoTexts.length > 0 ? (
                infoTexts.map((textObj, index) => (
                    <div key={index}>
                        {textObj.header && <Header>{textObj.header}</Header>}
                        <Paragraph>{textObj.text}</Paragraph>
                        {textObj.comment && <Comment>({textObj.comment})</Comment>}
                    </div>
                ))
            ) : (
                <p>No Text found.</p>
            )}
        </TextContainer>
    );
};

export default TextDisplay;
