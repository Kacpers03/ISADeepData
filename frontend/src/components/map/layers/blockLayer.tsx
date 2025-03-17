import React from "react";
import { Source, Layer } from 'react-map-gl';

interface BlockLayerProps {
  block: {
    blockId: number;
    blockName: string;
    status: string;
    geoJson: any;
    centerLatitude?: number;
    centerLongitude?: number;
    areaSizeKm2?: number;
  };
  hoveredBlockId: number | null;
  onBlockClick: (blockId: number) => void;
}

const BlockLayer: React.FC<BlockLayerProps> = ({ 
  block, 
  hoveredBlockId, 
  onBlockClick 
}) => {
  // Get appropriate color based on block status
  const getBlockStatusColor = (status: string): string => {
    switch (status?.toLowerCase()) {
      case 'active': return '#059669';    // Green
      case 'pending': return '#d97706';   // Amber
      case 'inactive': return '#6b7280';  // Gray
      case 'reserved': return '#3b82f6';  // Blue
      default: return '#059669';          // Default green
    }
  };
  
  return (
    <Source 
      key={`block-source-${block.blockId}`}
      id={`block-source-${block.blockId}`}
      type="geojson" 
      data={block.geoJson}
    >
      {/* Block Fill */}
      <Layer
        id={`block-fill-${block.blockId}`}
        type="fill"
        paint={{
          'fill-color': getBlockStatusColor(block.status),
          'fill-opacity': hoveredBlockId === block.blockId ? 0.6 : 0.3,
          'fill-outline-color': getBlockStatusColor(block.status)
        }}
        beforeId="settlement-label"
        onClick={() => onBlockClick(block.blockId)}
      />
      
      {/* Block Outline */}
      <Layer
        id={`block-line-${block.blockId}`}
        type="line"
        paint={{
          'line-color': getBlockStatusColor(block.status),
          'line-width': hoveredBlockId === block.blockId ? 2 : 1.5,
        }}
        beforeId="settlement-label"
      />
      
      {/* Block Label */}
      <Layer
        id={`block-label-${block.blockId}`}
        type="symbol"
        layout={{
          'text-field': block.blockName,
          'text-size': [
            'interpolate', ['linear'], ['zoom'],
            4, 0,    // Hide text when zoomed out
            5, 10,   // Start showing small text
            8, 12    // Larger text when zoomed in
          ],
          'text-anchor': 'center',
          'text-justify': 'center',
          'text-allow-overlap': false,
          'text-ignore-placement': false,
          'text-optional': true
        }}
        paint={{
          'text-color': '#1e3a8a',
          'text-halo-color': 'rgba(255, 255, 255, 0.9)',
          'text-halo-width': 1.5
        }}
        beforeId="settlement-label"
      />
    </Source>
  );
};

export default BlockLayer;