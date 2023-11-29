import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import Card from './Card';
import CardCreate from './CardCreate';
import axios from 'axios';

function CardList({ type, items, userData, handleSetRefresh, images }) {

  const [isEditing, setIsEditing] = useState(false);
  const idKey = type === 'recipe' ? 'recipe_id' : (type === 'cookbook' ? 'cookbook_id' : ''); // Key name for id of object
  const title = type === 'recipe' ? 'My Recipes' : (type === 'cookbook' ? 'My Cookbooks' : ''); // title to display
  // const table = type === 'recipe' ? 'Recipes' : (type === 'cookbook' ? 'Cookbooks' : '');
  const handleEditClick = () => {
    setIsEditing(!isEditing)
  }

  const handleDeleteItem = async (item) => {
    // console.log(table);
    if (type === 'recipe') {
      // Send delete request to recipe endpoint
      try {
        const response = await axios.delete(`https://noahboyd-capstone-deploy-40896fd67e31.herokuapp.com/api/recipe/${item[idKey]}`, {withCredentials: true});
        if (response.status === 200) {
          
          handleSetRefresh();
        }
      } catch (error) {
        console.log(error);
      }
    } else if (type === 'cookbook') {
      // Send delete request to cookbook endpoint
      try {
        let dataObject = {
          userID: userData.user_id,
          cookbookUserID: item.user_id
        }
        const response = await axios.delete(`https://noahboyd-capstone-deploy-40896fd67e31.herokuapp.com/api/cookbook/${item[idKey]}`, {params: dataObject,withCredentials: true});

        if (response.status === 200) {
          handleSetRefresh();
        } else {
          handleSetRefresh();
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  if (items) {
    return (
      <div className='cardlist--container'>
        <div className='cardlist--header'>
          <span className='cardlist--title' style={{ fontWeight: 700 }}>{title}</span>
          <Button variant='outline-dark' className='app-btn-primary' onClick={handleEditClick}>Edit</Button>
        </div>
        <div className='cardlist--card-container'>
          <CardCreate type={type} userData={userData} handleSetRefresh={handleSetRefresh} />
          {items.map((item, index) => {
            // Safely access the image property
            const itemImage = images[index] && typeof images[index].image === "string" ? images[index].image : "";
            return (
              <div className='d-flex flex-column align-items-center' key={item[idKey]}> {/* Added key for React list rendering */}
                <Card type={type} data={item} userData={userData} image={itemImage} />
                {isEditing && (
                  <Button onClick={() => handleDeleteItem(item)} className='btn btn-danger w-25 app-btn-danger' style={{ marginTop: '5px' }}>X</Button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  } else {
    return <div>Loading...</div>; // Or any other placeholder you'd like to show when there are no items
  }
}

export default CardList;
