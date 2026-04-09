import React from 'react';
import { Container, Headline, Comment } from './sharedStyles';
import styled from 'styled-components';
import { media } from './sharedStyles';

const StyledLink = styled.a`
    color: #1abc9c;
    text-decoration: none;
    word-break: break-all;

    ${media.mobile`
        min-height: 44px;
        display: inline-flex;
        align-items: center;
    `}

    &:hover {
        text-decoration: underline;
    }
`;

const LinkDisplay = ({ infoLinks }) => {
    return (
        <Container>
            {Array.isArray(infoLinks) && infoLinks.length > 0 ? (
                infoLinks.map((linkObj, index) => (
                    <div key={index}>
                        {linkObj.header && <Headline>{linkObj.header}</Headline>}
                        <StyledLink href={linkObj.path} target="_blank" rel="noopener noreferrer">
                            {linkObj.path}
                        </StyledLink>
                        {linkObj.comment && <Comment>({linkObj.comment})</Comment>}
                    </div>
                ))
            ) : (
                <p>No Links found.</p>
            )}
        </Container>
    );
};

export default LinkDisplay;
