import React from 'react';
import { Container, Headline, Comment } from './sharedStyles';
import styled from 'styled-components';

const Image = styled.img`
    max-width: 100%;
    height: auto;
    border-radius: 8px;
`;

const PicDisplay = ({ infoPics }) => {
    return (
        <Container>
            {Array.isArray(infoPics) && infoPics.length > 0 ? (
                infoPics.map((picObj, index) => (
                    <div key={index}>
                        <Image src={picObj.path} alt={picObj.header || 'Image'} />
                        {picObj.header && <Headline>{picObj.header}</Headline>}
                        {picObj.comment && <Comment>{picObj.comment}</Comment>}
                    </div>
                ))
            ) : (
                <p>No Images found.</p>
            )}
        </Container>
    );
};

export default PicDisplay;
