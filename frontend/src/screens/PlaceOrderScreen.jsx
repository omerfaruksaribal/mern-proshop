import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Row, Col, ListGroup, Card, Form } from 'react-bootstrap';
import { useCreateOrderMutation } from '../slices/ordersApiSlice';
import { clearCartItems } from '../slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { v4 as uuidv4 } from 'uuid';
import { debounce } from 'lodash';

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [idempotencyKey, setIdempotencyKey] = useState('');

  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.auth.userInfo);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart.paymentMethod, navigate]);

  useEffect(() => {
    // Generate a unique idempotency key when the component mounts
    const key = uuidv4();
    setIdempotencyKey(key);
  }, []);

  const placeOrderHandler = useCallback(async () => {
    if (isPlacingOrder) return; // Prevent multiple submissions
    setIsPlacingOrder(true);

    try {
      const orderData = {
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        taxPrice: cart.taxPrice,
        shippingPrice: cart.shippingPrice,
        totalPrice: cart.totalPrice,
        idempotencyKey, // Include the idempotency key
      };

      const order = await createOrder(orderData).unwrap();

      dispatch(clearCartItems());

      navigate(`/order/${order._id}`);

      toast.success('Order placed successfully!');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    } finally {
      setIsPlacingOrder(false);
    }
  }, [isPlacingOrder, cart, createOrder, dispatch, navigate, idempotencyKey]);

  // Memoize the debounced function to prevent ESLint warning
  const debouncedPlaceOrder = useMemo(
    () => debounce(() => placeOrderHandler(), 500),
    [placeOrderHandler]
  );

  const submitHandler = useCallback(
    (e) => {
      e.preventDefault();
      debouncedPlaceOrder();
    },
    [debouncedPlaceOrder]
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedPlaceOrder.cancel();
    };
  }, [debouncedPlaceOrder]);

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          {/* Order details components */}
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address:</strong> {cart.shippingAddress.address},{' '}
                {cart.shippingAddress.city} {cart.shippingAddress.postalCode},{' '}
                {cart.shippingAddress.country}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <strong>Method:</strong> {cart.paymentMethod}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {cart.cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="rounded img-fluid"
                          />
                        </Col>
                        <Col>
                          <a href={`/product/${item.product}`}>{item.name}</a>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = $
                          {(item.qty * item.price).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
                {user && (
                  <p>
                    <strong>User:</strong> {user.name} ({user.email})
                  </p>
                )}
              </ListGroup.Item>
              {/* Items Price */}
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${cart.itemsPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
              {/* Shipping Price */}
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${cart.shippingPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
              {/* Tax Price */}
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${cart.taxPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
              {/* Total Price */}
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${cart.totalPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
              {/* Place Order Button */}
              <ListGroup.Item>
                {/* Wrap the button in a Form to handle submission */}
                <Form onSubmit={submitHandler}>
                  <Button
                    type="submit"
                    className="btn-block"
                    disabled={
                      cart.cartItems.length === 0 || isLoading || isPlacingOrder
                    }
                  >
                    {isLoading || isPlacingOrder
                      ? 'Placing Order...'
                      : 'Place Order'}
                  </Button>
                </Form>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
      {isLoading && <Loader />}
      {error && <Message variant="danger">{error}</Message>}
    </>
  );
};

export default PlaceOrderScreen;
