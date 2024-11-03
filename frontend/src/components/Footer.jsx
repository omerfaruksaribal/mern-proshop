import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-600 to-red-600">
      <Container>
        <Row>
          <Col className="py-3 text-center">
            <p className="text-white">ProShop &copy; {currentYear}</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
