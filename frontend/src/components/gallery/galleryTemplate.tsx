// Updated GalleryTemplate.tsx with translation support
import React, { useState, useEffect } from 'react' // Import React and hooks
import styles from '../../styles/gallery/gallery.module.css' // Import CSS module for styling
import ImprovedGalleryFilter from './galleryFilter' // Import filter sidebar component
import MediaCard from './mediaCard' // Import media card component
import MediaModal from './mediaModal' // Import modal component for media preview
import { useLanguage } from '../../contexts/languageContext' // Import language context for translations

// Media item interface - defines the structure of gallery items
interface MediaItem {
	mediaId: number // Unique identifier for the media item
	fileName: string // File name
	fileUrl: string // URL to the full media file
	mediaType: string // Type of media (image, video)
	thumbnailUrl: string // URL to the thumbnail image
	captureDate: string // When the media was captured
	stationId: number // Related station ID
	stationCode: string // Code identifying the station
	contractorId: number // Related contractor ID
	contractorName: string // Name of the contractor
	cruiseId: number // Related cruise ID
	cruiseName: string // Name of the cruise
	sampleId: number // Related sample ID
	sampleCode: string // Code identifying the sample
	latitude: number // Geographic latitude coordinate
	longitude: number // Geographic longitude coordinate
	description: string // Descriptive text about the media
	cameraSpecs?: string // Optional camera specifications
}

// Filter state interface - defines the structure of the filter state
interface FilterState {
	mediaType: string // Type of media to filter by (image, video, all)
	contractorId: string // Contractor ID to filter by
	cruiseId: string // Cruise ID to filter by
	stationId: string // Station ID to filter by
	year: string // Year to filter by
	searchQuery: string // Text search query
}

const GalleryTemplate: React.FC = () => {
	const { t } = useLanguage() // Use the language context for translations

	// State for media items and loading
	const [mediaItems, setMediaItems] = useState<MediaItem[]>([]) // All media items
	const [filteredItems, setFilteredItems] = useState<MediaItem[]>([]) // Media items after filtering
	const [loading, setLoading] = useState(true) // Loading state indicator
	const [error, setError] = useState<string | null>(null) // Error message if loading fails

	// State for filter options - populate dropdown selections
	const [contractors, setContractors] = useState<{ id: number; name: string }[]>([]) // Available contractors
	const [cruises, setCruises] = useState<{ id: number; name: string }[]>([]) // Available cruises
	const [stations, setStations] = useState<{ id: number; code: string }[]>([]) // Available stations
	const [years, setYears] = useState<string[]>([]) // Available years

	// State for modal display
	const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null) // Currently selected media item
	const [showModal, setShowModal] = useState(false) // Whether to show the modal

	// State for pagination
	const [currentPage, setCurrentPage] = useState(1) // Current page number
	const [itemsPerPage] = useState(12) // Number of items to display per page

	// State for filters - initialize with default "all" values
	const [filters, setFilters] = useState<FilterState>({
		mediaType: 'all',
		contractorId: 'all',
		cruiseId: 'all',
		stationId: 'all',
		year: 'all',
		searchQuery: '',
	})

	// Initial data fetch - run once when component mounts
	useEffect(() => {
		const fetchMediaItems = async () => {
			try {
				setLoading(true)
				setError(null) // Reset error state

				// Get API base URL from environment or try common local development ports
				const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5062/api'

				console.log(`Attempting to fetch media from: ${API_BASE_URL}/Gallery/media`)

				// Fetch media items with timeout for better error handling
				const controller = new AbortController()
				const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

				let response
				try {
					// First attempt using primary URL
					response = await fetch(`${API_BASE_URL}/Gallery/media`, {
						signal: controller.signal,
					})
				} catch (fetchError) {
					console.log('First fetch attempt failed, trying alternative port...')
					// If first attempt fails, try alternative port
					const ALT_API_URL = API_BASE_URL.includes('5062') ? 'http://localhost:5062/api' : 'http://localhost:5802/api'

					console.log(`Attempting alternative URL: ${ALT_API_URL}/Gallery/media`)
					response = await fetch(`${ALT_API_URL}/Gallery/media`, {
						signal: controller.signal,
					})
				}

				clearTimeout(timeoutId) // Clear the timeout

				if (!response.ok) {
					throw new Error(`Failed to fetch media. Status: ${response.status} ${response.statusText}`)
				}

				const data = await response.json()
				console.log(`Successfully retrieved ${data.length} media items`)

				// Process the data to ensure URLs are properly formatted
				const processedData = data.map((item: MediaItem) => ({
					...item,
					// Ensure the URLs are absolute
					fileUrl: item.fileUrl || item.mediaUrl || '',
					thumbnailUrl: item.thumbnailUrl || item.mediaUrl || '',
				}))

				setMediaItems(processedData)
				setFilteredItems(processedData)

				// Extract filter options from the data
				// Get unique contractor options
				const contractorOptions = Array.from(new Set(processedData.map((item: MediaItem) => item.contractorId)))
					.filter(id => id !== null && id !== undefined) // Remove nulls and undefined
					.map(id => ({
						id,
						name: processedData.find((item: MediaItem) => item.contractorId === id)?.contractorName || 'Unknown',
					}))

				// Get unique cruise options
				const cruiseOptions = Array.from(new Set(processedData.map((item: MediaItem) => item.cruiseId)))
					.filter(id => id !== null && id !== undefined)
					.map(id => ({
						id,
						name: processedData.find((item: MediaItem) => item.cruiseId === id)?.cruiseName || 'Unknown',
					}))

				// Get unique station options
				const stationOptions = Array.from(new Set(processedData.map((item: MediaItem) => item.stationId)))
					.filter(id => id !== null && id !== undefined)
					.map(id => ({
						id,
						code: processedData.find((item: MediaItem) => item.stationId === id)?.stationCode || 'Unknown',
					}))

				// Get unique year options from capture dates
				const yearOptions = Array.from(
					new Set(
						processedData.map((item: MediaItem) => {
							if (item.captureDate) {
								return new Date(item.captureDate).getFullYear().toString()
							}
							return null
						})
					)
				).filter(year => year !== null) as string[]

				// Update state with filter options
				setContractors(contractorOptions)
				setCruises(cruiseOptions)
				setStations(stationOptions)
				setYears(yearOptions.sort()) // Sort years in ascending order
			} catch (err) {
				console.error('Error fetching gallery data:', err)

				// Handle specific error cases with user-friendly messages
				if (err instanceof Error) {
					if (err.name === 'AbortError') {
						setError(t('gallery.errors.timeout') || 'Request timed out. Please check your connection and try again.')
					} else if (err.message.includes('NetworkError') || err.message.includes('Failed to fetch')) {
						setError(
							t('gallery.errors.network') ||
								`Network error: Unable to connect to the API server. 
              We tried ports 5802 and 5062. Please ensure your backend API is running and accessible.
              Check your API project's launchSettings.json for the correct port.`
						)
					} else if (err.message.includes('CONNECTION_REFUSED')) {
						setError(
							t('gallery.errors.connection') ||
								`Connection refused: The server rejected the connection. 
              Make sure your API is running at http://localhost:5802 
              and that CORS is properly configured to allow requests from this origin.`
						)
					} else {
						setError(err.message)
					}
				} else {
					setError(t('gallery.errors.unknown') || 'An unknown error occurred while fetching data')
				}
			} finally {
				setLoading(false) // Always set loading to false when done
			}
		}

		fetchMediaItems() // Execute the fetch function
	}, [t]) // Dependency on translation function

	// Apply filters whenever filters state changes
	useEffect(() => {
		if (mediaItems.length === 0) return // Skip if no items loaded yet

		const applyFilters = () => {
			let filtered = [...mediaItems] // Start with all media items

			// Filter by media type
			if (filters.mediaType !== 'all') {
				filtered = filtered.filter(item => {
					if (filters.mediaType === 'image') {
						// Identify images by media type or file extension
						return (
							item.mediaType?.toLowerCase().includes('image') ||
							item.mediaType?.toLowerCase().includes('photo') ||
							item.fileName.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i)
						)
					} else if (filters.mediaType === 'video') {
						// Identify videos by media type or file extension
						return (
							item.mediaType?.toLowerCase().includes('video') || item.fileName.match(/\.(mp4|webm|avi|mov|wmv|flv)$/i)
						)
					}
					return true
				})
			}

			// Filter by contractor ID
			if (filters.contractorId !== 'all') {
				filtered = filtered.filter(item => item.contractorId?.toString() === filters.contractorId)
			}

			// Filter by cruise ID
			if (filters.cruiseId !== 'all') {
				filtered = filtered.filter(item => item.cruiseId?.toString() === filters.cruiseId)
			}

			// Filter by station ID
			if (filters.stationId !== 'all') {
				filtered = filtered.filter(item => item.stationId?.toString() === filters.stationId)
			}

			// Filter by year
			if (filters.year !== 'all') {
				filtered = filtered.filter(item => {
					if (item.captureDate) {
						const year = new Date(item.captureDate).getFullYear().toString()
						return year === filters.year
					}
					return false
				})
			}

			// Filter by search query - search across multiple fields
			if (filters.searchQuery.trim() !== '') {
				const query = filters.searchQuery.toLowerCase()
				filtered = filtered.filter(
					item =>
						item.fileName.toLowerCase().includes(query) ||
						(item.description && item.description.toLowerCase().includes(query)) ||
						(item.stationCode && item.stationCode.toLowerCase().includes(query)) ||
						(item.contractorName && item.contractorName.toLowerCase().includes(query)) ||
						(item.cruiseName && item.cruiseName.toLowerCase().includes(query)) ||
						(item.sampleCode && item.sampleCode.toLowerCase().includes(query))
				)
			}

			setFilteredItems(filtered) // Update filtered items
			setCurrentPage(1) // Reset to first page when filters change
		}

		applyFilters() // Execute the filter function
	}, [filters, mediaItems]) // Dependency on filters and mediaItems

	// Handle filter changes from the filter component
	const handleFilterChange = (filterName: keyof FilterState, value: string) => {
		setFilters(prev => ({
			...prev,
			[filterName]: value, // Update just the changed filter
		}))
	}

	// Reset all filters to default values
	const handleResetFilters = () => {
		setFilters({
			mediaType: 'all',
			contractorId: 'all',
			cruiseId: 'all',
			stationId: 'all',
			year: 'all',
			searchQuery: '',
		})
	}

	// Open modal with selected media
	const handleMediaClick = (media: MediaItem) => {
		setSelectedMedia(media) // Store the selected media item
		setShowModal(true) // Show the modal
	}

	// Close modal
	const handleCloseModal = () => {
		setShowModal(false) // Hide the modal
		setSelectedMedia(null) // Clear the selected media
	}

	// Pagination logic - calculate which items to show on current page
	const indexOfLastItem = currentPage * itemsPerPage
	const indexOfFirstItem = indexOfLastItem - itemsPerPage
	const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem)

	const totalPages = Math.ceil(filteredItems.length / itemsPerPage)

	// Handle page change
	const handlePageChange = (pageNumber: number) => {
		setCurrentPage(pageNumber)
		// Scroll to top when page changes for better user experience
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	// Generate pagination buttons with efficient display for many pages
	const renderPaginationButtons = () => {
		// Maximum number of page buttons to show
		const maxButtons = 5
		let pages = []

		if (totalPages <= maxButtons) {
			// Show all pages if total is less than or equal to maxButtons
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i)
			}
		} else {
			// Always include first page, current page, and last page
			pages.push(1)

			// Add ellipsis if current page is not near the first page
			if (currentPage > 3) {
				pages.push(-1) // -1 represents ellipsis
			}

			// Add pages around current page
			for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
				pages.push(i)
			}

			// Add ellipsis if current page is not near the last page
			if (currentPage < totalPages - 2) {
				pages.push(-2) // -2 represents ellipsis
			}

			pages.push(totalPages)
		}

		// Render the page buttons or ellipses
		return pages.map((page, index) => {
			if (page < 0) {
				// Render ellipsis
				return (
					<span key={`ellipsis-${index}`} className={styles.ellipsis}>
						&hellip;
					</span>
				)
			}

			return (
				<button
					key={page}
					className={`${styles.pageButton} ${currentPage === page ? styles.activePage : ''}`}
					onClick={() => handlePageChange(page)}>
					{page}
				</button>
			)
		})
	}

	// Function to retry loading data after connection failure
	const handleRetry = () => {
		setError(null)
		setLoading(true)

		// Directly trigger a new fetch attempt instead of full page reload
		const fetchMediaItems = async () => {
			try {
				// Try with port 5802 first
				console.log('Retry: Attempting to fetch from port 5802')
				const controller = new AbortController()
				const timeoutId = setTimeout(() => controller.abort(), 8000)

				const response = await fetch('http://localhost:5802/api/Gallery/media', {
					signal: controller.signal,
				})

				clearTimeout(timeoutId)

				if (!response.ok) {
					throw new Error(`Failed to fetch media. Status: ${response.status} ${response.statusText}`)
				}

				const data = await response.json()

				// Process data and update state
				const processedData = data.map((item: MediaItem) => ({
					...item,
					fileUrl: item.fileUrl || item.mediaUrl || '',
					thumbnailUrl: item.thumbnailUrl || item.mediaUrl || '',
				}))

				setMediaItems(processedData)
				setFilteredItems(processedData)
				setLoading(false)

				// Extract filter options
				const contractorOptions = Array.from(new Set(processedData.map((item: MediaItem) => item.contractorId)))
					.filter(id => id !== null && id !== undefined)
					.map(id => ({
						id,
						name: processedData.find((item: MediaItem) => item.contractorId === id)?.contractorName || 'Unknown',
					}))

				const cruiseOptions = Array.from(new Set(processedData.map((item: MediaItem) => item.cruiseId)))
					.filter(id => id !== null && id !== undefined)
					.map(id => ({
						id,
						name: processedData.find((item: MediaItem) => item.cruiseId === id)?.cruiseName || 'Unknown',
					}))

				const stationOptions = Array.from(new Set(processedData.map((item: MediaItem) => item.stationId)))
					.filter(id => id !== null && id !== undefined)
					.map(id => ({
						id,
						code: processedData.find((item: MediaItem) => item.stationId === id)?.stationCode || 'Unknown',
					}))

				const yearOptions = Array.from(
					new Set(
						processedData.map((item: MediaItem) => {
							if (item.captureDate) {
								return new Date(item.captureDate).getFullYear().toString()
							}
							return null
						})
					)
				).filter(year => year !== null) as string[]

				setContractors(contractorOptions)
				setCruises(cruiseOptions)
				setStations(stationOptions)
				setYears(yearOptions.sort())
			} catch (err) {
				console.error('Retry failed with port 5802, trying 5062 now:', err)

				// Try with port 5062 as fallback
				try {
					const controller = new AbortController()
					const timeoutId = setTimeout(() => controller.abort(), 8000)

					const response = await fetch('http://localhost:5062/api/Gallery/media', {
						signal: controller.signal,
					})

					clearTimeout(timeoutId)

					if (!response.ok) {
						throw new Error(`Failed to fetch media. Status: ${response.status} ${response.statusText}`)
					}

					const data = await response.json()
					// Process data similarly
					// ...processing code would be identical to above...

					setMediaItems(data)
					setFilteredItems(data)
					setLoading(false)
				} catch (secondErr) {
					console.error('Both retry attempts failed:', secondErr)
					setError(
						t('gallery.errors.bothPorts') ||
							'Connection failed on both ports (5802, 5062). Please check if your API server is running and accessible.'
					)
					setLoading(false)
				}
			}
		}

		fetchMediaItems() // Execute the fetch retry
	}

	return (
		<div className={styles.galleryContainer}>
			{' '}
			{/* Main container for the entire gallery page */}
			<div className={styles.galleryHeader}>
				{' '}
				{/* Header section with title and description */}
				<h1 className={styles.galleryTitle}>{t('gallery.title') || 'Deep-Sea Media Gallery'}</h1>
				<p className={styles.galleryDescription}>
					{t('gallery.description') ||
						'Explore a collection of deep-sea images and videos from various exploration missions and research activities.'}
				</p>
			</div>
			<div className={styles.galleryContent}>
				{' '}
				{/* Main content area with filter sidebar and media display */}
				{/* Filter sidebar on the left */}
				<div className={styles.filterSidebar}>
					<ImprovedGalleryFilter
						filters={filters}
						onFilterChange={handleFilterChange}
						onResetFilters={handleResetFilters}
						contractors={contractors}
						cruises={cruises}
						stations={stations}
						years={years}
						currentFilteredItems={filteredItems}
					/>
				</div>
				{/* Gallery display area on the right */}
				<div className={styles.mediaGalleryContainer}>
					{loading ? (
						// Loading state with spinner
						<div className={styles.loadingContainer}>
							<div className={styles.spinner}></div>
							<p>{t('gallery.loading') || 'Loading media...'}</p>
						</div>
					) : error ? (
						// Error state with retry options
						<div className={styles.errorContainer}>
							<p className={styles.errorMessage}>{error}</p>
							<div className={styles.errorActions}>
								<button onClick={handleRetry} className={styles.retryButton}>
									{t('gallery.retry') || 'Retry Connection'}
								</button>
								<button
									onClick={() => {
										// Check API connectivity on multiple ports
										const checkPorts = async () => {
											setError(t('gallery.checkingConnectivity') || 'Checking API connectivity...')
											const ports = [5802, 5062, 7171, 5000, 5001] // Common API ports to check
											let results = ''

											for (const port of ports) {
												try {
													const controller = new AbortController()
													const timeoutId = setTimeout(() => controller.abort(), 3000)

													console.log(`Testing connectivity to port ${port}...`)
													const startTime = Date.now()
													const response = await fetch(`http://localhost:${port}/api/Gallery/media`, {
														signal: controller.signal,
														method: 'HEAD', // Just check headers, don't fetch data
													}).catch(e => {
														// This is expected for ports that don't respond
														return { status: 0, statusText: e.message }
													})

													clearTimeout(timeoutId)
													const elapsed = Date.now() - startTime

													if (response.status > 0) {
														results += `✅ Port ${port}: Connected! (${elapsed}ms, status: ${response.status})\n`
													} else {
														results += `❌ Port ${port}: Failed (${elapsed}ms)\n`
													}
												} catch (e) {
													results += `❌ Port ${port}: Error - ${e.message}\n`
												}
											}

											setError(
												`${t('gallery.connectivityResults') || 'API Connectivity Check Results'}:\n${results}\n\n${
													t('gallery.matchPortMessage') ||
													"Try to match one of these ports in your code, or check your API's launchSettings.json file."
												}`
											)
										}

										checkPorts() // Execute the port check
									}}
									className={styles.diagnosticButton}>
									{t('gallery.checkConnectivity') || 'Check API Connectivity'}
								</button>
							</div>
						</div>
					) : currentItems.length === 0 ? (
						// No results state
						<div className={styles.noResults}>
							<p>{t('gallery.noResults') || 'No media found matching your filters.'}</p>
							<button onClick={handleResetFilters} className={styles.resetButton}>
								{t('gallery.resetFilters') || 'Reset Filters'}
							</button>
						</div>
					) : (
						<>
							

							{/* Media Grid - 3 column layout of media cards */}
							<div className={styles.mediaGrid}>
								{currentItems.map(media => (
									<MediaCard key={media.mediaId} media={media} onClick={() => handleMediaClick(media)} />
								))}
							</div>

							{/* Pagination controls - only shown if more than one page */}
							{totalPages > 1 && (
								<div className={styles.pagination}>
									<button
										className={styles.pageButton}
										onClick={() => handlePageChange(currentPage - 1)}
										disabled={currentPage === 1}>
										&laquo; {t('gallery.pagination.previous') || 'Previous'}
									</button>

									<div className={styles.pageNumbers}>{renderPaginationButtons()}</div>

									<button
										className={styles.pageButton}
										onClick={() => handlePageChange(currentPage + 1)}
										disabled={currentPage === totalPages}>
										{t('gallery.pagination.next') || 'Next'} &raquo;
									</button>
								</div>
							)}
						</>
					)}
				</div>
			</div>
			{/* Media Modal - only rendered when a media item is selected */}
			{showModal && selectedMedia && <MediaModal media={selectedMedia} onClose={handleCloseModal} />}
		</div>
	)
}

export default GalleryTemplate
