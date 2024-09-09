import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import getUserInfo from "../../utilities/decodeJwt";


//link to service
//http://localhost:8096/privateUserProfile

const PrivateUserProfile = () => {
  const [show, setShow] = useState(false);
  const [user, setUser] = useState({})
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();
  document.body.style.backgroundColor = "#0c0c1f";
  


  // handle logout button
  const handleLogout = (async) => {
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    setUser(getUserInfo())
  }, []);
  



  
  if (!user) return (<div><h4>Log in to view this page.</h4></div>)
  const { id, email, username, password, favroute} = user
  return (
    <div class="container"  style ={{background: '#0c0c1f', color: 'white'}}>
      <div id="wrapper">
      
        <h1 class="col-md-12 text-center">{user && user.username}</h1>
        
      </div>
        
          
          <>
          <div>
          <div class="col-md-12 text-center">     
           
                <h3>
                    Welcome
                </h3>
                    <span className='username'> @{username}</span>
                
                <h3>
                    Your userId in mongo db is:
                </h3>
                    <span className='userId'> {id}</span>
                
                <h3>
                    Your registered email is: 
                </h3>
                    <span className='email'> {email}</span>
                
                <h3>
                    Your password is:
                </h3>

                    <span className='password'> {password} ( hashed )</span>
                
                <h3>
                    Your favorite route is currently set as:
                </h3>
                    <span className='favroute'> {favroute}</span>
                    
            </div>    
        </div>
            <Button className="me-2" onClick={handleShow}>
              Log Out
            </Button>
            <Modal
              
              show={show}
              onHide={handleClose}
              backdrop="static"
              keyboard={false}
            >
              <Modal.Header closeButton>
                <Modal.Title>Log Out</Modal.Title>
              </Modal.Header>
              <Modal.Body>Are you sure you want to Log Out?</Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="primary" onClick={handleLogout}>
                  Yes
                </Button>
              </Modal.Footer>
            </Modal>
            
          </>
        </div>
      

    
  );
};

export default PrivateUserProfile;
