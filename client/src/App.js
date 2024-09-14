import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import InfoPage from './components/InfoPage';
import LoginPage from './components/LoginPage'; // Create Login component
import RegisterPage from './components/RegisterPage'; // Create Register component
import SearchPage from './components/SearchPage'; // Create Search component
import TopicPage from './components/TopicPage'; // Create Topic component

const App = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/" element={<InfoPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/topic" element={<TopicPage />} />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
};

export default App;
