import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import ProfilePictureUpload from './ProfilePictureUpload';
import axios from 'axios';



function EditProfileInfoWindow(props) {
    const [firstName, setFirstName] = useState(props.userData.first_name);
    const [lastName, setLastName] = useState(props.userData.last_name);
    const [userData, setUserData] = useState(props.userData);

    useEffect(() => {
      setUserData(props.userData);
    }, [props.userData]);
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Update userData with new first and last name
        const updatedUserData = {
          ...userData,
          first_name: firstName,
          last_name: lastName
        }
        try {
          const url = `https://noahboyd-capstone-deploy-40896fd67e31.herokuapp.com/api/user/${userData.user_id}`; // Replace with your API endpoint

          const response = await axios.put(url, updatedUserData, {withCredentials: true}); // Axios automatically stringifies JSON objects
  
          if (response.status = 200) {
            let updatedUserData = response.data.userData[0];
            // Set userData in app state
            props.setUserData(updatedUserData); // Set userData in state
            props.handleSetIsEditing(); // Close editing window
          }
        } catch (error) {
          console.log(error);
        }
    }
    
  return (
    <Container>
      <Row className="justify-content-center" style={{height: '85vh', alignItems: 'center'}}>
        <Col md={6}>
          <h2>Edit Your Info</h2>
          <Form onSubmit={(handleSubmit)}>
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
              <br />
            </Form.Group>
            <Button variant="primary" className='app-btn-action' type="submit" style={{ width: '100%' }}>
              Submit
            </Button>
          </Form>
          <br />
          <Button className='btn btn-danger app-btn-danger' onClick={props.handleSetIsEditing}>X</Button>
        </Col>
      </Row>
    </Container>
  )
}

export default EditProfileInfoWindow