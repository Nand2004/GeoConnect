import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { 
  FaCalendarPlus, 
  FaMapMarkerAlt, 
  FaUsers, 
  FaSpinner, 
  FaExclamationCircle, 
  FaClockFa, 
  FaTag, 
  FaInfoCircle,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';
import getUserInfo from "../../utilities/decodeJwt";

const EventPage = () => {
  // State variables
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [nearbyEvents, setNearbyEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchRadius, setSearchRadius] = useState(500);
  const [currentUser, setCurrentUser] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newEventForm, setNewEventForm] = useState({
    name: '',
    description: '',
    category: 'Other',
    dateTime: '',
  });

  const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  // Get user info on component mount
  useEffect(() => {
    const userInfo = getUserInfo();
    if (userInfo) {
      setCurrentUser(userInfo);
    }
  }, []);

  // Get user location on component mount and set interval
  useEffect(() => {
    getUserLocation();
    const interval = setInterval(getUserLocation, 120000);
    return () => clearInterval(interval);
  }, []);

  // Fetch nearby events when location changes
  useEffect(() => {
    if (location.latitude && location.longitude) {
      findNearbyEvents();
    }
  }, [location, searchRadius]);

  // Get user's current location
  const getUserLocation = () => {
    setLoading(true);
    setError(null);
    setMessage('');

    navigator.geolocation
      ? navigator.geolocation.getCurrentPosition(
          ({ coords }) => {
            setLocation({ 
              latitude: coords.latitude, 
              longitude: coords.longitude 
            });
          },
          () => {
            setLoading(false);
            setError('Error getting your location. Please enable location access.');
          }
        )
      : setError('Geolocation is not supported by this browser.');
  };

  // Find nearby events
  const findNearbyEvents = async () => {
    try {
      const { data } = await axios.get('http://localhost:8081/event/getNearbyEvents', {
        params: { 
          latitude: location.latitude, 
          longitude: location.longitude, 
          radius: searchRadius 
        },
      });
      setNearbyEvents(data);
      if (data.length === 0) setMessage('No events found nearby.');
      setLoading(false);
    } catch (err) {
      setError('Error finding nearby events.');
      setLoading(false);
    }
  };

  // Join an event
  const joinEvent = async (eventId) => {
    try {
      await axios.post('http://localhost:8081/event/joinEvent/', {
        eventId,
        userId: currentUser.id
      });
      setMessage('Successfully joined the event!');
      findNearbyEvents(); // Refresh events to update attendee count
    } catch (err) {
      setError('Failed to join event.');
    }
  };

  // Leave an event
  const leaveEvent = async (eventId) => {
    try {
      await axios.post('http://localhost:8081/event/leaveEvent/', {
        eventId,
        userId: currentUser.id
      });
      setMessage('Successfully left the event.');
      findNearbyEvents(); // Refresh events to update attendee count
    } catch (err) {
      setError('Failed to leave event.');
    }
  };

  // Create a new event
  const createEvent = async (e) => {
    e.preventDefault();
    try {
      const eventData = {
        ...newEventForm,
        location: {
          type: 'Point',
          coordinates: [location.longitude, location.latitude]
        },
        creatorId: currentUser.id,
        dateTime: new Date(newEventForm.dateTime).toISOString()
      };

      await axios.post('http://localhost:8081/event/createEvent/', eventData);
      setMessage('Event created successfully!');
      setIsCreateModalOpen(false);
      findNearbyEvents(); // Refresh events
      
      // Reset form
      setNewEventForm({
        name: '',
        description: '',
        category: 'Other',
        dateTime: '',
      });
    } catch (err) {
      setError('Failed to create event.');
    }
  };

  // Calculate distance between two points
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  // Render method
  return (
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
        <h2 style={styles.title}>Nearby Events</h2>
        
        {/* Controls */}
        <div style={styles.controls}>
          <div style={styles.rangeContainer}>
            <input
              type="range"
              min="100"
              max="1000"
              step="100"
              value={searchRadius}
              onChange={(e) => setSearchRadius(Number(e.target.value))}
              style={styles.rangeInput}
            />
            <span style={styles.rangeValue}>
              Search radius: {searchRadius}m
            </span>
          </div>

          <button 
            onClick={() => setIsCreateModalOpen(true)}
            style={styles.createEventButton}
          >
            <FaCalendarPlus style={styles.buttonIcon} />
            Create Event
          </button>
        </div>

        {/* Error and Message Display */}
        {error && (
          <div style={styles.alert}>
            <FaExclamationCircle style={styles.alertIcon} />
            {error}
          </div>
        )}
        {message && (
          <div style={styles.message}>
            <FaCheckCircle style={styles.messageIcon} />
            {message}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div style={styles.content}>
        {/* Events Grid */}
        <div style={styles.eventGrid}>
          {nearbyEvents.map((event, index) => (
            <div 
              key={index} 
              style={styles.eventCard}
              onClick={() => setSelectedEvent(event)}
            >
              <div style={styles.eventCardHeader}>
                <h3 style={styles.eventCardTitle}>{event.name}</h3>
                <div style={styles.eventCategory}>{event.category}</div>
              </div>
              
              <div style={styles.eventCardContent}>
                <div style={styles.eventDetails}>
                  <div style={styles.eventDetailItem}>
                    <FaMapMarkerAlt style={styles.detailIcon} />
                    {calculateDistance(
                      location.latitude, 
                      location.longitude, 
                      event.location.coordinates[1], 
                      event.location.coordinates[0]
                    ).toFixed(0)}m away
                  </div>
                  <div style={styles.eventDetailItem}>
                    <FaUsers style={styles.detailIcon} />
                    {event.attendees.length} Attendees
                  </div>
                </div>

                {/* Conditional Join/Leave Button */}
                {event.creatorId !== currentUser.id && (
                  <div style={styles.attendeeActions}>
                    {event.attendees.some(a => a.userId === currentUser.id) ? (
                      <button 
                        onClick={() => leaveEvent(event._id)}
                        style={styles.leaveButton}
                      >
                        Leave Event
                      </button>
                    ) : (
                      <button 
                        onClick={() => joinEvent(event._id)}
                        style={styles.joinButton}
                      >
                        Join Event
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Map Section */}
        {location.latitude && location.longitude && (
          <div style={styles.mapContainer}>
            <LoadScript googleMapsApiKey={googleMapsApiKey}>
              <GoogleMap
                center={{ lat: location.latitude, lng: location.longitude }}
                zoom={14}
                mapContainerStyle={styles.map}
                options={{ styles: mapStyles }}
              >
                {/* User's Location Marker */}
                <Marker
                  position={{ lat: location.latitude, lng: location.longitude }}
                  icon={{
                    path: "M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0",
                    fillColor: '#4F46E5',
                    fillOpacity: 0.6,
                    strokeWeight: 0,
                    scale: 0.5
                  }}
                />

                {/* Events Markers */}
                {nearbyEvents.map((event, index) => (
                  <Marker
                    key={index}
                    position={{
                      lat: event.location.coordinates[1],
                      lng: event.location.coordinates[0]
                    }}
                    icon={{
                      path: "M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0",
                      fillColor: '#EC4899',
                      fillOpacity: 0.6,
                      strokeWeight: 0,
                      scale: 0.3
                    }}
                    onClick={() => setSelectedEvent(event)}
                  />
                ))}

                {/* Event Info Window */}
                {selectedEvent && (
                  <InfoWindow
                    position={{
                      lat: selectedEvent.location.coordinates[1],
                      lng: selectedEvent.location.coordinates[0]
                    }}
                    onCloseClick={() => setSelectedEvent(null)}
                  >
                    <div style={styles.infoWindow}>
                      <h3 style={styles.infoTitle}>{selectedEvent.name}</h3>
                      <p style={styles.infoDetails}>
                        <FaInfoCircle style={styles.infoIcon} />
                        {selectedEvent.description}
                      </p>
                      <p style={styles.infoDetails}>
                        <FaTag style={styles.infoIcon} />
                        {selectedEvent.category}
                      </p>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </LoadScript>
          </div>
        )}
      </div>

      {/* Create Event Modal */}
      {isCreateModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalTitle}>Create New Event</h2>
            <form onSubmit={createEvent} style={styles.createEventForm}>
              <input
                type="text"
                placeholder="Event Name"
                value={newEventForm.name}
                onChange={(e) => setNewEventForm({...newEventForm, name: e.target.value})}
                style={styles.formInput}
                required
              />
              <textarea
                placeholder="Event Description"
                value={newEventForm.description}
                onChange={(e) => setNewEventForm({...newEventForm, description: e.target.value})}
                style={styles.formTextarea}
                required
              />
              <select
                value={newEventForm.category}
                onChange={(e) => setNewEventForm({...newEventForm, category: e.target.value})}
                style={styles.formSelect}
              >
                <option value="Sports">Sports</option>
                <option value="Educational">Educational</option>
                <option value="Job">Job</option>
                <option value="Campus_Life">Campus Life</option>
                <option value="Concert">Concert</option>
                <option value="Other">Other</option>
              </select>
              <input
                type="datetime-local"
                value={newEventForm.dateTime}
                onChange={(e) => setNewEventForm({...newEventForm, dateTime: e.target.value})}
                style={styles.formInput}
                required
              />
              <div style={styles.modalButtons}>
                <button 
                  type="submit" 
                  style={styles.modalSubmitButton}
                >
                  Create Event
                </button>
                <button 
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  style={styles.modalCancelButton}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
  
};
const styles = {
    container: {
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%)',
      minHeight: '100vh',
      padding: '2rem',
      color: '#fff',
      paddingTop: "70px",
      paddingBottom: "50px",
  
    },
    header: {
      marginBottom: '2rem',
      textAlign: 'center',
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      background: 'linear-gradient(45deg, #4F46E5, #EC4899)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '1.5rem',
    },
    controls: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '2rem',
      marginBottom: '1.5rem',
    },
    rangeContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    },
    rangeInput: {
      width: '200px',
      accentColor: '#4F46E5',
    },
    rangeValue: {
      color: '#94A3B8',
      fontSize: '0.9rem',
    },
    button: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.75rem 1.5rem',
      background: 'linear-gradient(45deg, #4F46E5, #EC4899)',
      border: 'none',
      borderRadius: '9999px',
      color: '#fff',
      fontSize: '1rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'transform 0.2s, box-shadow 0.2s',
      boxShadow: '0 4px 6px rgba(79, 70, 229, 0.1)',
    },
    buttonDisabled: {
      opacity: 0.7,
      cursor: 'not-allowed',
    },
    buttonIcon: {
      fontSize: '1.2rem',
    },
    spinningIcon: {
      fontSize: '1.2rem',
      animation: 'spin 1s linear infinite',
    },
    content: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '2rem',
      maxWidth: '1400px',
      margin: '0 auto',
    },
    userGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '1.5rem',
    },
    card: {
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      borderRadius: '1rem',
      padding: '1.5rem',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer',
    },
    cardHovered: {
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '1rem',
    },
    cardTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      margin: 0,
    },
    distance: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: '#10B981',
      fontSize: '0.9rem',
    },
    distanceIcon: {
      fontSize: '1rem',
    },
    cardContent: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    emailContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: '#94A3B8',
      fontSize: '0.9rem',
    },
    coordinates: {
      display: 'flex',
      gap: '1rem',
      color: '#94A3B8',
      fontSize: '0.8rem',
    },
    coordIcon: {
      marginRight: '0.25rem',
    },
    chatButton: {
      marginTop: '0.5rem',
      padding: '0.75rem',
      background: 'linear-gradient(45deg, #4F46E5, #EC4899)',
      border: 'none',
      borderRadius: '0.5rem',
      color: '#fff',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'opacity 0.2s',
    },
    mapContainer: {
      borderRadius: '1rem',
      overflow: 'hidden',
      height: '100%',
      minHeight: '500px',
    },
    map: {
      width: '100%',
      height: '100%',
    },
    infoWindow: {
      padding: '1rem',
      maxWidth: '200px',
    },
    infoTitle: {
      fontSize: '1.1rem',
      fontWeight: '600',
      marginBottom: '0.5rem',
      color: '#1F2937',
    },
    infoContent: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    },
    infoText: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      margin: 0,
      color: '#4B5563',
      fontSize:'0.9rem',
    },
    infoIcon: {
      fontSize: '0.9rem',
      color: '#6B7280',
    },
    alert: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.75rem 1rem',
      background: 'rgba(239, 68, 68, 0.1)',
      border: '1px solid rgba(239, 68, 68, 0.2)',
      borderRadius: '0.5rem',
      color: '#EF4444',
      fontSize: '0.9rem',
      marginBottom: '1rem',
    },
    message: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.75rem 1rem',
      background: 'rgba(59, 130, 246, 0.1)',
      border: '1px solid rgba(59, 130, 246, 0.2)',
      borderRadius: '0.5rem',
      color: '#3B82F6',
      fontSize: '0.9rem',
      marginBottom: '1rem',
    },
    alertIcon: {
      fontSize: '1.1rem',
    },
    messageIcon: {
      fontSize: '1.1rem',
    },
    '@keyframes spin': {
      from: { transform: 'rotate(0deg)' },
      to: { transform: 'rotate(360deg)' },
    },
    // Additional styles for event-specific elements
  eventGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  eventCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    borderRadius: '1rem',
    padding: '1.5rem',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
  },
  eventCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  eventCardTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    margin: 0,
  },
  eventCategory: {
    background: 'rgba(79, 70, 229, 0.2)',
    color: '#4F46E5',
    padding: '0.25rem 0.5rem',
    borderRadius: '0.5rem',
    fontSize: '0.8rem',
  },
  };
  
  const mapStyles = [
    {
      elementType: 'geometry',
      stylers: [{ color: '#242f3e' }]
    },
    {
      elementType: 'labels.text.stroke',
      stylers: [{ color: '#242f3e' }]
    },
    {
      elementType: 'labels.text.fill',
      stylers: [{ color: '#746855' }]
    },
    {
      featureType: 'administrative.locality',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }]
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }]
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [{ color: '#263c3f' }]
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#6b9a76' }]
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#38414e' }]
    },
    {
      featureType: 'road',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#212a37' }]
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#9ca5b3' }]
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{ color: '#746855' }]
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#1f2835' }]
    },
    {
      featureType: 'road.highway',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#f3d19c' }]
    },
    {
      featureType: 'transit',
      elementType: 'geometry',
      stylers: [{ color: '#2f3948' }]
    },
    {
      featureType: 'transit.station',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }]
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#17263c' }]
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#515c6d' }]
    },
    {
      featureType: 'water',
      elementType: 'labels.text.stroke',
      stylers: [{ color: '#17263c' }]
    }
    
  ];

export default EventPage;
