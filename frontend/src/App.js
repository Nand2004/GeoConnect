import React from "react";
// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";

// We import all the components we need in our app
import Navbar from "./components/navbar";
import LandingPage from "./components/users/landingPage";
import Login from "./components/users/loginPage";
import Signup from "./components/users/registerPage";
import PrivateUserProfile from "./components/users/privateUserProfilePage";
import { createContext, useState, useEffect } from "react";
import getUserInfo from "./utilities/decodeJwt";
import GeoLocation from './components/location/geoLocation'
import FindUsersNearby from "./components/location/findUsersNearby";
import Event from './components/event/eventPage';
import Chat from "./components/chat/chat";
export const UserContext = createContext();

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
          <Route exact path="/signup" element={<Signup />} />
          <Route path="/privateUserProfile" element={<PrivateUserProfile />} />
          <Route path="/geoLocation" element={< GeoLocation />} />
          <Route path="/findUsersNearby" element={< FindUsersNearby />} />
          <Route path="/chat" element={< Chat />} />
          <Route path='/event' element={< Event />}></Route>

        </Routes>
      </UserContext.Provider>
    </>
  );
};
export default App
