import React, { useState, useEffect } from 'react';
import { FaStar } from "react-icons/fa";
import axios from 'axios';
import getUserInfo from '../../utilities/decodeJwt';



const RatingPage = () => {

  //Variable for DropDown Menu
  const [stops, setStops] = useState([]);
  const [accessibleStops, setAccessibleStops] = useState([]);
  const [selectedStops, setSelectedStops] = useState('');
  const [validLines, setValidLines] = useState([]);
  const [selectedLine, setSelectedLine] = useState('');

  // Variables for Ratings.
  const [ratings, setRatings] = useState(null);
  const [comments, setComments] = useState(null);

  const [user, setUser] = useState({})


  // For Handling and submitting the form.
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log('handleSubmit: ', user.username, selectedLine, ratings, comments, Date);
      const response = await axios.post('http://localhost:8081/ratings/add', {
        username: user.username,
        stationName: selectedLine,
        ratings: ratings,
        comments: comments,
        Date: new Date(),
      });
      console.log('response from server: ', response.data);
      alert("Rating added successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to add Rating. Please try again later.\n\nMake sure you are logged-in !");
    }
  };


  // UseEffect for creating DropDown Menus.
  useEffect(() => {
    async function fetchData() {
      const result = await axios('https://api-v3.mbta.com/stops?filter[route]=Red,Blue,Green-B,Green-C,Green-D,Green-E,Mattapan,Orange');
      const filteredStops = result.data.data.filter(stop => stop.attributes.wheelchair_boarding === 1);
      setAccessibleStops(filteredStops);
      //filters all stops to be ones that are accessible
    }
    fetchData();

    async function fetchRoutes() { //filters all possible routes in the mbta which can be used
      const result = await axios('https://api-v3.mbta.com/routes');
      const validRoutes = result.data.data.map(route => route.attributes.short_name);
      setValidLines(validRoutes);
    }
    fetchRoutes();
    setUser(getUserInfo()) //Retrieves the User's information and stores it in a local variable.
  }, []);

  // Sets up the function which will let the users submit the form.
  async function submit(event) {
    if (!user.username) {
      alert("No Logged in")
      return
    }
    const result = await axios(`https://api-v3.mbta.com/stops?filter[route]=${selectedLine}`);
    const filteredStops = result.data.data.filter(stop => stop.attributes.wheelchair_boarding === 1);
    setStops(filteredStops);
    setAccessibleStops(filteredStops); //filters all stops to be ones that are accessible
    const wrapper = document.getElementById('optionPrompt');
  }

  // Selects the selected station
  function handleSelect(event) {
    setSelectedLine(event.target.value);
  }

  return (
    <form method='post' onSubmit={handleSubmit} style={{ textAlign: 'center' }}>
      <div className="star-rating" style={{ height: 900, backgroundColor: '#0c0c1f', color: 'white', textAlign: 'center', fontFamily: 'Montserrat', color: 'white', minHeight: '100vh' }}>
        <h3>Choose an accessible stop to rate it</h3>
        <br></br>

        <div name="DropDown" id="wrapper" style={{ backgroundColor: '#0c0c1f', color: 'white' }}>

          <div style={{ textAlign: 'center', paddingTop: "10px", fontFamily: 'Montserrat', backgroundColor: '#0c0c1f', paddingBottom: '10px' }}>
            <br></br>
            <select style={{ backgroundColor: '#0c0c1f', color: 'white', textAlign: 'center' }} id="stopsTest" onChange={handleSelect}>
              <option value="" disabled>Choose a Boston Line</option>
              <option value="Red">Red Line</option>
              <option value="Orange">Orange Line</option>
              <option value="Blue">Blue Line</option>
              <option value="Mattapan">Mattapan Trolley</option>
              <option value="Green-B">Green Line B</option>
              <option value="Green-C">Green Line C</option>
              <option value="Green-D">Green Line D</option>
              <option value="Green-E">Green Line E</option>
            </select>

            <button style={{ backgroundColor: '#cc5c99', color: 'white' }} onClick={submit} type="button">Filter</button>


            <br></br>
            <br></br>

            <select style={{ backgroundColor: '#0c0c1f', color: 'white', textAlign: 'center' }} id="stopsTest" value={selectedStops} onChange={handleSelect}>
              <option disabled value="" >{selectedLine} line</option>
              {accessibleStops.map(stops => <option key={stops.id} value={stops.attributes.name}>{stops.attributes.name}</option>)}
            </select>

          </div>
        </div>

        <br></br>
        <br></br>

        {[...Array(5)].map((star, index) => { //Creates an array of 5, will let us draw 5 stars, used for ratings.

          const ratingValue = index + 1;
          //Will map out the array so it shows 5 stars.
          return <label>
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              style={{ display: "none", cursor: "pointer" }}
              onClick={() => setRatings(ratingValue)}
            />
            <FaStar //React component which will give us stars to rate.
              clasName="star"
              size={100}
              style={{ cursor: "pointer" }}
              color={ratingValue <= (ratings) ? "#ffc107" : "#e4e5e9"}
            />
          </label>
        })}
        <br></br>
        <br></br>
        <h3>
          The rating you gave for {selectedLine}:  {ratings} stars.
        </h3>
        <br></br>

        <textarea // Will create a comment area.
          value={comments}
          onChange={(event) => setComments(event.target.value)}
          placeholder="Enter your comment here"
          style={{ backgroundColor: "#0c0c1f", color: "white" }}
        />

        <br></br>
        <button variant="primary" type="submit">Submit</button>
      </div>

    </form>
  );


};

export default RatingPage;
