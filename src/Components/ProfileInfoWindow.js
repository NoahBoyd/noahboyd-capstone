import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import EditProfileInfoWindow from './EditProfileInfoWindow';
import ProfilePictureUpload from './ProfilePictureUpload';
import axios from 'axios';


function ProfileInfoWindow(props) {
  const circleImageStyle = {
    width: '150px', // Set the desired width and height for the circle
    height: '150px',
    borderRadius: '50%', // Makes the element a circle
    objectFit: 'cover', // Ensures the image fits inside the circle
    marginBottom: '2rem'
  };

  const [isEditing, setIsEditing] = useState(false);
  const [showUploadProfilePic, setShowUploadProfilePic] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  const [newProfilePic, setNewProfilePic] = useState(0);
  const [userData, setUserData] = useState(props.userData)

  const handleSetIsEditing = () => {
    isEditing ? setIsEditing(false) : setIsEditing(true);
  }
  const handleSetShowUploadProfilePic = () => {
    showUploadProfilePic ? setShowUploadProfilePic(false) : setShowUploadProfilePic(true);
  }
  
  const handleNewProfilePic = () => {
    setNewProfilePic(newProfilePic + 1);
  }

  // useEffect tries a get request to the profile picture endpoint, if it returns status 200, set state variable to display the users profile picture
  useEffect(() => {
    setUserData(props.userData);
    const fetchProfilePhoto = async () => {
      try {
        // Construct URL
        const url = `https://noahboyd-capstone-deploy-40896fd67e31.herokuapp.com/api/user/${userData.user_id}/profile-photo`;
        // Make Axios request
        const response = await axios.get(url, {withCredentials: true,});
        // Check if the response is successful (status 200)
        if (response.status === 200) {
          setProfilePictureUrl(`${url}?timestamp=${new Date().getTime()}`);
        } else if (response.status === 404)  {
        }
      } catch (error) {
        console.error('Error fetching the profile photo:', error);
        setShowUploadProfilePic(true);
      }
    };

    // Invoke the function to make the Axios request
    fetchProfilePhoto();
  }, [newProfilePic, props.userData]); // Dependency array: useEffect runs when userData.user_id changes
  
  
  if (props.userData) {
    if (isEditing) {
      return (
        <EditProfileInfoWindow setUserData={props.setUserData} userData={userData} handleSetIsEditing={handleSetIsEditing}/>
      )
    } else {
      return (
        <div className='profileInfo--container'>
          {/* <img className='profile--profile_picture' src={`https://noahboyd-capstone-deploy-40896fd67e31.herokuapp.com/api/user/${props.userData.user_id}/profile-photo`}  style={circleImageStyle} onClick={handleSetShowUploadProfilePic} /> */}
          {/* Render Loading message if profile picture has not loaded */}
          {profilePictureUrl ? 
            <img 
              className='profile--profile_picture' 
              src={profilePictureUrl}  
              style={circleImageStyle} 
              onClick={handleSetShowUploadProfilePic} 
              alt="Profile"
            /> 
            : <p>Loading image...</p>
          }
          {showUploadProfilePic ? (<ProfilePictureUpload userId={userData.user_id} handleNewProfilePic={handleNewProfilePic} type={'profile'}/>) : (<></>)}
          <h1>{`${userData.first_name} ${userData.last_name}`}</h1>
          <p>{userData.email_address}</p>
          <Button variant='btn btn-outline-primary app-btn-primary' onClick={handleSetIsEditing}>Edit</Button>
        </div>
      )
    }
    
  }
}

export default ProfileInfoWindow