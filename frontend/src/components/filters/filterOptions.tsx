// src/components/filters/FilterOptions.tsx
import React from 'react';
import styles from '../../styles/map/filter.module.css';
import { CustomDropdown } from './CustomDropdown';

interface FilterOptionsProps {
  contractorOptions: any[];
  mineralTypeOptions: any[];
  contractStatusOptions: any[];
  sponsoringStateOptions: any[];
  yearOptions: any[];
  locationOptions: any[];
  filters: any;
  debouncedSelectChange: (key: string, value: string) => void;
  loading: boolean;
}

const FilterOptions: React.FC<FilterOptionsProps> = ({
  contractorOptions,
  mineralTypeOptions,
  contractStatusOptions,
  sponsoringStateOptions,
  yearOptions,
  locationOptions,
  filters,
  debouncedSelectChange,
  loading
}) => {
  return (
    <div className={styles.filtersGroup}>
      <h3>Filter By</h3>
      
      <CustomDropdown
        id="contractorId"
        label="Contractor Name"
        options={contractorOptions}
        value={filters.contractorId?.toString() || 'all'}
        onChange={(e) => debouncedSelectChange('contractorId', e.target.value)}
        isActive={!!filters.contractorId}
        disabled={loading}
      />
      
      <CustomDropdown
        id="mineralTypeId"
        label="Mineral Type"
        options={mineralTypeOptions}
        value={filters.mineralTypeId?.toString() || 'all'}
        onChange={(e) => debouncedSelectChange('mineralTypeId', e.target.value)}
        isActive={!!filters.mineralTypeId}
        disabled={loading}
      />
      
      <CustomDropdown
        id="contractStatusId"
        label="Contract Status"
        options={contractStatusOptions}
        value={filters.contractStatusId?.toString() || 'all'}
        onChange={(e) => debouncedSelectChange('contractStatusId', e.target.value)}
        isActive={!!filters.contractStatusId}
        disabled={loading}
      />
      
      <CustomDropdown
        id="sponsoringState"
        label="Sponsoring State"
        options={sponsoringStateOptions}
        value={filters.sponsoringState || 'all'}
        onChange={(e) => debouncedSelectChange('sponsoringState', e.target.value)}
        isActive={!!filters.sponsoringState}
        disabled={loading}
      />
      
      <CustomDropdown
        id="year"
        label="Contract Year"
        options={yearOptions}
        value={filters.year?.toString() || 'all'}
        onChange={(e) => debouncedSelectChange('year', e.target.value)}
        isActive={!!filters.year}
        disabled={loading}
      />
      
      <CustomDropdown
        id="locationId"
        label="Location"
        options={locationOptions}
        value={filters.locationId || 'all'}
        onChange={(e) => debouncedSelectChange('locationId', e.target.value)}
        isActive={!!filters.locationId}
        disabled={loading}
      />
    </div>
  );
};

export default FilterOptions;