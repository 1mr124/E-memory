import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import InfoButton from './InfoButton';
import TextDisplay from './TextDisplay';
import LinkDisplay from './LinkDisplay';
import PicDisplay from './PicDisplay';
import { media } from './sharedStyles';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 90%;
    max-width: 800px;
    background-color: #1c2a39;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
    margin: 20px auto;
    gap: 20px;
    overflow-x: hidden;

    ${media.desktop`
        flex-direction: row;
        align-items: flex-start;
        justify-content: flex-start;
        width: 95%;
        max-width: 100%;
        padding: 10px;
    `}
`;

const ResultsPanel = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow-y: auto;
    max-height: calc(100vh - 300px);

    ${props => props.$collapsed && css`
        display: none;
    `}

    ${media.mobile`
        max-height: calc(100vh - 250px);
    `}

    ${media.tabletPortrait`
        gap: 15px;
        padding: 10px;
        max-height: calc(100vh - 280px);
    `}

    ${media.desktop`
        display: flex !important;
        width: 350px;
        min-width: 300px;
        max-height: calc(100vh - 200px);
        flex-shrink: 0;
    `}
`;

const ContentPanel = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    overflow-y: auto;
    word-wrap: break-word;
    overflow-wrap: break-word;

    ${media.tabletPortrait`
        gap: 25px;
        padding: 15px;
    `}

    ${media.desktop`
        flex: 1;
        min-width: 0;
        padding-left: 20px;
        border-left: 1px solid #34495e;
    `}
`;

const CollapsedResultsBar = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #34495e;
    padding: 15px;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 10px;

    ${media.desktop`
        display: none;
    `}
`;

const CollapsedTitle = styled.span`
    color: #e0f7fa;
    font-weight: bold;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const EmptyState = styled.div`
    color: #ccc;
    text-align: center;
    padding: 40px 20px;
    font-size: 1em;

    ${media.mobile`
        font-size: 0.9em;
        padding: 30px 15px;
    `}
`;

const InfoDisplayController = ({ results, hasSearched }) => {
    const [selectedInfo, setSelectedInfo] = useState(null);
    const [isResultsCollapsed, setIsResultsCollapsed] = useState(false);

    const handleClick = (info) => {
        setSelectedInfo(info);
        setIsResultsCollapsed(true);
    };

    const handleToggleCollapse = () => {
        setIsResultsCollapsed(!isResultsCollapsed);
    };

    const isEmptyState = Array.isArray(results) && results.length === 0;

    return (
        <Container>
            {selectedInfo && isResultsCollapsed && (
                <CollapsedResultsBar onClick={handleToggleCollapse}>
                    <CollapsedTitle>{selectedInfo.title || selectedInfo.key}</CollapsedTitle>
                    <FaChevronDown color="#e0f7fa" />
                </CollapsedResultsBar>
            )}

            <ResultsPanel $collapsed={isResultsCollapsed && !!selectedInfo}>
                {Array.isArray(results) && results.length > 0 ? (
                    results.map((info) => (
                        <InfoButton key={info.id} info={info} onClick={() => handleClick(info)} />
                    ))
                ) : (
                    <EmptyState>
                        {hasSearched ? (
                            <p>No results found.</p>
                        ) : (
                            <p>Search for your saved information above</p>
                        )}
                    </EmptyState>
                )}
            </ResultsPanel>

            <ContentPanel>
                {selectedInfo && (
                    <>
                        {selectedInfo.texts && selectedInfo.texts.length > 0 && (
                            <TextDisplay infoTexts={selectedInfo.texts} />
                        )}
                        {selectedInfo.links && selectedInfo.links.length > 0 && (
                            <LinkDisplay infoLinks={selectedInfo.links} />
                        )}
                        {selectedInfo.pics && selectedInfo.pics.length > 0 && (
                            <PicDisplay infoPics={selectedInfo.pics} />
                        )}
                    </>
                )}
            </ContentPanel>
        </Container>
    );
};

export default InfoDisplayController;
