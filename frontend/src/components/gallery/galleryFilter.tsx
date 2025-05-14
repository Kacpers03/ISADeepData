import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react' // Import React hooks
import { CustomDropdown } from '../map/filters/CustomDropdown' // Import custom dropdown component
import styles from '../../styles/gallery/gallery.module.css' // Import gallery-specific styles
import mapStyles from '../../styles/map/filter.module.css' // Import map filter styles for reuse
import { useLanguage } from '../../contexts/languageContext' // Import language context for translations

// Define the component props interface
interface GalleryFilterProps {
	filters: {
		mediaType: string // Type of media (image, video, all)
		contractorId: string // Selected contractor ID
		cruiseId: string // Selected cruise ID
		stationId: string // Selected station ID
		year: string // Selected year
		searchQuery: string // Text search query
	}
	onFilterChange: (filterName: string, value: string) => void // Callback for filter changes
	onResetFilters: () => void // Callback to reset all filters
	contractors: { id: number; name: string }[] // Available contractors list
	cruises: { id: number; name: string }[] // Available cruises list
	stations: { id: number; code: string }[] // Available stations list
	years: string[] // Available years list
	currentFilteredItems: any[] // Array of currently filtered media items
}

// Create a simple debounce function instead of importing from lodash
// This delays execution of a function until after a specified wait time
const debounce = (func: Function, wait: number) => {
	let timeout: NodeJS.Timeout
	return function executedFunction(...args: any[]) {
		const later = () => {
			clearTimeout(timeout)
			func(...args)
		}
		clearTimeout(timeout)
		timeout = setTimeout(later, wait)
	}
}

const GalleryFilter: React.FC<GalleryFilterProps> = ({
	filters,
	onFilterChange,
	onResetFilters,
	contractors,
	cruises,
	stations,
	years,
	currentFilteredItems,
}) => {
	const { t } = useLanguage() // Use the language context for translations
	const [isCollapsed, setIsCollapsed] = useState(false) // Track if filter panel is collapsed
	const [isDownloading, setIsDownloading] = useState(false) // Track if CSV download is in progress
	const [searchQuery, setSearchQuery] = useState(filters.searchQuery) // Local state for search input
	const [showResults, setShowResults] = useState(false) // Track if search results dropdown is visible
	const [searchResults, setSearchResults] = useState<any[]>([]) // Store search results

	// Refs for managing DOM access and interactions
	const searchInputRef = useRef<HTMLInputElement>(null) // Reference to search input element
	const resultsRef = useRef<HTMLDivElement>(null) // Reference to search results dropdown

	// Calculate available options based on the current filtered items - memoized for performance
	const availableOptions = useMemo(() => {
		// If no filtered items, return all options
		if (!currentFilteredItems.length) {
			return {
				mediaTypes: ['image', 'video'],
				contractors: contractors,
				cruises: cruises,
				stations: stations,
				years: years,
			}
		}

		// Check which media types exist in the filtered data
		const hasImages = currentFilteredItems.some(
			item => !item.mediaType?.toLowerCase().includes('video') && !item.fileName.match(/\.(mp4|webm|avi|mov|wmv|flv)$/i)
		)

		const hasVideos = currentFilteredItems.some(
			item => item.mediaType?.toLowerCase().includes('video') || item.fileName.match(/\.(mp4|webm|avi|mov|wmv|flv)$/i)
		)

		// Available media types based on filtered data
		const availableMediaTypes = []
		if (hasImages) availableMediaTypes.push('image')
		if (hasVideos) availableMediaTypes.push('video')

		// Extract unique values from filtered items for each filter type
		const uniqueContractorIds = new Set(
			currentFilteredItems.map(item => item.contractorId).filter(id => id !== null && id !== undefined)
		)

		const uniqueCruiseIds = new Set(
			currentFilteredItems.map(item => item.cruiseId).filter(id => id !== null && id !== undefined)
		)

		const uniqueStationIds = new Set(
			currentFilteredItems.map(item => item.stationId).filter(id => id !== null && id !== undefined)
		)

		const uniqueYears = new Set(
			currentFilteredItems
				.map(item => {
					if (item.captureDate) {
						return new Date(item.captureDate).getFullYear().toString()
					}
					return null
				})
				.filter(year => year !== null)
		)

		// Return filtered options - only show options that exist in the filtered data
		// If a filter is active (not 'all'), still show all options for that filter type
		return {
			mediaTypes: filters.mediaType !== 'all' ? ['image', 'video'] : availableMediaTypes,

			contractors:
				filters.contractorId !== 'all' ? contractors : contractors.filter(c => uniqueContractorIds.has(c.id)),

			cruises: filters.cruiseId !== 'all' ? cruises : cruises.filter(c => uniqueCruiseIds.has(c.id)),

			stations: filters.stationId !== 'all' ? stations : stations.filter(s => uniqueStationIds.has(s.id)),

			years: filters.year !== 'all' ? years : years.filter(y => uniqueYears.has(y)),
		}
	}, [
		filters.mediaType,
		filters.contractorId,
		filters.cruiseId,
		filters.stationId,
		filters.year,
		currentFilteredItems,
		contractors,
		cruises,
		stations,
		years,
	]) // Recalculate when any of these dependencies change

	// Handle click outside search results - close results dropdown when clicking elsewhere
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (resultsRef.current && !resultsRef.current.contains(event.target as Node)) {
				setShowResults(false) // Close search results dropdown
			}
		}

		document.addEventListener('mousedown', handleClickOutside) // Add global click listener
		return () => {
			document.removeEventListener('mousedown', handleClickOutside) // Clean up on unmount
		}
	}, [])

	// Handle search input change with debounce to avoid excessive searches while typing
	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value) // Update local state immediately for UI

		if (e.target.value.trim() === '') {
			// Clear results and filters if search is empty
			setSearchResults([])
			setShowResults(false)
			onFilterChange('searchQuery', '')
		} else {
			// Debounce the search to avoid excessive searches while typing
			debouncedSearch(e.target.value)
		}
	}

	// Perform search on the filtered items
	const performSearch = useCallback(
		(query: string) => {
			if (query.trim() === '') {
				// Clear results if search is empty
				setSearchResults([])
				setShowResults(false)
				return
			}

			const lowercaseQuery = query.toLowerCase() // Case-insensitive search

			// Search through currentFilteredItems for matches
			const results = currentFilteredItems
				.filter(
					item =>
						item.fileName.toLowerCase().includes(lowercaseQuery) ||
						(item.description && item.description.toLowerCase().includes(lowercaseQuery)) ||
						(item.stationCode && item.stationCode.toLowerCase().includes(lowercaseQuery)) ||
						(item.contractorName && item.contractorName.toLowerCase().includes(lowercaseQuery)) ||
						(item.cruiseName && item.cruiseName.toLowerCase().includes(lowercaseQuery))
				)
				.slice(0, 10) // Limit to 10 results for performance and usability

			setSearchResults(results) // Update search results state
			setShowResults(results.length > 0) // Show dropdown if there are results
			onFilterChange('searchQuery', query) // Update parent component's filter state
		},
		[currentFilteredItems, onFilterChange]
	)

	// Create debounced version of the search function - memoized to avoid recreation
	const debouncedSearch = useCallback(
		debounce((query: string) => {
			performSearch(query)
		}, 300), // 300ms delay
		[performSearch]
	)

	// Handle Enter key press in search input - immediately perform search
	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			performSearch(searchQuery)
		}
	}

	// Count active filters for displaying count in reset button
	const countActiveFilters = () => {
		let count = 0
		if (filters.mediaType !== 'all') count++
		if (filters.contractorId !== 'all') count++
		if (filters.cruiseId !== 'all') count++
		if (filters.stationId !== 'all') count++
		if (filters.year !== 'all') count++
		if (filters.searchQuery.trim() !== '') count++
		return count
	}

	const activeFiltersCount = countActiveFilters() // Calculate active filters count

	// Debounced filter change handler to prevent rapid updates
	const debouncedFilterChange = useCallback(
		debounce((key: string, value: string) => {
			onFilterChange(key, value)
		}, 300),
		[onFilterChange]
	)

	// Handle dropdown selection changes
	const handleSelectChange = (key: string, value: any) => {
		if (value === 'all') {
			debouncedFilterChange(key, 'all')
		} else {
			debouncedFilterChange(key, value)
		}
	}

	// Handle search result item click - updates filters based on the selected item
	const handleResultClick = (item: any) => {
		// Close results dropdown
		setShowResults(false)

		// Set filters based on the clicked item
		onFilterChange('searchQuery', item.fileName || item.stationCode || '')

		// Apply relevant filters based on the clicked item
		if (item.contractorId) {
			onFilterChange('contractorId', item.contractorId.toString())
		}

		if (item.cruiseId) {
			onFilterChange('cruiseId', item.cruiseId.toString())
		}

		if (item.stationId) {
			onFilterChange('stationId', item.stationId.toString())
		}
	}

	// Helper function to properly escape CSV values for Excel
	const escapeCSVValue = (value: any): string => {
		if (value === null || value === undefined) return '""'

		// Convert to string and escape double quotes by doubling them
		const stringValue = String(value)
		const escaped = stringValue.replace(/"/g, '""')

		// Replace line breaks with spaces for better readability
		const noLineBreaks = escaped.replace(/\r?\n|\r/g, ' ')

		// Always wrap in quotes to handle special characters and preserve formatting
		return `"${noLineBreaks}"`
	}

	// Format date consistently for Excel - YYYY-MM-DD format
	const formatDate = (dateString?: string): string => {
		if (!dateString) return 'N/A'

		try {
			const date = new Date(dateString)

			// Check if date is valid
			if (isNaN(date.getTime())) return 'N/A'

			// Format as YYYY-MM-DD for consistent Excel handling
			return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(
				2,
				'0'
			)}`
		} catch (error) {
			return 'N/A'
		}
	}

	// Extract year from a date string
	const getCruiseYear = (dateString?: string): string => {
		if (!dateString) return ''

		try {
			const date = new Date(dateString)

			// Check if date is valid
			if (isNaN(date.getTime())) return ''

			return date.getFullYear().toString()
		} catch (error) {
			return ''
		}
	}

	// Function to download all filtered media items as a CSV file
	const handleDownloadAllImages = async () => {
		if (currentFilteredItems.length === 0) {
			alert(t('gallery.filter.noItemsToDownload') || 'No items to download.')
			return
		}

		try {
			setIsDownloading(true) // Show download in progress state

			// Filter items based on mediaType if that filter is active
			const itemsToDownload =
				filters.mediaType === 'image'
					? currentFilteredItems.filter(
							item =>
								!item.mediaType?.toLowerCase().includes('video') &&
								!item.fileName.match(/\.(mp4|webm|avi|mov|wmv|flv)$/i)
					  )
					: filters.mediaType === 'video'
					? currentFilteredItems.filter(
							item =>
								item.mediaType?.toLowerCase().includes('video') || item.fileName.match(/\.(mp4|webm|avi|mov|wmv|flv)$/i)
					  )
					: currentFilteredItems

			if (itemsToDownload.length === 0) {
				alert(t('gallery.filter.noMatchingItems') || 'No items match the current filter for download.')
				setIsDownloading(false)
				return
			}

			// Create download description based on active filters
			let filterDescription = t('gallery.filter.allMedia') || 'All Media'
			if (filters.mediaType !== 'all')
				filterDescription =
					filters.mediaType === 'image'
						? t('gallery.filter.images') || 'Images'
						: t('gallery.filter.videos') || 'Videos'
			if (filters.contractorId !== 'all') {
				const contractor = contractors.find(c => c.id.toString() === filters.contractorId)
				filterDescription += ` - ${contractor?.name || t('gallery.filter.selectedContractor') || 'Selected Contractor'}`
			}
			if (filters.stationId !== 'all') {
				const station = stations.find(s => s.id.toString() === filters.stationId)
				filterDescription += ` - ${t('gallery.filter.station') || 'Station'} ${
					station?.code || t('gallery.filter.selected') || 'Selected'
				}`
			}
			if (filters.year !== 'all') {
				filterDescription += ` - ${filters.year}`
			}

			// Store all CSV rows here
			const allRows: string[] = []
			const delimiter = ';' // Use semicolon as delimiter for Excel compatibility

			// Add report title section
			allRows.push(`"${t('gallery.export.title') || 'ISA DeepData Gallery Export'} - ${filterDescription}"`)
			allRows.push(`"${t('gallery.export.generated') || 'Generated on'}: ${new Date().toISOString().split('T')[0]}"`)
			allRows.push('') // Empty row for better readability

			// 1. MEDIA SECTION
			// Add section title with empty cells for proper alignment
			allRows.push([t('gallery.export.media') || 'MEDIA', '', '', '', '', '', ''].join(delimiter))

			// Add proper headers
			allRows.push(
				[
					t('gallery.export.headers.mediaId') || 'MediaId',
					t('gallery.export.headers.fileName') || 'FileName',
					t('gallery.export.headers.mediaType') || 'MediaType',
					t('gallery.export.headers.url') || 'URL',
					t('gallery.export.headers.stationCode') || 'StationCode',
					t('gallery.export.headers.contractorName') || 'ContractorName',
					t('gallery.export.headers.captureDate') || 'CaptureDate',
					t('gallery.export.headers.description') || 'Description',
				]
					.map(h => escapeCSVValue(h))
					.join(delimiter)
			)

			// Add media data rows
			itemsToDownload.forEach((item, index) => {
				const row = [
					index + 1, // Use sequential numbering as MediaId
					escapeCSVValue(item.fileName || ''),
					escapeCSVValue(item.mediaType || ''),
					escapeCSVValue(item.fileUrl || ''),
					escapeCSVValue(item.stationCode || 'N/A'),
					escapeCSVValue(item.contractorName || 'N/A'),
					escapeCSVValue(formatDate(item.captureDate)),
					escapeCSVValue(item.description || ''),
				].join(delimiter)

				allRows.push(row)
			})

			// Add empty rows as separator
			allRows.push('')
			allRows.push('')

			// 2. STATION REFERENCE SECTION - include information about stations
			// Get unique stations from the media items
			const uniqueStations = Array.from(new Set(itemsToDownload.map(item => item.stationCode).filter(Boolean)))

			if (uniqueStations.length > 0) {
				// Add section title
				allRows.push([t('gallery.export.stations') || 'STATIONS', '', '', '', '', ''].join(delimiter))

				// Add headers
				allRows.push(
					[
						t('gallery.export.headers.stationId') || 'StationId',
						t('gallery.export.headers.stationCode') || 'StationCode',
						t('gallery.export.headers.cruiseId') || 'CruiseId',
						t('gallery.export.headers.latitude') || 'Latitude',
						t('gallery.export.headers.longitude') || 'Longitude',
						t('gallery.export.headers.contractorName') || 'ContractorName',
					]
						.map(h => escapeCSVValue(h))
						.join(delimiter)
				)

				// Add station data rows
				uniqueStations.forEach((stationCode, index) => {
					// Find first media item with this station to extract data
					const stationItem = itemsToDownload.find(item => item.stationCode === stationCode)

					if (stationItem) {
						const row = [
							index + 1, // Use sequential numbering as StationId
							escapeCSVValue(stationCode),
							escapeCSVValue(stationItem.cruiseId?.toString() || 'N/A'),
							escapeCSVValue(stationItem.latitude?.toString() || 'N/A'),
							escapeCSVValue(stationItem.longitude?.toString() || 'N/A'),
							escapeCSVValue(stationItem.contractorName || 'N/A'),
						].join(delimiter)

						allRows.push(row)
					}
				})

				// Add empty rows as separator
				allRows.push('')
				allRows.push('')
			}

			// 3. CRUISE REFERENCE SECTION - include information about cruises
			// Get unique cruises from the media items
			const uniqueCruises = Array.from(new Set(itemsToDownload.map(item => item.cruiseName).filter(Boolean)))

			if (uniqueCruises.length > 0) {
				// Add section title
				allRows.push([t('gallery.export.cruises') || 'CRUISES', '', '', '', ''].join(delimiter))

				// Add headers
				allRows.push(
					[
						t('gallery.export.headers.cruiseId') || 'CruiseId',
						t('gallery.export.headers.cruiseName') || 'CruiseName',
						t('gallery.export.headers.contractorId') || 'ContractorId',
						t('gallery.export.headers.contractorName') || 'ContractorName',
						t('gallery.export.headers.year') || 'Year',
					]
						.map(h => escapeCSVValue(h))
						.join(delimiter)
				)

				// Add cruise data rows
				uniqueCruises.forEach((cruiseName, index) => {
					// Find first media item with this cruise to extract data
					const cruiseItem = itemsToDownload.find(item => item.cruiseName === cruiseName)

					if (cruiseItem) {
						const row = [
							index + 1, // Use sequential numbering as CruiseId
							escapeCSVValue(cruiseName),
							escapeCSVValue(cruiseItem.contractorId?.toString() || 'N/A'),
							escapeCSVValue(cruiseItem.contractorName || 'N/A'),
							escapeCSVValue(getCruiseYear(cruiseItem.captureDate) || 'N/A'),
						].join(delimiter)

						allRows.push(row)
					}
				})

				// Add empty rows as separator
				allRows.push('')
				allRows.push('')
			}

			// 4. CONTRACTOR REFERENCE SECTION - include information about contractors
			// Get unique contractors from the media items
			const uniqueContractors = Array.from(new Set(itemsToDownload.map(item => item.contractorName).filter(Boolean)))

			if (uniqueContractors.length > 0) {
				// Add section title
				allRows.push([t('gallery.export.contractors') || 'CONTRACTORS', '', '', '', ''].join(delimiter))

				// Add headers
				allRows.push(
					[
						t('gallery.export.headers.contractorId') || 'ContractorId',
						t('gallery.export.headers.contractorName') || 'ContractorName',
						t('gallery.export.headers.mediaCount') || 'MediaCount',
					]
						.map(h => escapeCSVValue(h))
						.join(delimiter)
				)

				// Add contractor data rows
				uniqueContractors.forEach((contractorName, index) => {
					// Count media items for this contractor
					const contractorItems = itemsToDownload.filter(item => item.contractorName === contractorName)

					const row = [
						index + 1, // Use sequential numbering as ContractorId
						escapeCSVValue(contractorName),
						escapeCSVValue(contractorItems.length.toString()),
					].join(delimiter)

					allRows.push(row)
				})
			}

			// Join all rows with Windows-style line endings for Excel compatibility
			const csvContent = allRows.join('\r\n')

			// Add UTF-8 BOM for Excel compatibility with special characters
			const bomPrefix = '\uFEFF'
			const blob = new Blob([bomPrefix + csvContent], { type: 'text/csv;charset=utf-8;' })

			// Create a download URL
			const url = URL.createObjectURL(blob)

			// Get current date for the filename
			const date = new Date().toISOString().split('T')[0]
			const filename = `ISA_DeepData_${filterDescription.replace(/ /g, '_')}_${date}.csv`

			// Create download link and trigger download
			const link = document.createElement('a')
			link.href = url
			link.setAttribute('download', filename)
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)

			// Revoke the URL object to free up memory
			URL.revokeObjectURL(url)
		} catch (error) {
			console.error('Error downloading files:', error)
			alert(t('gallery.export.error') || 'There was an error preparing your download. Please try again.')
		} finally {
			setIsDownloading(false) // Reset downloading state
		}
	}

	// Helper function to prepare dropdown options
	const prepareDropdownOptions = (items: any[], valueKey: string, labelKey: string) => {
		return [
			{ value: 'all', label: t('gallery.filter.all') || 'All' }, // "All" option
			...items.map(item => ({
				value: item[valueKey].toString(),
				label: item[labelKey],
			})),
		]
	}

	// Create dropdown options with dynamic filtering
	const mediaTypeOptions = [
		{ value: 'all', label: t('gallery.filter.allMediaTypes') || 'All Media Types' },
		// Only include image option if images are available
		...(availableOptions.mediaTypes.includes('image')
			? [{ value: 'image', label: t('gallery.filter.imagesOnly') || 'Images only' }]
			: []),
		// Only include video option if videos are available
		...(availableOptions.mediaTypes.includes('video')
			? [{ value: 'video', label: t('gallery.filter.videosOnly') || 'Videos only' }]
			: []),
	]

	// Use filtered options for dropdowns
	const contractorOptions = prepareDropdownOptions(availableOptions.contractors, 'id', 'name')
	const cruiseOptions = prepareDropdownOptions(availableOptions.cruises, 'id', 'name')
	const stationOptions = prepareDropdownOptions(availableOptions.stations, 'id', 'code')
	const yearOptions = [
		{ value: 'all', label: t('gallery.filter.allYears') || 'All Years' },
		...availableOptions.years.map(year => ({ value: year, label: year })),
	]

	return (
		<div
			className={`${mapStyles.improvedFilterPanel} ${styles.filterContainer} ${isCollapsed ? styles.collapsed : ''}`}>
			<div className={mapStyles.filterContent}>
				{' '}
				{/* Main content container */}
				<div className={mapStyles.filterHeader}>
					{' '}
					{/* Header with title and reset button */}
					<h2>{t('gallery.filter.title') || 'Media Filters'}</h2>
					{activeFiltersCount > 0 && (
						<button className={mapStyles.resetButton} onClick={onResetFilters}>
							{t('gallery.filter.reset') || 'Reset'} ({activeFiltersCount}){' '}
							{/* Reset button with active filter count */}
						</button>
					)}
				</div>
				{/* Search Container - text search input and results */}
				<div className={mapStyles.searchContainer}>
					<div className={mapStyles.searchInputWrapper}>
						<input
							ref={searchInputRef}
							type='text'
							id='mediaSearch' // Added ID attribute for accessibility
							name='mediaSearch' // Added name attribute for forms
							placeholder={t('gallery.filter.searchPlaceholder') || 'Search media...'}
							value={searchQuery}
							onChange={handleSearchChange}
							onKeyPress={handleKeyPress}
							className={mapStyles.searchInput}
							aria-label={t('gallery.filter.searchAriaLabel') || 'Search media'} // Added aria-label for accessibility
						/>
						<button
							onClick={() => performSearch(searchQuery)}
							className={mapStyles.searchButton}
							aria-label={t('gallery.filter.search') || 'Search'}>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								width='18'
								height='18'
								viewBox='0 0 24 24'
								fill='none'
								stroke='currentColor'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'>
								<circle cx='11' cy='11' r='8'></circle>
								<line x1='21' y1='21' x2='16.65' y2='16.65'></line>
							</svg>{' '}
							{/* Search icon */}
						</button>
					</div>

					{/* Search Results dropdown - only visible when search has results */}
					{showResults && (
						<div ref={resultsRef} className={mapStyles.searchResultsList}>
							<div className={mapStyles.searchResultsHeader}>
								<span>
									{t('gallery.filter.searchResults') || 'Search Results'} ({searchResults.length})
								</span>
								<button className={mapStyles.closeResultsButton} onClick={() => setShowResults(false)}>
									× {/* Close button */}
								</button>
							</div>

							<div className={mapStyles.searchResultsContent}>
								{searchResults.length === 0 ? (
									<div className={mapStyles.noResults}>
										{t('gallery.filter.noResultsFound') || 'No results found for'} "{searchQuery}"
									</div>
								) : (
									<ul>
										{searchResults.map((result, index) => (
											<li key={`result-${result.mediaId || index}`} onClick={() => handleResultClick(result)}>
												<div className={mapStyles.resultType}>
													{result.mediaType?.toLowerCase().includes('video') ||
													result.fileName.match(/\.(mp4|webm|avi|mov|wmv|flv)$/i) ? (
														<>
															<svg
																xmlns='http://www.w3.org/2000/svg'
																width='12'
																height='12'
																viewBox='0 0 24 24'
																fill='none'
																stroke='currentColor'
																strokeWidth='2'
																strokeLinecap='round'
																strokeLinejoin='round'>
																<polygon points='5 3 19 12 5 21 5 3'></polygon>
															</svg>{' '}
															{/* Video play icon */}
															{t('gallery.filter.video') || 'Video'}
														</>
													) : (
														<>
															<svg
																xmlns='http://www.w3.org/2000/svg'
																width='12'
																height='12'
																viewBox='0 0 24 24'
																fill='none'
																stroke='currentColor'
																strokeWidth='2'
																strokeLinecap='round'
																strokeLinejoin='round'>
																<rect x='3' y='3' width='18' height='18' rx='2' ry='2'></rect>
																<circle cx='8.5' cy='8.5' r='1.5'></circle>
																<polyline points='21 15 16 10 5 21'></polyline>
															</svg>{' '}
															{/* Image icon */}
															{t('gallery.filter.image') || 'Image'}
														</>
													)}
												</div>
												<div className={mapStyles.resultName}>{result.fileName}</div> {/* File name */}
												{result.stationCode && (
													<div className={mapStyles.resultParent}>
														{t('gallery.filter.station') || 'Station'}: {result.stationCode}
													</div> /* Station information if available */
												)}
											</li>
										))}
									</ul>
								)}
							</div>
						</div>
					)}
				</div>
				<div className={mapStyles.filtersGroup}>
					{' '}
					{/* Filter dropdowns container */}
					<h3>{t('gallery.filter.filterBy') || 'Filter By'}</h3>
					{/* Media Type Dropdown */}
					<CustomDropdown
						id='mediaType'
						label={t('gallery.filter.mediaType') || 'Media Type'}
						options={mediaTypeOptions}
						value={filters.mediaType}
						onChange={e => handleSelectChange('mediaType', e.target.value)}
						isActive={filters.mediaType !== 'all'} // Highlight if filter is active
					/>
					{/* Contractor Dropdown */}
					<CustomDropdown
						id='contractorId'
						label={t('gallery.filter.contractor') || 'Contractor'}
						options={contractorOptions}
						value={filters.contractorId}
						onChange={e => handleSelectChange('contractorId', e.target.value)}
						isActive={filters.contractorId !== 'all'} // Highlight if filter is active
					/>
					{/* Cruise Dropdown */}
					<CustomDropdown
						id='cruiseId'
						label={t('gallery.filter.cruise') || 'Cruise'}
						options={cruiseOptions}
						value={filters.cruiseId}
						onChange={e => handleSelectChange('cruiseId', e.target.value)}
						isActive={filters.cruiseId !== 'all'} // Highlight if filter is active
					/>
					{/* Station Dropdown */}
					<CustomDropdown
						id='stationId'
						label={t('gallery.filter.station') || 'Station'}
						options={stationOptions}
						value={filters.stationId}
						onChange={e => handleSelectChange('stationId', e.target.value)}
						isActive={filters.stationId !== 'all'} // Highlight if filter is active
					/>
					{/* Year Dropdown */}
					<CustomDropdown
						id='year'
						label={t('gallery.filter.year') || 'Year'}
						options={yearOptions}
						value={filters.year}
						onChange={e => handleSelectChange('year', e.target.value)}
						isActive={filters.year !== 'all'} // Highlight if filter is active
					/>
					{/* Download All Button - export CSV file with filtered items */}
					<button
						className={`${styles.downloadAllButton} ${mapStyles.actionButton}`}
						onClick={handleDownloadAllImages}
						disabled={isDownloading || currentFilteredItems.length === 0}>
						{' '}
						{/* Disable when downloading or no items */}
						{isDownloading
							? t('gallery.filter.preparingDownload') || 'Preparing Download...' // Show loading text
							: `${t('gallery.filter.downloadCSV') || 'Download CSV'} (${currentFilteredItems.length})`}{' '}
						{/* Show item count */}
					</button>
				</div>
			</div>

			{/* Results count indicator - shows number of items that match current filters */}
			<div className={mapStyles.resultsInfo}>
				<span>
					{currentFilteredItems.length} {t('gallery.filter.itemsMatchFilters') || 'items match your filters'}
				</span>
			</div>
		</div>
	)
}

export default GalleryFilter
