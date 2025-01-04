import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Badge, NavDropdown } from 'react-bootstrap';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import logoOutline from '../assets/logo-outline.png';
import SearchBox from './SearchBox';
import { toast } from 'react-toastify';
import { resetCart } from '../slices/cartSlice';

/**
 * Header component that displays the navigation bar, search box, cart information,
 * and user/account options. It also provides admin links if the user is an admin.
 *
 * @returns {JSX.Element} - A header section with navigation and account controls.
 */
const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  /**
   * Handles user logout by calling the API and dispatching the logout action.
   * Navigates to the login page after logging out.
   */
  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      dispatch(resetCart());
      navigate('/login');
    } catch (error) {
      toast.error(error?.data?.message || error.error, {
        theme: 'colored',
        position: 'top-center',
      });
    }
  };

  return (
    <header style={{ zoom: '85%' }} className="bg-primary">
      <Navbar expand="md" collapseOnSelect>
        <Container>
          <LinkContainer
            to="/"
            style={{
              color: '#E0E5EB',
              letterSpacing: 1.4,
              fontWeight: 600,
              fontSize: 23,
            }}
          >
            <Navbar.Brand className="flex-row d-flex">
              <img src={logoOutline} alt="logo" style={{ width: 280 }} />
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav">
            <SearchBox />
            <Nav className="gap-3 ms-auto">
              <LinkContainer to="/cart">
                <Nav.Link className="p-2 px-4 text-white rounded-1 fw-semibold">
                  <FaShoppingCart size={22} style={{ paddingRight: 4 }} /> Cart
                  {cartItems.length > 0 && (
                    <Badge
                      className="bg-white text-primary"
                      style={{
                        zoom: '120%',
                        marginLeft: '7px',
                        borderRadius: '50%',
                      }}
                    >
                      {cartItems.reduce((acc, curr) => acc + curr.qty, 0)}
                    </Badge>
                  )}
                </Nav.Link>
              </LinkContainer>

              {userInfo ? (
                <NavDropdown
                  className="bg-warning rounded-1 fw-semibold"
                  style={{ paddingLeft: 12, paddingRight: 12, fontSize: 17 }}
                  title={userInfo.name}
                  id="username"
                >
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>

                  <NavDropdown.Item onClick={logoutHandler}>
                    Sign Out
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer
                  to="/login"
                  className="p-2 px-4 text-white rounded-1 fw-semibold"
                >
                  <Nav.Link>
                    <FaUser size={21} style={{ paddingRight: 5 }} /> Login
                  </Nav.Link>
                </LinkContainer>
              )}

              {userInfo && userInfo.isAdmin && (
                <NavDropdown
                  className="bg-info rounded-1 fw-semibold"
                  style={{
                    paddingLeft: 12,
                    paddingRight: 12,
                    fontSize: 17,
                    marginLeft: 10,
                  }}
                  title="Dashboard"
                  id="adminmenu"
                >
                  <LinkContainer to="/admin/productlist">
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/userlist">
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/orderlist">
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="slider"></div>
    </header>
  );
};

export default Header;
