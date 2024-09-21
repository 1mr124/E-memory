import React, { useState } from 'react';

const SearchContainer = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // In the future, you'd trigger an API call or search function here
    console.log('Searching for:', searchTerm);
  };

  return (
    <div>
      <h2>Search for Info</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter search term"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      <div>
        {/* You can display search results here in the future */}
        {searchTerm && <p>Results for: {searchTerm}</p>}
      </div>
    </div>
  );
};

export default SearchContainer;
