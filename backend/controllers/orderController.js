import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';

/**
 * @description Create a new Order
 * @method POST
 * @link /api/orders
 * @access Private
 */
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = req.body;
  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No Order Items');
  } else {
    const order = new Order({
      orderItems: orderItems.map((x) => ({
        ...x,
        product: x._id,
        _id: undefined,
      })),
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    });
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

/**
 * @description Get Logged in Users Orders
 * @method Get
 * @link /api/orders/myorders
 * @access Private
 */
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

/**
 * @description Update Order to Paid
 * @method POST
 * @link /api/orders/:id/pay
 * @access Private
 */
const updateOrderToPaid = asyncHandler(async (req, res) => {
  res.send('update order to paid');
});

/**
 * @description Get Order by ID
 * @method POST
 * @link /api/orders/:id
 * @access Private
 * @role Admin
 */
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById({ _id: req.params.id }).populate(
    'user',
    'name email'
  );
  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

/**
 * @description Update Order to Delivered
 * @method POST
 * @link /api/orders/:id/deliver
 * @access Private
 * @role Admin
 */
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  res.send('update order to delivered');
});

/**
 * @description Get All Orders
 * @method Get
 * @link /api/orders
 * @access Private
 * @role Admin
 *  */
const getOrders = asyncHandler(async (req, res) => {
  res.send('get all orders');
});

export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
};
