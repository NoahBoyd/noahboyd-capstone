import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import '../App.css';
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const navigate = useNavigate();

  
  const handleSignup = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    // Clear error text
    setErrorText('');

    let passwordIsLongEnough = password.length >= 10;
    let passwordsMatch = password === confirmPassword;
    if (!passwordIsLongEnough) {
      // Passwords are too short
      setErrorText('Error: passwords must be at least 10 characters long');
    }

    if (!passwordsMatch) {
      // Passwords do not match
      setErrorText('Error: Passwords do not match');
    }

    // Send a POST request to the backend to handle signup
    if (passwordIsLongEnough && passwordsMatch) {
      try {
        const response = await axios.post('https://noahboyd-capstone-deploy-40896fd67e31.herokuapp.com/api/signup', {
          email,
          firstName,
          lastName,
          password,
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      
        if (response.status === 200) {
          // Handle successful signup
          setErrorText("Successfully created account, please wait while we redirect you")
          setTimeout(() => navigate('/login'), 2000);
          
        } else {
          // Handle signup error
        }
      } catch (error) {
        // Handle network error or other exceptions
        let errorMessage = error.response.data.message;
        if (errorMessage == "Email taken") {
          // Show error message for email taken
          setErrorText('An account has already been registered with that email address.');
        }
      }
    }
    
  };

  return (
    <Container>
      <Row className="justify-content-center" style={{height: '85vh', alignItems: 'center'}}>
        <Col md={6} className='w-75 p-5 round-form-border signup-form'>
          <h2>Create an Account</h2>
          <Form onSubmit={handleSignup}>
            <Form.Group controlId="email">
            <br />
              <Form.Control
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="firstName">
              <br />
              <Form.Control
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="lastName">
            <br />
              <Form.Control
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
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
            </Form.Group>

            <Form.Group controlId="confirmPassword">
              <br />
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <br />
            </Form.Group>
            <p className='error-text'>{errorText}</p>
            <Button variant="primary" className='app-btn-action' type="submit">
              Signup
            </Button>
          </Form>
         <Button variant='outline-primary' className='mt-3 btn btn-sm app-btn-primary' onClick={() => navigate('/login')}>Already a member?</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;
