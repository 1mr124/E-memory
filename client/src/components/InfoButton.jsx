import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { media } from './sharedStyles';

const KeyButton = styled.button`
    background-color: #34495e;
    color: #e0f7fa;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin: 0 3px;
    text-align: left;
    width: 100%;

    ${media.mobile`
        width: 100%;
        min-height: 44px;
        margin: 4px 0;
    `}

    ${media.tabletPortrait`
        padding: 15px;
        margin: 5px 0;
    `}

    ${media.desktop`
        width: 100%;
    `}

    &:hover {
        background-color: #2e3d60;
    }
`;

const ButtonContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const KeyText = styled.div`
    font-weight: bold;
`;

const BreadcrumbPath = styled.div`
    font-size: 0.8em;
    color: #95a5a6;
    display: flex;
    align-items: center;
    gap: 4px;

    ${media.mobile`
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 100%;
    `}
`;

const BreadcrumbLink = styled.button`
    background: none;
    border: none;
    color: #3498db;
    cursor: pointer;
    padding: 0;
    text-decoration: underline;
    font-size: 0.8em;

    &:hover {
        color: #1abc9c;
    }
`;

const BreadcrumbSeparator = styled.span`
    color: #7f8c8d;
`;

const InfoButton = ({ info, onClick }) => {
    const navigate = useNavigate();

    const handleBreadcrumbClick = (e, topicId) => {
        e.stopPropagation();
        navigate(`/topics/${topicId}`);
    };

    const renderBreadcrumb = () => {
        if (!info.breadcrumb || info.breadcrumb.length === 0) {
            return null;
        }

        return (
            <BreadcrumbPath>
                {info.breadcrumb.map((item, index) => (
                    <React.Fragment key={item.id}>
                        {index > 0 && <BreadcrumbSeparator>›</BreadcrumbSeparator>}
                        <BreadcrumbLink onClick={(e) => handleBreadcrumbClick(e, item.id)}>
                            {item.name}
                        </BreadcrumbLink>
                    </React.Fragment>
                ))}
            </BreadcrumbPath>
        );
    };

    return (
        <KeyButton onClick={() => onClick(info)}>
            <ButtonContent>
                <KeyText>{info.title || info.key}</KeyText>
                {renderBreadcrumb()}
            </ButtonContent>
        </KeyButton>
    );
};

export default InfoButton;
