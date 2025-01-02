import { Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Rating from './Rating';

import { addToCart } from '../slices/cartSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

/**
 * Product component to display individual product details, including name, image, price, and rating.
 * Provides functionality to add the product to the cart.
 *
 * @param {object} product - The product object containing details such as _id, image, name, price, rating, and numReviews.
 *
 * @returns {JSX.Element} - A card displaying the product with a link to its detail page and an "Add to Cart" button.
 */
const Product = ({ product }) => {
  const dispatch = useDispatch();

  /**
   * Handler function to add the product to the cart.
   * Dispatches the addToCart action and displays a success toast notification.
   *
   * @param {object} product - The product object to add to the cart.
   * @param {number} qty - The quantity of the product to add.
   */
  const addToCartHandler = async (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
    toast.success('Item added to cart successfully.', {
      theme: 'colored',
      position: 'bottom-center',
    });
  };

  return (
    <Card className="p-3 pb-2 my-3 rounded-3 product-card">
      <Link to={`/product/${product._id}`}>
        <Card.Img src={product.image} variant="top" />
      </Link>

      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as="div" className="product-title">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as="div">
          <Rating
            value={product.rating}
            text={`${product.numReviews} Reviews`}
          />
        </Card.Text>

        <div className="card-price-button-container">
          <Card.Text
            className="pt-2 product-price text-primary fw-normal"
            as="h3"
          >
            ${product.price}
          </Card.Text>

          <Button
            className="py-2 text-white add-to-cart-button bg-primary fw-medium"
            onClick={(e) => addToCartHandler(product, 1)}
          >
            Add to Cart
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Product;
