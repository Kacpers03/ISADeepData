import React, { useEffect, useState } from 'react';
import { useFilter } from '../../contexts/filterContext';
import styles from '../../styles/map/map.module.css';
import { CustomDropdown } from './CustomDropdown';

export const FilterPanel: React.FC = () => {
  const { 
    filters, 
    setFilter, 
    resetFilters, 
    filterOptions, 
    loading,
    mapData
  } = useFilter();
  
  // State for contractor names
  const [contractorNames, setContractorNames] = useState<Array<{id: number, name: string}>>([]);
  
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
    if (['mineralTypeId', 'contractStatusId', 'year', 'cruiseId', 'contractorId'].includes(key)) {
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
        {/* Contractor Name Filter - Custom Dropdown */}
        <CustomDropdown
          id="contractorId"
          label="Contractor Name"
          options={contractorOptions}
          value={filters.contractorId?.toString() || 'all'}
          onChange={(e: any) => handleSelectChange(e, 'contractorId')}
          isActive={!!filters.contractorId}
          disabled={loading}
        />
        
        {/* Mineral Type Filter - Custom Dropdown */}
        <CustomDropdown
          id="mineralTypeId"
          label="Mineral Type"
          options={mineralTypeOptions}
          value={filters.mineralTypeId?.toString() || 'all'}
          onChange={(e: any) => handleSelectChange(e, 'mineralTypeId')}
          isActive={!!filters.mineralTypeId}
          disabled={loading}
        />
        
        {/* Contract Status Filter - Custom Dropdown */}
        <CustomDropdown
          id="contractStatusId"
          label="Contract Status"
          options={contractStatusOptions}
          value={filters.contractStatusId?.toString() || 'all'}
          onChange={(e: any) => handleSelectChange(e, 'contractStatusId')}
          isActive={!!filters.contractStatusId}
          disabled={loading}
        />
        
        {/* Sponsoring State Filter - Custom Dropdown */}
        <CustomDropdown
          id="sponsoringState"
          label="Sponsoring State"
          options={sponsoringStateOptions}
          value={filters.sponsoringState || 'all'}
          onChange={(e: any) => handleSelectChange(e, 'sponsoringState')}
          isActive={!!filters.sponsoringState}
          disabled={loading}
        />
        
        {/* Contractual Year Filter - Custom Dropdown */}
        <CustomDropdown
          id="year"
          label="Contract Year"
          options={yearOptions}
          value={filters.year?.toString() || 'all'}
          onChange={(e: any) => handleSelectChange(e, 'year')}
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
            Showing {contractorCount} contractor{contractorCount !== 1 ? 's' : ''}, {cruiseCount} cruise{cruiseCount !== 1 ? 's' : ''}, and {stationCount} station{stationCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  );
};