import { useCallback, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearCartItems } from '../slices/cartSlice';
import {
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
} from '../slices/ordersApiSlice';
import dotenv from 'dotenv';
dotenv.config();

const stripePromise = loadStripe(
  `${process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY}`
);

export const CheckoutForm = () => {
  const cart = useSelector((state) => state.cart);
  // eslint-disable-next-line no-unused-vars
  const { cartItems, shippingAddress } = cart;

  const fetchClientSecret = useCallback(async () => {
    const shippingAddress = cart.shippingAddress || {
      address: 'No address provided',
      city: 'No city',
      postalCode: '00000',
      country: 'No country',
    };

    try {
      const response = await fetch('/api/orders/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cartItems, shippingAddress }),
      });
      const data = await response.json();
      if (response.ok) {
        return data.clientSecret;
      } else {
        throw new Error(`Failed to fetch client secret: ${data.message}`);
      }
    } catch (error) {
      toast.error(error?.data?.message || error.error, {
        theme: 'colored',
        position: 'top-center',
      });
      throw error;
    }
  }, [cartItems, cart.shippingAddress]);

  const options = { fetchClientSecret };

  return (
    <div id="checkout" className="mt-2 mb-5">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};

export const Return = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart);
  const {
    cartItems,
    shippingAddress,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = cart;

  const [createOrder] = useCreateOrderMutation();
  const dispatch = useDispatch();
  const [status, setStatus] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [customerEmail, setCustomerEmail] = useState('');
  /**
   * Get order details from the database after checkout is completed
   */

  const [orderId, setOrderId] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const { data, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId, {
    skip: !orderId,
  });

  const placeOrderHandler = useCallback(
    async (sessionId) => {
      try {
        const newOrder = await createOrder({
          orderItems: cartItems,
          shippingAddress,
          paymentMethod: 'Credit & Debit Card',
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
          isPaid: true,
          paidAt: Date.now(),
          paymentResult: {
            id: sessionId,
            status: 'COMPLETED',
            email_address: customerEmail,
          },
        }).unwrap();

        setOrderId(newOrder._id);
        dispatch(clearCartItems());
      } catch (err) {
        console.error('Order creation failed:', err);
        toast.error(
          err?.data?.message || err.error || 'Order creation failed.',
          {
            theme: 'colored',
            position: 'top-center',
          }
        );
      }
    },
    [
      createOrder,
      cartItems,
      shippingAddress,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      customerEmail,
      dispatch,
    ]
  );

  useEffect(() => {
    // call refetch only if orderId is set
    if (orderId) {
      refetch();
    }
  }, [orderId, refetch]);

  useEffect(() => {
    const fetchSessionStatus = async () => {
      try {
        const sessionId = new URLSearchParams(window.location.search).get(
          'session_id'
        );
        if (!sessionId) return;

        const response = await fetch(
          `/api/orders/session-status?session_id=${sessionId}`
        );
        const data = await response.json();

        if (response.ok) {
          setStatus(data.status);
          setCustomerEmail(data.customer_email);

          // Add this section to update order payment status
          if (data.status === 'complete') {
            await placeOrderHandler(sessionId);
          }
        } else {
          throw new Error(data.message || 'Failed to fetch session status.');
        }
      } catch (error) {
        console.log('Session status fetch failed:', error);
        toast.error(error.message || 'An error occurred.', {
          theme: 'colored',
          position: 'top-center',
        });
      }
    };

    fetchSessionStatus();
  }, [placeOrderHandler]);

  const onClickFunction = () => {
    placeOrderHandler();
    dispatch(clearCartItems());
  };

  if (status === 'open') {
    return <Navigate to="/checkout" />;
  }
  if (status === 'complete') {
    return (
      <section id="success" className="container mt-2 mb-5">
        <div className="mt-0 text-black card">
          <div className="my-2 text-white card-header bg-success w-100">
            <h1 className="my-auto text-center">Order Confirmation</h1>
          </div>
          <div className="card-body">
            <h5 className="card-title ps-4">
              Thank you for your purchase, {userInfo.name.split(' ')[0]}!
            </h5>
            <p className="mb-4 card-text ps-4">
              We have successfully received your order and a confirmation email
              has been sent to your email address.
            </p>

            {/* Displaying product images and details */}
            <div className="pt-4 row border-top">
              <div className="col-md-8">
                <h5 className="mb-1 ps-4">Order Details:</h5>

                <ul className="list-group list-group-flush">
                  {cartItems.map((item, index) => (
                    <li key={index} className="list-group-item">
                      <div className="row">
                        <div className="col-6 col-md-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="img-thumbnail"
                          />
                        </div>
                        <div className="col-6 col-md-8">
                          <div>{item.name}</div>
                          <div>
                            {item.qty} x ${item.price}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-2 col-md-4 border-start ps-4">
                <h5>Order Summary:</h5>
                <div className="mb-2">
                  <span className="text-muted">Items Total: </span>
                  <p className="float-right">${itemsPrice}</p>
                </div>
                <div className="mb-2">
                  <span className="text-muted">Shipping: </span>
                  <p className="float-right">${shippingPrice}</p>
                </div>
                <div className="mb-2">
                  <span className="text-muted">Tax: </span>
                  <p className="float-right">${taxPrice}</p>
                </div>
                <div className="pt-2 mb-4 border-top">
                  <span className="text-muted">Total: </span>
                  <p className="float-right">${totalPrice}</p>
                </div>
                <div className="text-center">
                  <a
                    href="/"
                    className="px-4 text-white btn bg-primary fw-semibold"
                    onClick={() => {
                      onClickFunction();
                    }}
                  >
                    Continue Shopping
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-3 card-footer">
              <p>
                If you have any questions, please email{' '}
                <a href="mailto:support@mern-proshop.com">
                  support@mern-proshop.com
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return null;
};
