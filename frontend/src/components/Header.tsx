import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import logo from '../assets/logo.png';
import '../global.d.ts';

const Header = () => {
  return (
    <header>
      <Navbar
        className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800"
        variant="dark"
        expand="md"
        collapseOnSelect
      >
        <Container>
          <Navbar.Brand href="/" className="flex flex-row">
            <img src={logo ? logo : ''} alt="ProShop" />
            <span className="mt-2">ProShop</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="flex items-center justify-center ms-auto">
              <Nav.Link href="/cart" className="flex flex-auto">
                <FaShoppingCart className="mt-1 mr-2" />
                Cart
              </Nav.Link>
              <Nav.Link href="/login" className="flex flex-auto">
                <FaUser className="mt-1 mr-2 " />
                Login
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
