import { Link, useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Message from '../components/Message.jsx';
import Loader from '../components/Loader.jsx';
import { useSelector } from 'react-redux';
import {
  useGetOrderDetailsQuery,
  useDeliverOrderMutation,
} from '../slices/ordersApiSlice.js';
import { formatDate } from '../utils/formatDate.js';
const OrderScreen = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const deliverOrderHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success("Order marked as 'delivered'.", {
        theme: 'colored',
        position: 'top-center',
      });
    } catch (err) {
      toast.error(err?.data?.message || err.message, {
        theme: 'colored',
        position: 'top-center',
      });
    }
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error?.data?.message || error.error}</Message>
  ) : (
    <>
      <h1 className="p-4 m-2 text-center bg-info-subtle rounded-2">
        Order ({order._id})
      </h1>

      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping Information</h2>
              <p>
                <strong>Name: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong> {order.user.email}
              </p>
              <p>
                <strong>Address: </strong> {order.shippingAddress?.address},{' '}
                {order.shippingAddress?.city},{' '}
                {order.shippingAddress?.postalCode},{' '}
                {order.shippingAddress?.country}
              </p>

              {order.isDelivered ? (
                <Message variant="success">
                  Delivered at {formatDate(order.deliveredAt)}.
                </Message>
              ) : (
                <Message variant="danger">Not delivered yet.</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong> {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">
                  Paid on {formatDate(order.paidAt)}
                </Message>
              ) : (
                <Message variant="danger">Not Paid Yet</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.map((item, index) => (
                <ListGroup.Item key={index} className="border-1 rounded-2">
                  <Row>
                    <Col md={2}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col md={7}>
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                    </Col>
                    <Col md={3}>
                      {item.qty} x ${item.price} = $
                      {(Math.round(item.qty * item.price * 100) / 100).toFixed(
                        2
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4} className="p-3">
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Order Summary</h2>
            </ListGroup.Item>

            <ListGroup.Item>
              <Row className="py-2">
                <Col>Items</Col>
                <Col>${order.itemsPrice}</Col>
              </Row>
              <Row className="py-2">
                <Col>Shipping</Col>
                <Col>${order.shippingPrice}</Col>
              </Row>
              <Row className="py-2">
                <Col>Tax</Col>
                <Col>${order.taxPrice}</Col>
              </Row>
              <Row className="py-2">
                <Col>
                  <strong>TOTAL</strong>
                </Col>
                <Col>
                  <strong>${order.totalPrice}</strong>
                </Col>
              </Row>
            </ListGroup.Item>

            {loadingDeliver && <Loader />}

            {userInfo && userInfo.isAdmin && !order.isDelivered && (
              <ListGroup.Item>
                <Button
                  type="button"
                  className="btn btn-block"
                  onClick={deliverOrderHandler}
                >
                  Mark as "Delivered"
                </Button>
              </ListGroup.Item>
            )}
          </ListGroup>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
