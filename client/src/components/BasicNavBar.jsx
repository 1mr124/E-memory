import React from 'react';
import styled from 'styled-components';

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

// Main Navbar Component
const Navbar = () => {
  return (
    <NavbarContainer>
      <NavbarContent>
        <NavbarLinks>
          <NavbarLink><a href="#link1">Info</a></NavbarLink>
          <NavbarLink><a href="#link2">Search</a></NavbarLink>
          <NavbarLink><a href="#link3">Topics</a></NavbarLink>
          <NavbarLink><a href="#link4">Account</a></NavbarLink>
        </NavbarLinks>
      </NavbarContent>
    </NavbarContainer>
  );
};

export default Navbar;
