import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CloudFormation } from 'aws-sdk';

var link = document.createElement('link');
link.setAttribute('rel', 'stylesheet');
link.setAttribute('type', 'text/css');
link.setAttribute('href', "https://fonts.googleapis.com/css2?family=Montserrat&display=swap");
document.head.appendChild(link);

const DeveloperList = () => {
  const [developers, setDevelopers] = useState([]);

  useEffect(() => {
    const fetchDevelopers = async () => {
      const response = await axios.get('http://localhost:8081/developers/getAll');
      setDevelopers(response.data);
    };
    fetchDevelopers();
  }, []);

  return (
    <div style={{ fontFamily: 'Montserrat' ,backgroundColor: '#0c0c1f', color: 'white', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '800px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '50px', fontSize: '50px' }}>Developers</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {developers.map((developer, index) => (
            <div key={index} style={{ width: '300px', height: '200px', margin: '20px', border: `5px solid #cc5c99`, borderRadius: '10px', backgroundColor: 'white', color: '#0c0c1f' }}>
              <div style={{ padding: '20px' }}>
                <h2 style={{  }}>{developer.name}</h2>
                <h4 style={{  }}>{developer.role}</h4>
                <p>{developer.school}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeveloperList;

