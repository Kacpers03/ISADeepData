import React from 'react';
import { Marker } from 'react-map-gl';
import styles from '../../styles/map/map.module.css';

interface ClusterMarkerProps {
  cluster: {
    id: string;
    longitude: number;
    latitude: number;
    count: number;
    expansionZoom: number;
  };
  onClick: () => void;
}

const ClusterMarker: React.FC<ClusterMarkerProps> = ({ cluster, onClick }) => {
  // Determine size based on point count
  const getSize = () => {
    const count = cluster.count;
    if (count < 10) return 35;
    if (count < 50) return 45;
    if (count < 100) return 55;
    return 65;
  };
  
  const size = getSize();
  
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
        className={styles.clusterMarker}
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
      >
        <div className={styles.clusterCount}>
          {cluster.count}
        </div>
      </div>
    </Marker>
  );
};

export default ClusterMarker;