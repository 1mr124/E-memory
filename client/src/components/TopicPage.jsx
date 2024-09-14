import React, { useState, useEffect } from 'react';

const TopicPage = () => {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [newTopicName, setNewTopicName] = useState('');
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    // Fetch initial topics data on component mount
    const fetchTopics = async () => {
      try {
        const response = await fetch('/api/v1/topics');
        const data = await response.json();
        setTopics(data);
      } catch (error) {
        console.error('Error fetching topics:', error);
      }
    };

    fetchTopics();
  }, []);

  const handleSearch = async (event) => {
    event.preventDefault();
    // Implement search functionality if needed
  };

  const handleNewTopic = async (event) => {
    event.preventDefault();
    try {
      await fetch('/api/v1/topics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newTopicName })
      });
      setNewTopicName('');
      // Optionally, refresh topics list
    } catch (error) {
      console.error('Error creating new topic:', error);
    }
  };

  const handleDeleteTopic = async (event) => {
    event.preventDefault();
    try {
      await fetch('/api/v1/topics', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: selectedTopic })
      });
      setSelectedTopic('');
      // Optionally, refresh topics list
    } catch (error) {
      console.error('Error deleting topic:', error);
    }
  };

  return (
    <div className="content center">
      <ul>
        <li onClick={() => setActiveSection('SearchDiv')}>Search</li>
        <li onClick={() => setActiveSection('NewTopic')}>New</li>
        <li onClick={() => setActiveSection('DeleteTopic')}>Delete</li>
      </ul>

      <div id="SearchDiv" className={activeSection === 'SearchDiv' ? '' : 'none'}>
        <form onSubmit={handleSearch}>
          <input
            list="TopicId"
            type="search"
            name="SearchTopic"
            id="SearchTopic"
            className="Key"
            placeholder="Topic Name"
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
          />
          <datalist id="TopicId">
            {topics.map((topic, index) => (
              <option key={index} value={topic} />
            ))}
          </datalist>
          <button type="submit" className="none">Search</button>
        </form>
      </div>

      <div id="NewTopic" className={activeSection === 'NewTopic' ? '' : 'none'}>
        <form onSubmit={handleNewTopic}>
          <input
            type="text"
            name="Name"
            placeholder="Topic Name"
            className="Comment"
            value={newTopicName}
            onChange={(e) => setNewTopicName(e.target.value)}
          />
          <button type="submit" className="submit">New Topic</button>
        </form>
      </div>

      <div id="DeleteTopic" className={activeSection === 'DeleteTopic' ? '' : 'none'}>
        <form onSubmit={handleDeleteTopic}>
          <input
            list="TopicId"
            type="search"
            name="TopicId"
            id="SearchTopic"
            className="Key"
            placeholder="Topic Name"
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
          />
          <datalist id="TopicId">
            {topics.map((topic, index) => (
              <option key={index} value={topic} />
            ))}
          </datalist>
          <button type="submit" className="submit">Delete</button>
        </form>
      </div>
    </div>
  );
};

export default TopicPage;
