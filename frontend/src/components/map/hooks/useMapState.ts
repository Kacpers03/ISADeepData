// frontend/src/components/map/hooks/useMapState.ts
import { useState, useRef } from "react";

/**
 * Custom hook for managing map view state and related properties
 */
const useMapState = () => {
  // Map view state
  const [viewState, setViewState] = useState({
    longitude: 0,
    latitude: 20,
    zoom: 1.8,
    bearing: 0,
    pitch: 0
  });
  
  // Reference to maintain current view state across rerenders
  const mapRef = useRef(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  
  // Cursor position for coordinates display
  const [cursorPosition, setCursorPosition] = useState({ 
    latitude: 0, 
    longitude: 0 
  });
  
  // Map style
  const [mapStyle, setMapStyle] = useState("mapbox://styles/mapbox/outdoors-v11");

  return {
    viewState,
    setViewState,
    mapRef,
    initialLoadComplete,
    setInitialLoadComplete,
    cursorPosition,
    setCursorPosition,
    mapStyle,
    setMapStyle
  };
};

export default useMapState;