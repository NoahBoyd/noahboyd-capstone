import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import Card from './Card';
import CardCreate from './CardCreate';
import axios from 'axios';

function CookbookCardList({ type, items, userData, handleSetRefresh }) {

  const [isEditing, setIsEditing] = useState(false);
  const idKey = type === 'recipe' ? 'recipe_id' : (type === 'cookbook' ? 'cookbook_id' : ''); // Key name for id of object
  const title = type === 'recipe' ? 'My Recipes' : (type === 'cookbook' ? 'My Cookbooks' : ''); // title to display
  const table = type === 'recipe' ? 'Recipes' : (type === 'cookbook' ? 'Cookbooks' : '');
  const handleEditClick = () => {
    setIsEditing(!isEditing)
  }

  const handleDeleteItem = async (item) => {
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
          userID: userData.user_id
        }
        const response = await axios.delete(`https://noahboyd-capstone-deploy-40896fd67e31.herokuapp.com/api/cookbook/${item[idKey]}`, {params: dataObject,withCredentials: true});
        if (response.status === 200) {
          handleSetRefresh();
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

if (items) {
    return (
      <div className='cookbookcardlist--container'>
        {items.map((item, index) => (
            <div className='d-flex flex-column align-items-center'>
                    <Card type={'recipe'} data={item}/>
            </div>
            ))}
      </div>
    );
}
}

export default CookbookCardList;
