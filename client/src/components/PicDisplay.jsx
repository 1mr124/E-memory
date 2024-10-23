import React from 'react';
import styled from 'styled-components';

const PicContainer = styled.div`
    margin: 10px 0;
    text-align: center;
    width: 100%;
`;

const Image = styled.img`
    max-width: 100%;
    height: auto;
    border-radius: 8px;

    @media (max-width: 768px) {
        width: 100%;
    }
`;

const PicHeader = styled.h4`
    color: #fff;
`;

const PicComment = styled.em`
    color: #888;
    display: block;
    margin-top: 5px;
`;

const PicDisplay = ({ infoPics }) => {
    return (
        <PicContainer>
            {Array.isArray(infoPics) && infoPics.length > 0 ? (
                infoPics.map((picObj, index) => (
                    <div key={index}>
                        <Image src={picObj.path} alt={picObj.header || 'Image'} />
                        {picObj.header && <PicHeader>{picObj.header}</PicHeader>}
                        {picObj.comment && <PicComment>({picObj.comment})</PicComment>}
                    </div>
                ))
            ) : (
                <p>No Pictures found.</p>
            )}
        </PicContainer>
    );
};

export default PicDisplay;
