import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import authApi from '../api/authApi'

const InfoSearchKey = ({ setTopicId }) => {
    const [topics, setTopics] = useState([]);
    const [selectedTopicId, setSelectedTopicId] = useState(null);
    const [error, setError] = useState(null);



    useEffect(() => {
        // Fetch topics on component mount
        fetchTopics();
    }, []);

    
    const fetchTopics = async () => {
        try {
            const response = await authApi.get("/api/v1/topic/all");
            const data = await response.data;
            
            // Ensure correct response structure
            if (!data || !Array.isArray(data.topics)) {
                throw new Error("Invalid response format"); 
            }

            setTopics(data.topics || []);  // Set topics or an empty array if undefined
        } catch (error) {
            setError("Could not load topics. Please try again later."); // Set user-friendly error message
        }

    }

    // Handle selection from datalist
    const handleTopicChange = (event) => {
        const selectedTopic = event.target.value
        const selectedTopicId = topics.find(topic => topic.title === selectedTopic);

        if (selectedTopicId){
            setSelectedTopicId(selectedTopicId);
            setTopicId(selectedTopicId.id);
        } else {
            setSelectedTopicId(null); // Clear selection if no match is found
            setTopicId(null); // Reset parent state if selection is invalid
        }
        
        
    };

    return (
        <SearchWrapper>
            {/* Error message display */}
            {error && <ErrorMessage>{error}</ErrorMessage>}

            <SearchKeyInput id="searchKey" type="text" placeholder="Search Key" required />
            <DataListInput 
                list="data-options" 
                placeholder="Topic" 
                onChange={(e) => handleTopicChange(e)} 
                required 
            />

            <datalist id="data-options">
            { Array.isArray(topics) && topics.map((topic) => (
                <option key={topic.id} value={topic.title} />
            ))}
            </datalist>

        </SearchWrapper>
    );
};

export default InfoSearchKey;



const SearchWrapper = styled.div`
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;
    justify-content: center;
    width: 80%;
    margin: auto;
`;

const SearchKeyInput = styled.input`
    width: 80%;
    background-color: transparent;
    color: #e0f7fa;
    border: none;
    outline: none;
    padding: 10px;
    text-align: center;
    margin-bottom: 10px;
`;

const DataListInput = styled.input`
    width: 80%;
    background-color: transparent;
    color: #e0f7fa;
    border: none;
    outline: none;
    padding: 10px;
    text-align: center;
`;

const ErrorMessage = styled.div`
    color: red;
    text-align: center;
    font-size: 14px;
    margin-top: 5px;
`;