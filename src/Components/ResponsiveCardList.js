import React, { useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import Card from './Card';
import CardCreate from './CardCreate';
import axios from 'axios';
import CardResponsive from './CardResponsive';

function ResponsiveCardList({ type, items, userData, handleSetRefresh, images }) {

  const [isEditing, setIsEditing] = useState(false);
  const idKey = type === 'recipe' ? 'recipe_id' : (type === 'cookbook' ? 'cookbook_id' : ''); // Key name for id of object
  const title = type === 'recipe' ? 'My Recipes' : (type === 'cookbook' ? 'My Cookbooks' : ''); // title to display
  const table = type === 'recipe' ? 'Recipes' : (type === 'cookbook' ? 'Cookbooks' : '');


if (items) {
    return (
        <Container className='w-100'>
            <div className='d-flex align-items-center gap-3 justify-content-center responsive-card-list flex-wrap'>
                {items.map((item, index) => {
                    const itemImage = images[index] && typeof images[index].image === "string" ? images[index].image : "";
                    return (
                        <CardResponsive  type={'recipe'} data={item} userData={userData} image={itemImage}/>
                    )
                })}
            </div>
        </Container>
    );
}
}

export default ResponsiveCardList;
