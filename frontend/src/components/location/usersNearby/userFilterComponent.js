import React, { useState, useEffect, useRef } from 'react';
import { 
  FaFilter, FaTimes, FaUsers, FaTag, FaCheckCircle 
} from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const UserFilterComponent = ({ 
  onFilterChange, 
  initialFilters = {} 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    hobbies: [],
    ...initialFilters
  });

  // Create a ref for the filter container
  const filterRef = useRef(null);

  const hobbies = [
    { value: 'Traveling', emoji: '✈️' },
    { value: 'Photography', emoji: '📷' },
    { value: 'Music', emoji: '🎵' },
    { value: 'Reading', emoji: '📖' },
    { value: 'Sports', emoji: '🏀' },
    { value: 'Gaming', emoji: '🎮' },
    { value: 'Movies', emoji: '🎬' },
    { value: 'Fitness', emoji: '💪' },
    { value: 'Art', emoji: '🎨' },
    { value: 'Writing', emoji: '✍️' }
  ];

  // Add outside click handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Add event listener when component mounts
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
  
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }
  
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen]);

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const resetFilters = () => {
    setFilters({
      hobbies: []
    });
  };

  const hasActiveFilters = filters.hobbies.length > 0;

  return (
    <div className="position-relative" ref={filterRef}>
      <button 
        className={`btn ${hasActiveFilters ? 'btn-primary' : 'btn-outline-primary'} d-flex align-items-center`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaFilter className="me-2" />
        Filters
        {hasActiveFilters && (
          <span className="badge bg-light text-primary ms-2">
            {filters.hobbies.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div 
          className="position-absolute top-100 end-0 bg-white shadow-lg rounded-3 p-4 mt-2"
          style={{ width: '380px', zIndex: 1000 }}
        >
          <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
            <h5 className="mb-0 text-primary">
              <FaFilter className="me-2" />
              Refine Your Search
            </h5>
            <button 
              className="btn-close" 
              onClick={() => setIsOpen(false)}
            />
          </div>

          {/* Hobbies */}
          <div className="mb-3">
            <h6 className="d-flex align-items-center mb-2">
              <FaUsers className="text-primary me-2" />
              Hobbies
            </h6>
            <div className="row g-2">
              {hobbies.map(hobby => (
                <div key={hobby.value} className="col-4">
                  <button
                    className={`btn w-100 ${
                      filters.hobbies.includes(hobby.value) 
                        ? 'btn-primary' 
                        : 'btn-outline-secondary'
                    }`}
                    onClick={() => setFilters(prev => ({
                      ...prev,
                      hobbies: prev.hobbies.includes(hobby.value)
                        ? prev.hobbies.filter(h => h !== hobby.value)
                        : [...prev.hobbies, hobby.value]
                    }))}
                  >
                    <span className="d-block">{hobby.emoji}</span>
                    {hobby.value}
                    {filters.hobbies.includes(hobby.value) && (
                      <FaCheckCircle className="position-absolute top-0 end-0 m-1" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-flex gap-2">
            <button 
              className="btn btn-outline-secondary w-100"
              onClick={resetFilters}
            >
              <FaTimes className="me-2" />
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserFilterComponent;