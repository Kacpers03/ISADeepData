// frontend/src/components/map/ui/ZoomOutButton.tsx
import React from 'react' // Import React
import styles from '../../../styles/map/controls.module.css' // Import control styles
import { useLanguage } from '../../../contexts/languageContext' // Import language context for translations

// Interface defining zoom out button properties
interface ZoomOutButtonProps {
	mapRef: any // Reference to map component
	resetToDefaultView?: boolean // Optional flag to reset to default view instead of just zooming out
}

// Component that displays a button to zoom out or reset the map view
const ZoomOutButton: React.FC<ZoomOutButtonProps> = ({ mapRef, resetToDefaultView = false }) => {
	const { t } = useLanguage() // Get translation function from language context

	// Handler for zoom out button click
	const handleZoomOut = () => {
		if (!mapRef.current) return // Skip if map not ready

		// Use the same method as the reset button uses
		mapRef.current.fitBounds(
			[
				[-180, -60], // Southwest corner of world
				[180, 85], // Northeast corner of world (avoiding extreme north)
			],
			{ padding: 20, duration: 800, essential: true } // Animation settings
		)
	}

	return (
		<div className={styles.zoomOutButtonContainer}>
			<button
				className={styles.zoomOutButton}
				onClick={handleZoomOut}
				aria-label={t('map.controls.zoomOut') || 'Zoom out'} // Accessible label with translation
				title={t('map.controls.zoomOutTitle') || 'Zoom out'}>
				{' '}
				{/* Tooltip text with translation */}
				<svg
					xmlns='http://www.w3.org/2000/svg'
					width='20'
					height='20'
					viewBox='0 0 24 24'
					fill='none'
					stroke='currentColor'
					strokeWidth='2'
					strokeLinecap='round'
					strokeLinejoin='round'>
					<circle cx='11' cy='11' r='8'></circle>
					<line x1='8' y1='11' x2='14' y2='11'></line>
				</svg>
				<span>{t('map.controls.zoomOut') || 'Zoom Out'}</span> {/* Button text with translation */}
			</button>
		</div>
	)
}

export default ZoomOutButton
