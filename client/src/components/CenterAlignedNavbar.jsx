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
  height: 80px;
  margin-bottom:25px;

  @media (max-width: 600px) {
    height: auto;
    padding: 20px 0;
  }
`;

const NavbarContent = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative; /* To position the lines connecting to logo */
  flex-wrap: wrap; /* Allow wrapping on small screens */

  @media (max-width: 600px) {
    flex-direction: row;
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
    flex-direction: column;
    gap: 10px; /* Adjust gap for smaller screens */
  }
`;

const NavbarLink = styled.li`
  a {
    color: white;
    text-decoration: none;
    font-size: 1.4em;

    @media (max-width: 600px) {
      font-size: 1.2em; /* Reduce font size on smaller screens */
    }

    &:hover {
      color: #1da1f2;
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

  @media (max-width: 600px) {
    margin-bottom: 10px; /* Add space below logo for smaller screens */
  }
`;

const LogoImage = styled.img`
  width: 100px;
  padding: 0 43px;

  @media (max-width: 600px) {
    width: 80px; /* Adjust logo size on smaller screens */
  }
`;

const LeftLine = styled.div`
  position: absolute;
  height: 2.8px;
  background-color: black;
  top: 31%;
  left: -88px;
  right: auto;
  width: 89%;

  /* Vertical line at the end of the left line */
  &::after {
    content: '';
    position: absolute;
    right: 198px;
    top: 0;
    width: 2.8px;
    height: 23px;
    background-color: black;
  }
  /* Small horizontal line at the bottom of the vertical line */
  &::before {
    content: '';
    position: absolute;
    right: 187px;
    top: 20px;
    width: 22px;
    height: 2.8px;
    background-color: black;
  }
    @media (max-width: 600px) {
    display:none;
  }
`;

const RightLine = styled.div`
  position: absolute;
  height: 2.8px;
  background-color: black;
  top: 73%;
  left: 114px;
  right: auto;
  width: 86%;

  /* Vertical line at the start of the right line */
  &::after {
    content: '';
    position: absolute;
    left: 183px;
    top: -20px;
    width: 21px;
    height: 2.8px;
    background-color: black;
  }

  /* Small horizontal line at the top of the vertical line */
  &::before {
    content: '';
    position: absolute;
    left: 192px;
    top: -20px;
    width: 2.8px;
    height: 22px;
    background-color: black;
  }
  @media (max-width: 600px) {
    display:none;
  }

`;

// Main Navbar Component
const CenterAlignedNavbar = () => {
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

export default CenterAlignedNavbar;
