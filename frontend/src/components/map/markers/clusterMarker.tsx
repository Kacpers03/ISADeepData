import React, { useState, useRef, useEffect } from 'react';
import { Marker } from 'react-map-gl';
import styles from '../../../styles/map/markers.module.css';

interface ClusterMarkerProps {
  cluster: {
    id: string;
    longitude: number;
    latitude: number;
    count: number;
    expansionZoom: number;
  };
  clusterIndex: any; // Supercluster instance
  onClick: () => void;
  points?: any[]; // The actual points in this cluster
  activeClusterId: string | null; // Currently active cluster
  setActiveClusterId: (id: string | null) => void; // Function to set active cluster
}

const ClusterMarker: React.FC<ClusterMarkerProps> = ({ 
  cluster, 
  clusterIndex,
  onClick,
  points,
  activeClusterId,
  setActiveClusterId
}) => {
  const isActive = activeClusterId === cluster.id;
  const tooltipRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);
  
  // Determine size based on point count
  const getSize = () => {
    const count = cluster.count;
    if (count < 10) return 35;
    if (count < 50) return 45;
    if (count < 100) return 55;
    return 65;
  };
  
  const size = getSize();
  
  // Get stations in this cluster
  const getClusterStations = () => {
    if (!points || !points.length) {
      // If points aren't provided directly, try to get them from clusterIndex
      try {
        if (clusterIndex) {
          // Get the cluster leaves (stations in this cluster)
          const leaves = clusterIndex.getLeaves(
            parseInt(cluster.id.replace('cluster-', '')), 
            Math.min(cluster.count, 10) // Limit to 10 stations to avoid oversized tooltip
          );
          
          return leaves.map(leaf => leaf.properties.stationData);
        }
      } catch (err) {
        console.warn('Could not get cluster stations:', err.message);
      }
      return [];
    }
    
    // If points are directly provided, use them
    return points.map(p => p.properties?.stationData).filter(Boolean);
  };
  
  const stations = getClusterStations();

  // Handle mouse enter to set this cluster as active
  const handleMouseEnter = () => {
    setActiveClusterId(cluster.id);
  };
  
  // Effect to add a global click handler to detect clicks outside the tooltip
  useEffect(() => {
    if (!isActive) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      // If the click is outside both the marker and its tooltip, close the tooltip
      if (
        tooltipRef.current && 
        markerRef.current && 
        !tooltipRef.current.contains(event.target as Node) &&
        !markerRef.current.contains(event.target as Node)
      ) {
        setActiveClusterId(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isActive, setActiveClusterId]);
  
  return (
    <Marker
      longitude={cluster.longitude}
      latitude={cluster.latitude}
      onClick={e => {
        e.originalEvent.stopPropagation();
        onClick();
      }}
    >
      <div 
        ref={markerRef}
        className={`${styles.clusterMarker} ${isActive ? styles.active : ''}`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
        onMouseEnter={handleMouseEnter}
      >
        <div className={styles.clusterCount}>
          {cluster.count}
        </div>
        
        {/* Tooltip that shows when this is the active cluster */}
        {isActive && stations.length > 0 && (
          <div 
            ref={tooltipRef}
            className={`${styles.clusterTooltip} ${styles.persistentTooltip}`}
            onClick={(e) => e.stopPropagation()} // Prevent clicks inside tooltip from closing it
          >
            <div className={styles.clusterTooltipHeader}>
              <strong>{cluster.count} stations in this area</strong>
              <span className={styles.clusterTooltipSubtext}>
                Click to zoom in
              </span>
            </div>
            <div className={styles.clusterTooltipContent}>
              {stations.slice(0, 6).map((station, index) => (
                <div 
                  key={station?.stationId || index} 
                  className={styles.clusterStationItem}
                  onClick={(e) => {
                    e.stopPropagation();
                    // If there's a handler for station clicks, call it
                    if (typeof window.showStationDetails === 'function' && station?.stationId) {
                      window.showStationDetails(station.stationId);
                      // Close the tooltip after selecting a station
                      setActiveClusterId(null);
                    }
                  }}
                >
                  <span className={styles.stationCode}>{station?.stationCode || `Station #${station?.stationId}`}</span>
                  <span className={styles.stationType}>{station?.stationType || 'Unknown'}</span>
                </div>
              ))}
              {cluster.count > 6 && (
                <div className={styles.clusterMoreStations}>
                  + {cluster.count - 6} more stations...
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Marker>
  );
};

export default ClusterMarker;