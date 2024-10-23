import React from 'react';
import styled from 'styled-components';
import InfoButton from './InfoButton'

const Container = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 90%;
    max-width: 800px;
    background-color: #1c2a39;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

`;


const InfoDisplayController = ({ results }) => {
    
    results.map((info) => {
        const TextArray = info.texts;
        const LinkArray = info.links;
        const PicsArray = info.pics;

        //console.log(info);
                
        
    });


    const handleClick = (info) => {
        console.log(info.texts, info.links, info.pics);
        // Implement modal or expand functionality here
    };


    return (
      <Container>
        {Array.isArray(results) && results.length > 0 ? (
            results.map((info) => (
                
                <InfoButton key={info.id} info={info} onClick={() => handleClick(info)}></InfoButton>


            ))
        ) : (
            <p>No results found.</p>
        )}
      </Container>
    );
};

export default InfoDisplayController;


// <ResultsList>
//                 {Array.isArray(results) && results.length > 0 ? (
//                     results.map((info) => (
//                         <ResultItem key={info.id}>
//                             <Button onClick={() => handleInfoButtonClick(info.id)}>
//                                 {info.key} {/* You can change this to display another field if you prefer */}
//                             </Button>
//                             {/* Show details of the selected info */}
//                             {expandedInfo === info.id && (
//                                 <InfoDetails>
//                                     <h3>Details for: {info.key}</h3>
//                                     <h4>Texts:</h4>
//                                     {info.texts.map((text, index) => (
//                                         <div key={index}>
//                                             <strong>{text.header}</strong>: {text.text} <br />
//                                             <em>{text.comment}</em>
//                                         </div>
//                                     ))}
//                                     <h4>Links:</h4>
//                                     {info.links.length > 0 ? (
//                                         info.links.map((link, index) => (
//                                             <div key={index}>
//                                                 <strong>{link.header}</strong>: <a href={link.path} target="_blank" rel="noopener noreferrer">{link.path}</a>
//                                                 <em>{link.comment}</em>
//                                             </div>
//                                         ))
//                                     ) : (
//                                         <div>No links available.</div>
//                                     )}
//                                     <h4>Pictures:</h4>
//                                     {info.pics.length > 0 ? (
//                                         info.pics.map((pic, index) => (
//                                             <img key={index} src={pic.path} alt={pic.comment} style={{ width: '100px', height: '100px', margin: '5px' }} />
//                                         ))
//                                     ) : (
//                                         <div>No pictures available.</div>
//                                     )}
//                                 </InfoDetails>
//                             )}
//                         </ResultItem>
//                     ))
//                 ) : (
//                     <ResultItem>No results found.</ResultItem>
//                 )}
//             </ResultsList>