import React, { useEffect, useState, useRef, useMemo } from 'react' // Import React hooks
import { ChevronDown, X, Filter } from 'lucide-react' // Import Lucide icons
import styles from '../../styles/samples/filter.module.css' // Import CSS modules for styling
import { useLanguage } from '../../contexts/languageContext' // Import language context for translations

const SampleFilter = ({
	filters, // Current filter state
	setFilters, // Function to update filters
	defaultFilters, // Default filter values for reset
	visibleColumns, // Currently visible table columns
	setVisibleColumns, // Function to update visible columns
	filteredData = [], // Data after filtering (for calculating available options)
}) => {
	const { t } = useLanguage() // Get translation function from language context

	// State for filter options fetched from API
	const [sampleTypes, setSampleTypes] = useState([]) // Sample type options
	const [matrixTypes, setMatrixTypes] = useState([]) // Matrix type options
	const [habitatTypes, setHabitatTypes] = useState([]) // Habitat type options
	const [analyses, setAnalyses] = useState([]) // Analysis options
	const [stationOptions, setStationOptions] = useState([]) // Station options
	const [cruiseOptions, setCruiseOptions] = useState([]) // Cruise options
	const [contractorOptions, setContractorOptions] = useState([]) // Contractor options
	const [loading, setLoading] = useState(true) // Loading state for initial data fetch

	// Refs for dropdown functionality - tracks DOM elements for click outside detection
	const dropdownRefs = useRef({})
	const [openDropdown, setOpenDropdown] = useState(null) // Tracks which dropdown is currently open

	// Define all possible column options for the column visibility toggles
	const allColumnOptions = [
		{ key: 'sampleCode', label: 'Sample Code' },
		{ key: 'sampleType', label: 'Sample Type' },
		{ key: 'matrixType', label: 'Matrix Type' },
		{ key: 'habitatType', label: 'Habitat Type' },
		{ key: 'analysis', label: 'Analysis' },
		{ key: 'result', label: 'Result' },
		{ key: 'contractor', label: 'Contractor' },
		{ key: 'station', label: 'Station' },
		{ key: 'cruise', label: 'Cruise' },
		{ key: 'sampleDescription', label: 'Description' },
	]

	// Calculate available options based on the filtered data - memoized for performance
	const availableOptions = useMemo(() => {
		// If no filtered data, return all options
		if (!filteredData.length) {
			return {
				sampleTypes: sampleTypes,
				matrixTypes: matrixTypes,
				habitatTypes: habitatTypes,
				analyses: analyses,
				stations: stationOptions,
				cruises: cruiseOptions,
				contractors: contractorOptions,
			}
		}

		// Extract unique values from filtered data for each filter category
		const uniqueSampleTypes = [...new Set(filteredData.map(item => item.sampleType).filter(Boolean))]
		const uniqueMatrixTypes = [...new Set(filteredData.map(item => item.matrixType).filter(Boolean))]
		const uniqueHabitatTypes = [...new Set(filteredData.map(item => item.habitatType).filter(Boolean))]
		const uniqueAnalyses = [...new Set(filteredData.map(item => item.analysis).filter(Boolean))]
		const uniqueStations = [...new Set(filteredData.map(item => item.stationCode).filter(Boolean))]
		const uniqueCruises = [...new Set(filteredData.map(item => item.cruiseName).filter(Boolean))]
		const uniqueContractors = [...new Set(filteredData.map(item => item.contractorName).filter(Boolean))]

		// Only show filtered options for filters that aren't currently active
		// (Show all options for active filters, only remaining valid options for inactive filters)
		return {
			sampleTypes: filters.sampleType !== 'all' ? sampleTypes : uniqueSampleTypes,
			matrixTypes: filters.matrixType !== 'all' ? matrixTypes : uniqueMatrixTypes,
			habitatTypes: filters.habitatType !== 'all' ? habitatTypes : uniqueHabitatTypes,
			analyses: filters.analysis !== 'all' ? analyses : uniqueAnalyses,
			stations: filters.station !== 'all' ? stationOptions : uniqueStations,
			cruises: filters.cruise !== 'all' ? cruiseOptions : uniqueCruises,
			contractors: filters.contractor !== 'all' ? contractorOptions : uniqueContractors,
		}
	}, [
		filteredData,
		filters.sampleType,
		filters.matrixType,
		filters.habitatType,
		filters.analysis,
		filters.station,
		filters.cruise,
		filters.contractor,
		sampleTypes,
		matrixTypes,
		habitatTypes,
		analyses,
		stationOptions,
		cruiseOptions,
		contractorOptions,
	]) // Recalculate when any of these dependencies change

	// Close dropdown when clicking outside - click-outside detection
	useEffect(() => {
		const handleClickOutside = event => {
			if (
				openDropdown &&
				dropdownRefs.current[openDropdown] &&
				!dropdownRefs.current[openDropdown].contains(event.target)
			) {
				setOpenDropdown(null) // Close the open dropdown if clicked outside
			}
		}

		document.addEventListener('mousedown', handleClickOutside) // Add global click listener
		return () => {
			document.removeEventListener('mousedown', handleClickOutside) // Clean up on unmount
		}
	}, [openDropdown])

	// Fetch filter options from API endpoints on component mount
	useEffect(() => {
		const fetchFilterOptions = async () => {
			setLoading(true)
			try {
				// Parallel fetch of all filter options
				const [sampleTypeRes, matrixTypeRes, habitatTypeRes, analysisRes, stationRes, cruiseRes, contractorRes] =
					await Promise.all([
						fetch('http://localhost:5062/api/sample/sampletypes'),
						fetch('http://localhost:5062/api/sample/matrixtypes'),
						fetch('http://localhost:5062/api/sample/habitattypes'),
						fetch('http://localhost:5062/api/sample/analyses'),
						fetch('http://localhost:5062/api/sample/stations'),
						fetch('http://localhost:5062/api/sample/cruises'),
						fetch('http://localhost:5062/api/sample/contractors'),
					])

				// Parse JSON responses
				const sampleTypeData = await sampleTypeRes.json()
				const matrixTypeData = await matrixTypeRes.json()
				const habitatTypeData = await habitatTypeRes.json()
				const analysisData = await analysisRes.json()
				const stationData = await stationRes.json()
				const cruiseData = await cruiseRes.json()
				const contractorData = await contractorRes.json()

				// Update state with fetched options
				setSampleTypes(sampleTypeData.result || [])
				setMatrixTypes(matrixTypeData.result || [])
				setHabitatTypes(habitatTypeData.result || [])
				setAnalyses(analysisData.result || [])
				setStationOptions(stationData.result || [])
				setCruiseOptions(cruiseData.result || [])
				setContractorOptions(contractorData.result || [])
			} catch (error) {
				console.error('Error fetching filter options:', error)
			} finally {
				setLoading(false) // Mark loading as complete regardless of success/failure
			}
		}

		fetchFilterOptions()
	}, []) // Empty dependency array means this runs once on mount

	// Handle input filter changes (search input)
	const handleFilterChange = e => {
		const { name, value } = e.target
		setFilters(prev => ({
			...prev,
			[name]: value, // Update the specific filter value
		}))
	}

	// Reset all filters to default values
	const handleClearFilters = () => {
		setFilters(defaultFilters) // Reset to default filter values
		setOpenDropdown(null) // Close any open dropdown
	}

	// Handle column visibility toggle
	const handleColumnToggle = e => {
		const { value, checked } = e.target
		if (checked) {
			setVisibleColumns(prev => [...prev, value]) // Add column to visible list
		} else {
			setVisibleColumns(prev => prev.filter(col => col !== value)) // Remove column from visible list
		}
	}

	// Toggle dropdown open/closed state
	const toggleDropdown = name => {
		setOpenDropdown(openDropdown === name ? null : name) // Toggle - close if already open, open if closed
	}

	// Select option from dropdown
	const selectOption = (name, value) => {
		setFilters(prev => ({
			...prev,
			[name]: value, // Update the specific filter value
		}))
		setOpenDropdown(null) // Close the dropdown after selection
	}

	// Get display value for dropdown based on selected filter value
	const getDisplayValue = (name, value) => {
		if (value === 'all') {
			// Return appropriate "All X" text for different filter types
			switch (name) {
				case 'contractor':
					return t('library.samples.filter.allContractors') || 'All Contractors'
				case 'station':
					return t('library.samples.filter.allStations') || 'All Stations'
				case 'cruise':
					return t('library.samples.filter.allCruises') || 'All Cruises'
				case 'sampleType':
					return t('library.samples.filter.allSampleTypes') || 'All Sample Types'
				case 'matrixType':
					return t('library.samples.filter.allMatrixTypes') || 'All Matrix Types'
				case 'habitatType':
					return t('library.samples.filter.allHabitatTypes') || 'All Habitat Types'
				case 'analysis':
					return t('library.samples.filter.allAnalyses') || 'All Analyses'
				default:
					return t('library.samples.filter.all') || 'All'
			}
		}
		return value // Return the actual value if not "all"
	}

	// Show loading state while fetching initial options
	if (loading) {
		return (
			<div className={styles.filterContainer}>
				<div className={styles.loadingContainer}>
					<span className={styles.loadingText}>{t('library.samples.filter.loading') || 'Loading filters...'}</span>
				</div>
			</div>
		)
	}

	return (
		<div className={styles.filterContainer}>
			{' '}
			{/* Main filter container */}
			<div className={styles.filterHeader}>
				{' '}
				{/* Filter header with title and reset button */}
				<h2>
					<Filter size={16} className={styles.filterIcon} />
					{t('library.samples.filter.title') || 'Sample Filters'}
				</h2>
				<button className={styles.resetButton} onClick={handleClearFilters} type='button'>
					{t('library.samples.filter.reset') || 'Reset'} {/* Reset button */}
				</button>
			</div>
			<div className={styles.filterContent}>
				{' '}
				{/* Main filter content area */}
				<div className={styles.filtersGroup}>
					{/* Search Filter - text input for free text search */}
					<label className={styles.filterLabel}>{t('library.samples.filter.search') || 'Search'}</label>
					<div className={styles.searchInputContainer}>
						<input
							type='text'
							name='searchQuery'
							value={filters.searchQuery || ''}
							onChange={handleFilterChange}
							placeholder={t('library.samples.filter.searchPlaceholder') || 'Search sample code...'}
							className={filters.searchQuery ? `${styles.searchInput} ${styles.hasValue}` : styles.searchInput}
						/>
						{filters.searchQuery && (
							<button
								className={styles.clearSearchButton}
								onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))} // Clear search text
								type='button'
								aria-label='Clear search'>
								<X size={14} /> {/* X icon for clear button */}
							</button>
						)}
					</div>
					{/* Contractor Dropdown - custom dropdown implementation */}
					<label className={styles.filterLabel}>{t('library.samples.filter.contractor') || 'Contractor'}</label>
					<div className={styles.dropdownContainer} ref={el => (dropdownRefs.current['contractor'] = el)}>
						{' '}
						{/* Reference for click detection */}
						<button
							className={
								filters.contractor !== 'all' ? `${styles.customSelect} ${styles.hasSelection}` : styles.customSelect
							} // Apply active styling if filter is set
							onClick={() => toggleDropdown('contractor')}
							type='button'>
							<span className={styles.selectText}>{getDisplayValue('contractor', filters.contractor)}</span>{' '}
							{/* Display selected value */}
							<ChevronDown
								size={16}
								className={`${styles.selectIcon} ${openDropdown === 'contractor' ? styles.selectIconOpen : ''}`}
							/>{' '}
							{/* Dropdown arrow that rotates when open */}
						</button>
						{/* Dropdown options menu - only shown when dropdown is open */}
						{openDropdown === 'contractor' && (
							<div className={styles.dropdownContent}>
								<div
									className={`${styles.dropdownOption} ${filters.contractor === 'all' ? styles.selectedOption : ''}`}
									onClick={() => selectOption('contractor', 'all')}>
									All Contractors {/* "All" option */}
								</div>
								{availableOptions.contractors.map((option, index) => (
									<div
										key={index}
										className={`${styles.dropdownOption} ${filters.contractor === option ? styles.selectedOption : ''}`}
										onClick={() => selectOption('contractor', option)}>
										{option} {/* Individual contractor options */}
									</div>
								))}
							</div>
						)}
					</div>
					{/* Station Dropdown - similar structure to contractor dropdown */}
					<label className={styles.filterLabel}>{t('library.samples.filter.station') || 'Station'}</label>
					<div className={styles.dropdownContainer} ref={el => (dropdownRefs.current['station'] = el)}>
						<button
							className={
								filters.station !== 'all' ? `${styles.customSelect} ${styles.hasSelection}` : styles.customSelect
							}
							onClick={() => toggleDropdown('station')}
							type='button'>
							<span className={styles.selectText}>{getDisplayValue('station', filters.station)}</span>
							<ChevronDown
								size={16}
								className={`${styles.selectIcon} ${openDropdown === 'station' ? styles.selectIconOpen : ''}`}
							/>
						</button>

						{openDropdown === 'station' && (
							<div className={styles.dropdownContent}>
								<div
									className={`${styles.dropdownOption} ${filters.station === 'all' ? styles.selectedOption : ''}`}
									onClick={() => selectOption('station', 'all')}>
									All Stations
								</div>
								{availableOptions.stations.map((option, index) => (
									<div
										key={index}
										className={`${styles.dropdownOption} ${filters.station === option ? styles.selectedOption : ''}`}
										onClick={() => selectOption('station', option)}>
										{option}
									</div>
								))}
							</div>
						)}
					</div>
					{/* Cruise Dropdown - similar structure to previous dropdowns */}
					<label className={styles.filterLabel}>{t('library.samples.filter.station') || 'Station'}</label>{' '}
					{/* Note: Label might need correction - currently shows "Station" for Cruise */}
					<div className={styles.dropdownContainer} ref={el => (dropdownRefs.current['cruise'] = el)}>
						<button
							className={
								filters.cruise !== 'all' ? `${styles.customSelect} ${styles.hasSelection}` : styles.customSelect
							}
							onClick={() => toggleDropdown('cruise')}
							type='button'>
							<span className={styles.selectText}>{getDisplayValue('cruise', filters.cruise)}</span>
							<ChevronDown
								size={16}
								className={`${styles.selectIcon} ${openDropdown === 'cruise' ? styles.selectIconOpen : ''}`}
							/>
						</button>

						{openDropdown === 'cruise' && (
							<div className={styles.dropdownContent}>
								<div
									className={`${styles.dropdownOption} ${filters.cruise === 'all' ? styles.selectedOption : ''}`}
									onClick={() => selectOption('cruise', 'all')}>
									All Cruises
								</div>
								{availableOptions.cruises.map((option, index) => (
									<div
										key={index}
										className={`${styles.dropdownOption} ${filters.cruise === option ? styles.selectedOption : ''}`}
										onClick={() => selectOption('cruise', option)}>
										{option}
									</div>
								))}
							</div>
						)}
					</div>
					{/* Sample Type Dropdown - similar structure to previous dropdowns */}
					<label className={styles.filterLabel}>{t('library.samples.filter.sampleType') || 'Sample Type'}</label>
					<div className={styles.dropdownContainer} ref={el => (dropdownRefs.current['sampleType'] = el)}>
						<button
							className={
								filters.sampleType !== 'all' ? `${styles.customSelect} ${styles.hasSelection}` : styles.customSelect
							}
							onClick={() => toggleDropdown('sampleType')}
							type='button'>
							<span className={styles.selectText}>{getDisplayValue('sampleType', filters.sampleType)}</span>
							<ChevronDown
								size={16}
								className={`${styles.selectIcon} ${openDropdown === 'sampleType' ? styles.selectIconOpen : ''}`}
							/>
						</button>

						{openDropdown === 'sampleType' && (
							<div className={styles.dropdownContent}>
								<div
									className={`${styles.dropdownOption} ${filters.sampleType === 'all' ? styles.selectedOption : ''}`}
									onClick={() => selectOption('sampleType', 'all')}>
									All Sample Types
								</div>
								{availableOptions.sampleTypes.map((option, index) => (
									<div
										key={index}
										className={`${styles.dropdownOption} ${filters.sampleType === option ? styles.selectedOption : ''}`}
										onClick={() => selectOption('sampleType', option)}>
										{option}
									</div>
								))}
							</div>
						)}
					</div>
					{/* Matrix Type Dropdown - similar structure to previous dropdowns */}
					<label className={styles.filterLabel}>{t('library.samples.filter.matrixType') || 'Matrix Type'}</label>
					<div className={styles.dropdownContainer} ref={el => (dropdownRefs.current['matrixType'] = el)}>
						<button
							className={
								filters.matrixType !== 'all' ? `${styles.customSelect} ${styles.hasSelection}` : styles.customSelect
							}
							onClick={() => toggleDropdown('matrixType')}
							type='button'>
							<span className={styles.selectText}>{getDisplayValue('matrixType', filters.matrixType)}</span>
							<ChevronDown
								size={16}
								className={`${styles.selectIcon} ${openDropdown === 'matrixType' ? styles.selectIconOpen : ''}`}
							/>
						</button>

						{openDropdown === 'matrixType' && (
							<div className={styles.dropdownContent}>
								<div
									className={`${styles.dropdownOption} ${filters.matrixType === 'all' ? styles.selectedOption : ''}`}
									onClick={() => selectOption('matrixType', 'all')}>
									All Matrix Types
								</div>
								{availableOptions.matrixTypes.map((option, index) => (
									<div
										key={index}
										className={`${styles.dropdownOption} ${filters.matrixType === option ? styles.selectedOption : ''}`}
										onClick={() => selectOption('matrixType', option)}>
										{option}
									</div>
								))}
							</div>
						)}
					</div>
					{/* Habitat Type Dropdown - similar structure to previous dropdowns */}
					<label className={styles.filterLabel}>{t('library.samples.filter.habitatType') || 'Habitat Type'}</label>
					<div className={styles.dropdownContainer} ref={el => (dropdownRefs.current['habitatType'] = el)}>
						<button
							className={
								filters.habitatType !== 'all' ? `${styles.customSelect} ${styles.hasSelection}` : styles.customSelect
							}
							onClick={() => toggleDropdown('habitatType')}
							type='button'>
							<span className={styles.selectText}>{getDisplayValue('habitatType', filters.habitatType)}</span>
							<ChevronDown
								size={16}
								className={`${styles.selectIcon} ${openDropdown === 'habitatType' ? styles.selectIconOpen : ''}`}
							/>
						</button>

						{openDropdown === 'habitatType' && (
							<div className={styles.dropdownContent}>
								<div
									className={`${styles.dropdownOption} ${filters.habitatType === 'all' ? styles.selectedOption : ''}`}
									onClick={() => selectOption('habitatType', 'all')}>
									All Habitat Types
								</div>
								{availableOptions.habitatTypes.map((option, index) => (
									<div
										key={index}
										className={`${styles.dropdownOption} ${
											filters.habitatType === option ? styles.selectedOption : ''
										}`}
										onClick={() => selectOption('habitatType', option)}>
										{option}
									</div>
								))}
							</div>
						)}
					</div>
					{/* Analysis Dropdown - similar structure to previous dropdowns */}
					<label className={styles.filterLabel}>{t('library.samples.filter.analysis') || 'Analysis'}</label>
					<div className={styles.dropdownContainer} ref={el => (dropdownRefs.current['analysis'] = el)}>
						<button
							className={
								filters.analysis !== 'all' ? `${styles.customSelect} ${styles.hasSelection}` : styles.customSelect
							}
							onClick={() => toggleDropdown('analysis')}
							type='button'>
							<span className={styles.selectText}>{getDisplayValue('analysis', filters.analysis)}</span>
							<ChevronDown
								size={16}
								className={`${styles.selectIcon} ${openDropdown === 'analysis' ? styles.selectIconOpen : ''}`}
							/>
						</button>

						{openDropdown === 'analysis' && (
							<div className={styles.dropdownContent}>
								<div
									className={`${styles.dropdownOption} ${filters.analysis === 'all' ? styles.selectedOption : ''}`}
									onClick={() => selectOption('analysis', 'all')}>
									All Analyses
								</div>
								{availableOptions.analyses.map((option, index) => (
									<div
										key={index}
										className={`${styles.dropdownOption} ${filters.analysis === option ? styles.selectedOption : ''}`}
										onClick={() => selectOption('analysis', option)}>
										{option}
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
			{/* Column Visibility Section - allows toggling which columns are shown in the table */}
			<div className={styles.visibilitySection}>
				<div className={styles.visibilityHeader}>
					<span>{t('library.samples.filter.visibleColumns') || 'Visible Columns'}</span>
				</div>
				<div className={styles.columnsGrid}>
					{' '}
					{/* Grid layout for column checkboxes */}
					{allColumnOptions.map(col => (
						<div key={col.key} className={styles.columnToggle}>
							<input
								type='checkbox'
								id={`col-${col.key}`}
								value={col.key}
								checked={visibleColumns.includes(col.key)} // Checked if column is in visible columns array
								onChange={handleColumnToggle} // Handle checkbox toggle
								className={styles.columnCheckbox}
							/>
							<label htmlFor={`col-${col.key}`} className={styles.columnLabel}>
								{col.label} {/* Column display name */}
							</label>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default SampleFilter
