import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import '../App.css';

const Login = (props) => {
  const [cookies, setCookie] = useCookies(['userAuthenticated']);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setErrorText('');
    try {
      const response = await axios.post('https://noahboyd-capstone-deploy-40896fd67e31.herokuapp.com/api/login', {
        email: email,
        password: password,
      }, {
        withCredentials: true,
      });

      if (response.status === 200) { // USER SUCCESSFULLY LOGS IN
        let userData = {
          user_id: response.data.user_id,
          email_address: response.data.email_address,
          first_name: response.data.first_name,
          last_name: response.data.last_name,
          profile_picture: response.data.profile_picture
        };
        setCookie('userAuthenticated', response.data.user_id, { maxAge: 86400 });
        props.setUserData(userData);
        localStorage.setItem("userData", JSON.stringify(userData));
        navigate("/home");
      } else {
        // Handle login error
      }
    } catch (error) {
      console.error(error);
      let errorMessage = error.response.data.message;
      if (errorMessage === 'Incorrect Password') {
        setErrorText('Incorrect password');
      } else if (errorMessage === 'User does not exist') {
        setErrorText('Could not find a user with that email address');
      }
    }
  };

  return (
    <Container>
      <Row className="justify-content-center" style={{height: '85vh', alignItems: 'center'}} >
        <Col md={6} className='w-75 p-5 round-form-border login-form'>
          <h2>Login</h2>
          <Form onSubmit={handleLogin}>
            <Form.Group controlId="email">
              <br />
              <Form.Control
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="password">
              <br />
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <br />
            </Form.Group>
            <p className='error-text'>{errorText}</p>
            <Button variant="primary" className='app-btn-action' type="submit" style={{ width: '100%' }}>
              Login
            </Button>
          </Form>
          <Button variant='outline-primary' className='mt-3 btn btn-sm app-btn-primary' onClick={() => navigate('/signup')}>Dont have an account?</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
