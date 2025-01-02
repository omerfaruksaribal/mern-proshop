import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // For redirection
import { useDispatch, useSelector } from 'react-redux';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../slices/cartSlice';

const PaymentScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const paymentMethod = 'CreditCard';

  // Get the user's shipping address (you can change this depending on your application)
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => {
    // If there's no shipping address, redirect to shipping page
    if (!shippingAddress) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(savePaymentMethod(paymentMethod));

    if (paymentMethod === 'CreditCard') {
      navigate('/stripe');
    }
  };

  return (
    <div>
      <CheckoutSteps step1 step2 step3 />
      <h1>Payment Method</h1>
      <form onSubmit={submitHandler}>
        <div>
          <h4 className="flex justify-center">Credit Card</h4>
        </div>

        <button type="submit" className="btn btn-primary">
          Continue
        </button>
      </form>
    </div>
  );
};

export default PaymentScreen;
