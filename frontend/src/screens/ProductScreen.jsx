import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Card, Button } from 'react-bootstrap';
import { FaHome } from 'react-icons/fa';
import axios from 'axios';

import Rating from '../components/Rating';

const ProductScreen = () => {
  const [product, setProduct] = useState({});

  const { id: productId } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await axios.get(`/api/products/${productId}`);
      setProduct(data);
    };
    fetchProduct();
  }, [productId]);

  return (
    <div>
      <Row className="gy-4">
        {/* Left Column - Image */}
        <Col md={6} lg={4} className="d-flex justify-content-center">
          <Image
            src={product.image}
            alt={product.name}
            fluid
            className="border border-black border-solid rounded-md"
          />
        </Col>

        {/* Center Column - Product Details */}
        <Col md={6} lg={5}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h3>{product.name}</h3>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating
                value={product.rating}
                text={`${product.numReviews} reviews`}
              />
            </ListGroup.Item>
            <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
            <ListGroup.Item>Description: {product.description}</ListGroup.Item>
          </ListGroup>
        </Col>

        {/* Right Column - Card Component */}
        <Col lg={3} md={6} className="d-flex justify-content-center">
          <Card className="w-100 h-100">
            <ListGroup variant="flush">
              <ListGroup.Item className="py-3">
                <Row>
                  <Col>Price:</Col>
                  <Col>
                    <strong>${product.price}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item className="py-3">
                <Row>
                  <Col>Status:</Col>
                  <Col>
                    <strong>
                      {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                    </strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item className="py-3">
                <Button
                  className="btn btn-block w-100 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-300 to-yellow-500 hover:from-yellow-500 hover:to-yellow-300"
                  type="button"
                  disabled={product.countInStock === 0}
                >
                  Add to Cart
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>

      {/* Centered Go Back Button */}
      <Row className="my-4">
        <Col className="d-flex justify-content-center">
          <Link
            to="/"
            className="flex justify-center items-center w-24 h-12 rounded-lg text-white bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-300 to-yellow-500 hover:from-yellow-500 hover:to-yellow-300"
          >
            <FaHome className="mr-1" />
            Go back
          </Link>
        </Col>
      </Row>
    </div>
  );
};

export default ProductScreen;
