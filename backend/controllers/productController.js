import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js';

/**
 * @description Fetch All Products
 * @method GET
 * @link /api/products
 * @access Public
 */
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

/**
 * @description Fetch one product by ID
 * @method GET
 * @link /api/products/:id
 * @access Public
 */
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    return res.json(product);
  } else {
    res.status(404);
    throw new Error('Resource not Found');
  }
});

export { getProducts, getProductById };
