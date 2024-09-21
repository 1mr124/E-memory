import React from 'react';
import CenterAlignedNavbar from './components/CenterAlignedNavbar';
import BasicNavBar from './components/BasicNavBar';

import './App.css';
import InfoContainer from './components/InfoContainer';

const App = () => {
  return (
    <div className="App">
      {/* <CenterAlignedNavbar /> */}
      <BasicNavBar />
      <InfoContainer/>
    </div>
  );
};

export default App;
