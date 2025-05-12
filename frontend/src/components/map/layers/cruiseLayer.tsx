// frontend/src/components/map/layers/cruiseLayer.tsx
import React, { useEffect } from 'react' // Import React and useEffect hook
import CruiseMarker from '../markers/cruiseMarker' // Import the cruise marker component

// Interface defining cruise layer properties
interface CruiseLayerProps {
	cruises: any[] // Array of cruise objects
	showCruises: boolean // Flag to toggle cruise visibility
	onCruiseClick: (cruise: any) => void // Click handler for cruise selection
}

// Component that renders cruise markers on the map
const CruiseLayer: React.FC<CruiseLayerProps> = ({ cruises, showCruises, onCruiseClick }) => {
	// Debug logging when props change
	useEffect(() => {
		console.log(`CruiseLayer: ${cruises?.length || 0} cruises, showCruises=${showCruises}`)

		// If we're supposed to show cruises but have none, log it as a potential issue
		if (showCruises && (!cruises || cruises.length === 0)) {
			console.warn('CruiseLayer has showCruises=true but no cruises to display')
		}
	}, [cruises, showCruises]) // Run when cruises or visibility changes

	// If not showing or no cruises, return null
	if (!showCruises || !cruises || cruises.length === 0) {
		return null
	}

	// Group cruises by contractorId for better organization
	const cruisesByContractor = cruises.reduce((acc, cruise) => {
		const contractorId = cruise.contractorId || 'unknown' // Default to 'unknown' if no contractorId
		if (!acc[contractorId]) {
			acc[contractorId] = [] // Initialize array for this contractor
		}
		acc[contractorId].push(cruise) // Add cruise to contractor group
		return acc
	}, {})

	// Debug log the grouped cruises
	console.log(
		'CruiseLayer rendering cruises by contractor:',
		Object.keys(cruisesByContractor).map(id => ({
			contractorId: id,
			cruiseCount: cruisesByContractor[id].length,
		}))
	)

	// Render a marker for each cruise
	return (
		<>
			{cruises.map(cruise => (
				<CruiseMarker key={`cruise-marker-${cruise.cruiseId}`} cruise={cruise} onClick={onCruiseClick} />
			))}
		</>
	)
}

export default CruiseLayer
