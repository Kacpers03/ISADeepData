// src/components/filters/filterPanel.tsx
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useFilter } from '../context/filterContext';
import styles from '../../../styles/map/filter.module.css';
import { CustomDropdown } from './CustomDropdown';
import { locationBoundaries } from '../../../constants/locationBoundaries';
import SearchPanel from './searchPanel';
import FilterOptions from './filterOptions';
import ResultsInfo from './resultInfo';
import { downloadCSV } from '../../../utils/csvExport';

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
    selectedCruiseId,
    setSelectedCruiseId,
    handleContractorSelect,
    setDetailPanelType,
    setShowDetailPanel
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
  const [selectedSearchItem, setSelectedSearchItem] = useState(null);
  
  // Reference to keep track of previous filters for proper reset
  const previousFiltersRef = useRef(null);
  
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

  // Store previous filters before reset
  useEffect(() => {
    previousFiltersRef.current = { ...filters };
  }, [filters]);
  
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
        
        // Special handling for cruiseId to keep cruises visible
        if (key === 'cruiseId') {
          setSelectedCruiseId(parseInt(value, 10));
          
          // Make sure cruises are visible and zoom to the selected cruise
          if (window.showCruiseDetails) {
            window.showCruiseDetails(parseInt(value, 10));
          }
        }
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
  }, [setFilter, setSelectedContractorId, setSelectedCruiseId, handleContractorSelect]);
  
  // Debounced select change handler to prevent rapid state updates
  const debouncedSelectChange = useMemo(() => 
    debounce((key, value) => {
      handleSelectChange(key, value);
    }, 300), [handleSelectChange]);
  
  // Enhanced reset filters function that also clears selected search item
  const handleResetFilters = useCallback(() => {
    // Clear the selected search item
    setSelectedSearchItem(null);
    
    // Reset all filters using the context function
    resetFilters();
  }, [resetFilters]);

  // CSV export functionality
  const handleDownloadCSV = useCallback(() => {
    if (!mapData) return;
    // Use our CSV export utility
    downloadCSV(mapData, `exploration-data`);
  }, [mapData]);
  
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

  const locationOptions = [
    { value: 'all', label: 'All Locations' },
    ...locationBoundaries.map(location => ({
      value: location.id,
      label: location.name
    }))
  ];

  return (
    <div className={styles.improvedFilterPanel}>
      <div className={styles.filterContent}>
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
        
        {/* Search Component */}
        <SearchPanel 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchResults={searchResults}
          setSearchResults={setSearchResults}
          showResults={showResults}
          setShowResults={setShowResults}
          selectedSearchItem={selectedSearchItem}
          setSelectedSearchItem={setSelectedSearchItem}
          mapData={mapData}
          setFilter={setFilter}
          handleContractorSelect={handleContractorSelect}
          setSelectedContractorId={setSelectedContractorId}
          setSelectedCruiseId={setSelectedCruiseId}
          setDetailPanelType={setDetailPanelType}
          setShowDetailPanel={setShowDetailPanel}
          setViewBounds={setViewBounds}
        />
        
        {/* Filter Options Component */}
        <FilterOptions
          contractorOptions={contractorOptions}
          mineralTypeOptions={mineralTypeOptions}
          contractStatusOptions={contractStatusOptions}
          sponsoringStateOptions={sponsoringStateOptions}
          yearOptions={yearOptions}
          locationOptions={locationOptions}
          filters={filters}
          debouncedSelectChange={debouncedSelectChange}
          loading={loading}
        />
      </div>
      
      {/* Results Info Component with Download CSV button */}
      <ResultsInfo 
        loading={loading}
        contractorCount={contractorCount}
        cruiseCount={cruiseCount}
        stationCount={stationCount}
        mapData={mapData}  // Pass the actual mapData for use in CSV export
      />
    </div>
  );
};

export default ImprovedFilterPanel;