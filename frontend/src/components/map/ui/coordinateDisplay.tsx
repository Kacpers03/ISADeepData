// frontend/src/components/map/ui/CoordinateDisplay.tsx
import React from 'react' // Import React
import styles from '../../../styles/map/base.module.css' // Import CSS styles

// Interface defining coordinate display properties
interface CoordinateDisplayProps {
	latitude: string | number // Latitude value (can be string or number)
	longitude: string | number // Longitude value (can be string or number)
}

// Simple component to display geographic coordinates on the map
const CoordinateDisplay: React.FC<CoordinateDisplayProps> = ({ latitude, longitude }) => {
	return (
		<div className={styles.coordinateDisplay}>
			{latitude}, {longitude} {/* Display coordinates separated by comma */}
		</div>
	)
}

export default CoordinateDisplay
