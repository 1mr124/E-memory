import React, { useState } from 'react';
import styled from 'styled-components';
import InfoButton from './InfoButton';
import TextDisplay from './TextDisplay';
import LinkDisplay from './LinkDisplay';
import PicDisplay from './PicDisplay';

const Container = styled.div`
    display: flex;
    flex-direction: row;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 90%;
    max-width: 800px;
    background-color: #1c2a39;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
    margin: 20px auto;
`;

const InfoDisplayController = ({ results }) => {
    const [selectedInfo, setSelectedInfo] = useState(null);

    const handleClick = (info) => {
        setSelectedInfo(info);
    };

    return (
        <Container>
            {/* Display buttons */}
            {Array.isArray(results) && results.length > 0 ? (
                results.map((info) => (
                    <InfoButton key={info.id} info={info} onClick={() => handleClick(info)} />
                ))
            ) : (
                <p>No results found.</p>
            )}

            {/* Display selected info */}
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
        </Container>
    );
};

export default InfoDisplayController;
