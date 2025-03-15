import React from 'react';
import { Marker } from 'react-map-gl';
import styles from '../../styles/map/map.module.css';

const CruiseMarker = ({ cruise, onClick }) => {
  // Calculate average position for cruise based on stations
  const calculateAveragePosition = () => {
    if (!cruise.stations || cruise.stations.length === 0) {
      return { lat: 0, lng: 0 };
    }
    
    const avgLat = cruise.stations.reduce((sum, s) => sum + s.latitude, 0) / cruise.stations.length;
    const avgLon = cruise.stations.reduce((sum, s) => sum + s.longitude, 0) / cruise.stations.length;
    
    return { lat: avgLat, lng: avgLon };
  };
  
  const position = calculateAveragePosition();
  
  if (position.lat === 0 && position.lng === 0) {
    return null;
  }
  
  return (
    <Marker 
      longitude={position.lng} 
      latitude={position.lat}
      anchor="bottom"
      onClick={(e) => {
        e.originalEvent.stopPropagation();
        onClick(cruise);
      }}
    >
      <div className={styles.cruiseMarker}>
        {/* Cruise name appears above the icon */}
        <div 
          className={`${styles.cruiseLabel} ${cruise.isSelected ? styles.selectedCruiseLabel : ''}`}
        >
          {cruise.cruiseName}
        </div>
        
        {/* Use SVG anchor instead of emoji for color control */}
        <div 
          className={`${styles.cruiseIcon} ${cruise.isSelected ? styles.selectedCruise : ''}`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8C14.2091 8 16 6.20914 16 4C16 1.79086 14.2091 0 12 0C9.79086 0 8 1.79086 8 4C8 6.20914 9.79086 8 12 8Z" fill="#8B4513"/>
            <path d="M12 9V21" stroke="#8B4513" strokeWidth="3" strokeLinecap="round"/>
            <path d="M5 13.4V17.4C5 17.4 8 21.5 12 17.4C16 21.5 19 17.4 19 17.4V13.4" stroke="#8B4513" strokeWidth="3" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
    </Marker>
  );
};

export default CruiseMarker;