import React, { useState } from 'react';
import styled from 'styled-components';
import { FaUpload, FaTrashAlt } from 'react-icons/fa';

const Pic = ({ pics, setPics }) => {
    const [visibleIndex, setVisibleIndex] = useState(0);

    const handleChange = (index, field, value) => {
        const updatedPics = [...pics];
        updatedPics[index][field] = value;
        setPics(updatedPics);
    };

    const addPic = (e) => {
        e.preventDefault();
        setPics([...pics, { headline: '', comment: '', pic: null }]);
        setVisibleIndex(pics.length);
    };

    const toggleVisible = (e, index) => {
        e.preventDefault();
        setVisibleIndex(index);
    };

    const deletePic = (e, index) => {
        e.preventDefault();
        const updatedPics = pics.filter((_, i) => i !== index);
        setPics(updatedPics);
        setVisibleIndex(visibleIndex > index ? visibleIndex - 1 : 0);
    };

    const handleFileSelect = (e, index) => {
        const file = e.target.files[0];
        handleChange(index, 'pic', file);
    };

    return (
        <Container>
            <ButtonsContainer>
                {pics.map((_, index) => (
                    <CollapsedContainer key={index}>
                        <CollapsedButton onClick={(e) => toggleVisible(e, index)}>
                            Pic {index + 1}
                        </CollapsedButton>
                        {index !== 0 && (
                            <DeleteButton onClick={(e) => deletePic(e, index)}>
                                <FaTrashAlt />
                            </DeleteButton>
                        )}
                    </CollapsedContainer>
                ))}
            </ButtonsContainer>

            <PicContainer>
                {pics.map((pic, index) => (
                    visibleIndex === index && (
                        <PicWrapper key={index}>
                            <Headline
                                value={pic.headline}
                                onChange={(e) => handleChange(index, 'headline', e.target.value)}
                                placeholder="Headline"
                            />
                            <UploadContainer>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileSelect(e, index)}
                                    style={{ display: 'none' }}
                                    id={`file-input-${index}`}
                                />
                                <label htmlFor={`file-input-${index}`}>
                                    <UploadIcon size={40} />
                                    <UploadText>Select Image</UploadText>
                                </label>
                            </UploadContainer>
                            <Comment
                                value={pic.comment}
                                onChange={(e) => handleChange(index, 'comment', e.target.value)}
                                placeholder="Comment"
                            />
                        </PicWrapper>
                    )
                ))}
            </PicContainer>

            <AddButton onClick={addPic}>Add New Pic</AddButton>
        </Container>
    );
};

export default Pic;




const Container = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow: hidden; // need to be Fixed
`;

const ButtonsContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 10px;
    margin: auto;
    justify-content: center;
`;

const PicContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 10px;
    margin: auto;
    justify-content: center;
`;

const PicWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    justify-content: center;
    width: 80%;
`;

const Headline = styled.input`
    width: 80%;
    background-color: transparent;
    color: #e0f7fa;
    border: none;
    outline: none;
    padding: 10px;
    text-align: center;
    font-weight: bold;
    font-size: 1.2em;
`;

const Comment = styled.input`
    width: 80%;
    background-color: transparent;
    color: #e0f7fa;
    border: none;
    outline: none;
    padding: 10px;
    text-align: center;
    font-weight: bold;
    font-size: 1.2em;
`;

const UploadContainer = styled.div`
    width: 80%;
    height: 300px; // Adjust height as needed
    background-color: #15202b;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid black; // Dashed border for the upload area
    border-radius: 8px;
    cursor: pointer;

`;

const UploadText = styled.span`
    color: #e0f7fa;
    font-size: 1.5em;
    text-align: center;
`;

const CollapsedButton = styled.button`
    background-color: #34495e;
    color: #e0f7fa;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        background-color: #2e3d60;
    }
`;

const AddButton = styled.button`
    background-color: #1da1f2;
    color: white;
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    width: 120px;
    align-self: center;

    &:hover {
        background-color: #0d86d1;
    }
`;

const DeleteButton = styled.button`
    background-color: transparent;
    border: none;
    cursor: pointer;
    color: #e0f7fa;
    margin-top: 3px;

    &:hover {
        color: #ff4d4d;
    }
`;

const CollapsedContainer = styled.div`
    display: flex;
    align-items: center;
    flex-direction: row;
    background-color: #34495e;
    color: #e0f7fa;
    cursor: pointer;
    height: 35px;
    border-radius: 5px;
`;

const UploadIcon = styled(FaUpload)`
    transition: color 0.3s;
    margin: 0px 3px 3px 0;


    ${UploadContainer}:hover & {
        color: #1da1f2; // Change icon color on hover
        margin:0px 3px 6px 0;
    }
`;