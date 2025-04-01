// frontend/src/components/map/ui/ZoomOutButton.tsx
import React from 'react';
import styles from '../../../styles/map/controls.module.css';

interface ZoomOutButtonProps {
  mapRef: any;
  resetToDefaultView?: boolean;
}

const ZoomOutButton: React.FC<ZoomOutButtonProps> = ({ mapRef, resetToDefaultView = false }) => {
  const handleZoomOut = () => {
    if (!mapRef.current) return;
    
    // Bruk nøyaktig samme metode som reset-knappen bruker
    mapRef.current.fitBounds(
      [[-180, -60], [180, 85]],
      { padding: 20, duration: 800, essential: true }
    );
  };

  return (
    <div className={styles.zoomOutButtonContainer}>
      <button 
        className={styles.zoomOutButton}
        onClick={handleZoomOut}
        aria-label="Zoom out"
        title="Zoom out"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="8" y1="11" x2="14" y2="11"></line>
        </svg>
        <span>Zoom Out</span>
      </button>
    </div>
  );
};

export default ZoomOutButton;