import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import EditEventModal from './editEventModal';
import ChatButton from '../chat/chatButton';
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

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEventForEdit, setSelectedEventForEdit] = useState(null);

  const openEditModal = (event) => {
    setSelectedEventForEdit(event);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedEventForEdit(null);
  };

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
        dateTime: new Date().toISOString() // Use current time automatically
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
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

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
                    <button
                      onClick={() => openEditModal(event)}
                      style={styles.editButton}
                    >
                      Edit Event

                    </button>
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

        {/* Edit Modal Conditional Rendering */}
        {isEditModalOpen && selectedEventForEdit && (
          <EditEventModal
            event={selectedEventForEdit}
            currentUser={currentUser}
            onClose={closeEditModal}
            onUpdateSuccess={(message) => {
              setMessage(message);
              setTimeout(() => setMessage(''), 3000);
            }}
            onUpdateError={(error) => {
              setError(error);
              setTimeout(() => setError(''), 3000);
            }}
          />
        )}

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
                onChange={(e) => setNewEventForm({ ...newEventForm, name: e.target.value })}
                style={styles.formInput}
                required
              />
              <textarea
                placeholder="Event Description"
                value={newEventForm.description}
                onChange={(e) => setNewEventForm({ ...newEventForm, description: e.target.value })}
                style={styles.formTextarea}
                required
              />
              <select
                value={newEventForm.category}
                onChange={(e) => setNewEventForm({ ...newEventForm, category: e.target.value })}
                style={styles.formSelect}
              >
                <option value="Sports">Sports</option>
                <option value="Educational">Educational</option>
                <option value="Job">Job</option>
                <option value="Campus_Life">Campus Life</option>
                <option value="Concert">Concert</option>
                <option value="Other">Other</option>
              </select>

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
    backgroundColor: '#0F172A',
    color: '#FFFFFF',
    padding: '2rem',
    borderRadius: '1rem',
    fontFamily: 'Arial, sans-serif',
    marginTop: "10px",
    paddingTop: "70px",
    height: "100vh",
    paddingBottom: "150px",

  },
  header: {
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '1rem',
    color: '#FFFFFF',
  },
  controls: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
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
  },
  createEventButton: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#4F46E5',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  buttonIcon: {
    marginRight: '0.5rem',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem',
  },
  eventGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
    maxHeight: '600px',
    overflowY: 'auto',
  },
  eventCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    borderRadius: '1rem',
    padding: '1.5rem',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
    border: '1px solid rgba(79, 70, 229, 0.2)',
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
  eventCardContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  eventDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    color: '#94A3B8',
  },
  eventDetailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  detailIcon: {
    color: '#4F46E5',
  },
  attendeeActions: {
    marginTop: '1rem',
  },
  joinButton: {
    width: '100%',
    padding: '0.5rem',
    backgroundColor: '#10B981',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  leaveButton: {
    width: '100%',
    padding: '0.5rem',
    backgroundColor: '#EF4444',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  mapContainer: {
    height: '600px',
    borderRadius: '1rem',
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  alert: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    color: '#EF4444',
    padding: '1rem',
    borderRadius: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  alertIcon: {
    fontSize: '1.5rem',
  },
  message: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    color: '#10B981',
    padding: '1rem',
    borderRadius: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  messageIcon: {
    fontSize: '1.5rem',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#1E293B',
    padding: '2rem',
    borderRadius: '1rem',
    width: '500px',
    maxWidth: '90%',
  },
  modalTitle: {
    marginBottom: '1.5rem',
    color: '#FFFFFF',
  },
  createEventForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  formInput: {
    padding: '0.5rem',
    borderRadius: '0.5rem',
    border: '1px solid #4F46E5',
    backgroundColor: '#0F172A',
    color: '#FFFFFF',
  },
  formTextarea: {
    padding: '0.5rem',
    borderRadius: '0.5rem',
    border: '1px solid #4F46E5',
    backgroundColor: '#0F172A',
    color: '#FFFFFF',
    minHeight: '100px',
  },
  formSelect: {
    padding: '0.5rem',
    borderRadius: '0.5rem',
    border: '1px solid #4F46E5',
    backgroundColor: '#0F172A',
    color: '#FFFFFF',
  },
  modalButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
  },
  modalSubmitButton: {
    flex: 1,
    backgroundColor: '#4F46E5',
    color: 'white',
    border: 'none',
    padding: '0.5rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    color: 'white',
    border: 'none',
    padding: '0.5rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
  },
  infoWindow: {
    color: '#0F172A',
    maxWidth: '250px',
  },
  infoTitle: {
    fontSize: '1.25rem',
    marginBottom: '0.5rem',
  },
  infoDetails: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    margin: '0.5rem 0',
  },
  infoIcon: {
    color: '#4F46E5',
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
