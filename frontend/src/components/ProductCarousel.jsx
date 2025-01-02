import { Link } from 'react-router-dom';
import { Carousel, Image } from 'react-bootstrap';
import Message from './Message.jsx';
import { useGetTopProductsQuery } from '../slices/productsApiSlice.js';

/**
 * ProductCarousel component to display a carousel of top-rated products.
 * Fetches the top products and renders them in a Bootstrap carousel.
 *
 * @returns {JSX.Element | null} - A carousel of top products or an error message.
 */
const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  // If loading, render nothing. If there's an error, display a message.
  return isLoading ? null : error ? (
    <Message variant="danger">{error?.data?.message || error.error}</Message>
  ) : (
    <div className="mt-3 carousel-container">
      <Carousel pause="hover" className="mx-auto mb-5" style={{ zoom: '65%' }}>
        {products.map((product) => (
          <Carousel.Item key={product._id} className="text-center">
            <Link to={`/product/${product._id}`}>
              <Image src={product.image} alt={product.name} fluid />
              <Carousel.Caption>
                <p className="text-right text-white caption">
                  {product.name} (${product.price})
                </p>
              </Carousel.Caption>
            </Link>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default ProductCarousel;
