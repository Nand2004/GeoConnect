import React, { useState } from 'react';
import axios from 'axios';
import { 
  FaEdit, 
  FaSave, 
  FaTimes 
} from 'react-icons/fa';

const EditEventModal = ({ 
  event, 
  currentUser, 
  onClose, 
  onUpdateSuccess, 
  onUpdateError 
}) => {
  const [editEventForm, setEditEventForm] = useState({
    name: event.name,
    description: event.description,
    category: event.category,
    dateTime: new Date(event.dateTime).toISOString().slice(0, 16)
  });

  const editEvent = async (e) => {
    e.preventDefault();
    try {
      const updatePayload = {
        userId: currentUser.id,
        updates: {
          name: editEventForm.name,
          description: editEventForm.description,
          dateTime: new Date(editEventForm.dateTime).toISOString(),
          category: editEventForm.category
        }
      };

      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_SERVER_URI}/event/updateEvent/${event._id}`, 
        updatePayload
      );
      
      onUpdateSuccess('Event updated successfully!');
      onClose();
    } catch (err) {
      onUpdateError('Failed to update event.');
    }
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>
            <FaEdit style={styles.titleIcon} /> Edit Event
          </h2>
          <button 
            onClick={onClose} 
            style={styles.closeButton}
          >
            <FaTimes />
          </button>
        </div>
        <form onSubmit={editEvent} style={styles.createEventForm}>
          <input
            type="text"
            placeholder="Event Name"
            value={editEventForm.name}
            onChange={(e) => setEditEventForm({...editEventForm, name: e.target.value})}
            style={styles.formInput}
            required
          />
          <textarea
            placeholder="Event Description"
            value={editEventForm.description}
            onChange={(e) => setEditEventForm({...editEventForm, description: e.target.value})}
            style={styles.formTextarea}
            required
          />
          <select
            value={editEventForm.category}
            onChange={(e) => setEditEventForm({...editEventForm, category: e.target.value})}
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
            value={editEventForm.dateTime}
            onChange={(e) => setEditEventForm({...editEventForm, dateTime: e.target.value})}
            style={styles.formInput}
            required
          />
          <button 
            type="submit" 
            style={styles.modalSubmitButton}
          >
            <FaSave style={styles.buttonIcon} /> Update Event
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
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
    position: 'relative',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  modalTitle: {
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  titleIcon: {
    color: '#4F46E5',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: '#EF4444',
    fontSize: '1.5rem',
    cursor: 'pointer',
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
  modalSubmitButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    backgroundColor: '#4F46E5',
    color: 'white',
    border: 'none',
    padding: '0.5rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
  },
  buttonIcon: {
    marginRight: '0.5rem',
  },
};

export default EditEventModal;