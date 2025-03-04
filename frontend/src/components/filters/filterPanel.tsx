import React, { useState, useEffect } from 'react';
import { useFilter } from '../../contexts/filterContext';
import styles from '../../styles/map/map.module.css';
import { CustomDropdown } from './CustomDropdown';

export const ImprovedFilterPanel = () => {
  const { 
    filters, 
    setFilter, 
    resetFilters, 
    filterOptions, 
    loading,
    mapData,
    viewBounds,
    setViewBounds
  } = useFilter();
  
  // State for contractor names
  const [contractorNames, setContractorNames] = useState([]);
  
  // Search functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  
  // Populate contractor names from mapData when it changes
  useEffect(() => {
    if (mapData?.contractors) {
      const names = mapData.contractors.map(contractor => ({
        id: contractor.contractorId,
        name: contractor.contractorName
      }));
      setContractorNames(names);
    }
  }, [mapData]);
  
  // Count active filters
  const activeFilterCount = Object.keys(filters).filter(key => 
    filters[key] !== undefined && filters[key] !== null).length;
  
  // Count results if available
  const contractorCount = mapData?.contractors.length || 0;
  const cruiseCount = mapData?.cruises.length || 0;
  const stationCount = mapData?.cruises.reduce((total, cruise) => 
    total + (cruise.stations?.length || 0), 0) || 0;
  
  // Handle select change
  const handleSelectChange = (e, key) => {
    const value = e.target.value;
    
    // For number values
    if (['mineralTypeId', 'contractStatusId', 'year', 'cruiseId', 'contractorId'].includes(key)) {
      if (value === 'all') {
        setFilter(key, undefined);
      } else {
        setFilter(key, parseInt(value, 10));
      }
    } 
    // For string values
    else {
      setFilter(key, value === 'all' ? undefined : value);
    }
  };
  
  // Handle search query change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim() === '') {
      setSearchResults([]);
      setShowResults(false);
    }
  };
  
  // Handle search submit
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const results = [];
    
    // Search contractors
    if (mapData?.contractors) {
      mapData.contractors.forEach(contractor => {
        if (contractor.contractorName.toLowerCase().includes(query)) {
          results.push({
            type: 'contractor',
            id: contractor.contractorId,
            name: contractor.contractorName
          });
        }
        
        // Search areas and blocks
        if (contractor.areas) {
          contractor.areas.forEach(area => {
            if (area.areaName.toLowerCase().includes(query)) {
              results.push({
                type: 'area',
                id: area.areaId,
                name: area.areaName,
                parent: contractor.contractorName
              });
            }
            
            if (area.blocks) {
              area.blocks.forEach(block => {
                if (block.blockName.toLowerCase().includes(query)) {
                  results.push({
                    type: 'block',
                    id: block.blockId,
                    name: block.blockName,
                    parent: `${area.areaName} (${contractor.contractorName})`
                  });
                }
              });
            }
          });
        }
      });
    }
    
    // Search stations
    if (mapData?.cruises) {
      mapData.cruises.forEach(cruise => {
        if (cruise.stations) {
          cruise.stations.forEach(station => {
            if (station.stationCode.toLowerCase().includes(query)) {
              results.push({
                type: 'station',
                id: station.stationId,
                name: station.stationCode,
                parent: cruise.cruiseName,
                latitude: station.latitude,
                longitude: station.longitude
              });
            }
          });
        }
      });
    }
    
    setSearchResults(results.slice(0, 10)); // Limit to 10 results
    setShowResults(true);
  };
  
  // Handle search result click
  const handleResultClick = (result) => {
    setShowResults(false);
    setSearchQuery('');
    
    // Handle different result types
    switch (result.type) {
      case 'contractor':
        setFilter('contractorId', result.id);
        break;
      case 'station':
        // Set the map view to focus on this station
        if (result.latitude && result.longitude) {
          // We'll need to implement flyTo in the map component
          if (window.mapInstance) {
            window.mapInstance.flyTo({
              center: [result.longitude, result.latitude],
              zoom: 10,
              duration: 1500
            });
          }
        }
        break;
      default:
        // For other types, we might need additional handling
        break;
    }
  };
  
  // Handle search on Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  if (!filterOptions) {
    return (
      <div className={styles.filterPanelLoading}>
        Loading filter options...
      </div>
    );
  }
  
  // Format options for custom dropdowns
  const contractorOptions = [
    { value: 'all', label: 'All Contractors' },
    ...contractorNames.map(c => ({ value: c.id.toString(), label: c.name }))
  ];
  
  const mineralTypeOptions = [
    { value: 'all', label: 'All Mineral Types' },
    ...filterOptions.contractTypes.map(type => ({ 
      value: type.contractTypeId.toString(), 
      label: type.contractTypeName 
    }))
  ];
  
  const contractStatusOptions = [
    { value: 'all', label: 'All Statuses' },
    ...filterOptions.contractStatuses.map(status => ({ 
      value: status.contractStatusId.toString(), 
      label: status.contractStatusName 
    }))
  ];
  
  const sponsoringStateOptions = [
    { value: 'all', label: 'All States' },
    ...filterOptions.sponsoringStates.map(state => ({ 
      value: state, 
      label: state 
    }))
  ];
  
  const yearOptions = [
    { value: 'all', label: 'All Years' },
    ...filterOptions.contractualYears.map(year => ({ 
      value: year.toString(), 
      label: year.toString() 
    }))
  ];
  
  return (
    <div className={styles.improvedFilterPanel}>
      <div className={styles.filterHeader}>
        <h2>Exploration Filters</h2>
        {activeFilterCount > 0 && (
          <button 
            className={styles.resetButton} 
            onClick={resetFilters}
            disabled={loading}
          >
            Reset ({activeFilterCount})
          </button>
        )}
      </div>
      
      {/* Integrated Search Bar */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search contractors, areas, blocks, stations..."
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyPress={handleKeyPress}
          className={styles.searchInput}
        />
        <button 
          onClick={handleSearch}
          className={styles.searchButton}
          aria-label="Search"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </div>
      
      {/* Search Results */}
      {showResults && searchResults.length > 0 && (
        <div className={styles.searchResultsList}>
          <div className={styles.searchResultsHeader}>
            <h4>Search Results ({searchResults.length})</h4>
            <button 
              onClick={() => setShowResults(false)}
              className={styles.closeResultsButton}
            >
              ×
            </button>
          </div>
          
          <ul>
            {searchResults.map((result, index) => (
              <li 
                key={`${result.type}-${result.id}-${index}`} 
                onClick={() => handleResultClick(result)}
              >
                <div className={styles.resultType}>
                  {result.type === 'contractor' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 7h-3a2 2 0 0 1-2-2V2"></path>
                      <path d="M16 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z"></path>
                    </svg>
                  )}
                  {result.type === 'area' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    </svg>
                  )}
                  {result.type === 'block' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="7"></rect>
                      <rect x="14" y="3" width="7" height="7"></rect>
                      <rect x="14" y="14" width="7" height="7"></rect>
                      <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                  )}
                  {result.type === 'station' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  )}
                  {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                </div>
                <div className={styles.resultName}>{result.name}</div>
                {result.parent && <div className={styles.resultParent}>{result.parent}</div>}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className={styles.filtersGroup}>
        <h3>Filter By</h3>
        
        {/* Contractor Name Filter */}
        <CustomDropdown
          id="contractorId"
          label="Contractor Name"
          options={contractorOptions}
          value={filters.contractorId?.toString() || 'all'}
          onChange={(e) => handleSelectChange(e, 'contractorId')}
          isActive={!!filters.contractorId}
          disabled={loading}
        />
        
        {/* Mineral Type Filter */}
        <CustomDropdown
          id="mineralTypeId"
          label="Mineral Type"
          options={mineralTypeOptions}
          value={filters.mineralTypeId?.toString() || 'all'}
          onChange={(e) => handleSelectChange(e, 'mineralTypeId')}
          isActive={!!filters.mineralTypeId}
          disabled={loading}
        />
        
        {/* Contract Status Filter */}
        <CustomDropdown
          id="contractStatusId"
          label="Contract Status"
          options={contractStatusOptions}
          value={filters.contractStatusId?.toString() || 'all'}
          onChange={(e) => handleSelectChange(e, 'contractStatusId')}
          isActive={!!filters.contractStatusId}
          disabled={loading}
        />
        
        {/* Sponsoring State Filter */}
        <CustomDropdown
          id="sponsoringState"
          label="Sponsoring State"
          options={sponsoringStateOptions}
          value={filters.sponsoringState || 'all'}
          onChange={(e) => handleSelectChange(e, 'sponsoringState')}
          isActive={!!filters.sponsoringState}
          disabled={loading}
        />
        
        {/* Contractual Year Filter */}
        <CustomDropdown
          id="year"
          label="Contract Year"
          options={yearOptions}
          value={filters.year?.toString() || 'all'}
          onChange={(e) => handleSelectChange(e, 'year')}
          isActive={!!filters.year}
          disabled={loading}
        />
      </div>
      
      {/* Results Summary */}
      <div className={styles.resultsInfo}>
        {loading ? (
          <span>Loading data...</span>
        ) : (
          <span>
            Showing {contractorCount} contractor{contractorCount !== 1 ? 's' : ''}, 
            {cruiseCount} cruise{cruiseCount !== 1 ? 's' : ''}, 
            and {stationCount} station{stationCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  );
};

export default ImprovedFilterPanel;