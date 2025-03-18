// frontend/src/components/map/hooks/useMapExport.ts
import { useCallback } from 'react';

/**
 * Custom hook for map data export functionality
 */
const useMapExport = (mapRef, mapData) => {
  /**
   * Export current map view as an image
   */
  const exportMapImage = useCallback(() => {
    if (!mapRef.current) return null;
    
    const map = mapRef.current.getMap();
    
    // Get the canvas element
    const canvas = map.getCanvas();
    
    // Convert the canvas to data URL
    try {
      const dataUrl = canvas.toDataURL('image/png');
      
      // Create a link and trigger download
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      link.download = `map-export-${timestamp}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return dataUrl;
    } catch (error) {
      console.error('Error exporting map image:', error);
      return null;
    }
  }, [mapRef]);
  
  /**
   * Export visible features as GeoJSON
   */
  const exportGeoJSON = useCallback(() => {
    if (!mapRef.current || !mapData) return null;
    
    const map = mapRef.current.getMap();
    
    // Get the current visible extent
    const bounds = map.getBounds();
    
    // Gather all visible features
    const visibleFeatures = map.queryRenderedFeatures({
      layers: ['area-fill', 'block-fill']
    });
    
    // Convert to GeoJSON
    const geojson = {
      type: 'FeatureCollection',
      features: visibleFeatures
    };
    
    // Download as file
    const dataStr = JSON.stringify(geojson, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const exportFileName = `map-data-${timestamp}.geojson`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileName);
    linkElement.click();
    
    return geojson;
  }, [mapRef, mapData]);
  
  /**
   * Export map data as CSV
   */
  const exportCSV = useCallback((data, filename = 'map-data') => {
    if (!data || !Array.isArray(data)) return null;
    
    // Convert data to CSV format
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(item => 
      Object.values(item)
        .map(val => typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val)
        .join(',')
    );
    
    const csvContent = [headers, ...rows].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}-${timestamp}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return csvContent;
  }, []);
  
  return {
    exportMapImage,
    exportGeoJSON,
    exportCSV
  };
};

export default useMapExport;