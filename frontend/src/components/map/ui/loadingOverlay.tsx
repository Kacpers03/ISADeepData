// frontend/src/components/map/ui/loadingOverlay.tsx
import React from 'react' // Import React
import styles from '../../../styles/map/base.module.css' // Import CSS styles

// Component that displays a loading spinner and message over the map
const LoadingOverlay = () => {
	return (
		<div className={styles.loadingOverlay}>
			{' '}
			{/* Full-screen overlay */}
			<div className={styles.loadingSpinner}></div> {/* Animated spinner */}
			<div className={styles.loadingText}>Loading map data...</div> {/* Loading message */}
		</div>
	)
}

export default LoadingOverlay
