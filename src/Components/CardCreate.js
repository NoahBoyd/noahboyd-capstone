import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

function CardCreate( { type, userData, handleSetRefresh }) {
  const [displayForm, setDisplayForm] = useState(false);
  const [cookbookName, setCookbookName] = useState('');
  const navigate = useNavigate();


  const submitCookbook = async (cookbookName) => {
    let cookbookObject = {
      name: cookbookName,
      userID: userData.user_id
    };
    try {
      // Axios POST to cookbook endpoint
      const response = await axios.post('https://noahboyd-capstone-deploy-40896fd67e31.herokuapp.com/api/cookbook', {cookbookObject: cookbookObject}, {withCredentials: true});
      if (response.status === 200) {
        handleSetRefresh();
        setDisplayForm(false);
        setCookbookName('');
      }
    } catch (error) {
      console.log(error);
    }
  }
  const handleNewClick = () => {
    if (type == 'recipe') {
      let route = `/new${type}`;
      navigate(route);
    } else if (type == 'cookbook') {
      setDisplayForm(!displayForm);
    }
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (cookbookName != undefined && cookbookName.length > 0) {
      await submitCookbook(cookbookName);
    }
  }


  if (displayForm) {
    return (
      <div className='card--container d-flex flex-column justify-content-center align-items-center' style={{paddingLeft: '10px', paddingRight: '10px'}}>
          <Form>
            <Form.Group className="mb-3" controlId="formCookbookName">
              <Form.Label>Cookbook Name</Form.Label>
              <Form.Control type="text" placeholder="Enter name" onChange={(e) => setCookbookName(e.target.value)} value={cookbookName}/>
            </Form.Group>
            <Button onClick={handleNewClick} variant="danger" type="button" style={{marginRight: '10px'}}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" onClick={handleFormSubmit}>
              Create
            </Button>
          </Form>
      </div>
    )
  } else {
    return (
      <div onClick={handleNewClick} className='card--container d-flex flex-column justify-content-center align-items-center'>
          <span style={{fontWeight: 700, fontSize: '200%'}}>+</span>
          <span>Create New</span>
      </div>
    )
  }
}

export default CardCreate