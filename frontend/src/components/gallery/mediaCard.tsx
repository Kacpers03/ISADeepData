import React, { useState } from 'react' // Import React and useState hook
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

// Props interface for the MediaCard component
interface MediaCardProps {
	media: MediaItem // The media item to display
	onClick: () => void // Callback function when card is clicked
}

const MediaCard: React.FC<MediaCardProps> = ({ media, onClick }) => {
	const { t } = useLanguage() // Use the language context for translations
	const [imageError, setImageError] = useState(false) // Track if thumbnail image failed to load
	const [isLoading, setIsLoading] = useState(true) // Track if thumbnail is still loading

	// Determine if media is video or image based on mediaType or file extension
	const isVideo =
		media.mediaType?.toLowerCase().includes('video') || media.fileName.match(/\.(mp4|webm|avi|mov|wmv|flv)$/i)

	// Format date for display - convert to local date string or show "Date unknown"
	const formattedDate = media.captureDate
		? new Date(media.captureDate).toLocaleDateString()
		: t('gallery.card.dateUnknown') || 'Date unknown'

	// Handle thumbnail load error - show fallback content
	const handleImageError = () => {
		setImageError(true) // Mark image as failed
		setIsLoading(false) // No longer loading
	}

	// Handle thumbnail load success
	const handleImageLoad = () => {
		setIsLoading(false) // Image loaded successfully
	}

	// Truncate filename if too long for better display
	const truncateFileName = (name: string, maxLength: number = 20) => {
		if (name.length <= maxLength) return name // Return unchanged if short enough

		const extension = name.split('.').pop() // Get file extension
		const baseName = name.substring(0, name.lastIndexOf('.')) // Get name without extension

		// Return truncated name with extension
		return `${baseName.substring(0, maxLength - extension!.length - 3)}...${extension}`
	}

	// Prevent click propagation when clicking download
	// This stops the card onClick from triggering when download button is clicked
	const handleDownloadClick = (e: React.MouseEvent) => {
		e.stopPropagation()
	}

	return (
		<div className={styles.mediaCard}>
			{' '}
			{/* Main card container */}
			<div className={styles.mediaThumbnail} onClick={onClick}>
				{' '}
				{/* Thumbnail container - clickable */}
				{/* Loading spinner - shown while thumbnail is loading */}
				{isLoading && (
					<div className={styles.thumbnailLoading}>
						<div className={styles.spinner}></div>
					</div>
				)}
				{isVideo ? (
					// Video thumbnail with play icon overlay
					<>
						{!imageError ? (
							// Try to load video thumbnail
							<img
								src={media.thumbnailUrl || '/images/video-placeholder.jpg'} // Use placeholder if no thumbnail
								alt={media.fileName}
								className={styles.thumbnailImage}
								onError={handleImageError} // Handle loading errors
								onLoad={handleImageLoad} // Handle successful load
							/>
						) : (
							// Fallback for failed video thumbnails
							<div className={styles.fallbackThumbnail}>
								<span className={styles.videoIcon}>🎬</span> {/* Film emoji as fallback */}
							</div>
						)}
						{/* Play button overlay for videos */}
						<div className={styles.playIconOverlay}>
							<svg className={styles.playIcon} viewBox='0 0 24 24'>
								<path d='M8 5v14l11-7z' />
							</svg>
						</div>
					</>
				) : // Image thumbnail handling
				!imageError ? (
					// Try to load image thumbnail
					<img
						src={media.thumbnailUrl || media.fileUrl || '/images/image-placeholder.jpg'} // Use file URL or placeholder if no thumbnail
						alt={media.fileName}
						className={styles.thumbnailImage}
						onError={handleImageError} // Handle loading errors
						onLoad={handleImageLoad} // Handle successful load
					/>
				) : (
					// Fallback for failed image thumbnails
					<div className={styles.fallbackThumbnail}>
						<span className={styles.imageIcon}>🖼️</span> {/* Picture frame emoji as fallback */}
					</div>
				)}
				{/* Media type badge - shows whether item is an image or video */}
				<div className={styles.mediaTypeBadge}>
					{isVideo ? t('gallery.card.video') || 'Video' : t('gallery.card.image') || 'Image'}
				</div>
			</div>
			<div className={styles.mediaInfo} onClick={onClick}>
				{' '}
				{/* Information section - clickable */}
				<h3 className={styles.mediaTitle} title={media.fileName}>
					{' '}
					{/* Title with full filename as tooltip */}
					{truncateFileName(media.fileName)} {/* Truncated filename for display */}
				</h3>
				<div className={styles.mediaDetails}>
					{' '}
					{/* Details section with metadata */}
					{/* Station information - only shown if available */}
					{media.stationCode && (
						<div className={styles.detailItem}>
							<span className={styles.detailLabel}>{t('gallery.card.station') || 'Station'}:</span>
							<span className={styles.detailValue}>{media.stationCode}</span>
						</div>
					)}
					{/* Capture date - only shown if available */}
					{media.captureDate && (
						<div className={styles.detailItem}>
							<span className={styles.detailLabel}>{t('gallery.card.date') || 'Date'}:</span>
							<span className={styles.detailValue}>{formattedDate}</span>
						</div>
					)}
					{/* Contractor information - only shown if available */}
					{media.contractorName && (
						<div className={styles.detailItem}>
							<span className={styles.detailLabel}>{t('gallery.card.contractor') || 'Contractor'}:</span>
							<span className={styles.detailValue} title={media.contractorName}>
								{' '}
								{/* Full name as tooltip */}
								{media.contractorName.length > 15
									? `${media.contractorName.substring(0, 15)}...` // Truncate long contractor names
									: media.contractorName}
							</span>
						</div>
					)}
				</div>
			</div>
			{/* Card action buttons */}
			<div className={styles.cardActions}>
				{/* View details button - opens modal */}
				<button className={styles.viewButton} onClick={onClick}>
					{t('gallery.card.viewDetails') || 'View Details'}
				</button>
				{/* Download link - opens in new tab */}
				<a
					href={media.fileUrl}
					target='_blank'
					rel='noopener noreferrer' // Security best practice for external links
					className={styles.downloadButton}
					onClick={handleDownloadClick}>
					{' '}
					{/* Stop propagation to prevent card click */}
					{t('gallery.card.download') || 'Download'}
				</a>
			</div>
		</div>
	)
}

export default MediaCard
