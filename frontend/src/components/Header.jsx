import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';

import logo from '../assets/logo.png';

const Header = () => {
  return (
    <header>
      <Navbar
        className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-600 to-red-600"
        variant="dark"
        expand="md"
        collapseOnSelect
      >
        <Container>
          <LinkContainer to="">
            <Navbar.Brand className="flex flex-row">
              <img src={logo ? logo : ''} alt="ProShop" />
              <span className="mt-2">ProShop</span>
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="flex items-center justify-center ms-auto">
              <LinkContainer to="/cart">
                <Nav.Link className="flex flex-auto">
                  <FaShoppingCart className="mt-1 mr-2" />
                  Cart
                </Nav.Link>
              </LinkContainer>
              <LinkContainer to="/login">
                <Nav.Link className="flex flex-auto">
                  <FaUser className="mt-1 mr-2 " />
                  Login
                </Nav.Link>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
