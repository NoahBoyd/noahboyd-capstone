import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import CardList from './CardList';
import ResponsiveCardList from './ResponsiveCardList'
import CookbookCardList from './CookbookCardlist';
import Table from 'react-bootstrap/Table';
import { Form, Button, Row, Col, Container, FormGroup } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import CookbookPictureUpload  from './CookbookPictureUpload';

function CookbookHome({ userData }) {
    // -------------------------------------------------------------------------- Initialize Variables -----------------------------------------------------------------------------------------------------
    const [cookies] = useCookies(['userAuthenticated']);
    const userAuthenticated = cookies.userAuthenticated !== undefined;
    const [userDetails, setUserDetails] = useState(userData);
    const [cookbookDetails, setCookbookDetails] = useState();
    const [cookbookRecipes, setCookbookRecipes] = useState();
    const [show404, setShow404] = useState(false);
    const [showAddRecipe, setShowAddRecipe] = useState(false);
    const [userRecipes, setUserRecipes] = useState([]);
    const [showSettings, setShowSettings] = useState(false);
    const [showManageMembers, setShowManageMembers] = useState(false);
    const [addMemberText, setAddMemberText] = useState("");
    const [insertUserMessage, setInsertUserMessage] = useState("");
    const [cookbookMembers, setCookbookMembers] = useState([]);
    const [showManageCookbook, setShowManageCookbook] = useState(false);
    const [cookbookName, setCookbookName] = useState("");
    const [cookbookDescription, setCookbookDescription] = useState("");
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const [isFiltered, setIsFiltered] = useState(false);
    const [filterValue, setFilterValue] = useState("");

    const [showStats, setShowStats] = useState(false);
    const [cookbookRatings, setCookbookRatings] = useState([]);
    const [chartDataValid, setChartDataValid] = useState(false);
    const [recipePhotos, setRecipePhotos] = useState([]);
    const [filteredRecipePhotos, setFilteredRecipePhotos] = useState([]);
    const { id } = useParams(); // RECIPE ID PASSED AS PARAMETER TO ROUTE

    // -------------------------------------------------------------------------- Functions -----------------------------------------------------------------------------------------------------

    const fetchCookbookData = async (id) => {
        if (userAuthenticated && userData) {
            let dataObject = {
                user_id: userData.user_id,
                id: id
            }
            try {
                const response = await axios.get('https://noahboyd-capstone-deploy-40896fd67e31.herokuapp.com/api/cookbook', { 
                    params: dataObject, // Just pass the dataObject directly here
                    withCredentials: true 
                });
                let cookbookData = response.data.cookbookData;
                if (cookbookData) {
                    setCookbookDetails(cookbookData);
                }
            } catch (error) {
                console.error("An error occured fetching cookbook data");
            }
        } else {
            setShow404(true);
        }
    };

    const fetchCookbookRecipes = async (id) => {
        try {
            // Construct URL
            const url = `https://noahboyd-capstone-deploy-40896fd67e31.herokuapp.com/api/recipe/cookbook/${id}`;
    
            // Make Axios request
            const response = await axios.get(url, {withCredentials: true,});
    
            // Check if the response is successful (status 200)
            if (response.status === 200) {
              let recipes = response.data.recipes;
              setCookbookRecipes(recipes);
              setFilteredRecipes(recipes);
              fetchRecipePhotos(recipes);
              // Change button to say ADDED
            }
          } catch (error) {
            console.error('Error fetching the profile photo:', error);
          }
    }

    const fetchRecipePhotos = async (recipeObjs) => {
        try {
          let recipeIDArray = recipeObjs.map((recipe) => recipe.recipe_id);
          // Construct URL
          const url = `https://noahboyd-capstone-deploy-40896fd67e31.herokuapp.com/api/recipes/images`;
          // Make Axios request
          const response = await axios.post(url, {recipeIDArray},  {withCredentials: true,});
          // Check if the response is successful (status 200)
          if (response.status === 200) {
            setRecipePhotos(response.data.images);
            setFilteredRecipePhotos(response.data.images)
          } else if (response.status === 404)  {
          }
        } catch (error) {
          console.error('Error fetching the recipe photos:', error);
          // setShowUploadProfilePic(true);
        }
      };

    const fetchUserRecipes = async (userID) => {
        try {
          // Construct URL
          const url = `https://noahboyd-capstone-deploy-40896fd67e31.herokuapp.com/api/recipe/${userID}`;
  
          // Make Axios request
          const response = await axios.get(url, {withCredentials: true,});
  
          // Check if the response is successful (status 200)
          if (response.status === 200) {
            let recipes = response.data.recipes[0];
            setUserRecipes(recipes);
          }
        } catch (error) {
          console.error('Error fetching the profile photo:', error);
        }
      };
    
    const handleAddRecipeClick = async () => {
        console.warn("User wants to add recipe to cookbook");
        console.warn("COOKBOOK RECIPES ->",cookbookRecipes);
        setShowAddRecipe(true);
        // fetch user recipes
        fetchUserRecipes(userDetails.user_id);
    };

    const handleAddClicked = async (recipeID, userID, cookbookID) => {
        console.warn("handleAddClicked()", recipeID, userID, cookbookID);
        // Axios request to add recipe to cookbook
        let dataObject = {
            recipeID: recipeID,
            userID: userID,
            cookbookID: cookbookID
          };
          try {
            // Axios POST to cookbook endpoint
            const response = await axios.post(`https://noahboyd-capstone-deploy-40896fd67e31.herokuapp.com/api/cookbook/addRecipe`, {dataObject: dataObject}, {withCredentials: true});
            if (response.status === 200) {
              fetchCookbookRecipes(cookbookDetails.cookbook_id);
            }
          } catch (error) {
            console.log(error);
          }
    };

    const handleRemoveRecipeClicked = async (recipeID, userID, cookbookID) => {

        try {
            let deleteResult =  await axios.delete(`https://noahboyd-capstone-deploy-40896fd67e31.herokuapp.com/api/cookbook/removeRecipe/${cookbookID}/${recipeID}`, {withCredentials: true});
            if (deleteResult.status === 200) {
                fetchCookbookRecipes(cookbookDetails.cookbook_id);
            }
        } catch (error) {

        }
    };
    
    const addMemberHandler = async (e) => {
        e.preventDefault();
        let dataObject = {
            userID: userDetails.user_id,
            cookbookID: cookbookDetails.cookbook_id,
            newUserEmail: addMemberText
        }
        setAddMemberText('');
        submitMemberToCookbook(dataObject);
    }

    const submitMemberToCookbook = async (dataObject) => {
        // Axios request to add member endpoint
        try {
            // Axios POST to cookbook endpoint
            const response = await axios.post(`https://noahboyd-capstone-deploy-40896fd67e31.herokuapp.com/api/cookbook/addMember`, {dataObject: dataObject}, {withCredentials: true});
            if (response.status === 200) {
              fetchAllCookbookUsers(cookbookDetails.cookbook_id);
            } else {
                console.warn("ERROR INSERTING USER TO COOKBOOK");
                setInsertUserMessage("No user exists with that email address");
            }
          } catch (error) {
            console.log(error);
          }
    }

    const fetchAllCookbookUsers = async (cookbookID) => {
        try {
            // Construct URL
            const url = `https://noahboyd-capstone-deploy-40896fd67e31.herokuapp.com/api/cookbook/${cookbookID}/members`;
    
            // Make Axios request
            const response = await axios.get(url, {withCredentials: true,});
    
            // Check if the response is successful (status 200)
            if (response.status === 200) {
              let members = response.data.members;

              let membersFiltered = members.filter((member) => member.user_id != response.data.cookbookOwner);
              
              setCookbookMembers(membersFiltered);
            }
          } catch (error) {
            console.error('Error fetching the profile photo:', error);
          }
    }

    const handleShowManageMembers = () => {
        setShowManageMembers(true);

        // fetch members
        fetchAllCookbookUsers(cookbookDetails.cookbook_id);
    }


    const handleDeleteUserFromCookbook = async (cookbookUserID) => {
        console.warn("handleDeleteUserFromCookbook",cookbookUserID);

        // Axios request to cookbookMember DELETE
        try {
            let deleteResponse = await axios.delete(`https://noahboyd-capstone-deploy-40896fd67e31.herokuapp.com/api/cookbook/members/${cookbookUserID}`, {withCredentials: true});
            if (deleteResponse.status === 200) {
                fetchAllCookbookUsers(cookbookDetails.cookbook_id);
            }
            console.warn(deleteResponse);
        } catch (error) {
            console.error("Error deleting cookbook user");
        }
    };

    const handleSetShowManageCookbook = async () => {
        setCookbookName(cookbookDetails.name);
        setCookbookDescription(cookbookDetails.description);
        setShowManageCookbook(true);
    };

    const fetchCookbookDetails = async () => {
        try {
            // Construct URL
            const url = `https://noahboyd-capstone-deploy-40896fd67e31.herokuapp.com/api/cookbook/details/${cookbookDetails.cookbook_id}`;
    
            // Make Axios request
            const response = await axios.get(url, {withCredentials: true,});
    
            // Check if the response is successful (status 200)
            if (response.status === 200) {
              setCookbookDetails(response.data.cookbookData);
            }
          } catch (error) {
            console.error('Error fetching the profile photo:', error);
          }
    };
    
    const handleSubmitCookbookDetails = async (e) => {
        e.preventDefault();
        // console.warn(cookbookName, cookbookDescription)
        // Axios request to the update cookbook endpoint
        let dataObject = {
            name: cookbookName,
            description: cookbookDescription,
            cookbook_id: cookbookDetails.cookbook_id
        }
        try {
            // Axios POST to cookbook endpoint
            const response = await axios.put(`https://noahboyd-capstone-deploy-40896fd67e31.herokuapp.com/api/cookbook/`, {dataObject: dataObject}, {withCredentials: true});
            if (response.status === 200) {
              fetchCookbookDetails();
              setShowManageCookbook(false);
            } else {
                console.warn("ERROR INSERTING USER TO COOKBOOK");
                setInsertUserMessage("No user exists with that email address");
            }
          } catch (error) {
            console.log(error);
          }

    };

    const filterCookbookRecipes = async (tag) => {
        if (tag != "clear" && cookbookRecipes && cookbookRecipes.length > 0) {
            let filtered = cookbookRecipes.filter((recipe) => {
            if (recipe.tags == tag) {
                return recipe
            }
        })

         // Filter the recipe photos
         const recipeIDs = filtered.map((recipe) => recipe.recipe_id);
         const filteredPhotos = recipePhotos.filter(recipe => recipeIDs.includes(recipe.recipeID));

        setIsFiltered(true);
        setFilterValue(tag);
        setFilteredRecipes(filtered)
        setFilteredRecipePhotos(filteredPhotos);
        } else {
            setFilteredRecipes(cookbookRecipes);
            setFilteredRecipePhotos(recipePhotos);
            setIsFiltered(false);
            setFilterValue("");
        }
        
    }

    const handleShowStats = async () => {
        // Fetch Metrics
        try {
          const response = await axios.get(`https://noahboyd-capstone-deploy-40896fd67e31.herokuapp.com/api/cookbook/${cookbookDetails.cookbook_id}/metrics`, {withCredentials: true});
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
              setCookbookRatings(data);
              setChartDataValid(true);
            }
          } else {
          }
        } catch (error) {
            console.log("No rating available");
        }
        setShowStats(true); // Show metrics
      };
    // -------------------------------------------------------------------------- Setup -----------------------------------------------------------------------------------------------------

    useEffect(() => {
        setUserDetails(userData);
        fetchCookbookData(id);
        // console.warn("SHIT", id);
        fetchCookbookRecipes(id);
    }, [userData]);

    useEffect(() => {

    }, []);


    // -------------------------------------------------------------------------- Render -----------------------------------------------------------------------------------------------------
    if (userAuthenticated && cookbookDetails && !showAddRecipe && !showSettings && !showStats) { // Authenticated, Cookbook details available
        // user is signed in 
        let activeFilterVariant = "Danger";
        return (
        <div className='d-flex flex-column align-items-center h-100 w-100'>
            <div id='cookbookHeader' className='d-flex justify-content-between align-items-center w-100'>
                <h1>{cookbookDetails.name}</h1>
                <div className='d-flex gap-3' style={{marginRight: '1rem'}}>
                    <Button className='btn btn-sm h-80 app-btn-primary' onClick={handleAddRecipeClick}>Add Recipe +</Button>
                    <Button className='btn btn-sm h-80 app-btn-primary' onClick={() => setShowSettings(true)}>Settings</Button>
                    <Button className='btn btn-sm h-80 app-btn-primary' onClick={() => handleShowStats()}>View Stats</Button>
                </div>
            </div>

            <div id='cookbookBody' className='d-flex flex-column h-100 w-100'>
                <div>
                    <h2>Recipes</h2>
                </div>
                <div className='d-flex gap-3 justify-content-center'>
                    <Container className='d-flex justify-content-center align-items-center gap-3 flex-wrap'>
                    <Button className={filterValue == "Breakfast" ? "app-btn-primary--active" : "app-btn-primary"} onClick={() => filterCookbookRecipes("Breakfast")}>Breakfast</Button>
                    <Button className={filterValue == "Lunch" ? "app-btn-primary--active" : "app-btn-primary"} onClick={() => filterCookbookRecipes("Lunch")}>Lunch</Button>
                    <Button className={filterValue == "Dinner" ? "app-btn-primary--active" : "app-btn-primary"} onClick={() => filterCookbookRecipes("Dinner")}>Dinner</Button>
                    <Button  className={filterValue == "Dessert" ? "app-btn-primary--active" : "app-btn-primary"} onClick={() => filterCookbookRecipes("Dessert")}>Dessert</Button>
                    {isFiltered ? (<Button variant='danger' className='app-btn-danger' onClick={() => filterCookbookRecipes("clear")}>X</Button>) : ("")}
                    </Container>
                </div>
                <Container className='pt-3'>
                    <ResponsiveCardList type={'recipe'} items={filteredRecipes} userData={userDetails} images={filteredRecipePhotos}/>
                </Container>
            </div>
        </div>
        );
    } else if (userAuthenticated && cookbookDetails && showAddRecipe && !showSettings) {
        return (
            <div className='managecookbook--container'>
                        <div className='managecookbook--header'>
                            <h1>Add Recipes To Cookbook</h1>
                            <Button variant='danger' className='app-btn-danger' onClick={() => setShowAddRecipe(false)}>X</Button>
                        </div>
                        <div className='addRecipe--list-container'>
                            <ul className='w-100 p-0 addRecipesUL'>
                                {userRecipes.map((recipe) => {
                                    return (
                                        <div className='d-flex gap-3' key={recipe.recipe_id}>
                                            {recipe.name}
                                            {
                                                cookbookRecipes && cookbookRecipes.some(obj => obj.recipe_id === recipe.recipe_id)
                                                ? <Button variant='danger' className='app-btn-danger' onClick={() => handleRemoveRecipeClicked(recipe.recipe_id, userDetails.user_id, cookbookDetails.cookbook_id)}>Remove</Button>
                                                : <Button className='app-btn-action' onClick={() => handleAddClicked(recipe.recipe_id, userDetails.user_id, cookbookDetails.cookbook_id)}>Add</Button>
                                            }
                                        </div>
                                    )
                                })}
                            </ul>
                        </div>
                </div>
        )
    } else if (show404) { // Authenticated, but cookbook details not available
        // user is not signed in
        return (
            <div>
            <h1>No Cookbook Found that matches ID = {id}</h1>
          </div>
        );
    } else if (showSettings) { // Authenticated, but cookbook details not available
        // user is not signed in
        return (
            <div className='managecookbook--container'>
                        <div className={(showManageMembers || showManageCookbook) ? "d-none" : "managecookbook--header"}>
                            <h1>Settings</h1>
                            <Button variant='danger' className='app-btn-danger' onClick={() => setShowSettings(false)}>X</Button>
                        </div>
                {showManageMembers ? (
                    <div className='d-flex flex-column align-items-center h-100'>
                        <div className='managecookbook--header'>
                            <h1>Manage Cookbook</h1>
                            <Button variant='danger' className='app-btn-danger' onClick={() => setShowManageMembers(false)}>X</Button>
                        </div>
                        <div>
                        <Form className='mt-3' onSubmit={addMemberHandler}>
                            <Row>
                                <Col xs={12} md={8}>
                                    <Form.Control 
                                        type="text" 
                                        placeholder="New Member Email" 
                                        value={addMemberText} 
                                        onChange={(e) => setAddMemberText(e.target.value)}
                                    />
                                </Col>
                                <Col xs={12} md={4}>
                                    <Button className="app-btn-action" onClick={(e) => addMemberHandler(e)}>ADD</Button>
                                </Col>
                            </Row>
                        </Form>
                            <br />
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                    <th>Name</th>
                                    <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cookbookMembers.map((member, index) => {
                                        return (
                                            <tr key={member.cookbook_user_id}>
                                                <td>{member.email_address}</td>
                                                <td><Button variant='danger' className='btn btn-sm app-btn-danger' onClick={() => handleDeleteUserFromCookbook(member.cookbook_user_id)}>Remove</Button></td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                                </Table>
                        </div>
                    </div>
                ) : showManageCookbook ? (
                    <div className='managecookbook--container'>
                        <div className='managecookbook--header'>
                            <h1>Edit Cookbook Details</h1>
                            <Button variant='danger' className='app-btn-danger' onClick={() => setShowManageCookbook(false)}>X</Button>
                        </div>
                        
                        <div>
                            <Container className='pt-3'>
                                <Container>
                                    <CookbookPictureUpload cookbookID={cookbookDetails.cookbook_id} type={"cookbook"}/>
                                </Container>
                                <Form className='p-5' onSubmit={(e) => handleSubmitCookbookDetails(e)}>
                                    <Form.Group>
                                        <Form.Group className="mb-3" controlId="group1">
                                            <Form.Label>Cookbook Name</Form.Label>
                                            <Form.Control type='text' placeholder='Cookbook Name' value={cookbookName} onChange={(e) => setCookbookName(e.target.value)}/>
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="group2">
                                            <Form.Label>Cookbook Description</Form.Label>
                                            <Form.Control type='text'placeholder='Cookbook Description' value={cookbookDescription} onChange={(e) => setCookbookDescription(e.target.value)}/>
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="group3">
                                            <Form.Control className='app-btn-action' type='submit' onClick={(e) => handleSubmitCookbookDetails(e)}/>
                                        </Form.Group>
                                    </Form.Group>
                                </Form>
                            </Container>
                        </div>
                    </div>
                ) : (
                    <div className='d-flex flex-column gap-3 mt-5 justify-content-center align-items-center'>
                        <Button className='app-btn-primary' onClick={handleShowManageMembers}>Manage Users</Button>
                        <Button className='app-btn-primary' onClick={() => handleSetShowManageCookbook()}>Edit Cookbook</Button>
                    </div>
                )}
                
            </div>
        );
    } else if (showStats) {
        return (
            <div className='managecookbook--container'>
                        <div className='managecookbook--header'>
                            <h1>Cookbook Stats</h1>
                            <Button variant='danger' className='app-btn-danger' onClick={() => setShowStats(false)}>X</Button>
                        </div>
                        <div>
                            <Container className='pt-3'>
                                <h2>Cookbook Metrics</h2>
                                <Container>
                                {chartDataValid ? (
                                <Bar data={cookbookRatings} />
                                ) : (
                                    <div></div>
                                )}
                                </Container>
                            </Container>
                        </div>
                </div>
        )
    } else { // Not Authenticated
        return (
            <div>
                
            </div>
            );
    }
}

export default CookbookHome;
