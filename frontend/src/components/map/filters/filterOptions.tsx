// frontend/src/components/map/filters/FilterOptions.tsx
import React from 'react' // Import React library
import styles from '../../../styles/map/filter.module.css' // Import CSS module for component styling
import { CustomDropdown } from './CustomDropdown' // Import CustomDropdown component for all filter selects

// Interface defining props for the FilterOptions component
interface FilterOptionsProps {
	contractorOptions: any[] // Array of contractor options for dropdown
	mineralTypeOptions: any[] // Array of mineral type options for dropdown
	contractStatusOptions: any[] // Array of contract status options for dropdown
	sponsoringStateOptions: any[] // Array of sponsoring state options for dropdown
	yearOptions: any[] // Array of year options for dropdown
	locationOptions: any[] // Array of location options for dropdown
	filters: any // Current filter values object
	debouncedSelectChange: (key: string, value: string) => void // Function to handle filter changes with debounce
	loading: boolean // Loading state to disable filters during data fetching
	t: any // Translation function from language context
}

// FilterOptions component that renders all filter dropdowns
const FilterOptions: React.FC<FilterOptionsProps> = ({
	contractorOptions,
	mineralTypeOptions,
	contractStatusOptions,
	sponsoringStateOptions,
	yearOptions,
	locationOptions,
	filters,
	debouncedSelectChange,
	loading,
	t,
}) => {
	return (
		<div className={styles.filtersGroup}>
			{' '}
			{/* Container for all filter dropdowns */}
			<h3>{t('map.filter.filterBy') || 'Filter By'}</h3> {/* Section heading with translation */}
			{/* Contractor filter dropdown */}
			<CustomDropdown
				id='contractorId' // Unique identifier
				label={t('map.filter.contractor') || 'Contractor Name'} // Label with translation
				options={contractorOptions} // Options array for dropdown
				value={filters.contractorId?.toString() || 'all'} // Current value (convert to string if exists, default to 'all')
				onChange={e => debouncedSelectChange('contractorId', e.target.value)} // onChange handler with debounce
				isActive={!!filters.contractorId} // Active state based on whether filter is set
				disabled={loading} // Disable during loading
			/>
			{/* Mineral Type filter dropdown */}
			<CustomDropdown
				id='mineralTypeId'
				label={t('map.filter.mineralType') || 'Mineral Type'} // Label with translation fallback
				options={mineralTypeOptions}
				value={filters.mineralTypeId?.toString() || 'all'}
				onChange={e => debouncedSelectChange('mineralTypeId', e.target.value)}
				isActive={!!filters.mineralTypeId}
				disabled={loading}
			/>
			{/* Contract Status filter dropdown */}
			<CustomDropdown
				id='contractStatusId'
				label={t('map.filter.contractStatus') || 'Contract Status'}
				options={contractStatusOptions}
				value={filters.contractStatusId?.toString() || 'all'}
				onChange={e => debouncedSelectChange('contractStatusId', e.target.value)}
				isActive={!!filters.contractStatusId}
				disabled={loading}
			/>
			{/* Sponsoring State filter dropdown */}
			<CustomDropdown
				id='sponsoringState'
				label={t('map.filter.sponsoringState') || 'Sponsoring State'}
				options={sponsoringStateOptions}
				value={filters.sponsoringState || 'all'}
				onChange={e => debouncedSelectChange('sponsoringState', e.target.value)}
				isActive={!!filters.sponsoringState}
				disabled={loading}
			/>
			{/* Contract Year filter dropdown */}
			<CustomDropdown
				id='year'
				label={t('map.filter.year') || 'Contract Year'}
				options={yearOptions}
				value={filters.year?.toString() || 'all'}
				onChange={e => debouncedSelectChange('year', e.target.value)}
				isActive={!!filters.year}
				disabled={loading}
			/>
			{/* Location filter dropdown */}
			<CustomDropdown
				id='locationId'
				label={t('map.filter.location') || 'Location'}
				options={locationOptions}
				value={filters.locationId || 'all'}
				onChange={e => debouncedSelectChange('locationId', e.target.value)}
				isActive={!!filters.locationId}
				disabled={loading}
			/>
		</div>
	)
}

export default FilterOptions
