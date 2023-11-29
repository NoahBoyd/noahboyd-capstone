import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { FormControl, FormGroup } from 'react-bootstrap';
import RecipePictureUpload from './RecipePictureUpload';

function EditRecipe( props ) {
  const [cookies] = useCookies(['userAuthenticated']);
  const [userData, setUserData] = useState(props.userData); // To store user data from the Axios request
  const userAuthenticated = cookies.userAuthenticated !== undefined;

  const [recipeID, setRecipeID] = useState(props.recipeData.recipe_id);
  const [recipeName, setRecipeName] = useState(props.recipeData.name);
  const [description, setDescription] = useState(props.recipeData.description);
  const [prepTime, setPrepTime] = useState(props.recipeData.prep_time);
  const [cookTime, setCookTime] = useState(props.recipeData.cook_time);
  const [totalTime, setTotalTime] = useState(props.recipeData.total_time);
  const [serves, setServes] = useState(props.recipeData.serves);
  const [ingredients, setIngredients] = useState(JSON.parse(props.recipeData.ingredients));
  const [directions, setDirections] = useState(JSON.parse(props.recipeData.directions));
  const [tags, setTags] = useState(["Breakfast", "Lunch", "Dinner", "Dessert"]);
  const [selectedTag, setSelectedTag] = useState(props.recipeData.tags);
  const [measurements, setMeasurements] = useState([]);
  
  const [errorText, setErrorText] = useState('');

  const getMeasurements = async () => {
    try {
        const response = await axios.get('https://noahboyd-capstone-deploy-40896fd67e31.herokuapp.com/api/measurements', {withCredentials: true});
        console.warn(response.data.measurements);
        if (response.status == 200) {
            setMeasurements(response.data.measurements)
        }
        } catch (error) {
            console.log(error)
        }
    };

  const handleInputChange = (event, index, field) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = event.target.value;
    setIngredients(newIngredients);
    };

    const addIngredient = () => {
        setIngredients([...ingredients, { name: '', amount: '', unit: '' }]);
    };

    const removeIngredient = (indexToRemove) => {
        setIngredients(ingredients.filter((_, index) => index !== indexToRemove));
    };
    
    // Submit form and Create new Recipe
    const handleSubmit = async (event) => {
        // console.warn(recipeName, description, prepTime, cookTime, totalTime, serves, ingredients, directions);
        event.preventDefault();
        setErrorText('');
        // Verify Inputs
        if (recipeName.length > 0 && description.length > 0 && ingredients.length > 0 && directions.length > 0 && userData.user_id != undefined) {
            let dataObject = {
                name: recipeName,
                description: description,
                prepTime: prepTime,
                cookTime: cookTime,
                totalTime: totalTime,
                serves: serves,
                ingredients: JSON.stringify(ingredients),
                directions: JSON.stringify(directions),
                userID: userData.user_id,
                recipe_id: props.recipeData.recipe_id,
                tags: selectedTag
            }
            // Check that ingredients and directions indexes are not empty
            await submitData(dataObject);
        } else {
            setErrorText('Error: One or more inputs missing');
        }
    };

    // Function to perform the axios request to send the form data to the server
    const submitData = async (dataObject) => {
        try {
            const response = await axios.put('https://noahboyd-capstone-deploy-40896fd67e31.herokuapp.com/api/recipe', {dataObject: dataObject}, {withCredentials: true});
            if (response.status === 200) {
                props.handleSetReload();
                props.handleEditClick();
            }
        } catch (error) {
            console.log(error)
        }
    }

    // Add a new direction in the array
    const addDirection = () => {
        setDirections([...directions, '']);
    };

    const removeDirection = (indexToRemove) => {
        setDirections(directions.filter((_, index) => index !== indexToRemove));
    };

    const handleInputChangeDirections = (event, index) => {
        const newDirections = [...directions];
        newDirections[index] = event.target.value;
        setDirections(newDirections);
        };
    
  // Need to fetch units of measurement for select menus
  useEffect(() => {
    getMeasurements();
  }, []);

  if (userAuthenticated) { // user is signed in 
    return (
      <div className='d-flex align-items-center justify-content-center'>
        {/* <h1>Create Recipe</h1>
        <p>User is authenticated</p>
        <p>{userData.email_address}</p> */}
        <Form className='w-75' onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formRecipeName">
                <Form.Label className='createRecipeFormTitle'>Recipe Name</Form.Label>
                <Form.Control type="text" placeholder="Enter recipe name" value={recipeName} onChange={(e) => setRecipeName(e.target.value)} required={true}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formRecipeDescription">
                <Form.Label className='createRecipeFormTitle'>Recipe Description</Form.Label>
                <Form.Control as="textarea" rows={3} placeholder='Enter Recipe Description' value={description} onChange={e => setDescription(e.target.value)} required={true}/>
            </Form.Group>
            <FormGroup className='d-flex gap-2' controlId="formRecipeCookingDetails">
                <Form.Control type="text" placeholder="Prep Time" value={prepTime} onChange={e => setPrepTime(e.target.value)} required={true}/>
                <Form.Control type="text" placeholder="Cook Time"  value={cookTime} onChange={e => setCookTime(e.target.value)} required={true}/>
                <Form.Control type="text" placeholder="Total Time"  value={totalTime} onChange={e => setTotalTime(e.target.value)} required={true}/>
                <Form.Control type="text" placeholder="Serves"  value={serves} onChange={e => setServes(e.target.value)} required={true}/>
            </FormGroup>

            <FormGroup  className='d-flex gap-2' style={{marginTop: '2rem'}} controlId="formRecipeCookingDetails">
                <Form.Label>Choose a category: </Form.Label>
                {tags.map((tag, index) => (
                    <Form.Check 
                        inline
                        label={tag}
                        name="tags"
                        type="radio"
                        id={`tag-${index}`}
                        key={index}
                        onChange={() => setSelectedTag(tag)}
                        checked={selectedTag === tag}
                    />
                ))}
            </FormGroup>
            <Form.Group className="mb-3 mt-3" controlId="formIngredients">
                <Form.Label className='createRecipeFormTitle'>Ingredients</Form.Label>
                {ingredients.map((ingredient, index) => {
                    return (
                        <div key={index}>
                            <div className='d-flex gap-2 mt-3 mb-3'>
                                <Form.Control type='text' placeholder='Ingredient Name' value={ingredient.name} onChange={e => handleInputChange(e, index, 'name')}/>
                                <Form.Control type='text' placeholder='Amount' value={ingredient.amount} onChange={e => handleInputChange(e, index, 'amount')}/>
                                <Form.Select aria-label="Default select example" value={ingredient.unit} onChange={e => handleInputChange(e, index, 'unit')}>
                                    {measurements.map((measurement, index) => {
                                        return <option key={index} value={measurement.measurement_type}>{measurement.measurement_type}</option>
                                    })}
                                </Form.Select>
                                <Button variant='danger' onClick={() => removeIngredient(index)}>X</Button>
                            </div>
                        </div>
                    )
                })}
                <div className='d-flex'>
                    <Button onClick={addIngredient}>Add Ingredient</Button>
                </div>
            </Form.Group>

            <Form.Group className="mb-3 mt-3" controlId="formDirections">
                <Form.Label className='createRecipeFormTitle'>Directions</Form.Label>
                {directions.map((step, index) => {
                    return (
                        <div key={index}>
                            <div className='d-flex gap-2 align-items-center mt-3 mb-3'>
                                <span>{index+1}.</span>
                                <FormControl type='text' placeholder='Enter step details' value={step} onChange={e => handleInputChangeDirections(e, index)}/> 
                                <Button variant='danger' onClick={() => removeDirection(index)}>X</Button>

                            </div>
                        </div>
                    )
                })}
                <div className='d-flex'>
                    <Button onClick={addDirection}>Add Step</Button>
                </div>
            </Form.Group>

            <Form.Group>
                <RecipePictureUpload recipeID={recipeID} handleNewRecipePic={props.handleNewRecipePic} type={'recipe'}/>
            </Form.Group>

            <Form.Group>
                
                <Form.Label style={{color: 'red'}}>{errorText}</Form.Label>
                <Form.Control type='submit' value="Save" className='mb-3'/>
                {/* <Form.Control type='button' value="cancel" onClick={props.handleEditClick} className='mb-3'/> */}
                <Button className='mb-3 btn btn-sm w-100' onClick={props.handleEditClick} variant='danger'>Cancel</Button>
            </Form.Group>
        </Form>
      </div>
    )
  } else {
    return ( // user is not signed in
      <div>
        <h1>Edit Recipe</h1>
        <p>You must be signed in to see this page</p>
      </div>
    )
  }

}

export default EditRecipe