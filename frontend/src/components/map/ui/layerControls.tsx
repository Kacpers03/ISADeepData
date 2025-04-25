import React, { useState, useRef, useEffect } from 'react';
import styles from '../../../styles/map/controls.module.css';
import { useLanguage } from '../../../contexts/languageContext';
const CompactLayerControls = ({ 
  showAreas, 
  setShowAreas, 
  showBlocks, 
  setShowBlocks, 
  showStations, 
  setShowStations,
  showCruises,  // Ny prop
  setShowCruises, // Ny prop
  mapStyle,
  setMapStyle,
  showSummary,
  setShowSummary
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activePanel, setActivePanel] = useState(null);
  const controlsRef = useRef(null);
  const panelRef = useRef(null);
  const { t } = useLanguage();
  
  // Function to toggle the controls panel
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

  // Calculate fixed position for the controls panel to prevent it from moving when opened/closed
  useEffect(() => {
    if (controlsRef.current && panelRef.current && isOpen) {
      // This ensures the panel stays in a fixed position relative to the toggle button
      panelRef.current.style.position = 'absolute';
      panelRef.current.style.right = '0';
      panelRef.current.style.bottom = '50px'; // Position above the toggle button
      
      // Set max-height to ensure the panel doesn't overflow viewport
      const maxHeight = window.innerHeight - 100; // Keep some space from top/bottom edges
      panelRef.current.style.maxHeight = `${maxHeight}px`;
      panelRef.current.style.overflowY = 'auto';
    }
  }, [isOpen]);

  return (
    <div className={styles.compactControls} ref={controlsRef}>
      {/* Main toggle button */}
      <button 
        className={`${styles.controlsToggle} ${isOpen ? styles.controlsToggleActive : ''}`}
        onClick={toggleControls}
        aria-expanded={isOpen}
        aria-label={t('map.controls.toggleMapControls') || "Toggle map controls"}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
          <line x1="8" y1="2" x2="8" y2="18"></line>
          <line x1="16" y1="6" x2="16" y2="22"></line>
        </svg>
        <span className={styles.controlsToggleLabel}>{t('map.controls.mapControls') || "Map Controls"}</span>
      </button>
      
      {/* Controls panel */}
      {isOpen && (
        <div className={styles.controlsPanel} ref={panelRef}>
          {/* Tabs navigation */}
          <div className={styles.controlsTabs}>
            <button 
              className={`${styles.controlsTab} ${activePanel === 'layers' ? styles.controlsTabActive : ''}`}
              onClick={() => switchPanel('layers')}
            >
              {t('map.controls.tabs.layers') || "Layers"}
            </button>
            <button 
              className={`${styles.controlsTab} ${activePanel === 'style' ? styles.controlsTabActive : ''}`}
              onClick={() => switchPanel('style')}
            >
              {t('map.controls.tabs.style') || "Style"}
            </button>
            <button 
              className={`${styles.controlsTab} ${activePanel === 'display' ? styles.controlsTabActive : ''}`}
              onClick={() => switchPanel('display')}
            >
              {t('map.controls.tabs.display') || "Display"}
            </button>
            <button 
              className={`${styles.controlsTab} ${activePanel === 'info' ? styles.controlsTabActive : ''}`}
              onClick={() => switchPanel('info')}
            >
              {t('map.controls.tabs.info') || "Info"}
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
                    <span className={styles.layerToggleLabel}>{t('map.controls.layers.areas') || "Areas"}</span>
                  </label>
                  
                  <label className={styles.layerToggle}>
                    <input
                      type="checkbox"
                      checked={showBlocks}
                      onChange={() => setShowBlocks(!showBlocks)}
                    />
                    <span className={styles.layerToggleLabel}>{t('map.controls.layers.blocks') || "Blocks"}</span>
                  </label>
                  
                  <label className={styles.layerToggle}>
                    <input
                      type="checkbox"
                      checked={showStations}
                      onChange={() => setShowStations(!showStations)}
                    />
                    <span className={styles.layerToggleLabel}>{t('map.controls.layers.stations') || "Stations"}</span>
                  </label>
                  
                  <label className={styles.layerToggle}>
                    <input
                      type="checkbox"
                      checked={showCruises}
                      onChange={() => setShowCruises(!showCruises)}
                    />
                    <span className={styles.layerToggleLabel}>{t('map.controls.layers.cruises') || "Cruises"}</span>
                  </label>
                </div>
              </div>
            )}
            
            {activePanel === 'style' && (
              <div className={styles.stylePanel}>
                <label className={styles.styleSelectLabel}>{t('map.controls.style.mapStyle') || "Map Style"}</label>
                <select
                  className={styles.styleSelect}
                  value={mapStyle}
                  onChange={(e) => setMapStyle(e.target.value)}
                >
                  <option value="mapbox://styles/mapbox/streets-v11">{t('map.controls.style.streets') || "Streets"}</option>
                  <option value="mapbox://styles/mapbox/outdoors-v11">{t('map.controls.style.outdoors') || "Outdoors"}</option>
                  <option value="mapbox://styles/mapbox/satellite-v9">{t('map.controls.style.satellite') || "Satellite"}</option>
                  <option value="mapbox://styles/mapbox/light-v10">{t('map.controls.style.light') || "Light"}</option>
                  <option value="mapbox://styles/mapbox/dark-v10">{t('map.controls.style.dark') || "Dark"}</option>
                </select>
              </div>
            )}
            
            {activePanel === 'display' && (
              <div className={styles.displayPanel}>
                <button 
                  className={styles.toggleSummaryButton}
                  onClick={() => setShowSummary(!showSummary)}
                >
                  {showSummary ? t('map.controls.display.hideSummary') || 'Hide Summary Panel' : t('map.controls.display.showSummary') || 'Show Summary Panel'}
                </button>
                <div className={styles.infoText}>
                  {t('map.controls.display.summaryDescription') || "The summary panel displays statistics about currently visible exploration data."}
                </div>
                <div className={styles.displayTip}>
                  <div className={styles.tipIcon}>💡</div>
                  <div className={styles.tipText}>
                    {t('map.controls.display.tip') || "When you select a contractor, the map will automatically zoom to its areas."}
                  </div>
                </div>
              </div>
            )}
            
            {activePanel === 'info' && (
              <div className={styles.infoPanel}>
                <div className={styles.mapLegendCompact}>
                  <div className={styles.legendItem}>
                    <div className={styles.stationMarkerIcon}></div>
                    <div>
                      <strong>{t('map.controls.info.stations') || "Stations"}</strong>
                      <div className={styles.legendDescription}>{t('map.controls.info.stationsDesc') || "Exploration or research sites with collected data"}</div>
                    </div>
                  </div>
                  
                  <div className={styles.legendItem}>
                    <div className={styles.blockIcon}></div>
                    <div>
                      <strong>{t('map.controls.info.blocks') || "Blocks"}</strong>
                      <div className={styles.legendDescription}>{t('map.controls.info.blocksDesc') || "Designated exploration areas by contractor"}</div>
                    </div>
                  </div>
                  
                  <div className={styles.legendItem}>
                    <div className={styles.areaIcon}></div>
                    <div>
                      <strong>{t('map.controls.info.areas') || "Areas"}</strong>
                      <div className={styles.legendDescription}>{t('map.controls.info.areasDesc') || "Larger zones containing multiple blocks"}</div>
                    </div>
                  </div>
                  
                  <div className={styles.legendItem}>
                    <div className={styles.cruiseIcon}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 8C14.2091 8 16 6.20914 16 4C16 1.79086 14.2091 0 12 0C9.79086 0 8 1.79086 8 4C8 6.20914 9.79086 8 12 8Z" fill="#8B4513"/>
                        <path d="M12 9V21" stroke="#8B4513" strokeWidth="3" strokeLinecap="round"/>
                        <path d="M5 13.4V17.4C5 17.4 8 21.5 12 17.4C16 21.5 19 17.4 19 17.4V13.4" stroke="#8B4513" strokeWidth="3" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div>
                      <strong>{t('map.controls.info.cruises') || "Cruises"}</strong>
                      <div className={styles.legendDescription}>{t('map.controls.info.cruisesDesc') || "Research voyages with connected stations"}</div>
                    </div>
                  </div>
                </div>
                <div className={styles.infoTip}>
                  <div className={styles.tipIcon}>ℹ️</div>
                  <div className={styles.tipText}>
                    {t('map.controls.info.filterTip') || "Use filters on the left to search by contractor or region"}
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

export default CompactLayerControls;

