import React, { useEffect } from 'react';
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
  // Debug logging when props change
  useEffect(() => {
    console.log(`CruiseLayer: ${cruises?.length || 0} cruises, showCruises=${showCruises}`);
    
    // If we're supposed to show cruises but have none, log it as a potential issue
    if (showCruises && (!cruises || cruises.length === 0)) {
      console.warn('CruiseLayer has showCruises=true but no cruises to display');
    }
  }, [cruises, showCruises]);

  // If not showing or no cruises, return null
  if (!showCruises || !cruises || cruises.length === 0) {
    return null;
  }

  // Group cruises by contractorId for better organization
  const cruisesByContractor = cruises.reduce((acc, cruise) => {
    const contractorId = cruise.contractorId || 'unknown';
    if (!acc[contractorId]) {
      acc[contractorId] = [];
    }
    acc[contractorId].push(cruise);
    return acc;
  }, {});

  // Debug log the grouped cruises
  console.log('CruiseLayer rendering cruises by contractor:', 
    Object.keys(cruisesByContractor).map(id => ({
      contractorId: id,
      cruiseCount: cruisesByContractor[id].length
    }))
  );

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