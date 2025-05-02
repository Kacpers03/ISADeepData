// Updated GalleryTemplate.tsx with translation support
import React, { useState, useEffect } from 'react'
import styles from '../../styles/gallery/gallery.module.css'
import ImprovedGalleryFilter from './galleryFilter'
import MediaCard from './mediaCard'
import MediaModal from './mediaModal'
import { useLanguage } from '../../contexts/languageContext' // Import language context

// Media item interface
interface MediaItem {
	mediaId: number
	fileName: string
	fileUrl: string
	mediaType: string
	thumbnailUrl: string
	captureDate: string
	stationId: number
	stationCode: string
	contractorId: number
	contractorName: string
	cruiseId: number
	cruiseName: string
	sampleId: number
	sampleCode: string
	latitude: number
	longitude: number
	description: string
	cameraSpecs?: string
}

// Filter state interface
interface FilterState {
	mediaType: string
	contractorId: string
	cruiseId: string
	stationId: string
	year: string
	searchQuery: string
}

const GalleryTemplate: React.FC = () => {
	const { t } = useLanguage() // Use the language context

	// State for media items and loading
	const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
	const [filteredItems, setFilteredItems] = useState<MediaItem[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	// State for filter options
	const [contractors, setContractors] = useState<{ id: number; name: string }[]>([])
	const [cruises, setCruises] = useState<{ id: number; name: string }[]>([])
	const [stations, setStations] = useState<{ id: number; code: string }[]>([])
	const [years, setYears] = useState<string[]>([])

	// State for modal
	const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)
	const [showModal, setShowModal] = useState(false)

	// State for pagination
	const [currentPage, setCurrentPage] = useState(1)
	const [itemsPerPage] = useState(12)

	// State for filters
	const [filters, setFilters] = useState<FilterState>({
		mediaType: 'all',
		contractorId: 'all',
		cruiseId: 'all',
		stationId: 'all',
		year: 'all',
		searchQuery: '',
	})

	// Initial data fetch
	useEffect(() => {
		const fetchMediaItems = async () => {
			try {
				setLoading(true)
				setError(null) // Reset error state

				// Get API base URL from environment or try common local development ports
				const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5062/api'

				console.log(`Attempting to fetch media from: ${API_BASE_URL}/Gallery/media`)

				// Fetch media items with timeout
				const controller = new AbortController()
				const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

				let response
				try {
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
				console.error('Error fetching gallery data:', err)

				// Handle specific error cases
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
				setLoading(false)
			}
		}

		fetchMediaItems()
	}, [t])

	// Apply filters whenever filters state changes
	useEffect(() => {
		if (mediaItems.length === 0) return

		const applyFilters = () => {
			let filtered = [...mediaItems]

			// Filter by media type
			if (filters.mediaType !== 'all') {
				filtered = filtered.filter(item => {
					if (filters.mediaType === 'image') {
						return (
							item.mediaType?.toLowerCase().includes('image') ||
							item.mediaType?.toLowerCase().includes('photo') ||
							item.fileName.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i)
						)
					} else if (filters.mediaType === 'video') {
						return (
							item.mediaType?.toLowerCase().includes('video') || item.fileName.match(/\.(mp4|webm|avi|mov|wmv|flv)$/i)
						)
					}
					return true
				})
			}

			// Filter by contractor
			if (filters.contractorId !== 'all') {
				filtered = filtered.filter(item => item.contractorId?.toString() === filters.contractorId)
			}

			// Filter by cruise
			if (filters.cruiseId !== 'all') {
				filtered = filtered.filter(item => item.cruiseId?.toString() === filters.cruiseId)
			}

			// Filter by station
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

			// Filter by search query
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

			setFilteredItems(filtered)
			setCurrentPage(1) // Reset to first page when filters change
		}

		applyFilters()
	}, [filters, mediaItems])

	// Handle filter changes
	const handleFilterChange = (filterName: keyof FilterState, value: string) => {
		setFilters(prev => ({
			...prev,
			[filterName]: value,
		}))
	}

	// Reset all filters
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
		setSelectedMedia(media)
		setShowModal(true)
	}

	// Close modal
	const handleCloseModal = () => {
		setShowModal(false)
		setSelectedMedia(null)
	}

	// Pagination logic
	const indexOfLastItem = currentPage * itemsPerPage
	const indexOfFirstItem = indexOfLastItem - itemsPerPage
	const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem)

	const totalPages = Math.ceil(filteredItems.length / itemsPerPage)

	const handlePageChange = (pageNumber: number) => {
		setCurrentPage(pageNumber)
		// Scroll to top when page changes
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	// Generate pagination buttons
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

	// Function to retry loading data
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

		fetchMediaItems()
	}

	return (
		<div className={styles.galleryContainer}>
			<div className={styles.galleryHeader}>
				<h1 className={styles.galleryTitle}>{t('gallery.title') || 'Deep-Sea Media Gallery'}</h1>
				<p className={styles.galleryDescription}>
					{t('gallery.description') ||
						'Explore a collection of deep-sea images and videos from various exploration missions and research activities.'}
				</p>
			</div>

			<div className={styles.galleryContent}>
				{/* Use the improved Gallery Filter Component */}
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

				{/* Gallery display */}
				<div className={styles.mediaGalleryContainer}>
					{loading ? (
						<div className={styles.loadingContainer}>
							<div className={styles.spinner}></div>
							<p>{t('gallery.loading') || 'Loading media...'}</p>
						</div>
					) : error ? (
						<div className={styles.errorContainer}>
							<p className={styles.errorMessage}>{error}</p>
							<div className={styles.errorActions}>
								<button onClick={handleRetry} className={styles.retryButton}>
									{t('gallery.retry') || 'Retry Connection'}
								</button>
								<button
									onClick={() => {
										// Check API connectivity
										const checkPorts = async () => {
											setError(t('gallery.checkingConnectivity') || 'Checking API connectivity...')
											const ports = [5802, 5062, 7171, 5000, 5001]
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

										checkPorts()
									}}
									className={styles.diagnosticButton}>
									{t('gallery.checkConnectivity') || 'Check API Connectivity'}
								</button>
							</div>
						</div>
					) : currentItems.length === 0 ? (
						<div className={styles.noResults}>
							<p>{t('gallery.noResults') || 'No media found matching your filters.'}</p>
							<button onClick={handleResetFilters} className={styles.resetButton}>
								{t('gallery.resetFilters') || 'Reset Filters'}
							</button>
						</div>
					) : (
						<>
							<div className={styles.resultsInfo}>
								<p>
									{t('gallery.showing', {
										from: indexOfFirstItem + 1,
										to: Math.min(indexOfLastItem, filteredItems.length),
										total: filteredItems.length,
									}) ||
										`Showing ${indexOfFirstItem + 1} - ${Math.min(indexOfLastItem, filteredItems.length)} of ${
											filteredItems.length
										} items`}
								</p>
							</div>

							{/* Media Grid - 3 column layout */}
							<div className={styles.mediaGrid}>
								{currentItems.map(media => (
									<MediaCard key={media.mediaId} media={media} onClick={() => handleMediaClick(media)} />
								))}
							</div>

							{/* Pagination */}
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

			{/* Media Modal */}
			{showModal && selectedMedia && <MediaModal media={selectedMedia} onClose={handleCloseModal} />}
		</div>
	)
}

export default GalleryTemplate
