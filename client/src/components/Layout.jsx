// src/components/Layout.js
import React from 'react';
import { Link } from 'react-router-dom';

const Layout = ({ children, title }) => {
  return (
    <div>
      <header>
        <ul>
          <li>
            <Link to="/register">
              <i style={{ fontSize: '28px' }} className="fas fa-user-circle"></i>
            </Link>
          </li>
          <li><Link to="/info">Info</Link></li>
          <li><Link to="/search">Search</Link></li>
          <li><Link to="/topic">Topic</Link></li>
        </ul>
      </header>

      <div className="container center">
        <div className="TitleBar">
          {title && <h1>{title}</h1>}
        </div>
        <div className="content center">
          {children}
        </div>
      </div>

      {/* Include any additional scripts or stylesheets here if necessary */}
    </div>
  );
};

export default Layout;
