import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BasicNavBar from './components/BasicNavBar';
import InfoContainer from './components/InfoContainer';
import SearchContainer from './components/SearchContainer'; // Assuming you have these components
import TopicsContainer from './components/TopicsContainer'; // Assuming you have these components
// import AccountContainer from './components/AccountContainer'; // Assuming you have these components

import './App.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        <BasicNavBar />
        {/* Routing area */}
        <Routes>
          <Route path="/info" element={<InfoContainer />} />
          <Route path="/search" element={<SearchContainer />} />
          <Route path="/topics" element={<TopicsContainer />} />
          {/* <Route path="/account" element={<AccountContainer />} />  */}
          {/* Default to InfoContainer if no path is specified */}
          <Route path="/" element={<InfoContainer />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
