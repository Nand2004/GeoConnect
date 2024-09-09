import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import axios from 'axios';


function TrainStops() {
  const [stops, setStops] = useState([]);
  const [accessibleStops, setAccessibleStops] = useState([]);
  const [selectedLine, setSelectedLine] = useState('');
  const [validLines, setValidLines] = useState([]);

   var link = document.createElement('link');
  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('type', 'text/css');
  link.setAttribute('href', "https://fonts.googleapis.com/css2?family=Montserrat&display=swap");
  document.head.appendChild(link);

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
  }, []);

  async function submit(event) {
    const result = await axios(`https://api-v3.mbta.com/stops?filter[route]=${selectedLine}`);
    const filteredStops = result.data.data.filter(stop => stop.attributes.wheelchair_boarding === 1);
    setStops(filteredStops);
    setAccessibleStops(filteredStops); //filters all stops to be ones that are accessible
    const wrapper = document.getElementById('optionPrompt');
    wrapper.style.paddingBottom = 0;
}

function handleSelect(event) {
  setSelectedLine(event.target.value); //function which takes the value from the dropdown
}

  return (
    <div id="wrapper" style ={{backgroundColor: '#0c0c1f', color: 'white'}}> 
      <div style={{ textAlign: 'center', paddingTop: "10px", fontFamily: 'Montserrat' , backgroundColor: '#0c0c1f', paddingBottom: '15px', paddingTop: '15px' }}>  
        <label htmlFor="stopsTest">Choose a Line to see its Accessible Stops:</label> 
        <br></br>
        <select style={{backgroundColor: '#0c0c1f', color: 'white', textAlign: 'center'}}id="stopsTest" value={selectedLine} onChange={handleSelect}>
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
        <button style={{backgroundColor: '#cc5c99', color:'white'}}onClick={submit} type="button">Filter</button>
      </div>

      <h1 style={{ textAlign: 'center', paddingTop: "10px", fontFamily: 'Montserrat', paddingBottom: 10 }}>
  {selectedLine ? `Accessible Stops for ${selectedLine} Line`: 'All Accessible Stops'}
      </h1>

      
      {accessibleStops.map(stop => (
        <div key={stop.id} style={{ paddingTop: '20px',paddingLeft: "10px", textAlign: 'center', fontFamily: 'Montserrat'}}>
          <h3>{stop.attributes.name}</h3>
          <p>{stop.attributes.address}</p>
        </div>
      ))}

      <h5 style={{fontFamily: 'Montserrat', textAlign: 'center'}}><a href='https://www.mbta.com/developers/v3-api' target='_blank' style={{color: 'white'}}>Stops are displayed via the MBTA V3 API Here</a></h5>
      
    </div>

  );
}

export default TrainStops;
