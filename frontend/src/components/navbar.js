import React, { useEffect, useState } from "react";
import getUserInfo from '../utilities/decodeJwt';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import ReactNavbar from 'react-bootstrap/Navbar';
import { NavItem } from "react-bootstrap";


// Here, we display our Navbar
export default function Navbar() {
  // We are pulling in the user's info but not using it for now.
  // Warning disabled: 
  // eslint-disable-next-line
  const [user, setUser] = useState({})

  useEffect(() => {
  setUser(getUserInfo())
  }, [])
  
  // if (!user) return null   - for now, let's show the bar even not logged in.
  // we have an issue with getUserInfo() returning null after a few minutes
  // it seems.
  return (
    <ReactNavbar bg="dark" variant="dark">
    <Container>
      <Nav className="me-auto">
        <Nav.Link href="/">Start</Nav.Link>
        {/* <Nav.Link href="/home">Home</Nav.Link> */}
        <Nav.Link href="/privateUserProfile">Profile</Nav.Link>
        <Nav.Link href="/userProfileImage">Edit</Nav.Link>
        <Nav.Link href="/stops">Stops</Nav.Link>
        <Nav.Link href="/rating">Rating</Nav.Link>
        <Nav.Link href="/historyRatings">History</Nav.Link>
        <Nav.Link href="/developers">Developers</Nav.Link>
        
      </Nav>
    </Container>
  </ReactNavbar>

  );
}