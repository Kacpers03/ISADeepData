import React, { useEffect, useState, useCallback, useMemo } from 'react' // Imports React and necessary hooks
import styles from '../../styles/files/reports.module.css' // Imports main styling
import dropdownStyles from '../../styles/files/dropdown.module.css' // Imports dropdown-specific styling
import { useLanguage } from '../../contexts/languageContext' // Imports language context for translations

// Interface defining the props for the FileFilter component
interface FileFilterProps {
	filters: {
		contractor: string
		country: string
		year: string
		theme: string
		searchQuery: string
	} // Current filter state
	onFilterChange: (filterName: string, value: string) => void // Handler when a filter changes
	onResetFilters: () => void // Handler to reset all filters
	contractors: { id: number; name: string }[] // Available contractor options
	countries: string[] // Available country options
	years: string[] // Available year options
	themes: string[] // Available theme options
	currentFilteredItems: any[] // Currently filtered items to calculate available options
}

// Utility function to debounce filter changes to prevent excessive re-renders
const debounce = (func: Function, wait: number) => {
	let timeout: NodeJS.Timeout
	return (...args: any[]) => {
		clearTimeout(timeout)
		timeout = setTimeout(() => func(...args), wait)
	}
}

const FileFilter: React.FC<FileFilterProps> = ({
	filters,
	onFilterChange,
	onResetFilters,
	contractors,
	countries,
	years,
	themes,
	currentFilteredItems,
}) => {
	const { t } = useLanguage() // Get translation function
	const [searchQuery, setSearchQuery] = useState(filters.searchQuery) // Local state for search input
	const [activeDropdown, setActiveDropdown] = useState<string | null>(null) // Track which dropdown is currently open

	// Effect to close dropdowns when clicking outside of them
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const targetElement = event.target as Element
			if (!targetElement.closest(`.${dropdownStyles.customSelectWrapper}`)) {
				setActiveDropdown(null) // Close all dropdowns if click is outside
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside) // Clean up on unmount
		}
	}, [])

	// Calculate available filter options based on currently filtered items
	// This creates dynamic filtering where options in one dropdown are filtered based on selections in others
	const availableOptions = useMemo(() => {
		if (!currentFilteredItems.length) {
			return {
				contractors: contractors.map(c => c.name),
				countries: countries,
				years: years,
				themes: themes,
			} // If no items, return all options
		}

		// Extract unique values from filtered items for each filter type
		const uniqueContractors = [...new Set(currentFilteredItems.map(item => item.contractor).filter(Boolean))]
		const uniqueCountries = [...new Set(currentFilteredItems.map(item => item.country).filter(Boolean))]
		const uniqueYears = [...new Set(currentFilteredItems.map(item => item.year?.toString()).filter(Boolean))]
		const uniqueThemes = [...new Set(currentFilteredItems.map(item => item.theme).filter(Boolean))]

		// Only show filtered options for filters that aren't currently active
		return {
			contractors: filters.contractor !== 'all' ? contractors.map(c => c.name) : uniqueContractors,
			countries: filters.country !== 'all' ? countries : uniqueCountries,
			years: filters.year !== 'all' ? years : uniqueYears,
			themes: filters.theme !== 'all' ? themes : uniqueThemes,
		}
	}, [
		currentFilteredItems,
		filters.contractor,
		filters.country,
		filters.year,
		filters.theme,
		contractors,
		countries,
		years,
		themes,
	])

	// Handle search input changes with local state
	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const query = e.target.value
		setSearchQuery(query)
		debouncedFilterChange('searchQuery', query) // Debounce to prevent rapid re-filtering
	}

	// Debounced filter change handler to prevent excessive updates
	const debouncedFilterChange = useCallback(
		debounce((key: string, value: string) => {
			onFilterChange(key, value)
		}, 300),
		[onFilterChange]
	)

	// Count how many filters are currently active (for reset button)
	const countActiveFilters = () => {
		let count = 0
		if (filters.contractor !== 'all') count++
		if (filters.country !== 'all') count++
		if (filters.year !== 'all') count++
		if (filters.theme !== 'all') count++
		if (filters.searchQuery.trim() !== '') count++
		return count
	}

	// Handler for toggling dropdowns open/closed
	const handleDropdownToggle = (id: string) => {
		setActiveDropdown(activeDropdown === id ? null : id) // Toggle current dropdown or close if already open
	}

	// Get display value for a dropdown based on filter name and current value
	const getDisplayValue = (name: string, value: string) => {
		if (value === 'all') {
			switch (name) {
				case 'contractor':
					return t('library.filter.allContractors') || 'All Contractors'
				case 'country':
					return t('library.filter.allCountries') || 'All Countries'
				case 'year':
					return t('library.filter.allYears') || 'All Years'
				case 'theme':
					return t('library.filter.allThemes') || 'All Themes'
				default:
					return t('library.filter.all') || 'All'
			}
		}
		return value // Return actual value if not 'all'
	}

	return (
		<div className={styles.filterContainer} style={{ overflow: 'visible' }}>
			{' '}
			{/* Main container with visible overflow for dropdowns */}
			<div className={dropdownStyles.improvedFilterPanel}>
				{' '}
				{/* Styled filter panel */}
				<div className={dropdownStyles.filterContent}>
					{' '}
					{/* Content container */}
					<div className={dropdownStyles.filterHeader}>
						{' '}
						{/* Header with title and reset button */}
						<h2>{t('library.filter.title') || 'File Filters'}</h2>
						{countActiveFilters() > 0 && (
							<button className={dropdownStyles.resetButton} onClick={onResetFilters}>
								{t('library.filter.reset') || 'Reset'} ({countActiveFilters()}){' '}
								{/* Reset button showing count of active filters */}
							</button>
						)}
					</div>
					<div className={dropdownStyles.searchContainer}>
						{' '}
						{/* Search input container */}
						<div className={dropdownStyles.searchInputWrapper}>
							<input
								type='text'
								placeholder={t('library.filter.searchPlaceholder') || 'Search files...'}
								value={searchQuery}
								onChange={handleSearchChange}
								className={dropdownStyles.searchInput}
							/>
							<button
								onClick={() => onFilterChange('searchQuery', searchQuery)}
								className={dropdownStyles.searchButton}
								aria-label='Search'>
								🔍 {/* Search button with magnifying glass icon */}
							</button>
						</div>
					</div>
					<div className={dropdownStyles.filtersGroup}>
						{' '}
						{/* Container for all filter dropdowns */}
						<h3>{t('library.filter.filterBy') || 'Filter By'}</h3>
						{/* Contractor filter dropdown */}
						<div className={dropdownStyles.customSelectWrapper}>
							<label className={dropdownStyles.filterLabel}>{t('library.filter.contractor') || 'Contractor'}</label>
							<div
								className={`${dropdownStyles.customSelect} ${
									filters.contractor !== 'all' ? dropdownStyles.activeFilter : ''
								}`} // Highlight if filter is active
								onClick={() => handleDropdownToggle('contractor')}>
								<span title={getDisplayValue('contractor', filters.contractor)}>
									{getDisplayValue('contractor', filters.contractor)} {/* Display current selection */}
								</span>
								<span
									className={`${dropdownStyles.selectArrow} ${
										activeDropdown === 'contractor' ? dropdownStyles.up : ''
									}`}>
									{' '}
									{/* Arrow that rotates when open */}▼
								</span>
							</div>

							{/* Dropdown options - only shown when this dropdown is active */}
							{activeDropdown === 'contractor' && (
								<div className={dropdownStyles.optionsList}>
									<div
										className={`${dropdownStyles.optionItem} ${
											filters.contractor === 'all' ? dropdownStyles.selected : ''
										}`}
										onClick={() => {
											onFilterChange('contractor', 'all')
											setActiveDropdown(null)
										}}>
										{t('library.filter.allContractors') || 'All Contractors'} 
										{filters.contractor === 'all' && <span className={dropdownStyles.selectedCheck}>✓</span>}
									</div>
									{availableOptions.contractors.map(option => (
										<div
											key={option}
											className={`${dropdownStyles.optionItem} ${
												option === filters.contractor ? dropdownStyles.selected : ''
											}`}
											onClick={() => {
												onFilterChange('contractor', option)
												setActiveDropdown(null)
											}}>
											{option} {/* Individual contractor options */}
											{option === filters.contractor && <span className={dropdownStyles.selectedCheck}>✓</span>}
										</div>
									))}
								</div>
							)}
						</div>
						{/* Country filter dropdown - structure follows same pattern as contractor */}
						<div className={dropdownStyles.customSelectWrapper}>
							<label className={dropdownStyles.filterLabel}>{t('library.filter.country') || 'Country'}</label>
							<div
								className={`${dropdownStyles.customSelect} ${
									filters.country !== 'all' ? dropdownStyles.activeFilter : ''
								}`}
								onClick={() => handleDropdownToggle('country')}>
								<span title={getDisplayValue('country', filters.country)}>
									{getDisplayValue('country', filters.country)}
								</span>
								<span
									className={`${dropdownStyles.selectArrow} ${activeDropdown === 'country' ? dropdownStyles.up : ''}`}>
									▼
								</span>
							</div>

							{activeDropdown === 'country' && (
								<div className={dropdownStyles.optionsList}>
									<div
										className={`${dropdownStyles.optionItem} ${
											filters.country === 'all' ? dropdownStyles.selected : ''
										}`}
										onClick={() => {
											onFilterChange('country', 'all')
											setActiveDropdown(null)
										}}>
										{t('library.filter.allCountries') || 'All Countries'}
										{filters.country === 'all' && <span className={dropdownStyles.selectedCheck}>✓</span>}
									</div>
									{availableOptions.countries.map(option => (
										<div
											key={option}
											className={`${dropdownStyles.optionItem} ${
												option === filters.country ? dropdownStyles.selected : ''
											}`}
											onClick={() => {
												onFilterChange('country', option)
												setActiveDropdown(null)
											}}>
											{option}
											{option === filters.country && <span className={dropdownStyles.selectedCheck}>✓</span>}
										</div>
									))}
								</div>
							)}
						</div>
						{/* Year filter dropdown - structure follows same pattern */}
						<div className={dropdownStyles.customSelectWrapper}>
							<label className={dropdownStyles.filterLabel}>{t('library.filter.year') || 'Year'}</label>
							<div
								className={`${dropdownStyles.customSelect} ${
									filters.year !== 'all' ? dropdownStyles.activeFilter : ''
								}`}
								onClick={() => handleDropdownToggle('year')}>
								<span title={getDisplayValue('year', filters.year)}>{getDisplayValue('year', filters.year)}</span>
								<span className={`${dropdownStyles.selectArrow} ${activeDropdown === 'year' ? dropdownStyles.up : ''}`}>
									▼
								</span>
							</div>

							{activeDropdown === 'year' && (
								<div className={dropdownStyles.optionsList}>
									<div
										className={`${dropdownStyles.optionItem} ${filters.year === 'all' ? dropdownStyles.selected : ''}`}
										onClick={() => {
											onFilterChange('year', 'all')
											setActiveDropdown(null)
										}}>
										{t('library.filter.allYears') || 'All Years'}
										{filters.year === 'all' && <span className={dropdownStyles.selectedCheck}>✓</span>}
									</div>
									{availableOptions.years.map(option => (
										<div
											key={option}
											className={`${dropdownStyles.optionItem} ${
												option === filters.year ? dropdownStyles.selected : ''
											}`}
											onClick={() => {
												onFilterChange('year', option)
												setActiveDropdown(null)
											}}>
											{option}
											{option === filters.year && <span className={dropdownStyles.selectedCheck}>✓</span>}
										</div>
									))}
								</div>
							)}
						</div>
						{/* Theme filter dropdown - structure follows same pattern */}
						<div className={dropdownStyles.customSelectWrapper}>
							<label className={dropdownStyles.filterLabel}>{t('library.filter.theme') || 'Theme'}</label>
							<div
								className={`${dropdownStyles.customSelect} ${
									filters.theme !== 'all' ? dropdownStyles.activeFilter : ''
								}`}
								onClick={() => handleDropdownToggle('theme')}>
								<span title={getDisplayValue('theme', filters.theme)}>{getDisplayValue('theme', filters.theme)}</span>
								<span
									className={`${dropdownStyles.selectArrow} ${activeDropdown === 'theme' ? dropdownStyles.up : ''}`}>
									▼
								</span>
							</div>

							{activeDropdown === 'theme' && (
								<div className={dropdownStyles.optionsList}>
									<div
										className={`${dropdownStyles.optionItem} ${filters.theme === 'all' ? dropdownStyles.selected : ''}`}
										onClick={() => {
											onFilterChange('theme', 'all')
											setActiveDropdown(null)
										}}>
										{t('library.filter.allThemes') || 'All Themes'}
										{filters.theme === 'all' && <span className={dropdownStyles.selectedCheck}>✓</span>}
									</div>
									{availableOptions.themes.map(option => (
										<div
											key={option}
											className={`${dropdownStyles.optionItem} ${
												option === filters.theme ? dropdownStyles.selected : ''
											}`}
											onClick={() => {
												onFilterChange('theme', option)
												setActiveDropdown(null)
											}}>
											{option}
											{option === filters.theme && <span className={dropdownStyles.selectedCheck}>✓</span>}
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
				{/* Results counter - shows how many items match current filters */}
				<div className={dropdownStyles.resultsInfo}>
					<span>
						{currentFilteredItems.length} {t('library.filter.itemsMatch') || 'items match your filters'}
					</span>
				</div>
			</div>
		</div>
	)
}

export default FileFilter
