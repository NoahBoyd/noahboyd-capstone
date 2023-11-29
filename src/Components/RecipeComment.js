import React from 'react'
import recipePlaceholder from '../assets/recipe-placeholder.png';
function RecipeComment({ commentData, image }) {
  return (
    <div className='recipeComment'>
      <div className='recipeComment--author'>
        <div className='author--photo'>
        <img src={image ? image : recipePlaceholder} alt="Base64 Encoded" />
        </div>
        <div className='author--name'>
          <span><strong>{`${commentData.first_name} ${commentData.last_name}`}</strong></span>
        </div>
      </div>
      <div className='recipeComment--comment'>
        <span>{`${commentData.comment}`}</span>  
      </div>
    </div>
  )
}

export default RecipeComment