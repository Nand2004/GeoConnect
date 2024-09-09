import React from "react";
// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";

// We import all the components we need in our app
import Navbar from "./components/navbar";
import LandingPage from "./components/pages/landingPage";
import Login from "./components/pages/loginPage";
import TrainStops from "./components/pages/trainStops";
import Signup from "./components/pages/registerPage";
import PrivateUserProfile from "./components/pages/privateUserProfilePage";
import Rating from "./components/pages/rating.js";
import UserProfileImage from "./components/pages/userProfileImage";
import { createContext, useState, useEffect } from "react";
import getUserInfo from "./utilities/decodeJwt";
import Developers from './components/pages/developersPage';
import History from './components/pages/ratingsHistory';

export const UserContext = createContext();

//test change
//test again
const App = () => {
  const [user, setUser] = useState();

  useEffect(() => {
    setUser(getUserInfo());
  }, []);

  return (
    <>
      <Navbar />
      <UserContext.Provider value={user}>
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          {/*<Route exact path="/home" element={<HomePage />} />*/} 
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/stops" element={<TrainStops />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route path="/privateUserProfile" element={<PrivateUserProfile />} />
          <Route path="/rating" element={<Rating />} />
          <Route path="/userProfileImage" element={<UserProfileImage />} />
          <Route path="/historyRatings" element={< History/>} />
          <Route path="/developers" element={< Developers/>} />

        </Routes>
      </UserContext.Provider>
    </>
  );
};



export default App
