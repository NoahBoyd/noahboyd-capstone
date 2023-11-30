import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import axios, { all } from 'axios';
import CardList from './CardList';

function Home(props) {
  const [cookies] = useCookies(['userAuthenticated']);
  const [userData, setUserData] = useState(props.userData); // To store user data from the Axios request
  const userAuthenticated = cookies.userAuthenticated !== undefined;
  const [userRecipes, setUserRecipes] = useState([]);
  const [userCookbooks, setUserCookbooks] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [userRecipeImages, setUserRecipeImages] = useState([]);
  const [userCookbookImages, setUserCookbookImages] = useState([]);

  const handleSetRefresh = () => {
    setRefresh(prevState => !prevState);
    console.log("REFRESHING");
};

  const fetchRecipePhotos = async (recipeObjs) => {
    try {
      let recipeIDArray = recipeObjs.map((recipe) => recipe.recipe_id);
      // Construct URL
      const url = `https://noahboyd-capstone-deploy-40896fd67e31.herokuapp.com/api/recipes/images`;
      // Make Axios request
      const response = await axios.post(url, {recipeIDArray},  {withCredentials: true,});
      // Check if the response is successful (status 200)
      console.log(response);
      if (response.status === 200) {
        setUserRecipeImages(response.data.images);
      } else if (response.status === 404)  {
      }
    } catch (error) {
      console.error('Error fetching the recipe photos:', error);
      // setShowUploadProfilePic(true);
    }
  };

  const fetchCookbookPhotos = async (cookbookObjs) => {
    try {
      let cookbookIDArray = cookbookObjs.map((cookbook) => cookbook.cookbook_id);
      // Construct URL
      const url = `https://noahboyd-capstone-deploy-40896fd67e31.herokuapp.com/api/cookbooks/images`;
      // Make Axios request
      const response = await axios.post(url, {cookbookIDArray},  {withCredentials: true,});
      // Check if the response is successful (status 200)
      if (response.status === 200) {
        setUserCookbookImages(response.data.images);
      } else if (response.status === 404)  {
      }
    } catch (error) {
      console.error('Error fetching the cookbook photos:', error);
      // setShowUploadProfilePic(true);
    }
  };

  const fetchAllCookbooks = async () => {
    try {
      // Construct URL
      const url = `https://noahboyd-capstone-deploy-40896fd67e31.herokuapp.com/api/cookbook/all/${userData.user_id}`;

      // Make Axios request
      const response = await axios.get(url, {withCredentials: true,});

      // Check if the response is successful (status 200)
      if (response.status === 200) {
        if (response.data.cookbooks) {
          let allCookbooks = response.data.cookbooks;
          if (allCookbooks != undefined) {
            // setUserCookbooks(cookbooks);
            setUserCookbooks(allCookbooks);
            fetchCookbookPhotos(allCookbooks);
          } else {
          }
          
        }
      } else if (response.status === 404) {
        console.log("404")
      }
    } catch (error) {
      console.error('Error fetching the profile photo:', error);
    }
  };


  useEffect(() => {
    if (userAuthenticated) {
      // User is authenticated, make an Axios request to get user data
      
      const fetchUserRecipes = async () => {
        try {
          // Construct URL
          const url = `https://noahboyd-capstone-deploy-40896fd67e31.herokuapp.com/api/recipe/${userData.user_id}`;
  
          // Make Axios request
          const response = await axios.get(url, {withCredentials: true,});
  
          // Check if the response is successful (status 200)
          if (response.status === 200) {
            let recipes = response.data.recipes[0];
            setUserRecipes(recipes);
            fetchRecipePhotos(recipes);
          }
        } catch (error) {
          console.error('Error fetching the profile photo:', error);
        }
      };

      const fetchUserCookbooks = async () => {
        try {
          // Construct URL
          const url = `https://noahboyd-capstone-deploy-40896fd67e31.herokuapp.com/api/cookbook/${userData.user_id}`;
  
          // Make Axios request
          const response = await axios.get(url, {withCredentials: true,});
  
          // Check if the response is successful (status 200)
          if (response.status === 200) {
            let cookbooks = response.data.cookbooks[0];
            setUserCookbooks(cookbooks);
          }
        } catch (error) {
          console.error('Error fetching the profile photo:', error);
        }
      };
      

      fetchUserRecipes();
      // fetchUserCookbooks();
      fetchAllCookbooks();
    }

  }, [userAuthenticated, refresh]);

  if (userAuthenticated && userData) { // user is signed in 
    return (
      <>
        <div className='home--top'>
          <CardList type={'cookbook'} userData={userData} items={userCookbooks} handleSetRefresh={handleSetRefresh} images={userCookbookImages}/>
        </div>
        <div className='home--bottom'>
          <CardList type={'recipe'} items={userRecipes} handleSetRefresh={handleSetRefresh} images={userRecipeImages}/>
        </div>
      </>
    )
  } else {
    return ( // user is not signed in
      <div>
        <h1>Home</h1>
        <p>You must be signed in to see this page</p>
      </div>
    )
  }

}

export default Home
