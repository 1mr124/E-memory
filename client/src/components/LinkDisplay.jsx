import React from 'react';
import styled from 'styled-components';

const LinkContainer = styled.div`
    margin: 10px 0;
    text-align: left;
    width: 100%;

    @media (max-width: 768px) {
        text-align: center;
    }
`;

const LinkHeader = styled.h4`
    color: #fff;
`;

const StyledLink = styled.a`
    color: #1abc9c;
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
`;

const LinkComment = styled.em`
    color: #888;
    display: block;
    margin-top: 5px;
`;

const LinkDisplay = ({ infoLinks }) => {
    return (
        <LinkContainer>
            {Array.isArray(infoLinks) && infoLinks.length > 0 ? (
                infoLinks.map((linkObj, index) => (
                    <div key={index}>
                        {linkObj.header && <LinkHeader>{linkObj.header}</LinkHeader>}
                        <StyledLink href={linkObj.path} target="_blank" rel="noopener noreferrer">
                            {linkObj.path}
                        </StyledLink>
                        {linkObj.comment && <LinkComment>({linkObj.comment})</LinkComment>}
                    </div>
                ))
            ) : (
                <p>No Links found.</p>
            )}
        </LinkContainer>
    );
};

export default LinkDisplay;
