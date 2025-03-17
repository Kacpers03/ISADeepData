import React from 'react';
import CruiseMarker from '../markers/cruiseMarker';

interface CruiseLayerProps {
  cruises: any[];
  showCruises: boolean;
  onCruiseClick: (cruise: any) => void;
}

const CruiseLayer: React.FC<CruiseLayerProps> = ({ 
  cruises, 
  showCruises, 
  onCruiseClick 
}) => {
  if (!showCruises || !cruises || cruises.length === 0) {
    return null;
  }

  return (
    <>
      {cruises.map(cruise => (
        <CruiseMarker
          key={`cruise-marker-${cruise.cruiseId}`}
          cruise={cruise}
          onClick={onCruiseClick}
        />
      ))}
    </>
  );
};

export default CruiseLayer;