import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import LandingPage from './Components/LandingPage';
import NavigationBar from './Components/NavigationBar';
import Home from './Components/Home';
import Login from './Components/Login';
import Signup from './Components/Signup';
import ProfileOverview from './Components/ProfileOverview';
import CreateRecipe from './Components/CreateRecipe';
import RecipeView from './Components/RecipeView';
import CookbookHome from './Components/CookbookHome';

function App() {
  const [userData, setUserData] = useState(() => {
    const storedUserData = localStorage.getItem('userData');
    return storedUserData ? JSON.parse(storedUserData) : null;
  });

  console.log("USER DATA IN STATE",userData);

  // Update localStorage when userData changes
  useEffect(() => {
    if (userData) {
      localStorage.setItem('userData', JSON.stringify(userData));
    } else {
      localStorage.removeItem('userData'); // remove the item if userData is null
    }
  }, [userData]);

  return (
    <div className='App'>
      <NavigationBar setUserData={setUserData}/>
      <div className='PageContent'>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login setUserData={setUserData}/>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home userData={userData}/>} />
          <Route path="/profile" element={<ProfileOverview setUserData={setUserData} userData={userData}/>} />
          <Route path="/newrecipe" element={<CreateRecipe userData={userData}/>} />
          <Route path="/recipe/:id" element={<RecipeView userData={userData}/>} />
          <Route path="/cookbook/:id" element={<CookbookHome userData={userData}/>} />

        </Routes>
      </div>
    </div>
  );
}

export default App;
