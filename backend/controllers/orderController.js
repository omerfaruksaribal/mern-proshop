import Stripe from 'stripe';

import dotenv from 'dotenv';
dotenv.config();

import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';
import { calcPrices } from '../utils/calcPrices.js';
import Product from '../models/productModel.js';

const stripe = new Stripe(`${process.env.REACT_APP_STRIPE_TEST_SECRET}`);

/**
 * @desc    Create new order with idempotency
 * @route   POST /api/orders
 * @access  Private
 */
const addOrderItems = asyncHandler(async (req, res) => {
  const { idempotencyKey, orderData } = req.body;

  if (!idempotencyKey) {
    res.status(400);
    throw new Error('Idempotency key is required');
  }

  // Check if an order with this idempotencyKey already exists
  const existingOrder = await Order.findOne({ idempotencyKey });
  if (existingOrder) {
    return res.status(200).json(existingOrder);
  }

  // Proceed to create a new order
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    isPaid,
    paidAt,
    paymentResult,
  } = orderData;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    // Get the ordered items from the database
    const itemsFromDB = await Product.find({
      _id: { $in: orderItems.map((x) => x.product) }, // Assuming 'product' is the ObjectId
    });

    // Map over the order items and use the price from our items from the database
    const dbOrderItems = orderItems.map((itemFromClient) => {
      const matchingItemFromDB = itemsFromDB.find(
        (itemFromDB) =>
          itemFromDB._id.toString() === itemFromClient.product.toString()
      );
      return {
        ...itemFromClient,
        price: matchingItemFromDB.price, // Ensure price consistency
        _id: undefined, // Prevent duplication
      };
    });

    // Calculate prices
    const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
      calcPrices(dbOrderItems);

    // Create the order
    const order = new Order({
      orderItems: dbOrderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      isPaid: isPaid || false,
      paidAt: paidAt || null,
      paymentResult: paymentResult || {},
      idempotencyKey, // Store the idempotency key
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  }
});

/**
 * @desc    Get logged in user orders
 * @route   GET /api/orders/mine
 * @access  Private
 */
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json(orders);
});

/**
 * @desc    Get order by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
});

/**
 * @desc    Update order to delivered
 * @route   PUT /api/orders/:id/deliver
 * @access  Private/Admin
 */
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
});

/**
 * @desc    Get all orders
 * @route   GET /api/orders
 * @access  Private/Admin
 */
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.status(200).json(orders);
});

/**
 * @desc    Delete order
 * @route   DELETE /api/orders/:id
 * @access  Private/Admin
 */
const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    await order.remove();
    res.status(200).json({ message: 'Order removed' });
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
});

/**
 * @desc    Create a checkout session with Stripe
 * @route   POST /api/orders/create-checkout-session
 * @access  Private
 */
const createCheckoutSession = asyncHandler(async (req, res) => {
  try {
    const { cartItems, shippingAddress } = req.body;

    if (!cartItems || cartItems.length === 0) {
      res.status(400).json({ message: 'Cart items are required' });
      return;
    }

    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.qty,
    }));

    const returnUrl =
      process.env.REACT_NODE_ENV === 'production'
        ? `https://mern-proshop-jch2.onrender.com/return?session_id={CHECKOUT_SESSION_ID}`
        : `http://localhost:3000/return?session_id={CHECKOUT_SESSION_ID}`;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      success_url: returnUrl,
      cancel_url: returnUrl,
      metadata: {
        userId: req.user._id.toString(),
        productIds: cartItems.map((item) => item.product).join(','),
        shippingAddress: JSON.stringify({
          address: shippingAddress?.address || 'No address provided',
          city: shippingAddress?.city || 'No city',
          postalCode: shippingAddress?.postalCode || '00000',
          country: shippingAddress?.country || 'No country',
        }),
      },
    });
    res.send({ clientSecret: session.client_secret, sessionId: session.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

/**
 * @desc    Get Stripe checkout session status
 * @route   GET /api/orders/session-status
 * @access  Private
 */
const getStripeSessionStatus = asyncHandler(async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

  res.send({
    status: session.status,
    customer_email: session.customer_details.email,
  });
});

/**
 * @desc    Get order by session ID
 * @route   GET /api/orders/order-by-session-id
 * @access  Private
 */
const getOrderBySessionId = asyncHandler(async (req, res) => {
  const sessionId = req.query.session_id;
  const order = await Order.findOne({ 'paymentResult.id': sessionId });

  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
});

/**
 * @desc    Update order to paid
 * @route   PUT /api/orders/:id/pay
 * @access  Private
 */
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const { sessionId } = req.body;

  // Confirm the session using Stripe's API
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (!session) {
    res.status(400);
    throw new Error('Payment session not found');
  }

  if (session.payment_status !== 'paid') {
    res.status(400);
    throw new Error('Payment not completed');
  }

  const order = await Order.findById(req.params.id);

  if (order) {
    // Validate the correct amount was paid
    const paidCorrectAmount =
      order.totalPrice.toFixed(2) === (session.amount_total / 100).toFixed(2);
    if (!paidCorrectAmount) {
      res.status(400);
      throw new Error('Incorrect amount paid');
    }

    // Mark order as paid
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: session.id,
      status: session.payment_status,
      update_time: session.created,
      email_address: session.customer_details.email,
    };

    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToDelivered,
  getAllOrders,
  deleteOrder,
  createCheckoutSession,
  getStripeSessionStatus,
  getOrderBySessionId,
  updateOrderToPaid,
};
