import React, { useEffect, useState, useRef, useMemo } from 'react'
import { ChevronDown, X, Filter } from 'lucide-react'
import styles from '../../styles/samples/filter.module.css'
import { useLanguage } from '../../contexts/languageContext'

const SampleFilter = ({
	filters,
	setFilters,
	defaultFilters,
	visibleColumns,
	setVisibleColumns,
	filteredData = [],
}) => {
	const { t } = useLanguage()
	const [sampleTypes, setSampleTypes] = useState([])
	const [matrixTypes, setMatrixTypes] = useState([])
	const [habitatTypes, setHabitatTypes] = useState([])
	const [analyses, setAnalyses] = useState([])
	const [stationOptions, setStationOptions] = useState([])
	const [cruiseOptions, setCruiseOptions] = useState([])
	const [contractorOptions, setContractorOptions] = useState([])
	const [loading, setLoading] = useState(true)

	// Refs for dropdown functionality
	const dropdownRefs = useRef({})
	const [openDropdown, setOpenDropdown] = useState(null)

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

	// Calculate available options based on the filtered data
	const availableOptions = useMemo(() => {
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

		// Extract unique values from filtered data
		const uniqueSampleTypes = [...new Set(filteredData.map(item => item.sampleType).filter(Boolean))]
		const uniqueMatrixTypes = [...new Set(filteredData.map(item => item.matrixType).filter(Boolean))]
		const uniqueHabitatTypes = [...new Set(filteredData.map(item => item.habitatType).filter(Boolean))]
		const uniqueAnalyses = [...new Set(filteredData.map(item => item.analysis).filter(Boolean))]
		const uniqueStations = [...new Set(filteredData.map(item => item.stationCode).filter(Boolean))]
		const uniqueCruises = [...new Set(filteredData.map(item => item.cruiseName).filter(Boolean))]
		const uniqueContractors = [...new Set(filteredData.map(item => item.contractorName).filter(Boolean))]

		// Only show filtered options for filters that aren't current active
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
	])

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = event => {
			if (
				openDropdown &&
				dropdownRefs.current[openDropdown] &&
				!dropdownRefs.current[openDropdown].contains(event.target)
			) {
				setOpenDropdown(null)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [openDropdown])

	useEffect(() => {
		const fetchFilterOptions = async () => {
			setLoading(true)
			try {
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

				const sampleTypeData = await sampleTypeRes.json()
				const matrixTypeData = await matrixTypeRes.json()
				const habitatTypeData = await habitatTypeRes.json()
				const analysisData = await analysisRes.json()
				const stationData = await stationRes.json()
				const cruiseData = await cruiseRes.json()
				const contractorData = await contractorRes.json()

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
				setLoading(false)
			}
		}

		fetchFilterOptions()
	}, [])

	const handleFilterChange = e => {
		const { name, value } = e.target
		setFilters(prev => ({
			...prev,
			[name]: value,
		}))
	}

	const handleClearFilters = () => {
		setFilters(defaultFilters)
		setOpenDropdown(null)
	}

	const handleColumnToggle = e => {
		const { value, checked } = e.target
		if (checked) {
			setVisibleColumns(prev => [...prev, value])
		} else {
			setVisibleColumns(prev => prev.filter(col => col !== value))
		}
	}

	// Toggle dropdown visibility
	const toggleDropdown = name => {
		setOpenDropdown(openDropdown === name ? null : name)
	}

	// Select option from dropdown
	const selectOption = (name, value) => {
		setFilters(prev => ({
			...prev,
			[name]: value,
		}))
		setOpenDropdown(null)
	}

	// Get display value for dropdown
	const getDisplayValue = (name, value) => {
		if (value === 'all') {
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
		return value
	}

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
			<div className={styles.filterHeader}>
				<h2>
					<Filter size={16} className={styles.filterIcon} />
					{t('library.samples.filter.title') || 'Sample Filters'}
				</h2>
				<button className={styles.resetButton} onClick={handleClearFilters} type='button'>
					{t('library.samples.filter.reset') || 'Reset'}
				</button>
			</div>

			<div className={styles.filterContent}>
				<div className={styles.filtersGroup}>
					{/* Search Filter */}
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
								onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
								type='button'
								aria-label='Clear search'>
								<X size={14} />
							</button>
						)}
					</div>

					{/* Contractor Dropdown */}
					<label className={styles.filterLabel}>{t('library.samples.filter.contractor') || 'Contractor'}</label>
					<div className={styles.dropdownContainer} ref={el => (dropdownRefs.current['contractor'] = el)}>
						<button
							className={
								filters.contractor !== 'all' ? `${styles.customSelect} ${styles.hasSelection}` : styles.customSelect
							}
							onClick={() => toggleDropdown('contractor')}
							type='button'>
							<span className={styles.selectText}>{getDisplayValue('contractor', filters.contractor)}</span>
							<ChevronDown
								size={16}
								className={`${styles.selectIcon} ${openDropdown === 'contractor' ? styles.selectIconOpen : ''}`}
							/>
						</button>

						{openDropdown === 'contractor' && (
							<div className={styles.dropdownContent}>
								<div
									className={`${styles.dropdownOption} ${filters.contractor === 'all' ? styles.selectedOption : ''}`}
									onClick={() => selectOption('contractor', 'all')}>
									All Contractors
								</div>
								{availableOptions.contractors.map((option, index) => (
									<div
										key={index}
										className={`${styles.dropdownOption} ${filters.contractor === option ? styles.selectedOption : ''}`}
										onClick={() => selectOption('contractor', option)}>
										{option}
									</div>
								))}
							</div>
						)}
					</div>

					{/* Station Dropdown */}
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

					{/* Cruise Dropdown */}
					<label className={styles.filterLabel}>{t('library.samples.filter.station') || 'Station'}</label>
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

					{/* Sample Type Dropdown */}
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

					{/* Matrix Type Dropdown */}
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

					{/* Habitat Type Dropdown */}
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

					{/* Analysis Dropdown */}
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

			{/* Column Visibility Section */}
			<div className={styles.visibilitySection}>
				<div className={styles.visibilityHeader}>
					<span>{t('library.samples.filter.visibleColumns') || 'Visible Columns'}</span>
				</div>
				<div className={styles.columnsGrid}>
					{allColumnOptions.map(col => (
						<div key={col.key} className={styles.columnToggle}>
							<input
								type='checkbox'
								id={`col-${col.key}`}
								value={col.key}
								checked={visibleColumns.includes(col.key)}
								onChange={handleColumnToggle}
								className={styles.columnCheckbox}
							/>
							<label htmlFor={`col-${col.key}`} className={styles.columnLabel}>
								{col.label}
							</label>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default SampleFilter
