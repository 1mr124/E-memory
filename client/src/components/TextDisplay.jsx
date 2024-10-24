import React from 'react';
import { Container, Headline, Paragraph, Comment } from './sharedStyles'; // Import shared styles

const TextDisplay = ({ infoTexts }) => {
    return (
        <Container>
            {Array.isArray(infoTexts) && infoTexts.length > 0 ? (
                infoTexts.map((textObj, index) => (
                    <div key={index}>
                        {textObj.header && <Headline>{textObj.header}</Headline>}
                        <Paragraph>{textObj.text}</Paragraph>
                        {textObj.comment && <Comment>({textObj.comment})</Comment>}
                    </div>
                ))
            ) : (
                <Paragraph>No Text found.</Paragraph>
            )}
        </Container>
    );
};

export default TextDisplay;
