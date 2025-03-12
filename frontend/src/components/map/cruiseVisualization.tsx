// CruiseVisualizationComponent.jsx
// Denne komponenten kan legges til i EnhancedMapComponent.tsx
import React, { useState, useEffect } from 'react';
import { Source, Layer, Popup } from 'react-map-gl';
import styles from '../../styles/map/map.module.css';

const CruiseVisualizationComponent = ({ mapData, showCruises, selectedCruiseId, setSelectedCruiseId }) => {
  const [hoveredCruiseId, setHoveredCruiseId] = useState(null);
  const [popupInfo, setPopupInfo] = useState(null);

  // Behandle ingen data
  if (!mapData || !mapData.cruises || !showCruises) {
    return null;
  }

  // Konvertere cruise-data til GeoJSON features
  const createCruiseFeatures = () => {
    const features = [];

    mapData.cruises.forEach(cruise => {
      // Kun vis cruise med stasjoner
      if (!cruise.stations || cruise.stations.length === 0) return;
      
      // Lag en linje som forbinder alle stasjoner i cruise
      const stationCoordinates = cruise.stations.map(station => [
        station.longitude,
        station.latitude
      ]);
      
      // Legg til linjestreng feature
      features.push({
        type: 'Feature',
        properties: {
          cruiseId: cruise.cruiseId,
          cruiseName: cruise.cruiseName,
          researchVessel: cruise.researchVessel,
          startDate: cruise.startDate,
          endDate: cruise.endDate,
          isSelected: cruise.cruiseId === selectedCruiseId
        },
        geometry: {
          type: 'LineString',
          coordinates: stationCoordinates
        }
      });
      
      // Finn gjennomsnittlig posisjon for cruise-etikett
      const avgLat = cruise.stations.reduce((sum, s) => sum + s.latitude, 0) / cruise.stations.length;
      const avgLon = cruise.stations.reduce((sum, s) => sum + s.longitude, 0) / cruise.stations.length;
      
      // Legg til et punkt-feature for cruise-etikett
      features.push({
        type: 'Feature',
        properties: {
          cruiseId: cruise.cruiseId,
          cruiseName: cruise.cruiseName,
          isLabel: true,
          isSelected: cruise.cruiseId === selectedCruiseId
        },
        geometry: {
          type: 'Point',
          coordinates: [avgLon, avgLat]
        }
      });
    });

    return {
      type: 'FeatureCollection',
      features: features
    };
  };

  const cruiseGeoJson = createCruiseFeatures();

  // Stil for cruise-linjene
  const cruiseLineLayer = {
    id: 'cruise-lines',
    type: 'line',
    source: 'cruise-data',
    filter: ['!', ['has', 'isLabel']],
    paint: {
      'line-color': [
        'case',
        ['==', ['get', 'isSelected'], true], '#F59E0B', // Oransje for valgt cruise
        ['==', ['get', 'cruiseId'], hoveredCruiseId], '#3B82F6', // Blå for hover
        '#64748B' // Standard grå
      ],
      'line-width': [
        'case',
        ['==', ['get', 'isSelected'], true], 3,
        ['==', ['get', 'cruiseId'], hoveredCruiseId], 2,
        1.5
      ],
      'line-dasharray': [3, 2]
    }
  };

  // Stil for cruise-etiketter
  const cruiseLabelLayer = {
    id: 'cruise-labels',
    type: 'symbol',
    source: 'cruise-data',
    filter: ['has', 'isLabel'],
    layout: {
      'text-field': ['get', 'cruiseName'],
      'text-size': 12,
      'text-offset': [0, -1.5],
      'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
      'text-radial-offset': 0.5,
      'text-justify': 'auto',
      'icon-image': 'harbor-15',
      'icon-size': 1.2,
      'icon-allow-overlap': true,
      'text-allow-overlap': false
    },
    paint: {
      'text-color': [
        'case',
        ['==', ['get', 'isSelected'], true], '#F59E0B',
        ['==', ['get', 'cruiseId'], hoveredCruiseId], '#3B82F6',
        '#64748B'
      ],
      'text-halo-color': 'rgba(255, 255, 255, 0.9)',
      'text-halo-width': 1.5
    }
  };

  // Interaktivitet - mouseover og klikk
  const handleMouseMove = (e) => {
    if (e.features && e.features.length > 0) {
      const cruiseId = e.features[0].properties.cruiseId;
      setHoveredCruiseId(cruiseId);
      
      // Vis popup ved hover
      if (!e.features[0].properties.isLabel) {
        const cruise = mapData.cruises.find(c => c.cruiseId === cruiseId);
        if (cruise) {
          setPopupInfo({
            longitude: e.lngLat.lng,
            latitude: e.lngLat.lat,
            cruiseId: cruiseId,
            cruiseName: cruise.cruiseName,
            researchVessel: cruise.researchVessel,
            startDate: new Date(cruise.startDate).toLocaleDateString(),
            endDate: new Date(cruise.endDate).toLocaleDateString(),
            stationCount: cruise.stations?.length || 0
          });
        }
      }
    } else {
      setHoveredCruiseId(null);
      setPopupInfo(null);
    }
  };

  const handleClick = (e) => {
    if (e.features && e.features.length > 0) {
      const cruiseId = e.features[0].properties.cruiseId;
      setSelectedCruiseId(cruiseId);
      setPopupInfo(null); // Lukk popup ved klikk
    }
  };

  return (
    <>
      <Source id="cruise-data" type="geojson" data={cruiseGeoJson}>
        <Layer {...cruiseLineLayer} />
        <Layer {...cruiseLabelLayer} />
      </Source>

      {/* Interaktive lag */}
      <Source
        id="cruise-interactive-lines"
        type="geojson"
        data={cruiseGeoJson}
      >
        <Layer
          id="cruise-hover-line"
          type="line"
          source="cruise-interactive-lines"
          filter={['!', ['has', 'isLabel']]}
          paint={{
            'line-color': 'transparent',
            'line-width': 10
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => {
            setHoveredCruiseId(null);
            setPopupInfo(null);
          }}
          onClick={handleClick}
        />
      </Source>

      {/* Popup for cruise-info */}
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
            <h3>{popupInfo.cruiseName}</h3>
            <div className={styles.popupGrid}>
              <div className={styles.popupItem}>
                <span className={styles.popupLabel}>Fartøy</span>
                <span>{popupInfo.researchVessel}</span>
              </div>
              <div className={styles.popupItem}>
                <span className={styles.popupLabel}>Periode</span>
                <span>{popupInfo.startDate} - {popupInfo.endDate}</span>
              </div>
              <div className={styles.popupItem}>
                <span className={styles.popupLabel}>Stasjoner</span>
                <span>{popupInfo.stationCount}</span>
              </div>
            </div>
            <button 
              className={styles.viewDetailsButton}
              onClick={() => {
                setSelectedCruiseId(popupInfo.cruiseId);
                setPopupInfo(null);
              }}
            >
              Vis detaljer
            </button>
          </div>
        </Popup>
      )}
    </>
  );
};

export default CruiseVisualizationComponent;