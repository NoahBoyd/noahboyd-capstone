import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { Container, Button } from 'react-bootstrap';
import ProfileInfoWindow from './ProfileInfoWindow';
import ResponsiveCardList from './ResponsiveCardList';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

// Component for the profile route
function ProfileOverview(props) {
  const [cookies] = useCookies(['userAuthenticated']);
  const [userData, setUserData] = useState(props.userData); // To store user data from the Axios request
  const userAuthenticated = cookies.userAuthenticated !== undefined;
  const [showFavourites, setShowFavourites] = useState(false);
  const [showMetrics, setShowMetrics] = useState(false);
  const [favouriteRecipes, setFavouriteRecipes] = useState([]);
  const [favouriteRecipePhotos, setFavouriteRecipePhotos] = useState([]);
  const [recipeRatings, setRecipeRatings] = useState([]);
  const [chartDataValid, setChartDataValid] = useState(false);

  const handleShowFavourites = async () => {
    // Fetch favourites
    try {
      const response = await axios.get(`https://noahboyd-capstone-deploy-40896fd67e31.herokuapp.com/api/user/${userData.user_id}/favourites`, {withCredentials: true});
      if (response.status === 200) {
        fetchRecipePhotos(response.data.favourites);
        setFavouriteRecipes(response.data.favourites);
      } else {
        console.log("No rating available");
      }
    } catch (error) {
  
    }
    setShowFavourites(true);
  };

  const fetchRecipePhotos = async (recipeObjs) => {
    try {
      let recipeIDArray = recipeObjs.map((recipe) => recipe.recipe_id);
      // Construct URL
      const url = `https://noahboyd-capstone-deploy-40896fd67e31.herokuapp.com/api/recipes/images`;
      // Make Axios request
      const response = await axios.post(url, {recipeIDArray},  {withCredentials: true,});
      // Check if the response is successful (status 200)
      if (response.status === 200) {
        setFavouriteRecipePhotos(response.data.images);
      } else if (response.status === 404)  {
      }
    } catch (error) {
      console.error('Error fetching the recipe photos:', error);
      // setShowUploadProfilePic(true);
    }
  };

  const handleShowMetrics = async () => {
    // Fetch Metrics
    try {
      const response = await axios.get(`https://noahboyd-capstone-deploy-40896fd67e31.herokuapp.com/api/user/${userData.user_id}/metrics`, {withCredentials: true});
      if (response.status === 200) {
        // Set users recipe ratings
        let summarizedRatings = response.data.summarizedRatings;
        if (summarizedRatings.length > 0) {
          const data = {
            labels:  summarizedRatings.map((rating) => rating.name),
            datasets: [
              {
                label: 'Average Rating',
                data: summarizedRatings.map((rating) => rating.avgRating),
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
              },
            ],
          };
          setRecipeRatings(data);
          setChartDataValid(true);
        }
      } else {
        console.log("No rating available");
      }
    } catch (error) {
      
    }
    setShowMetrics(true); // Show metrics
  };

  useEffect(() => {
    setUserData(props.userData);
    if (userAuthenticated) {
      // User is authenticated, make an Axios request to get user data
 
    }
  }, [userAuthenticated, props.userData]);

  useEffect(() => {
    setUserData(props.userData);
  }, [props.userData]);
  

  if (userAuthenticated && userData && !showFavourites && !showMetrics) { // user is signed in 
    return (
        <div className='profileOveriview--container'>
            <div className='profileOverview--left'>
                <ProfileInfoWindow setUserData={props.setUserData} userData={userData}/>
            </div>
            <div className='profileOverview--right'>
                <Button className='profile--button app-btn-primary' onClick={() => handleShowFavourites()}>Favourite Recipes</Button>
                <Button className='profile--button app-btn-primary' onClick={() => handleShowMetrics()}>Profile Metrics</Button>
            </div>
        </div>
    )
  } else if (userAuthenticated && userData && showFavourites) {
    return (
      <div className='managecookbook--container'>
        <div className='managecookbook--header'>
            <h1>Favourite Recipes</h1>
            <Button variant='danger' className='app-btn-danger' onClick={() => setShowFavourites(false)}>X</Button>
        </div>
        
        <div>
            <Container className='pt-3'>
                <ResponsiveCardList type={'recipe'} items={favouriteRecipes} images={favouriteRecipePhotos}/>
            </Container>
        </div>
    </div>
    )
  } else if (userAuthenticated && userData && showMetrics) {
    return ( // user is not signed in
    <div className='managecookbook--container'>
    <div className='managecookbook--header'>
        <h1>Profile Metrics</h1>
        <Button variant='danger' className='app-btn-danger' onClick={() => setShowMetrics(false)}>X</Button>
    </div>
    
    <div>
        <Container className='pt-3'>
            <h2>Metrics</h2>
            <Container>
              {chartDataValid ? (
              <Bar data={recipeRatings} />
              ) : (
                <div></div>
              )}
            </Container>
        </Container>
    </div>
</div>
    )
  } else {
    return ( // user is not signed in
      <div>
        <h1>ProfileOverview</h1>
        <p>You must be signed in to see this page</p>
      </div>
    )
  }

}

export default ProfileOverview
