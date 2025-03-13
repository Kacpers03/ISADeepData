// frontend/src/components/map/CruiseMarker.jsx
import React from 'react';
import { Marker } from 'react-map-gl';
import styles from '../../styles/map/map.module.css';

const CruiseMarker = ({ cruise, onClick }) => {
  // Finn gjennomsnittlig posisjon for cruise basert på stasjoner
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
      anchor="center"
      onClick={(e) => {
        e.originalEvent.stopPropagation();
        onClick(cruise);
      }}
    >
      {/* Bruk samme stil som i CruiseVisualizationComponent */}
      <div className={styles.cruiseMarker}>
        {/* Harbor icon med oransje farge for valgt cruise */}
        <div 
          className={`${styles.harborIcon} ${cruise.isSelected ? styles.selectedCruise : ''}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* Bruk samme ikon som 'harbor-15' fra Mapbox */}
          <svg width="24" height="24" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="#fcb414" stroke="#ffffff" strokeWidth="1.5" />
            <path d="M12 6V16M8 10H16M7 16C8 13 16 13 17 16" stroke="#333" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        
        {/* Cruise-navn med stil som matcher CruiseVisualizationComponent */}
        <div 
          className={`${styles.cruiseLabel} ${cruise.isSelected ? styles.selectedCruiseLabel : ''}`}
          style={{
            fontSize: '12px',
            color: '#fcb414',
            textShadow: '1px 1px 1px rgba(0,0,0,0.5), -1px -1px 1px rgba(0,0,0,0.5), 1px -1px 1px rgba(0,0,0,0.5), -1px 1px 1px rgba(0,0,0,0.5)',
            whiteSpace: 'nowrap',
            fontWeight: 'bold',
            textAlign: 'center',
            marginTop: '2px'
          }}
        >
          {cruise.cruiseName}
        </div>
      </div>
    </Marker>
  );
};

export default CruiseMarker;