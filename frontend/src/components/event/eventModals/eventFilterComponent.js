import React, { useState, useEffect } from 'react';
import { 
  FaFilter, FaTimes, FaSort, FaUsers, FaTag, FaSearch, FaCheckCircle 
} from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const EventFilterComponent = ({ 
  onFilterChange, 
  initialFilters = {} 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    categories: [],
    minAttendees: 0,
    maxAttendees: 100,
    sortBy: 'nearest',
    searchQuery: '',
    ...initialFilters
  });

  const categories = [
    { value: 'Sports', emoji: '🏀' },
    { value: 'Educational', emoji: '📚' },
    { value: 'Job', emoji: '💼' },
    { value: 'Campus_Life', emoji: '🎓' },
    { value: 'Concert', emoji: '🎵' },
    { value: 'Other', emoji: '✨' }
  ];

  const sortOptions = [
    { value: 'nearest', label: 'Nearest', emoji: '📍' },
    { value: 'mostPopular', label: 'Popular', emoji: '🔥' },
    { value: 'soonest', label: 'Soonest', emoji: '⏰' }
  ];

  useEffect(() => {
    const processedFilters = {
      ...filters,
      categories: filters.categories.join(',')
    };
    onFilterChange(processedFilters);
  }, [filters, onFilterChange]);

  const resetFilters = () => {
    setFilters({
      categories: [],
      minAttendees: 0,
      maxAttendees: 100,
      sortBy: 'nearest',
      searchQuery: ''
    });
  };

  const hasActiveFilters = 
    filters.categories.length > 0 || 
    filters.minAttendees > 0 || 
    filters.maxAttendees < 100 ||
    filters.searchQuery;

  return (
    <div className="position-relative">
      <button 
        className={`btn ${hasActiveFilters ? 'btn-primary' : 'btn-outline-primary'} d-flex align-items-center`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaFilter className="me-2" />
        Filters
        {hasActiveFilters && (
          <span className="badge bg-light text-primary ms-2">
            {[
              ...filters.categories,
              filters.searchQuery ? 'Search' : null,
              filters.minAttendees > 0 || filters.maxAttendees < 100 ? 'Attendees' : null
            ].filter(Boolean).length}
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
              Refine Your Events
            </h5>
            <button 
              className="btn-close" 
              onClick={() => setIsOpen(false)}
            />
          </div>

          {/* Search Section */}
          <div className="mb-3">
            <h6 className="d-flex align-items-center mb-2">
              <FaSearch className="text-primary me-2" />
              Search Events
            </h6>
            <input
              type="text"
              className="form-control"
              placeholder="Find events by name"
              value={filters.searchQuery}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                searchQuery: e.target.value
              }))}
            />
          </div>

          {/* Categories */}
          <div className="mb-3">
            <h6 className="d-flex align-items-center mb-2">
              <FaTag className="text-primary me-2" />
              Categories
            </h6>
            <div className="row g-2">
              {categories.map(category => (
                <div key={category.value} className="col-4">
                  <button
                    className={`btn w-100 ${
                      filters.categories.includes(category.value) 
                        ? 'btn-primary' 
                        : 'btn-outline-secondary'
                    }`}
                    onClick={() => setFilters(prev => ({
                      ...prev,
                      categories: prev.categories.includes(category.value)
                        ? prev.categories.filter(c => c !== category.value)
                        : [...prev.categories, category.value]
                    }))}
                  >
                    <span className="d-block">{category.emoji}</span>
                    {category.value}
                    {filters.categories.includes(category.value) && (
                      <FaCheckCircle className="position-absolute top-0 end-0 m-1" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Attendee Range */}
          <div className="mb-3">
            <h6 className="d-flex align-items-center mb-2">
              <FaUsers className="text-primary me-2" />
              Attendee Range
            </h6>
            <div className="d-flex align-items-center">
              <span className="me-2">Min: {filters.minAttendees}</span>
              <input 
                type="range"
                className="form-range flex-grow-1 me-2"
                min="0"
                max="100"
                value={filters.minAttendees}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  minAttendees: Number(e.target.value)
                }))}
              />
              <span className="me-2">Max: {filters.maxAttendees}</span>
              <input 
                type="range"
                className="form-range flex-grow-1"
                min="0"
                max="100"
                value={filters.maxAttendees}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  maxAttendees: Number(e.target.value)
                }))}
              />
            </div>
          </div>

          {/* Sort Options */}
          <div className="mb-3">
            <h6 className="d-flex align-items-center mb-2">
              <FaSort className="text-primary me-2" />
              Sort By
            </h6>
            <div className="btn-group w-100" role="group">
              {sortOptions.map(option => (
                <button
                  key={option.value}
                  type="button"
                  className={`btn ${
                    filters.sortBy === option.value 
                      ? 'btn-primary' 
                      : 'btn-outline-secondary'
                  }`}
                  onClick={() => setFilters(prev => ({
                    ...prev,
                    sortBy: option.value
                  }))}
                >
                  {option.emoji} {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-flex gap-2">
            <button 
              className="btn btn-outline-secondary w-50"
              onClick={resetFilters}
            >
              <FaTimes className="me-2" />
              Clear All
            </button>
            <button 
              className="btn btn-primary w-50"
              onClick={() => setIsOpen(false)}
            >
              <FaCheckCircle className="me-2" />
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventFilterComponent;