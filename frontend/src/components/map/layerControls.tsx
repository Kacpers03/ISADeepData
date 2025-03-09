import React, { useState } from 'react';
import styles from '../../styles/map/map.module.css';

const LayerControls = ({ 
  showAreas, 
  setShowAreas, 
  showBlocks, 
  setShowBlocks, 
  showStations, 
  setShowStations,
  mapStyle,
  setMapStyle,
  associateStationsWithBlocks,
  associating,
  showSummary,
  setShowSummary
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activePanel, setActivePanel] = useState(null);
  
  const toggleControls = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setActivePanel('layers'); // Default to layers panel when opening
    } else {
      setActivePanel(null);
    }
  };

  const switchPanel = (panel) => {
    setActivePanel(panel);
  };

  return (
    <div className={styles.compactControls}>
      {/* Main toggle button */}
      <button 
        className={`${styles.controlsToggle} ${isOpen ? styles.controlsToggleActive : ''}`}
        onClick={toggleControls}
        aria-expanded={isOpen}
        aria-label="Toggle map controls"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
          <line x1="8" y1="2" x2="8" y2="18"></line>
          <line x1="16" y1="6" x2="16" y2="22"></line>
        </svg>
        <span className={styles.controlsToggleLabel}>Map Controls</span>
      </button>
      
      {/* Controls panel */}
      {isOpen && (
        <div className={styles.controlsPanel}>
          <div className={styles.controlsTabs}>
            <button 
              className={`${styles.controlsTab} ${activePanel === 'layers' ? styles.controlsTabActive : ''}`}
              onClick={() => switchPanel('layers')}
            >
              Layers
            </button>
            <button 
              className={`${styles.controlsTab} ${activePanel === 'style' ? styles.controlsTabActive : ''}`}
              onClick={() => switchPanel('style')}
            >
              Style
            </button>
            <button 
              className={`${styles.controlsTab} ${activePanel === 'display' ? styles.controlsTabActive : ''}`}
              onClick={() => switchPanel('display')}
            >
              Display
            </button>
          </div>
          
          <div className={styles.controlsContent}>
            {activePanel === 'layers' && (
              <div className={styles.layersPanel}>
                <div className={styles.layerToggles}>
                  <label className={styles.layerToggle}>
                    <input
                      type="checkbox"
                      checked={showAreas}
                      onChange={() => setShowAreas(!showAreas)}
                    />
                    <span className={styles.layerToggleLabel}>Areas</span>
                  </label>
                  
                  <label className={styles.layerToggle}>
                    <input
                      type="checkbox"
                      checked={showBlocks}
                      onChange={() => setShowBlocks(!showBlocks)}
                    />
                    <span className={styles.layerToggleLabel}>Blocks</span>
                  </label>
                  
                  <label className={styles.layerToggle}>
                    <input
                      type="checkbox"
                      checked={showStations}
                      onChange={() => setShowStations(!showStations)}
                    />
                    <span className={styles.layerToggleLabel}>Stations</span>
                  </label>
                </div>
                
                <button
                  className={styles.associateButton}
                  onClick={associateStationsWithBlocks}
                  disabled={associating}
                >
                  {associating ? (
                    <span className={styles.loadingSpinner}></span>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                      <line x1="12" y1="22.08" x2="12" y2="12"></line>
                    </svg>
                  )}
                  <span>{associating ? 'Processing...' : 'Associate Stations'}</span>
                </button>
              </div>
            )}
            
            {activePanel === 'style' && (
              <div className={styles.stylePanel}>
                <label className={styles.styleSelectLabel}>Map Style</label>
                <select
                  className={styles.styleSelect}
                  value={mapStyle}
                  onChange={(e) => setMapStyle(e.target.value)}
                >
                  <option value="mapbox://styles/mapbox/streets-v11">Streets</option>
                  <option value="mapbox://styles/mapbox/outdoors-v11">Outdoors</option>
                  <option value="mapbox://styles/mapbox/satellite-v9">Satellite</option>
                  <option value="mapbox://styles/mapbox/light-v10">Light</option>
                  <option value="mapbox://styles/mapbox/dark-v10">Dark</option>
                </select>
              </div>
            )}
            
            {activePanel === 'display' && (
              <div className={styles.displayPanel}>
                <label className={styles.layerToggle}>
                  <input
                    type="checkbox"
                    checked={showSummary}
                    onChange={() => setShowSummary(!showSummary)}
                  />
                  <span className={styles.layerToggleLabel}>Show Summary Panel</span>
                </label>
                <div className={styles.infoText}>
                  The summary panel displays statistics about currently visible exploration data.
                </div>
                <div className={styles.displayTip}>
                  <div className={styles.tipIcon}>💡</div>
                  <div className={styles.tipText}>
                    When you select a contractor, the map will automatically zoom to its areas.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LayerControls;