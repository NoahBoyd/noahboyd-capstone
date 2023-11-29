import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

function RecipePictureUpload({ recipeID, handleNewProfilePic, type }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [statusText, setStatusText] = useState("");
  
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      if (!selectedFile) {
        console.error('No file selected');
        return;
      }

      // Check for file size (500KB = 500 * 1024 bytes)
      if (selectedFile.size > 1000 * 1024) {
        console.error('File size exceeds 1MB limit');
        return;
      }

      if (!selectedFile.type.startsWith('image/jpeg') && !selectedFile.type.startsWith('image/png') && !selectedFile.type.startsWith('image/jpg')) {
        console.error('Invalid file format. Please select a PNG or JPG image.');
        return;
      }
      const formData = new FormData();
      formData.append('photo', selectedFile);

      // Adjust the URL to the new generalized endpoint
      const response = await axios.post(`https://noahboyd-capstone-deploy-40896fd67e31.herokuapp.com/api/upload/${recipeID}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Upload-Type': "recipe" // Ensure this is correctly set based on the upload context
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        setStatusText("Success");
        // handleNewProfilePic(); // Make sure this function is appropriately handling different types of uploads
      } else {
        setStatusText("Failed to upload");
        console.error('Upload failed:', response.data.message);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  
  

  return (
    <Container className='upload-profile-container'>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Recipe Photo</button>
      <span style={statusText == "Success" ? {color: 'green'} : {color: 'red'}}>{statusText}</span>
    </Container>
  );
}

export default RecipePictureUpload;
