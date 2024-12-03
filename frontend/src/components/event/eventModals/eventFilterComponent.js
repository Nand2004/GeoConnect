import React, { useState, useEffect } from 'react';
import { 
  FaFilter, FaTimes, FaSort, FaUsers, FaCalendar, FaTag 
} from 'react-icons/fa';

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

  // Categories from your existing options
  const categories = [
    'Sports', 'Educational', 'Job', 
    'Campus_Life', 'Concert', 'Other'
  ];

  // Sort options
  const sortOptions = [
    { value: 'nearest', label: 'Nearest' },
    { value: 'mostPopular', label: 'Most Popular' },
    { value: 'soonest', label: 'Soonest' }
  ];

  // Effect to notify parent component of filter changes
  useEffect(() => {
    // Convert categories to comma-separated string for backend
    const processedFilters = {
      ...filters,
      categories: filters.categories.join(',')
    };
    onFilterChange(processedFilters);
  }, [filters]);

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      categories: [],
      minAttendees: 0,
      maxAttendees: 100,
      sortBy: 'nearest',
      searchQuery: ''
    });
  };

  return (
    <div style={styles.filterContainer}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={styles.filterToggleButton}
      >
        <FaFilter style={styles.filterIcon} />
        Filters
        {(filters.categories.length > 0 || 
          filters.minAttendees > 0 || 
          filters.maxAttendees < 100 ||
          filters.searchQuery) && (
          <span style={styles.filterBadge}>
            {[
              ...filters.categories,
              filters.searchQuery ? 'Search' : null,
              filters.minAttendees > 0 || filters.maxAttendees < 100 ? 'Attendees' : null
            ].filter(Boolean).length}
          </span>
        )}
      </button>

      {isOpen && (
        <div style={styles.filterModal}>
          <div style={styles.filterModalContent}>
            <div style={styles.filterHeader}>
              <h3>Filter & Sort Events</h3>
              <button 
                onClick={() => setIsOpen(false)}
                style={styles.closeButton}
              >
                <FaTimes />
              </button>
            </div>

            {/* Search Input */}
            <div style={styles.filterSection}>
              <h4>
                <FaTag style={styles.sectionIcon} /> 
                Search Events
              </h4>
              <input
                type="text"
                placeholder="Search by name or description"
                value={filters.searchQuery}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  searchQuery: e.target.value
                }))}
                style={styles.searchInput}
              />
            </div>

            {/* Category Filter */}
            <div style={styles.filterSection}>
              <h4>
                <FaTag style={styles.sectionIcon} /> 
                Categories
              </h4>
              <div style={styles.categoryGrid}>
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setFilters(prev => ({
                      ...prev,
                      categories: prev.categories.includes(category)
                        ? prev.categories.filter(c => c !== category)
                        : [...prev.categories, category]
                    }))}
                    style={{
                      ...styles.categoryButton,
                      backgroundColor: filters.categories.includes(category) 
                        ? '#4F46E5' 
                        : '#E5E7EB',
                      color: filters.categories.includes(category) 
                        ? 'white' 
                        : 'black'
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Attendee Range */}
            <div style={styles.filterSection}>
              <h4>
                <FaUsers style={styles.sectionIcon} /> 
                Attendee Range
              </h4>
              <div style={styles.rangeContainer}>
                <div style={styles.rangeLabels}>
                  <span>Min: {filters.minAttendees}</span>
                  <span>Max: {filters.maxAttendees}</span>
                </div>
                <div style={styles.dualRangeContainer}>
                  <input 
                    type="range"
                    min="0"
                    max="100"
                    value={filters.minAttendees}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      minAttendees: Number(e.target.value)
                    }))}
                    style={{...styles.rangeSlider, marginRight: '10px'}}
                  />
                  <input 
                    type="range"
                    min="0"
                    max="100"
                    value={filters.maxAttendees}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      maxAttendees: Number(e.target.value)
                    }))}
                    style={styles.rangeSlider}
                  />
                </div>
              </div>
            </div>

            {/* Sort By */}
            <div style={styles.filterSection}>
              <h4>
                <FaSort style={styles.sectionIcon} /> 
                Sort By
              </h4>
              <div style={styles.sortButtonContainer}>
                {sortOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => setFilters(prev => ({
                      ...prev,
                      sortBy: option.value
                    }))}
                    style={{
                      ...styles.sortButton,
                      backgroundColor: filters.sortBy === option.value 
                        ? '#4F46E5' 
                        : '#E5E7EB',
                      color: filters.sortBy === option.value 
                        ? 'white' 
                        : 'black'
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Button */}
            <button 
              onClick={resetFilters}
              style={styles.resetButton}
            >
              Reset All Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  filterContainer: {
    position: 'relative',
    zIndex: 50
  },
  filterToggleButton: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 15px',
    backgroundColor: '#4F46E5',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
  },
  filterIcon: {
    marginRight: '8px'
  },
  filterBadge: {
    backgroundColor: 'white',
    color: '#4F46E5',
    borderRadius: '50%',
    padding: '2px 6px',
    marginLeft: '8px',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  filterModal: {
    position: 'absolute',
    top: '100%',
    right: 0,
    width: '380px',
    backgroundColor: 'white',
    boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
    borderRadius: '12px',
    padding: '25px',
    marginTop: '15px',
    border: '1px solid #E5E7EB'
  },
  filterModalContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  filterHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #E5E7EB',
    paddingBottom: '15px'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color: '#6B7280'
  },
  filterSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  sectionIcon: {
    marginRight: '10px',
    color: '#4F46E5'
  },
  searchInput: {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #E5E7EB',
    fontSize: '14px'
  },
  categoryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '10px'
  },
  categoryButton: {
    padding: '10px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontWeight: '500'
  },
  rangeContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  rangeLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    color: '#6B7280'
  },
  dualRangeContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  rangeSlider: {
    flex: 1,
    appearance: 'none',
    height: '8px',
    background: '#E5E7EB',
    outline: 'none',
    opacity: 0.7,
    transition: 'opacity 0.2s',
    borderRadius: '5px'
  },
  sortButtonContainer: {
    display: 'flex',
    gap: '10px'
  },
  sortButton: {
    flex: 1,
    padding: '10px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontWeight: '500'
  },
  resetButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#F3F4F6',
    color: '#111827',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontWeight: '600'
  }
};

export default EventFilterComponent;