import React, { useEffect, useRef } from 'react' // Import React and hooks
import { useRouter } from 'next/router' // Import Next.js router for navigation
import styles from '../../styles/gallery/gallery.module.css' // Import CSS module for styling
import { useLanguage } from '../../contexts/languageContext' // Import language context for translations

// Interface defining the structure of a media item
interface MediaItem {
	mediaId: number // Unique identifier for the media
	fileName: string // Name of the file
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

// Props interface for the MediaModal component
interface MediaModalProps {
	media: MediaItem // The media item to display in the modal
	onClose: () => void // Callback function to close the modal
}

const MediaModal: React.FC<MediaModalProps> = ({ media, onClose }) => {
	const { t } = useLanguage() // Use the language context for translations
	const modalRef = useRef<HTMLDivElement>(null) // Reference to modal content div for click detection
	const videoRef = useRef<HTMLVideoElement>(null) // Reference to video element for controlling playback
	const router = useRouter() // Next.js router for navigation

	// Determine if media is video based on mediaType or file extension
	const isVideo =
		media.mediaType?.toLowerCase().includes('video') || media.fileName.match(/\.(mp4|webm|avi|mov|wmv|flv)$/i)

	// Format date for display - convert to local date string or show "Date unknown"
	const formattedDate = media.captureDate
		? new Date(media.captureDate).toLocaleDateString()
		: t('gallery.modal.dateUnknown') || 'Date unknown'

	// Format coordinates for display in a human-readable format
	const formatCoordinates = () => {
		if (!media.latitude || !media.longitude) return t('gallery.modal.notAvailable') || 'Not available'

		// Convert to degrees N/S and E/W notation with 4 decimal places
		const lat = Math.abs(media.latitude).toFixed(4) + (media.latitude >= 0 ? '°N' : '°S')
		const lon = Math.abs(media.longitude).toFixed(4) + (media.longitude >= 0 ? '°E' : '°W')

		return `${lat}, ${lon}`
	}

	// Close modal when clicking outside the content area
	const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
			onClose() // Call the onClose callback
		}
	}

	// Setup event listeners and handle cleanup
	useEffect(() => {
		// Handle Escape key press to close modal
		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				onClose()
			}
		}

		// Function to pause video when modal closes
		const pauseVideo = () => {
			if (videoRef.current) {
				videoRef.current.pause()
			}
		}

		document.addEventListener('keydown', handleEsc) // Add keyboard event listener

		// Prevent background scrolling when modal is open
		document.body.style.overflow = 'hidden'

		// Cleanup function that runs when component unmounts
		return () => {
			document.removeEventListener('keydown', handleEsc) // Remove keyboard event listener
			document.body.style.overflow = 'auto' // Restore scrolling
			pauseVideo() // Pause video if playing
		}
	}, [onClose]) // Dependency on onClose callback

	// Function to show the media location on map
	const handleShowOnMap = (e: React.MouseEvent) => {
		e.preventDefault() // Prevent default link behavior
		e.stopPropagation() // Prevent event from bubbling up

		console.log('Show on Map clicked for station ID:', media.stationId)

		// Store location information in sessionStorage for the map page to use
		if (media.stationId && media.latitude && media.longitude) {
			try {
				// Save station ID
				sessionStorage.setItem('mapShowStationId', media.stationId.toString())

				// Save coordinates as both object and individual values for redundancy
				const coordinates = {
					latitude: media.latitude,
					longitude: media.longitude,
				}
				sessionStorage.setItem('mapShowCoordinates', JSON.stringify(coordinates))
				sessionStorage.setItem('mapShowLatitude', media.latitude.toString())
				sessionStorage.setItem('mapShowLongitude', media.longitude.toString())

				// Save station name
				sessionStorage.setItem(
					'mapShowStationName',
					media.stationCode || `${t('gallery.modal.station') || 'Station'} #${media.stationId}`
				)

				// Save zoom level explicitly
				sessionStorage.setItem('mapShowZoomLevel', '16')

				// Save cruise and contractor IDs if available
				if (media.cruiseId) {
					sessionStorage.setItem('mapShowCruiseId', media.cruiseId.toString())
				}
				if (media.contractorId) {
					sessionStorage.setItem('mapShowContractorId', media.contractorId.toString())
				}

				console.log('Successfully saved station data to sessionStorage:', {
					stationId: media.stationId,
					lat: media.latitude,
					lon: media.longitude,
					name: media.stationCode || `${t('gallery.modal.station') || 'Station'} #${media.stationId}`,
				})
			} catch (e) {
				console.error('Error saving to sessionStorage:', e)
			}
		} else {
			console.warn('Missing required station data:', {
				id: media.stationId,
				lat: media.latitude,
				lon: media.longitude,
			})
		}

		// Navigate to map page
		router.push('/map')
	}

	return (
		<div className={styles.modalOverlay} onClick={handleOutsideClick}>
			{' '}
			{/* Semi-transparent overlay - clicking it closes the modal */}
			<div className={styles.modalContent} ref={modalRef}>
				{' '}
				{/* Main modal container with ref for click detection */}
				<button className={styles.closeButton} onClick={onClose}>
					{' '}
					{/* Close button (X) in top corner */}×
				</button>
				<div className={styles.modalBody}>
					{' '}
					{/* Main content area with media and details */}
					<div className={styles.mediaViewerContainer}>
						{' '}
						{/* Container for media viewer (left side) */}
						{isVideo ? (
							// Video player for video media
							<div className={styles.videoWrapper}>
								<video
									ref={videoRef} // Reference for controlling video playback
									src={media.fileUrl}
									className={styles.videoPlayer}
									controls // Show video controls
									autoPlay // Start playing automatically when modal opens
									poster={media.thumbnailUrl} // Show thumbnail until video loads
								/>
							</div>
						) : (
							// Image viewer for image media
							<div className={styles.imageWrapper}>
								<img src={media.fileUrl} alt={media.fileName} className={styles.fullImage} />
							</div>
						)}
					</div>
					<div className={styles.mediaDetailsContainer}>
						{' '}
						{/* Container for media details (right side) */}
						<h2 className={styles.mediaModalTitle}>{media.fileName}</h2> {/* Media filename as title */}
						{/* Description section - only shown if media has a description */}
						{media.description && (
							<div className={styles.mediaDescription}>
								<p>{media.description}</p>
							</div>
						)}
						<div className={styles.mediaDetailsList}>
							{' '}
							{/* List of media metadata */}
							{/* Media type */}
							<div className={styles.mediaDetailItem}>
								<span className={styles.mediaDetailLabel}>{t('gallery.modal.mediaType') || 'Media Type'}:</span>
								<span className={styles.mediaDetailValue}>
									{isVideo ? t('gallery.modal.video') || 'Video' : t('gallery.modal.image') || 'Image'}
								</span>
							</div>
							{/* Capture date - only shown if available */}
							{media.captureDate && (
								<div className={styles.mediaDetailItem}>
									<span className={styles.mediaDetailLabel}>{t('gallery.modal.captureDate') || 'Capture Date'}:</span>
									<span className={styles.mediaDetailValue}>{formattedDate}</span>
								</div>
							)}
							{/* Station code - only shown if available */}
							{media.stationCode && (
								<div className={styles.mediaDetailItem}>
									<span className={styles.mediaDetailLabel}>{t('gallery.modal.station') || 'Station'}:</span>
									<span className={styles.mediaDetailValue}>{media.stationCode}</span>
								</div>
							)}
							{/* Cruise name - only shown if available */}
							{media.cruiseName && (
								<div className={styles.mediaDetailItem}>
									<span className={styles.mediaDetailLabel}>{t('gallery.modal.cruise') || 'Cruise'}:</span>
									<span className={styles.mediaDetailValue}>{media.cruiseName}</span>
								</div>
							)}
							{/* Contractor name - only shown if available */}
							{media.contractorName && (
								<div className={styles.mediaDetailItem}>
									<span className={styles.mediaDetailLabel}>{t('gallery.modal.contractor') || 'Contractor'}:</span>
									<span className={styles.mediaDetailValue}>{media.contractorName}</span>
								</div>
							)}
							{/* Sample code - only shown if available */}
							{media.sampleCode && (
								<div className={styles.mediaDetailItem}>
									<span className={styles.mediaDetailLabel}>{t('gallery.modal.sample') || 'Sample'}:</span>
									<span className={styles.mediaDetailValue}>{media.sampleCode}</span>
								</div>
							)}
							{/* Coordinates - only shown if both latitude and longitude are available */}
							{media.latitude && media.longitude && (
								<div className={styles.mediaDetailItem}>
									<span className={styles.mediaDetailLabel}>{t('gallery.modal.coordinates') || 'Coordinates'}:</span>
									<span className={styles.mediaDetailValue}>{formatCoordinates()}</span>
								</div>
							)}
							{/* Camera specifications - only shown if available */}
							{media.cameraSpecs && (
								<div className={styles.mediaDetailItem}>
									<span className={styles.mediaDetailLabel}>{t('gallery.modal.cameraSpecs') || 'Camera Specs'}:</span>
									<span className={styles.mediaDetailValue}>{media.cameraSpecs}</span>
								</div>
							)}
						</div>
						<div className={styles.mediaActions}>
							{' '}
							{/* Container for action buttons */}
							{/* Download button */}
							<a
								href={media.fileUrl}
								download={media.fileName} // Suggest filename for download
								className={styles.downloadButton}
								target='_blank'
								rel='noopener noreferrer' // Security best practice for external links
								onClick={e => e.stopPropagation()}>
								{' '}
								{/* Prevent closing modal when clicking download */}
								{t('gallery.modal.download') || 'Download'}
							</a>
							{/* Show on Map button - only displayed if coordinates are available */}
							{media.latitude && media.longitude && (
								<button onClick={handleShowOnMap} className={styles.viewOnMapButton}>
									{t('gallery.modal.showOnMap') || 'Show on Map'}
								</button>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default MediaModal
