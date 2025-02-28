import React from 'react';
import { useFilter } from '../../contexts/filterContext';
import styles from '../../styles/map/map.module.css';

export const FilterPanel: React.FC = () => {
  const { 
    filters, 
    setFilter, 
    resetFilters, 
    filterOptions, 
    loading,
    mapData
  } = useFilter();
  
  // Count active filters
  const activeFilterCount = Object.keys(filters).length;
  
  // Count results if available
  const contractorCount = mapData?.contractors.length || 0;
  const cruiseCount = mapData?.cruises.length || 0;
  const stationCount = mapData?.cruises.reduce((total, cruise) => 
    total + (cruise.stations?.length || 0), 0) || 0;
  
  // Handle select change
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>, key: string) => {
    const value = e.target.value;
    
    // For number values
    if (['contractTypeId', 'contractStatusId', 'year', 'cruiseId', 'contractorId'].includes(key)) {
      if (value === 'all') {
        setFilter(key as any, undefined);
      } else {
        setFilter(key as any, parseInt(value, 10));
      }
    } 
    // For string values
    else {
      setFilter(key as any, value === 'all' ? undefined : value);
    }
  };
  
  if (!filterOptions) {
    return (
      <div className={styles.filterPanelLoading}>
        Loading filter options...
      </div>
    );
  }
  
  return (
    <div className={styles.filterPanelInner}>
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
      
      <div className={styles.filterGrid}>
        {/* Contract Type Filter */}
        <div className={styles.filterGroup}>
          <label htmlFor="contractTypeId">Contract Type</label>
          <select
            id="contractTypeId"
            value={filters.contractTypeId?.toString() || 'all'}
            onChange={(e) => handleSelectChange(e, 'contractTypeId')}
            className={filters.contractTypeId ? styles.activeFilter : ''}
            disabled={loading}
          >
            <option value="all">All Contract Types</option>
            {filterOptions.contractTypes.map(type => (
              <option key={type.contractTypeId} value={type.contractTypeId.toString()}>
                {type.contractTypeName}
              </option>
            ))}
          </select>
        </div>
        
        {/* Contract Status Filter */}
        <div className={styles.filterGroup}>
          <label htmlFor="contractStatusId">Contract Status</label>
          <select
            id="contractStatusId"
            value={filters.contractStatusId?.toString() || 'all'}
            onChange={(e) => handleSelectChange(e, 'contractStatusId')}
            className={filters.contractStatusId ? styles.activeFilter : ''}
            disabled={loading}
          >
            <option value="all">All Statuses</option>
            {filterOptions.contractStatuses.map(status => (
              <option key={status.contractStatusId} value={status.contractStatusId.toString()}>
                {status.contractStatusName}
              </option>
            ))}
          </select>
        </div>
        
        {/* Sponsoring State Filter */}
        <div className={styles.filterGroup}>
          <label htmlFor="sponsoringState">Sponsoring State</label>
          <select
            id="sponsoringState"
            value={filters.sponsoringState || 'all'}
            onChange={(e) => handleSelectChange(e, 'sponsoringState')}
            className={filters.sponsoringState ? styles.activeFilter : ''}
            disabled={loading}
          >
            <option value="all">All States</option>
            {filterOptions.sponsoringStates.map(state => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>
        
        {/* Contractual Year Filter */}
        <div className={styles.filterGroup}>
          <label htmlFor="year">Contract Year</label>
          <select
            id="year"
            value={filters.year?.toString() || 'all'}
            onChange={(e) => handleSelectChange(e, 'year')}
            className={filters.year ? styles.activeFilter : ''}
            disabled={loading}
          >
            <option value="all">All Years</option>
            {filterOptions.contractualYears.map(year => (
              <option key={year} value={year.toString()}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Results Summary */}
      <div className={styles.resultsInfo}>
        {loading ? (
          <span>Loading data...</span>
        ) : (
          <span>
            Showing {contractorCount} contractor{contractorCount !== 1 ? 's' : ''}, {cruiseCount} cruise{cruiseCount !== 1 ? 's' : ''}, and {stationCount} station{stationCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>
      
      {/* Additional filter tips */}
      <div className={styles.filterTips}>
        <h4>Filter Tips:</h4>
        <ul>
          <li>Click on any marker to see station details</li>
          <li>Use the "Filter by View" button to filter by the current map area</li>
          <li>Zoom in for more detail in densely populated areas</li>
        </ul>
      </div>
    </div>
  );
};