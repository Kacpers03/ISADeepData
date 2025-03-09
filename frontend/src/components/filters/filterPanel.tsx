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
    viewBounds,
    setViewBounds,
    refreshData,
    selectedContractorId,
    setSelectedContractorId
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
  const contractorCount = useMemo(() => mapData?.contractors.length || 0, [mapData]);
  const cruiseCount = useMemo(() => mapData?.cruises.length || 0, [mapData]);
  const stationCount = useMemo(() => 
    mapData?.cruises.reduce((total, cruise) => 
      total + (cruise.stations?.length || 0), 0) || 0, [mapData]);
  
  // Update filtered options whenever mapData or filterOptions change
  useEffect(() => {
    if (!mapData || !filterOptions) return;
    
    // Process the available options based on current data
    updateFilteredOptions();
  }, [mapData, filterOptions, filters]);
  
  // This function updates all the dropdown options based on the current filters and data
  const updateFilteredOptions = useCallback(() => {
    if (!mapData || !filterOptions) return;
    
    const { contractors, cruises } = mapData;
    
    // Extract all available values from the current filtered data
    
    // 1. Extract mineral types (contractTypes) from visible data
    const availableMineralTypes = new Set();
    contractors.forEach(contractor => {
      availableMineralTypes.add(contractor.contractType);
    });
    
    // 2. Extract contract statuses from visible data
    const availableContractStatuses = new Set();
    contractors.forEach(contractor => {
      availableContractStatuses.add(contractor.contractStatus);
    });
    
    // 3. Extract sponsoring states from visible data
    const availableSponsoringStates = new Set();
    contractors.forEach(contractor => {
      availableSponsoringStates.add(contractor.sponsoringState);
    });
    
    // 4. Extract years from visible data
    const availableYears = new Set();
    contractors.forEach(contractor => {
      availableYears.add(contractor.contractualYear);
    });
    
    // 5. Process for dropdown display
    
    // Update mineral types options - keep all options but mark unavailable ones
    if (filterOptions.contractTypes) {
      const updatedMineralTypes = filterOptions.contractTypes.map(type => ({
        value: type.contractTypeId.toString(),
        label: type.contractTypeName,
        disabled: filters.mineralTypeId === undefined && 
                 !availableMineralTypes.has(type.contractTypeName)
      }));
      setFilteredMineralTypes(updatedMineralTypes);
    }
    
    // Update contract statuses options
    if (filterOptions.contractStatuses) {
      const updatedContractStatuses = filterOptions.contractStatuses.map(status => ({
        value: status.contractStatusId.toString(),
        label: status.contractStatusName,
        disabled: filters.contractStatusId === undefined && 
                 !availableContractStatuses.has(status.contractStatusName)
      }));
      setFilteredContractStatuses(updatedContractStatuses);
    }
    
    // Update sponsoring states options
    if (filterOptions.sponsoringStates) {
      const updatedSponsoringStates = filterOptions.sponsoringStates.map(state => ({
        value: state,
        label: state,
        disabled: filters.sponsoringState === undefined && 
                 !availableSponsoringStates.has(state)
      }));
      setFilteredSponsoringStates(updatedSponsoringStates);
    }
    
    // Update years options
    if (filterOptions.contractualYears) {
      const updatedYears = filterOptions.contractualYears.map(year => ({
        value: year.toString(),
        label: year.toString(),
        disabled: filters.year === undefined && 
                 !availableYears.has(year)
      }));
      setFilteredYears(updatedYears);
    }
    
    // Update contractor names from mapData
    if (mapData?.contractors) {
      const contractorOptions = mapData.contractors.map(contractor => ({
        value: contractor.contractorId.toString(),
        label: contractor.contractorName
      }));
      setFilteredContractors(contractorOptions);
    }
  }, [mapData, filterOptions, filters]);
  
  // Handle select change with proper type conversion
  const handleSelectChange = useCallback((key, value) => {
    if (value === 'all') {
      // When "All" is selected, just remove the filter
      setFilter(key, undefined);
      
      // If we're resetting the contractorId, also clear the selection
      if (key === 'contractorId') {
        setSelectedContractorId(null);
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
        setSelectedContractorId(contractorId);
      }
      // For string values
      else {
        setFilter(key, value);
      }
    }
  }, [setFilter, setSelectedContractorId]);
  
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
  
  // Handle search submit with improved searching logic
  const handleSearch = useCallback(() => {
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
  }, [searchQuery, mapData]);
  
  // Handle search result click
  const handleResultClick = useCallback((result) => {
    setShowResults(false);
    setSearchQuery('');
    
    // Handle different result types
    switch (result.type) {
      case 'contractor':
        // Set both filter and selectedContractorId to trigger smart zoom
        setFilter('contractorId', result.id);
        setSelectedContractorId(result.id);
        break;
      case 'station':
        // Set the map view to focus on this station WITHOUT resetting other filters
        if (result.latitude && result.longitude && window.mapInstance) {
          // Keep current zoom level but center on point
          const currentZoom = window.mapInstance.getZoom();
          window.mapInstance.flyTo({
            center: [result.longitude, result.latitude],
            zoom: Math.max(currentZoom, 10), // Don't zoom out, only in if needed
            duration: 1500
          });
        }
        break;
      default:
        // For other types, handle as needed
        break;
    }
  }, [setFilter, setSelectedContractorId]);
  
  // Handle search on Enter key
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);
  
  // Handle reset filters
  const handleResetFilters = () => {
    resetFilters();
    // No need to do anything else - resetFilters handles clearing selection
    // and the map component will automatically zoom out
  };
  
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
            onClick={handleResetFilters}
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