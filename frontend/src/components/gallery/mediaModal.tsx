import React, { useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import styles from '../../styles/gallery/gallery.module.css'
import { useLanguage } from '../../contexts/languageContext' // Import language context

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

interface MediaModalProps {
	media: MediaItem
	onClose: () => void
}

const MediaModal: React.FC<MediaModalProps> = ({ media, onClose }) => {
	const { t } = useLanguage() // Use the language context
	const modalRef = useRef<HTMLDivElement>(null)
	const videoRef = useRef<HTMLVideoElement>(null)
	const router = useRouter()

	// Determine if media is video
	const isVideo =
		media.mediaType?.toLowerCase().includes('video') || media.fileName.match(/\.(mp4|webm|avi|mov|wmv|flv)$/i)

	// Format date for display
	const formattedDate = media.captureDate
		? new Date(media.captureDate).toLocaleDateString()
		: t('gallery.modal.dateUnknown') || 'Date unknown'

	// Format coordinates for display
	const formatCoordinates = () => {
		if (!media.latitude || !media.longitude) return t('gallery.modal.notAvailable') || 'Not available'

		const lat = Math.abs(media.latitude).toFixed(4) + (media.latitude >= 0 ? '°N' : '°S')
		const lon = Math.abs(media.longitude).toFixed(4) + (media.longitude >= 0 ? '°E' : '°W')

		return `${lat}, ${lon}`
	}

	// Close modal when clicking outside
	const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
			onClose()
		}
	}

	// Handle keyboard events
	useEffect(() => {
		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				onClose()
			}
		}

		// Pause video on close
		const pauseVideo = () => {
			if (videoRef.current) {
				videoRef.current.pause()
			}
		}

		document.addEventListener('keydown', handleEsc)

		// Prevent background scrolling when modal is open
		document.body.style.overflow = 'hidden'

		return () => {
			document.removeEventListener('keydown', handleEsc)
			document.body.style.overflow = 'auto'
			pauseVideo()
		}
	}, [onClose])

	// Function to show on map
	const handleShowOnMap = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()

		console.log('Show on Map clicked for station ID:', media.stationId)

		// Store ALL necessary info with very explicit names to avoid confusion
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
			<div className={styles.modalContent} ref={modalRef}>
				<button className={styles.closeButton} onClick={onClose}>
					×
				</button>

				<div className={styles.modalBody}>
					<div className={styles.mediaViewerContainer}>
						{isVideo ? (
							// Video player
							<div className={styles.videoWrapper}>
								<video
									ref={videoRef}
									src={media.fileUrl}
									className={styles.videoPlayer}
									controls
									autoPlay
									poster={media.thumbnailUrl}
								/>
							</div>
						) : (
							// Image viewer
							<div className={styles.imageWrapper}>
								<img src={media.fileUrl} alt={media.fileName} className={styles.fullImage} />
							</div>
						)}
					</div>

					<div className={styles.mediaDetailsContainer}>
						<h2 className={styles.mediaModalTitle}>{media.fileName}</h2>

						{media.description && (
							<div className={styles.mediaDescription}>
								<p>{media.description}</p>
							</div>
						)}

						<div className={styles.mediaDetailsList}>
							<div className={styles.mediaDetailItem}>
								<span className={styles.mediaDetailLabel}>{t('gallery.modal.mediaType') || 'Media Type'}:</span>
								<span className={styles.mediaDetailValue}>
									{isVideo ? t('gallery.modal.video') || 'Video' : t('gallery.modal.image') || 'Image'}
								</span>
							</div>

							{media.captureDate && (
								<div className={styles.mediaDetailItem}>
									<span className={styles.mediaDetailLabel}>{t('gallery.modal.captureDate') || 'Capture Date'}:</span>
									<span className={styles.mediaDetailValue}>{formattedDate}</span>
								</div>
							)}

							{media.stationCode && (
								<div className={styles.mediaDetailItem}>
									<span className={styles.mediaDetailLabel}>{t('gallery.modal.station') || 'Station'}:</span>
									<span className={styles.mediaDetailValue}>{media.stationCode}</span>
								</div>
							)}

							{media.cruiseName && (
								<div className={styles.mediaDetailItem}>
									<span className={styles.mediaDetailLabel}>{t('gallery.modal.cruise') || 'Cruise'}:</span>
									<span className={styles.mediaDetailValue}>{media.cruiseName}</span>
								</div>
							)}

							{media.contractorName && (
								<div className={styles.mediaDetailItem}>
									<span className={styles.mediaDetailLabel}>{t('gallery.modal.contractor') || 'Contractor'}:</span>
									<span className={styles.mediaDetailValue}>{media.contractorName}</span>
								</div>
							)}

							{media.sampleCode && (
								<div className={styles.mediaDetailItem}>
									<span className={styles.mediaDetailLabel}>{t('gallery.modal.sample') || 'Sample'}:</span>
									<span className={styles.mediaDetailValue}>{media.sampleCode}</span>
								</div>
							)}

							{media.latitude && media.longitude && (
								<div className={styles.mediaDetailItem}>
									<span className={styles.mediaDetailLabel}>{t('gallery.modal.coordinates') || 'Coordinates'}:</span>
									<span className={styles.mediaDetailValue}>{formatCoordinates()}</span>
								</div>
							)}

							{media.cameraSpecs && (
								<div className={styles.mediaDetailItem}>
									<span className={styles.mediaDetailLabel}>{t('gallery.modal.cameraSpecs') || 'Camera Specs'}:</span>
									<span className={styles.mediaDetailValue}>{media.cameraSpecs}</span>
								</div>
							)}
						</div>

						<div className={styles.mediaActions}>
							<a
								href={media.fileUrl}
								download={media.fileName}
								className={styles.downloadButton}
								target='_blank'
								rel='noopener noreferrer'
								onClick={e => e.stopPropagation()}>
								{t('gallery.modal.download') || 'Download'}
							</a>

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
