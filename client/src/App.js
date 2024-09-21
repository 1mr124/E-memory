import React from 'react';
import CenterAlignedNavbar from './components/CenterAlignedNavbar';
import BasicNavBar from './components/BasicNavBar';

import './App.css';
import Container from './components/Container';

const App = () => {
  return (
    <div className="App">
      {/* <CenterAlignedNavbar /> */}
      <BasicNavBar />
      <Container/>
    </div>
  );
};

export default App;
