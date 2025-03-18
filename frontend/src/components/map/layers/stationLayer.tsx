import React from "react";
import StationMarker from '../markers/stationMarker';
import ClusterMarker from '../markers/clusterMarker';

interface StationLayerProps {
  clusters: any[];
  showStations: boolean;
  clusterIndex: any;
  mapRef: any;
  onStationClick: (station: any) => void;
}

const StationLayer: React.FC<StationLayerProps> = ({ 
  clusters, 
  showStations, 
  clusterIndex,
  mapRef,
  onStationClick 
}) => {
  if (!showStations || !clusters || clusters.length === 0) {
    return null;
  }

  return (
    <>
      {clusters.map(cluster => {
        // Is this a cluster?
        const isCluster = cluster.properties.cluster;
        const clusterId = isCluster ? `cluster-${cluster.properties.cluster_id}` : `station-${cluster.properties.stationId}`;
        
        if (isCluster) {
          return (
            <ClusterMarker
              key={clusterId}
              cluster={{
                id: clusterId,
                longitude: cluster.geometry.coordinates[0],
                latitude: cluster.geometry.coordinates[1],
                count: cluster.properties.point_count,
                // Add error handling for expansion zoom:
                expansionZoom: (() => {
                  try {
                    return clusterIndex.getClusterExpansionZoom(cluster.properties.cluster_id);
                  } catch (err) {
                    console.warn('Could not get expansion zoom for cluster:', cluster.properties.cluster_id);
                    return Math.min(mapRef.current?.getMap().getZoom() + 2 || 10, 16); // Default zoom increase
                  }
                })()
              }}
              onClick={() => {
                // Zoom in when cluster is clicked
                try {
                  const [longitude, latitude] = cluster.geometry.coordinates;
                  let expansionZoom;
                  
                  try {
                    expansionZoom = clusterIndex.getClusterExpansionZoom(cluster.properties.cluster_id);
                  } catch (err) {
                    console.warn('Could not get expansion zoom on click:', err.message);
                    // Use a default zoom increase as fallback
                    expansionZoom = Math.min(mapRef.current.getMap().getZoom() + 2, 16);
                  }
                  
                  mapRef.current.flyTo({
                    center: [longitude, latitude],
                    zoom: expansionZoom,
                    duration: 500
                  });
                } catch (err) {
                  console.error('Error handling cluster click:', err);
                }
              }}
            />
          );
        } else {
          // It's a single station
          const station = cluster.properties.stationData;
          return (
            <StationMarker
              key={clusterId}
              station={station}
              onClick={onStationClick}
            />
          );
        }
      })}
    </>
  );
};

export default StationLayer;