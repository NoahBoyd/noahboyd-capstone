import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { Rating } from 'react-simple-star-rating'
import EditRecipe from './EditRecipe';
import RecipeComment from './RecipeComment';
import recipePlaceholder from '../assets/recipe-placeholder.png';
function RecipeView( props ) {
  const [cookies] = useCookies(['userAuthenticated']);
  const [userData, setUserData] = useState(props.userData); // To store user data from the Axios request
  const userAuthenticated = cookies.userAuthenticated !== undefined;
  const [recipeData, setRecipeData] = useState();
  const [show404, setShow404] = useState(false);
  const [newCommentText, setNewCommentText] = useState("");
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentPhotos, setCommentPhotos] = useState([]);
  const [computedClass, setComputedClass] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isFavourited, setIsFavourited] = useState(false);
  const [newRecipePic, setNewRecipePic] = useState(0);
  const [recipePicture, setRecipePicture] = useState("");
  // Catch Rating value
  const handleRating =  (rate) => {
    setRating(rate);
    submitRating(rate);
  }

  const handleNewRecipePic = () => {
    setNewRecipePic(newRecipePic + 1);
  }

  const submitRating = async (rate) => {
    // Make axios request to rating endpoint
    let dataObject = {
      userID: userData.user_id,
      recipeID: recipeData.recipe_id,
      rating: rate
    };
    try {
      // Axios POST to cookbook endpoint
      const response = await axios.post('https://noahboyd-capstone-deploy-40896fd67e31.herokuapp.com/api/recipe/rate', {dataObject: dataObject}, {withCredentials: true});
      if (response.status === 200) {
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getRecipeRatingForUser = async (dataObject) => {
    try {
      const response = await axios.get(`https://noahboyd-capstone-deploy-40896fd67e31.herokuapp.com/api/recipe/rate/${dataObject.id}/${dataObject.user_id}`, {withCredentials: true});
      if (response.status === 200) {
        setRating(response.data.rating);
      } else {
        console.log("No rating available");
      }
    } catch (error) {

    }
    
  };


  const setRecipeFavourite = async (dataObject) => {
    try {
      // The configuration object, including withCredentials, goes as the third argument
      const config = {
        withCredentials: true
      };

      const response = await axios.post(`https://noahboyd-capstone-deploy-40896fd67e31.herokuapp.com/api/recipe/favourite`, {dataObject}, config);
      if (response.status === 200) {
      } else {
        console.log("error setting status");
      }
    } catch (error) {
      console.log(error);
    }
};

const removeRecipeFavourite = async (dataObject) => {
  try {
    // The configuration object, including withCredentials, goes as the third argument
    const config = {
      withCredentials: true
    };

    const response = await axios.delete(`https://noahboyd-capstone-deploy-40896fd67e31.herokuapp.com/api/recipe/favourite/${dataObject.user_id}/${dataObject.id}`, config);
    if (response.status === 200) {
    } else {
      console.log("error removing favourite");
    }
  } catch (error) {
    console.log(error);
  }
};

  const handleFavouriteClick = async () => {    
    let dataObject = {
      user_id: userData.user_id,
      id: recipeData.recipe_id
    };
    
    await setRecipeFavourite(dataObject);

    getRecipeFavouriteStatus(dataObject);
  };

  const handleUnfavouriteClick = async () => {    
    let dataObject = {
      user_id: userData.user_id,
      id: recipeData.recipe_id
    };
    
    await removeRecipeFavourite(dataObject);

    getRecipeFavouriteStatus(dataObject);
  };


  const getRecipeFavouriteStatus = async (dataObject) => {
    try {
      
      const response = await axios.get(`https://noahboyd-capstone-deploy-40896fd67e31.herokuapp.com/api/recipe/favouite/${dataObject.id}/${dataObject.user_id}`, {withCredentials: true});
      if (response.status === 200) {
        setIsFavourited(response.data.isFavourite);
      } else {
        console.log("No rating available");
      }
    } catch (error) {

    }
    
  };

  const [reload, setReload] = useState(false);
  const handleSetReload = async () => {
    setRecipeData(undefined);
    setReload(prevState => !prevState);
    console.log("REFRESHING");
};

const fetchComments = async (dataObject) => {
  // FETCH COMMENTS axios request
  try {
    const response = await axios.get(`https://noahboyd-capstone-deploy-40896fd67e31.herokuapp.com/api/recipe/comment/${dataObject.id}`, {withCredentials: true});
    if (response.status === 200) {
      let commentsArray = response.data.commentsArray;
      setComments(commentsArray);
      fetchCommentPhotos(commentsArray);
    } else {
      console.log("No rating available");
    }
  } catch (error) {

  }

};

const fetchCommentPhotos = async (commentObjs) => {
  try {
    let userIDArray = commentObjs.map((comment) => comment.user_id);
    // Construct URL
    const url = `https://noahboyd-capstone-deploy-40896fd67e31.herokuapp.com/api/users/images`;
    // Make Axios request
    const response = await axios.post(url, {userIDArray},  {withCredentials: true,});
    // Check if the response is successful (status 200)
    if (response.status === 200) {
      // setFavouriteRecipePhotos(response.data.images);
      setCommentPhotos(response.data.images);
    } else if (response.status === 404)  {
    }
  } catch (error) {
    console.error('Error fetching the recipe photos:', error);
    // setShowUploadProfilePic(true);
  }
};


  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    // Axios request to create new comment endpoint
    let dataObject = {
      userID: userData.user_id,
      recipeID: recipeData.recipe_id,
      comment: newCommentText
    };
    try {
      // Axios POST to cookbook endpoint
      const response = await axios.post('https://noahboyd-capstone-deploy-40896fd67e31.herokuapp.com/api/recipe/comment', {dataObject: dataObject}, {withCredentials: true});
      if (response.status === 200) {
        setNewCommentText('');
        console.warn(dataObject.recipeID);
        dataObject.id = dataObject.recipeID;
        fetchComments(dataObject);
      } else {
        console.log("Error creating comment");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRecipePicture = async (recipeID) => {
    try {
      let recipeIDArray = [recipeID];
      // Construct URL
      const url = `https://noahboyd-capstone-deploy-40896fd67e31.herokuapp.com/api/recipes/images`;
      // Make Axios request
      const response = await axios.post(url, {recipeIDArray},  {withCredentials: true,});
      // Check if the response is successful (status 200)
      if (response.status === 200) {
        if (response.data.images.length > 0) {
          setRecipePicture(response.data.images[0].image);
        }
      } else if (response.status === 404)  {
      }
    } catch (error) {
      console.error('Error fetching the recipe photos:', error);
      // setShowUploadProfilePic(true);
    }
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const { id } = useParams(); // RECIPE ID PASSED AS PARAMETER TO ROUTE

  useEffect(() => {
    if (userAuthenticated && !recipeData && userData) {
        let dataObject = {
            user_id: userData.user_id,
            id: id
        }
        const fetchRecipeData = async (dataObject) => {
            try {
                // const url = `https://noahboyd-capstone-deploy-40896fd67e31.herokuapp.com/api/cookbook/${userData.user_id}`;
                const response = await axios.get('https://noahboyd-capstone-deploy-40896fd67e31.herokuapp.com/api/recipe', { params: {dataObject: dataObject}, withCredentials: true });
                if (response.status == 200) {
                    setRecipeData(response.data.recipeData);
                    if (response.data.recipeData.user_id != userData.user_id) {
                      setComputedClass("d-none");
                    }
                }
            } catch (error) {
                console.log(error)
                setShow404(true); // Show 404 error
            }
        };
        if (recipePicture  === "") {
          fetchRecipePicture(dataObject.id);
        }
        fetchRecipeData(dataObject);
        getRecipeRatingForUser(dataObject);
        fetchComments(dataObject);
        getRecipeFavouriteStatus(dataObject);
    } else {
      setShow404(true);
    }
    

  },[userAuthenticated, id, reload, comments]);

  // ---------------------------------------------- END OF FUNCTIONS ----------------------------------------------------------------------

  if (userAuthenticated) { // user is signed in 
    if (recipeData && !isEditing) { // RECIPE VALID

      const keys = Object.keys(recipeData);
      const spanElements = keys.map((key, index) => (
        <p key={index}>
          {key}: {recipeData[key]}
        </p>
      ));
      // Construct ingredients elements
      let ingredients = JSON.parse(recipeData.ingredients);
      const ingredientElements = ingredients.map((element, index) => {
        return (
          <p key={index}>&#9658; {element.amount} {element.unit} <strong>{element.name}</strong></p>
        )
      });
      // Construct ingredients elements
      let directions = JSON.parse(recipeData.directions);
      const directionElements = directions.map((element, index) => {
        return (
          <p key={index}>{index + 1}: {element}</p>
        )
      });
        // RETURN RECIPE VIEW PAGE
        return (
            <div className='d-flex flex-column align-items-center'>
              <h1>{recipeData.name}</h1>
              <Button className={`mb-3 btn btn-sm ${computedClass} app-btn-action`} onClick={handleEditClick}>Edit</Button>
              
              <div className='recipeView-section d-flex flex-column p-2'>
              <div className='recipe-view-image-container'>
                <img src={recipePicture && recipePicture.length > 0 ? recipePicture : recipePlaceholder} alt="Base64 Encoded" />
              </div>
                <div className='d-flex justify-content-between recipeView-details-section'>
                  <div>
                    <p className=''>Author: {recipeData.first_name} {recipeData.last_name}</p>
                  </div>

                  <div className='d-flex gap-3 rating-favourite'>
                    <Rating
                      onClick={handleRating}
                      /* Available Props */
                      initialValue={rating}
                    />
                    <Button className={isFavourited ? "d-none" : ""} onClick={handleFavouriteClick}>Favourite</Button>
                    <Button className={isFavourited ? "" : "d-none"} onClick={handleUnfavouriteClick}>Unfavourite</Button>
                  </div>
                  
                </div>
                <div>
                  {recipeData.description}
                </div>
              </div>

              <div className='recipeView-section d-flex recipe-times p-3'>
                <span><strong>{recipeData.tags}</strong></span>
                <span>Prep Time: <strong>{recipeData.prep_time}</strong></span>
                <span>Cook Time: <strong>{recipeData.cook_time}</strong></span>
                <span>Total Time: <strong>{recipeData.total_time}</strong></span>
                <span>Serves: <strong>{recipeData.serves}</strong></span>
              </div>

              <div className='recipeView-section d-flex flex-column p-3'>
                <h3>Ingredients</h3>
                <div className='d-flex flex-column align-items-start'>
                  {ingredientElements}
                </div>
              </div>

              <div className='recipeView-section d-flex flex-column p-3'>
                <h3>Directions</h3>
                <div className='d-flex flex-column align-items-start'>
                  {directionElements}
                </div>
              </div>

              <div className='recipeView-section recipeView-section--comments d-flex flex-column p-3 justify-content-center align-items-center'>
                <h3>Comments</h3>
                <div className='d-flex flex-column align-items-start comment-responsive-width'>
                  <div className='recipe-comments-list'>
                    {comments.map((comment, index) => {
                      const commentImage = commentPhotos[index] && typeof commentPhotos[index].image === "string" ? commentPhotos[index].image : "";
                      return <RecipeComment commentData={comment} image={commentImage}/>
                    })}
                  </div>

                  <div className='recipe-comments-form-container w-100'>
                    <Form onSubmit={handleCommentSubmit}>
                      <Row>
                        <Col sm={10}><Form.Control type='text' placeholder={"Enter Comment..."} className='w-100 mb-2' onChange={(e) => setNewCommentText(e.target.value)} value={newCommentText}/></Col>
                        <Col sm={2}><Button className='w-100 app-btn-action'>Submit</Button></Col>
                      </Row>
                    </Form>
                  </div>

                </div>
              </div>

            </div>
          )
    } else if (recipeData && isEditing) { // RECIPE INVALID
        return (
            <div>
              <EditRecipe userData={userData} handleEditClick={handleEditClick} recipeData={recipeData} handleSetReload={handleSetReload} handleNewRecipePic={handleNewRecipePic}/>
            </div>
          )
    }
    else if (show404) { // RECIPE INVALID
      return (
          <div>
            <h1>No Recipe Found that matches ID = {id}</h1>
          </div>
        )
  }
  } else {
    return ( // user is not signed in
      <div>
        <h1>Create Recipe</h1>
        <p>You must be signed in to see this page</p>
      </div>
    )
  }

}

export default RecipeView