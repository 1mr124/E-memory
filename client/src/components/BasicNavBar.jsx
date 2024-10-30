import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


// Main Navbar Component
const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();

  return (
    <NavbarContainer>
      <NavbarContent>
        <NavbarLinks>
          <NavbarLink><Link to="/info">Info</Link></NavbarLink>
          <NavbarLink><Link to="/search">Search</Link></NavbarLink>
          <NavbarLink><Link to="/topics">Topics</Link></NavbarLink>
          {!isLoggedIn ? (
          <NavbarLink><Link to="/account">Account</Link></NavbarLink>
            ) : (
                    <NavbarLink><Link onClick={logout} to="/account">Logout</Link></NavbarLink>
                )}
        </NavbarLinks>
      </NavbarContent>
    </NavbarContainer>
  );
};

export default Navbar;





const NavbarContainer = styled.header`
  position: sticky;
  top: 0;
  width: 100%;
  background-color: transparent;
  display: flex;
  justify-content: center;
  padding: 10px 0;
  z-index: 100;
  font-family: 'Open Sans', sans-serif !important;
  font-weight: bold;
  height: 80px;
  margin-bottom: 29px;
  @media (max-width: 600px) {
    height: auto;
    padding: 20px 0;
  }
`;

const NavbarContent = styled.nav`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;

  @media (max-width: 600px) {
    flex-direction: raw;
    align-items: center;
  }
`;

const NavbarLinks = styled.ul`
  list-style: none;
  display: flex;
  gap: 20px;
  margin: 0;
  padding: 0;

  @media (max-width: 600px) {
    flex-direction: row;
    gap: 10px;
  }
`;

const NavbarLink = styled.li`
  a {
    color: white;
    text-decoration: none;
    font-size: 1.4em;

    @media (max-width: 600px) {
      font-size: 1.2em;
    }

    &:hover {
      color: #1da1f2;
    }
  }
`;
