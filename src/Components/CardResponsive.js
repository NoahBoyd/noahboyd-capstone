import React from 'react'
import { useNavigate } from "react-router-dom";
import { Button, Container } from 'react-bootstrap';
import cookbookPlaceholder from '../assets/cookbook-placeholder2.png';
import recipePlaceholder from '../assets/recipe-placeholder.png';

function CardResponsive( { type, data, userData, image }) {
  const navigate = useNavigate();

  const idKey = type == 'recipe' ? 'recipe_id' : (type == 'cookbook' ? 'cookbook_id' : '');
  const placeholderImage = type == 'recipe' ? recipePlaceholder : (type == 'cookbook' ? cookbookPlaceholder : '');
  
  const handleClick = () => {
    console.warn("Clicked on Card with ID =", data[idKey], userData);
    if (type == "recipe") {
      navigate(`/recipe/${data[idKey]}`);
    } else if (type == "cookbook") {
      navigate(`/cookbook/${data[idKey]}`,{state:userData});
    }
  };

  const handleDeleteClick = async (item) => {
    console.log("REMOVING ITEM RECIPE FROM COOKBOOK ID =", item.recipe_id)
  };

  return (
    <div className='card--container-responsive' onClick={handleClick}>
      <div className='card--image-container'>
      <img src={image ? image : placeholderImage} alt="Base64 Encoded" />
      </div>
      <div className='card--title-container'>
        <span style={data.name.length > 50 ? {fontSize: '70%'} : {}}>{data['name']}</span>
      </div>
    </div>
  )
}

export default CardResponsive