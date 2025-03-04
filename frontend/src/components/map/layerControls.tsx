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
  associating
}) => {
  const [expanded, setExpanded] = useState(false);
  const [activePanel, setActivePanel] = useState(null);

  const togglePanel = (panel) => {
    if (activePanel === panel) {
      setActivePanel(null);
    } else {
      setActivePanel(panel);
      setExpanded(true);
    }
  };

  return (
    <div className={styles.layerControlsContainer}>
      <div className={styles.layerControlsMain}>
        <div 
          className={`${styles.controlsButton} ${activePanel === 'layers' ? styles.activeButton : ''}`}
          onClick={() => togglePanel('layers')}
        >
          <span className={styles.buttonIcon}>🔍</span>
          Map Layers
        </div>
        
        <div 
          className={`${styles.controlsButton} ${activePanel === 'style' ? styles.activeButton : ''}`}
          onClick={() => togglePanel('style')}
        >
          <span className={styles.buttonIcon}>🎨</span>
          Map Style
        </div>
      </div>
      
      {activePanel && (
        <div className={styles.layerControlsPanel}>
          <div className={styles.panelHeader}>
            <h3>{activePanel === 'layers' ? 'Map Layers' : 'Map Style'}</h3>
            <button 
              className={styles.closePanel}
              onClick={() => setActivePanel(null)}
            >
              ×
            </button>
          </div>
          
          <div className={styles.panelContent}>
            {activePanel === 'layers' && (
              <>
                <label className={styles.layerToggleItem}>
                  <input
                    type="checkbox"
                    checked={showAreas}
                    onChange={() => setShowAreas(!showAreas)}
                  />
                  Areas
                </label>
                <label className={styles.layerToggleItem}>
                  <input
                    type="checkbox"
                    checked={showBlocks}
                    onChange={() => setShowBlocks(!showBlocks)}
                  />
                  Blocks
                </label>
                <label className={styles.layerToggleItem}>
                  <input
                    type="checkbox"
                    checked={showStations}
                    onChange={() => setShowStations(!showStations)}
                  />
                  Stations
                </label>

                <button
                  className={styles.associateButton}
                  onClick={associateStationsWithBlocks}
                  disabled={associating}
                >
                  {associating ? 'Processing...' : 'Associate Stations with Blocks'}
                </button>
              </>
            )}
            
            {activePanel === 'style' && (
              <div className={styles.styleOptions}>
                <label className={styles.styleLabel}>Select Map Style</label>
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
          </div>
        </div>
      )}
    </div>
  );
};

export default LayerControls;