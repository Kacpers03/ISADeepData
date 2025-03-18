// frontend/src/components/map/MapLayers.tsx
import React from 'react';
import { Popup } from 'react-map-gl';
import panelStyles from '../../../styles/map/panels.module.css';
import markerStyles from '../../../styles/map/markers.module.css';

// Import layer components
import AreaLayer from './areaLayer';
import BlockLayer from './blockLayer';
import StationLayer from './stationLayer';
import CruiseLayer from './cruiseLayer';

interface MapLayersProps {
  showAreas: boolean;
  showBlocks: boolean;
  showStations: boolean;
  showCruises: boolean;
  areas: any[];
  cruises: any[];
  clusters: any[];
  clusterIndex: any;
  mapRef: any;
  hoveredBlockId: number | null;
  popupInfo: any;
  setPopupInfo: (info: any) => void;
  onBlockClick: (blockId: number) => void;
  onCruiseClick: (cruise: any) => void;
  onStationClick: (station: any) => void;
}
const styles = {
    ...panelStyles,
    ...markerStyles
  };
const MapLayers: React.FC<MapLayersProps> = ({
  showAreas,
  showBlocks,
  showStations,
  showCruises,
  areas,
  cruises,
  clusters,
  clusterIndex,
  mapRef,
  hoveredBlockId,
  popupInfo,
  setPopupInfo,
  onBlockClick,
  onCruiseClick,
  onStationClick
}) => {
  return (
    <>
      {/* Areas Layers */}
      {showAreas && areas.map(area => (
        <AreaLayer key={`area-${area.areaId}`} area={area} />
      ))}
      
      {/* Blocks Layers */}
      {showBlocks && areas.flatMap(area => 
        area.blocks ? area.blocks.map(block => (
          <BlockLayer 
            key={`block-${block.blockId}`} 
            block={block} 
            hoveredBlockId={hoveredBlockId}
            onBlockClick={onBlockClick}
          />
        )) : []
      )}

      {/* Cruises Layer */}
      <CruiseLayer 
        cruises={cruises} 
        showCruises={showCruises} 
        onCruiseClick={onCruiseClick} 
      />
      
      {/* Stations Layer */}
      <StationLayer 
        clusters={clusters} 
        showStations={showStations} 
        clusterIndex={clusterIndex}
        mapRef={mapRef}
        onStationClick={onStationClick}
      />

      {/* Popup for station info */}
      {popupInfo && (
        <Popup
          longitude={popupInfo.longitude}
          latitude={popupInfo.latitude}
          anchor="bottom"
          onClose={() => setPopupInfo(null)}
          className={styles.mapPopup}
          closeOnClick={false}
        >
          <div className={styles.popupContent}>
            <h3>{popupInfo.stationCode}</h3>
            <div className={styles.popupGrid}>
              <div className={styles.popupItem}>
                <span className={styles.popupLabel}>Type</span>
                <span>{popupInfo.stationType || 'Unknown'}</span>
              </div>
              <div className={styles.popupItem}>
                <span className={styles.popupLabel}>Status</span>
                <span>{popupInfo.contractorAreaBlockId ? 'Associated' : 'Unassociated'}</span>
              </div>
            </div>
            <button 
              className={styles.viewDetailsButton}
              onClick={() => onStationClick(popupInfo)}
            >
              View Details
            </button>
          </div>
        </Popup>
      )}
    </>
  );
};

export default MapLayers;