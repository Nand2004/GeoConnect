import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker, InfoWindow, Circle } from '@react-google-maps/api';
import EditEventModal from './eventModals/editEventModal';
import EventChatButton from '../chat/chatButton/eventChatButton';
import styles from './styles/eventPageStyles';
import mapStyles from './styles/mapStyles';
import AttendeesModal from './eventModals/attendeesModal';
import EventFilterComponent from './eventModals/eventFilterComponent';

import { FaCalendarPlus, FaMapMarkerAlt, FaUsers, FaExclamationCircle, FaTag, FaInfoCircle, FaCheckCircle } from 'react-icons/fa';
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

  const [hoveredEmojiEventId, setHoveredEmojiEventId] = useState(null);
  const categoryEmojis = {
    'Sports': '🏀',
    'Educational': '📚',
    'Job': '💼',
    'Campus_Life': '🎓',
    'Concert': '🎵',
    'Other': '✨'
  };

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEventForEdit, setSelectedEventForEdit] = useState(null);
  const [isAttendeesModalOpen, setIsAttendeesModalOpen] = useState(false);

  const openEditModal = (event) => {
    setSelectedEventForEdit(event);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedEventForEdit(null);
  };

  const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const [mapZoom, setMapZoom] = useState(14);

  const mapRef = useRef(null);

  const onLoad = (map) => {
    mapRef.current = map; // Assign map instance to the ref
  };

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


  const [filters, setFilters] = useState({
    categories: [],
    minAttendees: 0,
    maxAttendees: 100,
    sortBy: 'nearest',
    searchQuery: ''
  });


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

  const findNearbyEvents = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_SERVER_URI}/event/getNearbyEvents`, {
        params: {
          latitude: location.latitude,
          longitude: location.longitude,
          radius: searchRadius,
          ...filters  // Spread all filter parameters
        },
      });
      setNearbyEvents(data);
      if (data.length === 0) setMessage('No events found nearby.');
      setLoading(false);
    } catch (err) {
      setError('Error finding nearby events.');
      setLoading(false);
    }
    // Clear messages after 3 seconds
    setTimeout(() => {
      setMessage("");
      setError("");
    }, 3000);
  };
  // Trigger findNearbyEvents when filters change
  useEffect(() => {
    if (location.latitude && location.longitude) {
      findNearbyEvents();
    }
  }, [location, searchRadius, filters]);


  // Join an event
  const joinEvent = async (eventId) => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_SERVER_URI}/event/joinEvent/`, {
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
      await axios.post(`${process.env.REACT_APP_BACKEND_SERVER_URI}/event/leaveEvent/`, {
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

      await axios.post(`${process.env.REACT_APP_BACKEND_SERVER_URI}/event/createEvent/`, eventData);
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

      <EventFilterComponent
        onFilterChange={setFilters}
        initialFilters={{
          // Optional: provide any initial filter states
          minAttendees: 0,
          maxAttendees: 100
        }}
      />

      <div style={styles.header}>
        <h2 style={styles.title}>Nearby Events</h2>

        {/* Controls */}
        <div style={styles.controls}>
          <div style={styles.rangeContainer}>
            <input
              type="range"
              min="100"
              max="3000"
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
                <div
                  style={{
                    ...styles.eventCategory,
                    position: 'relative', // For positioning the hover text
                  }}
                >
                  <span
                    onMouseEnter={() => setHoveredEmojiEventId(event._id)}
                    onMouseLeave={() => setHoveredEmojiEventId(null)}
                    style={{
                      position: 'relative',
                      display: 'inline-block'
                    }}
                  >
                    {hoveredEmojiEventId === event._id
                      ? event.category
                      : categoryEmojis[event.category] || event.category}
                  </span>
                </div>
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
                  <div
                    style={{
                      ...styles.eventDetailItem,
                      cursor: 'pointer'
                    }}


                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedEvent(event);
                      setIsAttendeesModalOpen(true);
                    }}
                  >
                    <FaUsers style={styles.detailIcon} />
                    {event.attendees.length} Attendees
                  </div>
                </div>

                <div style={styles.attendeeActions}>
                  {/* Show chat button if user is creator OR an attendee */}
                  {(event.creatorId === currentUser.id ||
                    event.attendees.some(a => a.userId === currentUser.id)) && (
                      <EventChatButton
                        currentUserId={currentUser.id}
                        eventId={event._id}
                        eventName={event.name}
                        attendees={event.attendees.map(userId => ({ userId }))}
                        chatType="group"
                      />
                    )}

                  {/* Show edit button only to creator */}
                  {event.creatorId === currentUser.id && (
                    <button
                      onClick={() => openEditModal(event)}
                      style={styles.editButton}
                    >
                      Edit Event
                    </button>
                  )}

                  {/* Show join/leave button to non-creators */}
                  {event.creatorId !== currentUser.id && (
                    event.attendees.some(a => a.userId === currentUser.id) ? (
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
                    )
                  )}
                </div>
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
            <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={['drawing', 'places']} >

              <GoogleMap
                center={{ lat: location.latitude, lng: location.longitude }}
                zoom={mapZoom}
                mapContainerStyle={styles.map}
                options={{
                  styles: mapStyles,
                  fullscreenControl: false,
                  streetViewControl: false,
                  mapTypeControl: false,
                  draggable: true,
                  zoomControl: true,
                  scrollwheel: true,
                  disableDoubleClickZoom: false
                }}
                onZoomChanged={(map) => {
                  if (map) {
                    setMapZoom(map.getZoom());
                  }
                }}
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
                      scale: mapZoom > 12 ? 8 : 5,
                      fillColor: event.attendees.length > 10 ? '#FF6B6B' : '#4ECDC4',
                      fillOpacity: 0.7,
                      strokeWeight: 1,
                      strokeColor: '#FFFFFF'
                    }}
                    onClick={() => {
                      setSelectedEvent(event);
                      // Optional: Center map on clicked event
                      mapRef.current.panTo({
                        lat: event.location.coordinates[1],
                        lng: event.location.coordinates[0]
                      });
                    }}
                  />
                ))}

                {/* Radius Visualization */}
                <Circle
                  center={{ lat: location.latitude, lng: location.longitude }}
                  radius={searchRadius}
                  options={{
                    strokeColor: '#4F46E5',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: '#4F46E5',
                    fillOpacity: 0.1
                  }}
                />

                {/* Event Info Window */}
                {selectedEvent && (
                  <InfoWindow
                    position={{
                      lat: selectedEvent.location.coordinates[1],
                      lng: selectedEvent.location.coordinates[0]
                    }}
                    onCloseClick={() => setSelectedEvent(null)}
                  >
                    <div style={styles.infoWindowContainer}>
                      <div style={styles.infoWindowHeader}>
                        <h3 style={styles.infoWindowTitle}>{selectedEvent.name}</h3>
                        <span style={styles.infoWindowCategory}>
                          {categoryEmojis[selectedEvent.category]} {selectedEvent.category}
                        </span>
                      </div>

                      <div style={styles.infoWindowDetails}>
                        <div style={styles.infoWindowDetailItem}>
                          <FaUsers style={styles.infoIcon} />
                          {selectedEvent.attendees.length} Attendees
                        </div>
                        <div style={styles.infoWindowDetailItem}>
                          <FaMapMarkerAlt style={styles.infoIcon} />
                          {calculateDistance(
                            location.latitude,
                            location.longitude,
                            selectedEvent.location.coordinates[1],
                            selectedEvent.location.coordinates[0]
                          ).toFixed(0)}m away
                        </div>
                      </div>

                      <div style={styles.infoWindowActions}>
                        {currentUser && (
                          <>
                            {selectedEvent.creatorId === currentUser.id ? (
                              <button
                                style={styles.infoWindowEditButton}
                                onClick={() => openEditModal(selectedEvent)}
                              >
                                Edit Event
                              </button>
                            ) : (
                              selectedEvent.attendees.some(a => a.userId === currentUser.id) ? (
                                <button
                                  style={styles.infoWindowLeaveButton}
                                  onClick={() => leaveEvent(selectedEvent._id)}
                                >
                                  Leave Event
                                </button>
                              ) : (
                                <button
                                  style={styles.infoWindowJoinButton}
                                  onClick={() => joinEvent(selectedEvent._id)}
                                >
                                  Join Event
                                </button>
                              )
                            )}
                          </>
                        )}
                      </div>
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

      {isAttendeesModalOpen && selectedEvent && (
        <AttendeesModal
          eventId={selectedEvent._id}
          currentUserId={currentUser.id}
          onClose={() => setIsAttendeesModalOpen(false)}
        />
      )}

    </div>
  );

};

export default EventPage;
