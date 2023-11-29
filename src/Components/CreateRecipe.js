import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Container, FormControl, FormGroup } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

function CreateRecipe( props ) {
  const [cookies] = useCookies(['userAuthenticated']);
  const [userData, setUserData] = useState(props.userData); // To store user data from the Axios request
  const userAuthenticated = cookies.userAuthenticated !== undefined;
  const navigate = useNavigate();

  const [recipeName, setRecipeName] = useState('');
  const [description, setDescription] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [totalTime, setTotalTime] = useState('');
  const [serves, setServes] = useState('');
  const [ingredients, setIngredients] = useState([{ name: '', amount: '', unit: '' }]);
  const [directions, setDirections] = useState(['']);
  const [errorText, setErrorText] = useState('');
  const [recipeTags, setRecipeTags] = useState("");
  const [tags, setTags] = useState(["Breakfast", "Lunch", "Dinner", "Dessert"]);
  const [selectedTag, setSelectedTag] = useState('');
  const [measurements, setMeasurements] = useState([]);

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

  // Function for handling change of an input in ingredients
  const handleInputChange = (event, index, field) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = event.target.value;
    setIngredients(newIngredients);
    };

    // Function for adding new ingredient
    const addIngredient = () => {
        setIngredients([...ingredients, { name: '', amount: '', unit: '' }]);
    };

    // Function for removing an ingredient
    const removeIngredient = (indexToRemove) => {
        setIngredients(ingredients.filter((_, index) => index !== indexToRemove));
    };
    
    
    // Submit form and Create new Recipe
    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorText('');
        console.warn(selectedTag)
        // Verify Inputs
        if (recipeName.length > 0 && description.length > 0 && prepTime.length > 0 && cookTime.length > 0 && totalTime.length > 0 && serves.length > 0 && ingredients.length > 0 && directions.length > 0 && userData.user_id != undefined) {
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
            const response = await axios.post('https://noahboyd-capstone-deploy-40896fd67e31.herokuapp.com/api/recipe', {dataObject: dataObject}, {withCredentials: true});
            if (response.status == 200) {
                navigate('/home');
            }
        } catch (error) {
            console.log(error)
        }
    }

    // Add a new direction in the array
    const addDirection = () => {
        setDirections([...directions, '']);
    };

    // Function for removing index from directions
    const removeDirection = (indexToRemove) => {
        setDirections(directions.filter((_, index) => index !== indexToRemove));
    };

    // Function to handle the change of a value in directions
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
                <Container>
                <Form.Label>Choose a category: </Form.Label><br />
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
                </Container>
                
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
                                <Button variant='danger' className='app-btn-danger' onClick={() => removeIngredient(index)}>X</Button>
                            </div>
                        </div>
                    )
                })}
                <div className='d-flex'>
                    <Button className='app-btn-primary' onClick={addIngredient}>Add Ingredient</Button>
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
                                <Button variant='danger' className='app-btn-danger' onClick={() => removeDirection(index)}>X</Button>

                            </div>
                        </div>
                    )
                })}
                <div className='d-flex'>
                    <Button className='app-btn-primary' onClick={addDirection}>Add Step</Button>
                </div>
            </Form.Group>

            <Form.Group>
                
                <Form.Label style={{color: 'red'}}>{errorText}</Form.Label>
                <Form.Control type='submit' value="Save" className='mb-3 app-btn-action'/>
            </Form.Group>
        </Form>
      </div>
    )
  } else {
    return ( // user is not signed in
      <div>
        <h1>Create Recipe</h1>
        <p>You must be signed in to see this page</p>
      </div>
    )
  }

}

export default CreateRecipe