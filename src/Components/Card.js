import React from 'react'
import { useNavigate } from "react-router-dom";
import cookbookPlaceholder from '../assets/cookbook-placeholder2.png';
import recipePlaceholder from '../assets/recipe-placeholder.png';
function Card( { type, data, userData, image }) {
  const navigate = useNavigate();

  const idKey = type == 'recipe' ? 'recipe_id' : (type == 'cookbook' ? 'cookbook_id' : '');
  const placeholderImage = type == 'recipe' ? recipePlaceholder : (type == 'cookbook' ? cookbookPlaceholder : '');
  
  const handleClick = () => {
    if (type == "recipe") {
      navigate(`/recipe/${data[idKey]}`);
    } else if (type == "cookbook") {
      navigate(`/cookbook/${data[idKey]}`,{state:userData});
    }
  };

  return (
    <div className='card--container' onClick={handleClick}>
      <div className='card--image-container'>
      <img src={image ? image : placeholderImage} alt="Base64 Encoded" />
      </div>
      <div className='card--title-container'>
        <span>{data['name']}</span>
      </div>
    </div>
  )
}

export default Card