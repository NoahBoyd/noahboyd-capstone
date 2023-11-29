import React from 'react'
import '../App.css';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import landingImage from '../assets/landing-image.jpeg';
function LandingPage() {
  const navigate = useNavigate();
  return (
    <Container className='d-flex h-100'>
      <div className='d-flex flex-column justify-content-center align-items-start w-50 h-100'>
        <h1 className='landing-tagline'>Bring your family's recipes to life.</h1>
        <span className='landing-description'>Share discover, and preserve your culinary traditions with our online recipe community</span>
        <Button variant='outline-primary' className='app-btn-action' onClick={() => navigate('/signup')}>Get Started</Button>
      </div>
      <div className='d-flex justify-content-center align-items-center w-50 h-100'>
      <img src={landingImage} className='landing-image' alt="image" />
      </div>
    </Container>
  )
}

export default LandingPage;