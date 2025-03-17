import React, { useState, useMemo } from 'react';
import { Source, Layer, useMap } from 'react-map-gl';
import styles from '../../../styles/map/map.module.css';
interface AreaLayerProps {
  area: {
    areaId: number;
    areaName: string;
    geoJson: any;
    blocks?: Array<{
      blockId: number;
      blockName: string;
      status: string;
      geoJson: any;
    }>;
  };
  showBlocks: boolean;
  onBlockClick: (blockId: number) => void;
}

const AreaBlockLayer: React.FC<AreaLayerProps> = ({ 
  area, 
  showBlocks, 
  onBlockClick 
}) => {
  const { current: map } = useMap();
  const [hoveredBlockId, setHoveredBlockId] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [tooltipContent, setTooltipContent] = useState('');
  
  // Function to get block status color
  const getBlockStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'active': return '#059669';    // Green
      case 'pending': return '#d97706';   // Amber
      case 'inactive': return '#6b7280';  // Gray
      case 'reserved': return '#3b82f6';  // Blue
      default: return '#059669';          // Default green
    }
  };
  
  // Dynamically set layer paint properties based on zoom level
  const getAreaPaint = useMemo(() => ({
    'fill-color': '#0077b6',
    'fill-opacity': [
      'interpolate',
      ['linear'],
      ['zoom'],
      2, 0.08,   // Less opacity when zoomed out
      6, 0.15    // More opacity when zoomed in
    ],
    'fill-outline-color': '#0077b6'
  }), []);
  
  const getAreaLinePaint = useMemo(() => ({
    'line-color': '#0077b6',
    'line-width': [
      'interpolate',
      ['linear'],
      ['zoom'],
      2, 1.5,    // Thinner line when zoomed out
      6, 2.5     // Thicker line when zoomed in
    ],
    'line-dasharray': [3, 2]
  }), []);
  
  // Handle mouse move over blocks for tooltip
  const handleMouseMove = (e: any) => {
    if (!map || !showBlocks) return;
    
    // Get features under the mouse
    const features = map.queryRenderedFeatures(e.point, {
      layers: area.blocks?.map(block => `block-fill-${block.blockId}`) || []
    });
    
    if (features.length > 0) {
      // Get block info
      const blockId = parseInt(features[0].layer.id.split('-')[2]);
      const block = area.blocks?.find(b => b.blockId === blockId);
      
      if (block) {
        setHoveredBlockId(blockId);
        setTooltipPosition({ x: e.point.x, y: e.point.y });
        setTooltipContent(`${block.blockName} - ${block.status}`);
      }
    } else {
      setHoveredBlockId(null);
    }
  };
  
  // Add event listeners when component mounts
  React.useEffect(() => {
    if (map && showBlocks) {
      map.on('mousemove', handleMouseMove);
      
      return () => {
        map.off('mousemove', handleMouseMove);
      };
    }
  }, [map, showBlocks, area.blocks]);
  
  return (
    <>
      {/* Area Layer */}
      <Source id={`area-source-${area.areaId}`} type="geojson" data={area.geoJson}>
        {/* Area Fill */}
        <Layer
          id={`area-fill-${area.areaId}`}
          type="fill"
          paint={getAreaPaint}
          beforeId="settlement-label"
        />
        
        {/* Area Outline */}
        <Layer
          id={`area-line-${area.areaId}`}
          type="line"
          paint={getAreaLinePaint}
          beforeId="settlement-label"
        />
        
        {/* Area Label - Dynamic sizing */}
        <Layer
          id={`area-label-${area.areaId}`}
          type="symbol"
          layout={{
            'text-field': area.areaName,
            'text-size': [
              'interpolate', ['linear'], ['zoom'],
              2, 10,  // Smaller text when zoomed out
              6, 14   // Larger text when zoomed in
            ],
            'text-anchor': 'center',
            'text-justify': 'center',
            'text-offset': [0, 0],
            'text-allow-overlap': false,
            'text-ignore-placement': false,
            'text-optional': true,
            'symbol-z-order': 'source'
          }}
          paint={{
            'text-color': '#0077b6',
            'text-halo-color': 'rgba(255, 255, 255, 0.9)',
            'text-halo-width': 1.5
          }}
          beforeId="settlement-label"
        />
      </Source>
      
      {/* Block Layers */}
      {showBlocks && area.blocks && area.blocks.map(block => (
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
          
          {/* Block Label - Only show when zoomed in enough */}
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
      ))}
      
      {/* Tooltip for hovered block */}
      {hoveredBlockId && (
        <div 
          className={styles.blockTooltip}
          style={{
            top: tooltipPosition.y - 40, // Position above cursor
            left: tooltipPosition.x
          }}
        >
          {tooltipContent}
        </div>
      )}
    </>
  );
};

export default AreaBlockLayer;