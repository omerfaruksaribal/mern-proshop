import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product.jsx';
import Loader from '../components/Loader.jsx';
import Message from '../components/Message.jsx';
import { useGetProductsQuery } from '../slices/productsApiSlice.js';
import { Link, useParams } from 'react-router-dom';
import Paginate from '../components/Paginate.jsx';
import ProductCarousel from '../components/ProductCarousel.jsx';
import Meta from '../components/Meta.jsx';

const HomeScreen = () => {
  const { keyword, pageNumber } = useParams();
  const page = pageNumber ? Number(pageNumber) : 1;

  const { data, isLoading, error } = useGetProductsQuery({
    keyword: keyword || '',
    pageNumber: page,
  });

  return (
    <>
      {!keyword && <ProductCarousel />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Meta title="Mernmart | Your eCommerce Website" />
          {keyword ? (
            <>
              <Link to="/" className="btn btn-light">
                Go Back
              </Link>
              <h1 className="mt-4">Results related to "{keyword}"</h1>
            </>
          ) : (
            <h1 className="mt-4">Featured Products</h1>
          )}

          <Row className="mb-5">
            {data.products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={data.pages}
            page={data.page}
            keyword={keyword ? keyword : ''}
          />
        </>
      )}
    </>
  );
};

export default HomeScreen;
