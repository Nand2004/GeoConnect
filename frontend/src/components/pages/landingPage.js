import React, {} from 'react'
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css'
const Landingpage = () => {
    
    return (
      <div id="wrapper" style ={{backgroundColor: '#0c0c1f', color: 'white', height: 900, minHeight: '100vh'}}>
      <div style={{ textAlign: 'center', paddingTop: "10px", fontFamily: 'Montserrat' , backgroundColor: '#0c0c1f' }}>
        <div className="d-flex justify-content-center">
           
        <Card style={{ width: '40rem', textAlign: "center", backgroundColor: '#0c0c1f'}} className="mx-20 my-20">
        <Card.Text>
        <br></br>
        </Card.Text>
        <Card.Body>
          <Card.Title style={{fontSize: '40px'}}>MBTA Handicap Accesible Stops</Card.Title>
          <Card.Subtitle className="mb-2 text-muted" style={{fontSize: '20px'}}>An easy to understand webpage that displays disabled accesible trainstops</Card.Subtitle>
          <Card.Link href="/signup" style={{color: 'white', textDecoration: 'none', fontSize: '20px'}}>Sign Up</Card.Link>
        <Card.Link href="/login" style={{color: 'white', textDecoration: 'none', fontSize: '20px'}}>Login</Card.Link>
        </Card.Body>
        <Card.Img src ="https://external-preview.redd.it/KWkc0wreGafiCXOXC2ymxUv3qmoHTwK6cDZLOwxiBIg.png?auto=webp&s=97c093a33170d7c1f7b5250debe109aaacba3ce5" />
      </Card>
      </div>
      </div>
      </div>
    )
}

export default Landingpage