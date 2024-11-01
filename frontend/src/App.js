import React from 'react';
import { Container } from 'react-bootstrap';

import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';

const App = () => {
  return (
    <>
      <Header />
      <main className="py-3">
        <Container>
          <h1 className="flex justify-center mt-10 text-3xl text-blue-800">
            Tailwind setup test
          </h1>
        </Container>
      </main>
      <Footer />
    </>
  );
};

export default App;
