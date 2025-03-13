import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useFilter } from '../../contexts/filterContext';
import styles from '../../styles/map/filter.module.css';
import { CustomDropdown } from './CustomDropdown';

// Create a simple debounce function instead of importing from lodash
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const ImprovedFilterPanel = () => {
  const { 
    filters, 
    setFilter, 
    resetFilters, 
    filterOptions, 
    loading,
    mapData,
    originalMapData,
    viewBounds,
    setViewBounds,
    refreshData,
    selectedContractorId,
    setSelectedContractorId,
    handleContractorSelect // This is the new function we added
  } = useFilter();
  
  // State for filtered dropdown options
  const [filteredContractors, setFilteredContractors] = useState([]);
  const [filteredMineralTypes, setFilteredMineralTypes] = useState([]);
  const [filteredContractStatuses, setFilteredContractStatuses] = useState([]);
  const [filteredSponsoringStates, setFilteredSponsoringStates] = useState([]);
  const [filteredYears, setFilteredYears] = useState([]);
  
  // Search functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  
  // Count active filters
  const activeFilterCount = useMemo(() => 
    Object.keys(filters).filter(key => 
      filters[key] !== undefined && filters[key] !== null
    ).length, [filters]);
  
  // Count results if available
  const contractorCount = useMemo(() => mapData?.contractors?.length || 0, [mapData]);
  const cruiseCount = useMemo(() => mapData?.cruises?.length || 0, [mapData]);
  const stationCount = useMemo(() => 
    mapData?.cruises?.reduce((total, cruise) => 
      total + (cruise.stations?.length || 0), 0) || 0, [mapData]);
  
  // Update dropdown options whenever either mapData, originalMapData, or filterOptions change
  useEffect(() => {
    if (!originalMapData || !filterOptions) return;
    
    // Process the available options based on current data
    updateFilteredOptions();
  }, [originalMapData, filterOptions, mapData, filters]);
  
  // This function updates all the dropdown options based on the original data 
  // while highlighting which options are currently available based on other filters
  const updateFilteredOptions = useCallback(() => {
    if (!originalMapData || !filterOptions) return;
    
    // Get the full set of data from originalMapData 
    // and the filtered set from mapData
    const allContractors = originalMapData.contractors;
    const filteredContractors = mapData?.contractors || [];
    
    // Create sets to track what values are available in the filtered data
    const filteredMineralTypes = new Set();
    const filteredContractStatuses = new Set();
    const filteredSponsoringStates = new Set();
    const filteredYears = new Set();
    const filteredContractorIds = new Set();
    
    // Collect all values that exist in the filtered data
    filteredContractors.forEach(contractor => {
      if (contractor.contractType) filteredMineralTypes.add(contractor.contractType);
      if (contractor.contractStatus) filteredContractStatuses.add(contractor.contractStatus);
      if (contractor.sponsoringState) filteredSponsoringStates.add(contractor.sponsoringState);
      if (contractor.contractualYear) filteredYears.add(contractor.contractualYear);
      filteredContractorIds.add(contractor.contractorId);
    });
    
    // Get all possible values from the original data
    const allMineralTypes = new Set();
    const allContractStatuses = new Set();
    const allSponsoringStates = new Set();
    const allYears = new Set();
    
    allContractors.forEach(contractor => {
      if (contractor.contractType) allMineralTypes.add(contractor.contractType);
      if (contractor.contractStatus) allContractStatuses.add(contractor.contractStatus);
      if (contractor.sponsoringState) allSponsoringStates.add(contractor.sponsoringState);
      if (contractor.contractualYear) allYears.add(contractor.contractualYear);
    });
    
    // Count active filters to determine when we have a single filter
    const activeFilterCount = Object.keys(filters).filter(key => 
      filters[key] !== undefined && filters[key] !== null
    ).length;
    
    // Check which filter types are currently active
    const isMineralTypeActive = filters.mineralTypeId !== undefined;
    const isContractStatusActive = filters.contractStatusId !== undefined;
    const isSponsoringStateActive = filters.sponsoringState !== undefined;
    const isYearActive = filters.year !== undefined;
    const isContractorActive = filters.contractorId !== undefined;
    
    // Update mineral types - if mineralTypeId is the only active filter, show all options
    if (filterOptions.contractTypes) {
      const updatedMineralTypes = filterOptions.contractTypes.map(type => {
        // If mineralTypeId is the only active filter, don't disable any options
        const shouldCheckAvailability = activeFilterCount > 1 || !isMineralTypeActive;
        
        // Check if this mineral type exists in the filtered data (only if needed)
        const isAvailable = !shouldCheckAvailability || filteredMineralTypes.has(type.contractTypeName);
        
        return {
          value: type.contractTypeId.toString(),
          label: type.contractTypeName,
          disabled: !isAvailable
        };
      });
      setFilteredMineralTypes(updatedMineralTypes);
    }
    
    // Update contract statuses - similar approach
    if (filterOptions.contractStatuses) {
      const updatedContractStatuses = filterOptions.contractStatuses.map(status => {
        // If contractStatusId is the only active filter, don't disable any options
        const shouldCheckAvailability = activeFilterCount > 1 || !isContractStatusActive;
        
        const isAvailable = !shouldCheckAvailability || filteredContractStatuses.has(status.contractStatusName);
        
        return {
          value: status.contractStatusId.toString(),
          label: status.contractStatusName,
          disabled: !isAvailable
        };
      });
      setFilteredContractStatuses(updatedContractStatuses);
    }
    
    // Update sponsoring states
    if (filterOptions.sponsoringStates) {
      // If sponsoringState is the only active filter, don't disable any options
      const updatedSponsoringStates = filterOptions.sponsoringStates.map(state => {
        const shouldCheckAvailability = activeFilterCount > 1 || !isSponsoringStateActive;
        
        const isAvailable = !shouldCheckAvailability || filteredSponsoringStates.has(state);
        
        return {
          value: state,
          label: state,
          disabled: !isAvailable
        };
      });
      setFilteredSponsoringStates(updatedSponsoringStates);
    }
    
    // Update years options
    if (filterOptions.contractualYears) {
      const updatedYears = filterOptions.contractualYears.map(year => {
        // If year is the only active filter, don't disable any options
        const shouldCheckAvailability = activeFilterCount > 1 || !isYearActive;
        
        const isAvailable = !shouldCheckAvailability || filteredYears.has(year);
        
        return {
          value: year.toString(),
          label: year.toString(),
          disabled: !isAvailable
        };
      });
      setFilteredYears(updatedYears);
    }
    
    // Update contractor options from both datasets
    // First get all contractors from original data
    const contractorOptions = allContractors.map(contractor => {
      // If contractorId is the only active filter, don't disable any options
      const shouldCheckAvailability = activeFilterCount > 1 || !isContractorActive;
      
      // Check if this contractor is in the filtered dataset
      const isAvailable = !shouldCheckAvailability || filteredContractorIds.has(contractor.contractorId);
      
      return {
        value: contractor.contractorId.toString(),
        label: contractor.contractorName,
        disabled: !isAvailable
      };
    });
    
    setFilteredContractors(contractorOptions);
  }, [originalMapData, mapData, filterOptions, filters]);
  
  // Handle select change with proper type conversion
  const handleSelectChange = useCallback((key, value) => {
    if (value === 'all') {
      // When "All" is selected, just remove the filter
      setFilter(key, undefined);
      
      // If we're resetting the contractorId, also clear the selection
      if (key === 'contractorId') {
        // Use the context function if available, otherwise use the standard approach
        if (handleContractorSelect) {
          handleContractorSelect(null);
        } else {
          setSelectedContractorId(null);
        }
      }
    } 
    else {
      // For number values
      if (['mineralTypeId', 'contractStatusId', 'year', 'cruiseId'].includes(key)) {
        setFilter(key, parseInt(value, 10));
      } 
      // Special handling for contractorId to enable smart zooming
      else if (key === 'contractorId') {
        const contractorId = parseInt(value, 10);
        setFilter(key, contractorId);
        
        // Use the context function if available, otherwise use the standard approach
        if (handleContractorSelect) {
          handleContractorSelect(contractorId);
        } else {
          setSelectedContractorId(contractorId);
        }
      }
      // For string values
      else {
        setFilter(key, value);
      }
    }
  }, [setFilter, setSelectedContractorId, handleContractorSelect]);
  
  // Debounced select change handler to prevent rapid state updates
  const debouncedSelectChange = useMemo(() => 
    debounce((key, value) => {
      handleSelectChange(key, value);
    }, 300), [handleSelectChange]);
  
  // Handle search query change
  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim() === '') {
      setSearchResults([]);
      setShowResults(false);
    }
  }, []);
  
  // Updated handleSearch function that doesn't use DOM manipulation
  const handleSearch = useCallback(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    
    console.log("Searching for:", searchQuery);
    
    const query = searchQuery.toLowerCase();
    const results = [];
    
    // Search contractors with explicit null checks
    if (mapData && mapData.contractors && Array.isArray(mapData.contractors)) {
      console.log("Searching through", mapData.contractors.length, "contractors");
      mapData.contractors.forEach(contractor => {
        if (contractor && contractor.contractorName) {
          if (contractor.contractorName.toLowerCase().includes(query)) {
            console.log("MATCH found for contractor:", contractor.contractorName);
            results.push({
              type: 'contractor',
              id: contractor.contractorId,
              name: contractor.contractorName,
              sponsoringState: contractor.sponsoringState,
              contractType: contractor.contractType
            });
          }
        }
      });
    } else {
      console.log("No contractors array found in mapData");
    }
    
    // Search cruises
    if (mapData && mapData.cruises && Array.isArray(mapData.cruises)) {
      mapData.cruises.forEach(cruise => {
        const cruiseName = cruise.cruiseName || `Cruise #${cruise.cruiseId}`;
        
        // Search by cruise name or ID
        if ((cruise.cruiseName && cruise.cruiseName.toLowerCase().includes(query)) ||
            (cruise.cruiseId && cruise.cruiseId.toString().includes(query))) {
          
          // Find the parent contractor for context
          const parentContractor = mapData.contractors?.find(c => c.contractorId === cruise.contractorId);
          
          results.push({
            type: 'cruise',
            id: cruise.cruiseId,
            name: cruiseName,
            parent: parentContractor ? parentContractor.contractorName : undefined,
            contractorId: cruise.contractorId,
            startDate: cruise.startDate,
            endDate: cruise.endDate,
            vesselName: cruise.researchVessel
          });
        }
        
        // Search stations within this cruise
        if (cruise.stations && Array.isArray(cruise.stations)) {
          cruise.stations.forEach(station => {
            const stationName = station.stationName || station.stationCode || `Station #${station.stationId}`;
            
            if ((station.stationName && station.stationName.toLowerCase().includes(query)) ||
                (station.stationCode && station.stationCode.toLowerCase().includes(query)) ||
                (station.stationId && station.stationId.toString().includes(query)) ||
                (station.location && station.location.toLowerCase().includes(query))) {
              
              results.push({
                type: 'station',
                id: station.stationId,
                name: stationName,
                parent: cruiseName,
                cruiseId: cruise.cruiseId,
                latitude: station.latitude,
                longitude: station.longitude,
                stationType: station.stationType,
                stationObject: station
              });
            }
          });
        }
      });
    }
    
    // Search for areas and blocks
    if (mapData && mapData.contractors) {
      mapData.contractors.forEach(contractor => {
        if (contractor.areas && Array.isArray(contractor.areas)) {
          contractor.areas.forEach(area => {
            const areaName = area.areaName || `Area #${area.areaId}`;
            
            if ((area.areaName && area.areaName.toLowerCase().includes(query)) ||
                (area.areaId && area.areaId.toString().includes(query))) {
              
              results.push({
                type: 'area',
                id: area.areaId,
                name: areaName,
                parent: contractor.contractorName,
                contractorId: contractor.contractorId
              });
            }
            
            // Search blocks
            if (area.blocks && Array.isArray(area.blocks)) {
              area.blocks.forEach(block => {
                const blockName = block.blockName || `Block #${block.blockId}`;
                
                if ((block.blockName && block.blockName.toLowerCase().includes(query)) ||
                    (block.blockId && block.blockId.toString().includes(query))) {
                  
                  results.push({
                    type: 'block',
                    id: block.blockId,
                    name: blockName,
                    parent: `${areaName} (${contractor.contractorName})`,
                    areaId: area.areaId,
                    contractorId: contractor.contractorId,
                    status: block.status
                  });
                }
              });
            }
          });
        }
      });
    }
    
    console.log("Search results:", results);
    
    // Set results and show panel - no DOM manipulation needed
    setSearchResults(results);
    setShowResults(true);
    
  }, [searchQuery, mapData]);
  
  // Handle search result click with enhanced functionality
  const handleResultClick = useCallback((result) => {
    console.log("Search result clicked:", result);
    setShowResults(false);
    setSearchQuery('');
    
    // Find the main window object to access mapInstance
    const mainWindow = window as any;
    
    switch(result.type) {
      case 'contractor':
        // Set contractor filter, select it, and show detail panel
        setFilter('contractorId', result.id);
        
        // Use the provided handler or standard approach
        if (handleContractorSelect) {
          handleContractorSelect(result.id);
        } else {
          setSelectedContractorId(result.id);
        }
        
        // If the main window has a showDetailPanel function, call it
        if (mainWindow.showContractorDetails) {
          mainWindow.showContractorDetails(result.id);
        }
        break;
        
      case 'cruise':
        // Set cruise filter and show detail panel
        setFilter('cruiseId', result.id);
        
        // If the main window has a showCruiseDetails function, call it
        if (mainWindow.showCruiseDetails) {
          mainWindow.showCruiseDetails(result.id);
        }
        break;
        
      case 'station':
        // Find the station in the map data and display its info panel
        if (mainWindow.showStationDetails) {
          mainWindow.showStationDetails(result.id);
        }
        
        // Also zoom to the station's location
        if (mainWindow.mapInstance && result.latitude && result.longitude) {
          mainWindow.mapInstance.flyTo({
            center: [result.longitude, result.latitude],
            zoom: 12,
            duration: 1000
          });
        }
        
        // If station has parent cruise, also set that filter
        if (result.parent && result.parent.includes('Cruise #')) {
          const cruiseId = parseInt(result.parent.replace('Cruise #', ''), 10);
          if (!isNaN(cruiseId)) {
            setFilter('cruiseId', cruiseId);
          }
        }
        break;
        
      case 'area':
        // Zoom to the area if possible
        if (mainWindow.mapInstance && result.centerLatitude && result.centerLongitude) {
          mainWindow.mapInstance.flyTo({
            center: [result.centerLongitude, result.centerLatitude],
            zoom: 8,
            duration: 1000
          });
        }
        
        // If the area has bounds, set view bounds
        if (setViewBounds && result.bounds) {
          setViewBounds(result.bounds);
        }
        break;
        
      case 'block':
        // Show block analytics panel if available
        if (mainWindow.showBlockAnalytics) {
          mainWindow.showBlockAnalytics(result.id);
        }
        
        // Zoom to the block if possible
        if (mainWindow.mapInstance && result.centerLatitude && result.centerLongitude) {
          mainWindow.mapInstance.flyTo({
            center: [result.centerLongitude, result.centerLatitude],
            zoom: 10,
            duration: 1000
          });
        }
        
        // If the block has bounds, set view bounds
        if (setViewBounds && result.bounds) {
          setViewBounds(result.bounds);
        }
        break;
        
      default:
        console.warn('Unhandled result type:', result.type);
    }
  }, [setFilter, setSelectedContractorId, handleContractorSelect, setViewBounds]);
  
  // Handle search on Enter key
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);
  
  // Simplified useEffect for search results visibility
  useEffect(() => {
    if (showResults) {
      // Make sure the search results are always visible when they should be
      const searchResultsElem = document.getElementById('search-results-panel');
      if (searchResultsElem) {
        // We're now handling this with proper CSS in our JSX, not DOM manipulation
        console.log("Search results panel is present in the DOM");
      }
    }
  }, [showResults]);
  
  // If filter options aren't loaded yet, show loading
  if (!filterOptions) {
    return (
      <div className={styles.filterPanelLoading}>
        Loading filter options...
      </div>
    );
  }
  
  // Format options for custom dropdowns with "All" option first
  const contractorOptions = [
    { value: 'all', label: 'All Contractors' },
    ...filteredContractors
  ];
  
  const mineralTypeOptions = [
    { value: 'all', label: 'All Mineral Types' },
    ...filteredMineralTypes
  ];
  
  const contractStatusOptions = [
    { value: 'all', label: 'All Statuses' },
    ...filteredContractStatuses
  ];
  
  const sponsoringStateOptions = [
    { value: 'all', label: 'All States' },
    ...filteredSponsoringStates
  ];
  
  const yearOptions = [
    { value: 'all', label: 'All Years' },
    ...filteredYears
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
      
      {/* Search Container - Updated for better positioning */}
  
<div className={styles.searchContainer} style={{
  margin: '20px 0',
  position: 'relative', // Important for absolute positioning of results
  zIndex: 9999 // Very high z-index to ensure it displays above other elements
}}>
  <input
    type="text"
    placeholder="Search contractors, areas, blocks, stations..."
    value={searchQuery}
    onChange={handleSearchChange}
    onKeyPress={handleKeyPress}
    className={styles.searchInput}
    style={{
      width: '100%',
      padding: '12px 45px 12px 15px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      fontSize: '14px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}
  />
  <button 
    onClick={handleSearch}
    className={styles.searchButton}
    aria-label="Search"
    style={{
      position: 'absolute',
      right: '10px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#666'
    }}
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  </button>
  
  {/* Search Results Panel - With fixed dimensions and overflow */}
  {showResults && (
    <div 
      id="search-results-panel" 
      className={styles.searchResultsList} 
      style={{
        position: 'absolute',
        top: 'calc(100% + 5px)', // Position just below the search input
        left: 0,
        width: '100%',
        maxHeight: '400px', // Fixed height to prevent overlap with filters
        overflowY: 'auto',
        backgroundColor: 'white',
        border: '1px solid #0077b6',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        zIndex: 10000, // Even higher than container
        margin: 0,
        padding: 0
      }}
    >
      {/* Header with sticky positioning */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 15px',
        backgroundColor: '#0077b6',
        color: 'white',
        fontWeight: 'bold',
        position: 'sticky',
        top: 0,
        zIndex: 1
      }} className="searchResultsHeader">
        <span>Search Results ({searchResults.length})</span>
        <button 
          onClick={() => {
            setShowResults(false);
          }}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: '18px',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0
          }}
        >
          ×
        </button>
      </div>
      
      {/* Results list with scrollable content */}
      <div style={{
        backgroundColor: 'white',
        maxHeight: 'calc(400px - 40px)', // Account for header height
        overflowY: 'auto'
      }}>
        {searchResults.length > 0 ? (
          <div>
            {searchResults.map((result, index) => (
              <div 
                key={`${result.type}-${result.id}-${index}`} 
                onClick={() => {
                  handleResultClick(result);
                }}
                style={{
                  padding: '15px',
                  borderBottom: index < searchResults.length - 1 ? '1px solid #eee' : 'none',
                  cursor: 'pointer',
                  backgroundColor: 'white',
                  transition: 'background-color 0.2s',
                  position: 'relative'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f6f9fc'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                {/* Type indicator */}
                <div style={{
                  display: 'flex',
                  marginBottom: '8px'
                }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    backgroundColor: '#e6f7ff',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontSize: '13px',
                    color: '#0077b6'
                  }}>
                    {result.type === 'contractor' && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px'}}>
                        <path d="M20 7h-3a2 2 0 0 1-2-2V2"></path>
                        <path d="M16 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z"></path>
                      </svg>
                    )}
                    {result.type === 'area' && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px'}}>
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      </svg>
                    )}
                    {result.type === 'block' && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px'}}>
                        <rect x="3" y="3" width="7" height="7"></rect>
                        <rect x="14" y="3" width="7" height="7"></rect>
                        <rect x="14" y="14" width="7" height="7"></rect>
                        <rect x="3" y="14" width="7" height="7"></rect>
                      </svg>
                    )}
                    {result.type === 'station' && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px'}}>
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                    )}
                    {result.type === 'cruise' && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px'}}>
                        <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                        <line x1="6" y1="1" x2="6" y2="4"></line>
                        <line x1="10" y1="1" x2="10" y2="4"></line>
                        <line x1="14" y1="1" x2="14" y2="4"></line>
                      </svg>
                    )}
                    {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                  </div>
                </div>
                
                {/* Result name - larger font */}
                <div style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                  color: '#333'
                }}>
                  {result.name}
                </div>
                
                {/* Location/parent info as tag */}
                {(result.sponsoringState || result.parent) && (
                  <div style={{
                    display: 'inline-block',
                    backgroundColor: '#f5f5f5',
                    padding: '3px 10px',
                    borderRadius: '4px',
                    fontSize: '13px',
                    color: '#666'
                  }}>
                    {result.sponsoringState || result.parent}
                  </div>
                )}
                
                {/* Arrow icon on the right */}
                <div style={{
                  position: 'absolute',
                  right: '15px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#0077b6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            padding: '20px',
            textAlign: 'center',
            color: '#666'
          }}>
            No results found for "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  )}
</div>
      
      <div className={styles.filtersGroup}>
        <h3>Filter By</h3>
        
        {/* Contractor Name Filter */}
        <CustomDropdown
          id="contractorId"
          label="Contractor Name"
          options={contractorOptions}
          value={filters.contractorId?.toString() || 'all'}
          onChange={(e) => debouncedSelectChange('contractorId', e.target.value)}
          isActive={!!filters.contractorId}
          disabled={loading}
        />
        
        {/* Mineral Type Filter */}
        <CustomDropdown
          id="mineralTypeId"
          label="Mineral Type"
          options={mineralTypeOptions}
          value={filters.mineralTypeId?.toString() || 'all'}
          onChange={(e) => debouncedSelectChange('mineralTypeId', e.target.value)}
          isActive={!!filters.mineralTypeId}
          disabled={loading}
        />
        
        {/* Contract Status Filter */}
        <CustomDropdown
          id="contractStatusId"
          label="Contract Status"
          options={contractStatusOptions}
          value={filters.contractStatusId?.toString() || 'all'}
          onChange={(e) => debouncedSelectChange('contractStatusId', e.target.value)}
          isActive={!!filters.contractStatusId}
          disabled={loading}
        />
        
        {/* Sponsoring State Filter */}
        <CustomDropdown
          id="sponsoringState"
          label="Sponsoring State"
          options={sponsoringStateOptions}
          value={filters.sponsoringState || 'all'}
          onChange={(e) => debouncedSelectChange('sponsoringState', e.target.value)}
          isActive={!!filters.sponsoringState}
          disabled={loading}
        />
        
        {/* Contractual Year Filter */}
        <CustomDropdown
          id="year"
          label="Contract Year"
          options={yearOptions}
          value={filters.year?.toString() || 'all'}
          onChange={(e) => debouncedSelectChange('year', e.target.value)}
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