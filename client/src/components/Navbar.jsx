import React from 'react';
import styled from 'styled-components';

// Navbar setup remains similar with added lines to connect the logo to the links
const NavbarContainer = styled.header`
  position: sticky;
  top: 0;
  width: 100%;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0;
  z-index: 100;
  font-family: 'Open Sans', sans-serif !important;
  font-weight: bold;
`;

const NavbarContent = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative; /* To position the lines connecting to logo */
`;

const NavbarLinks = styled.ul`
  list-style: none;
  display: flex;
  gap: 20px;
  margin: 0;
  padding: 0;
`;

const NavbarLink = styled.li`
  a {
    color: white;
    text-decoration: none;
    font-size: 1.4em;
    &:hover {
      color: #ffdd00;
    }
  }
`;

const LogoContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0 20px; /* Add some space around the logo */
`;

const LogoImage = styled.img`
  width: 124px;
  padding: 0 43px;
`;

const LeftLine = styled.div`
  position: absolute;
  height: 2.8px;
  background-color: black;
  top: 31%;
  left: -86px;
  right: auto;
  width: 85%;

  /* Vertical line at the end of the left line */
  &::after {
    content: '';
    position: absolute;
    right: 210px;
    top: 0;
    width: 2.8px;
    height: 25px;
    background-color: black;
  }
   /* Small horizontal line at the bottom of the vertical line */
  &::before {
    content: '';
    position: absolute;
   right: 199px;
    top: 24px;
    width: 22px;
    height: 2.8px;
    background-color: black;
  }

  
`;

const RightLine = styled.div`
  position: absolute;
    height: 2.8px;
    background-color: black;
    top: 73%;
    left: 124px;
    right: auto;
    width: 83%;

  /* Vertical line at the start of the right line */
  &::after {
    content: '';
    position: absolute;
    left: 196px;
    top: -25px;
    width: 21px;
    height: 2.8px;
    background-color: black;
  }


  /* Small horizontal line at the top of the vertical line */
  &::before {
   content: '';
    position: absolute;
    left: 205px;
    top: -22px;
    width: 2.8px;
    height: 23px;
    background-color: black;
  }

  


`;




// Main Navbar Component
const Navbar = () => {
  return (
    <NavbarContainer>
      <NavbarContent>
        {/* Left side links */}
        <NavbarLinks>
          <NavbarLink><a href="#link1">Info</a></NavbarLink>
          <NavbarLink><a href="#link2">Search</a></NavbarLink>
        </NavbarLinks>

        {/* Center Logo with connecting lines */}
        <LogoContainer>
          <LogoImage src="imgs/Logo.png" alt="Logo" />
          {/* Lines connecting the logo to the sides */}
          <LeftLine />
          <RightLine />

        </LogoContainer>

        {/* Right side links */}
        <NavbarLinks>
          <NavbarLink><a href="#link3">Topics</a></NavbarLink>
          <NavbarLink><a href="#link4">Account</a></NavbarLink>
        </NavbarLinks>
      </NavbarContent>
    </NavbarContainer>
  );
};

export default Navbar;
