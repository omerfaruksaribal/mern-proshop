import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import { useRegisterMutation } from '../slices/usersApiSlice';
import { toast } from 'react-toastify';
import { setCredentials } from '../slices/authSlice';

const RegisterScreen = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const { name, email, password, confirmPassword } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate('/'); // Redirect to an authenticated route
    }
  }, [navigate, userInfo]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.warn('Please fill in all fields.', {
        theme: 'colored',
        position: 'top-center',
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.warn('Passwords do not match.', {
        theme: 'colored',
        position: 'top-center',
      });
    } else {
      try {
        const response = await register({ name, email, password }).unwrap();

        // Commented out verification navigation and token
        /*
        navigate('/verify', {
          state: {
            name,
            email,
            password,
            activationToken: response.activationToken,
          },
        });
        toast.success(`Verification code sent to ${email}.`, {
          theme: 'colored',
          position: 'top-center',
        });
        */

        // Automatically log in the user after registration
        dispatch(setCredentials({ ...response }));
        navigate('/'); // Redirect to an authenticated page
        toast.success(`Registration successful. Welcome, ${name}!`, {
          theme: 'colored',
          position: 'top-center',
        });
      } catch (error) {
        toast.error(
          `Something went wrong. [${error?.data?.message || error.error}]`,
          {
            theme: 'colored',
            position: 'top-center',
          }
        );
      }
    }
  };

  return (
    <FormContainer>
      <h1>Sign Up</h1>
      <Form onSubmit={submitHandler}>
        {/* Name Field */}
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your name"
            name="name"
            value={name}
            onChange={onChange}
            required
          ></Form.Control>
        </Form.Group>

        {/* Email Field */}
        <Form.Group controlId="email" className="my-3">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email"
            name="email"
            value={email}
            onChange={onChange}
            required
          ></Form.Control>
        </Form.Group>

        {/* Password Field */}
        <Form.Group controlId="password" className="my-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter a password"
            name="password"
            value={password}
            onChange={onChange}
            required
          ></Form.Control>
        </Form.Group>

        {/* Confirm Password Field */}
        <Form.Group controlId="confirmPassword" className="my-3">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm your password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={onChange}
            required
          ></Form.Control>
        </Form.Group>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          className="mt-4"
          disabled={isLoading}
        >
          {isLoading ? 'Registering...' : 'Register'}
        </Button>
      </Form>

      <Row className="py-3">
        <Col>
          Have an Account? <Link to="/login">Login</Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;
