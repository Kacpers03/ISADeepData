// frontend/src/components/map/hooks/useMapState.ts
import { useState, useRef } from 'react' // Import React hooks for state and refs

// Custom hook for managing map view state and related properties
const useMapState = () => {
	// Map view state - position and camera information
	const [viewState, setViewState] = useState({
		longitude: 0, // Initial longitude at Prime Meridian
		latitude: 20, // Initial latitude slightly north of equator
		zoom: 1.8, // Initial zoom level to show most of the world
		bearing: 0, // Initial bearing (rotation) of the map
		pitch: 0, // Initial pitch (tilt) of the map
	})

	// Reference to map instance
	const mapRef = useRef(null) // Store reference to Mapbox component
	const [initialLoadComplete, setInitialLoadComplete] = useState(false) // Track if initial map load is finished

	// Cursor position for coordinates display
	const [cursorPosition, setCursorPosition] = useState({
		latitude: 0, // Initial latitude
		longitude: 0, // Initial longitude
	})

	// Map style
	const [mapStyle, setMapStyle] = useState('mapbox://styles/mapbox/outdoors-v11') // Default outdoors style

	// Return state and setters
	return {
		viewState, // Current map position and zoom
		setViewState, // Function to update view state
		mapRef, // Reference to map component
		initialLoadComplete, // Whether initial loading is done
		setInitialLoadComplete, // Function to set load status
		cursorPosition, // Current mouse position
		setCursorPosition, // Function to update cursor position
		mapStyle, // Current map style URL
		setMapStyle, // Function to change map style
	}
}

export default useMapState
