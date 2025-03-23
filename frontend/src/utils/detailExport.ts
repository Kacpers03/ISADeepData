// frontend/src/utils/detailExport.ts
import { Station, Cruise, Contractor, MapData } from '../types/filter-types';
import { convertToCSV } from './csvExport';

/**
 * Finds a contractor in the full mapData based on contractorId
 * @param mapData The complete map data
 * @param contractorId The ID of the contractor to find
 * @returns The contractor object or null if not found
 */
const findContractor = (mapData: MapData, contractorId: number): Contractor | null => {
  if (!mapData || !mapData.contractors) return null;
  return mapData.contractors.find(c => c.contractorId === contractorId) || null;
};

/**
 * Finds a cruise in the full mapData based on cruiseId
 * @param mapData The complete map data
 * @param cruiseId The ID of the cruise to find
 * @returns The cruise object or null if not found
 */
const findCruise = (mapData: MapData, cruiseId: number): Cruise | null => {
  if (!mapData || !mapData.cruises) return null;
  return mapData.cruises.find(c => c.cruiseId === cruiseId) || null;
};

/**
 * Export station data including its parent cruise and contractor
 * to ensure all relationships are maintained in the export
 * 
 * @param station The station to export
 * @param mapData The full map data to find relationships
 * @param filename The base filename (without extension)
 * @returns boolean indicating success or failure
 */
export const exportStationCSV = (station: Station, mapData: MapData, filename = 'station-data'): boolean => {
  if (!station) {
    console.error('No station data provided for CSV export');
    return false;
  }
  
  try {
    // Find the parent cruise in the full dataset to get complete cruise data
    const parentCruise = findCruise(mapData, station.cruiseId);
    
    // Find the contractor if we have a cruise with contractorId
    const contractorId = parentCruise?.contractorId;
    const parentContractor = contractorId ? findContractor(mapData, contractorId) : null;
    
    // Create a mini-dataset focused on this station with all relationships intact
    const exportData: MapData = {
      contractors: parentContractor ? [parentContractor] : [], 
      cruises: parentCruise ? [{
        ...parentCruise,
        // Make sure the cruise only includes this specific station
        stations: [station]
      }] : [{
        cruiseId: station.cruiseId,
        cruiseName: station.cruiseName || `Cruise #${station.cruiseId}`,
        contractorId: station.contractorId || 0,
        stations: [station]
      }]
    };
    
    // Add UTF-8 BOM for Excel compatibility
    const bomPrefix = '\uFEFF';
    
    // Use the standard CSV converter with our focused dataset
    const csvString = convertToCSV(exportData);
    const fileContent = bomPrefix + csvString;
    
    // Create a Blob with the CSV data
    const blob = new Blob([fileContent], { type: 'text/csv;charset=utf-8;' });
    
    // Create a download URL
    const url = URL.createObjectURL(blob);
    
    // Add date and station code to filename for uniqueness
    const date = new Date().toISOString().split('T')[0];
    const stationCode = station.stationCode || `station-${station.stationId}`;
    const fullFilename = `${filename}-${stationCode.replace(/\s+/g, '_')}-${date}.csv`;
    
    // Create and trigger a download link
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fullFilename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL object
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error creating station CSV export:', error);
    return false;
  }
};

/**
 * Export cruise data including all its stations, samples, and parent contractor
 * to ensure all relationships are maintained in the export
 * 
 * @param cruise The cruise to export
 * @param mapData The full map data to find relationships
 * @param filename The base filename (without extension)
 * @returns boolean indicating success or failure
 */
export const exportCruiseCSV = (cruise: Cruise, mapData: MapData, filename = 'cruise-data'): boolean => {
  if (!cruise) {
    console.error('No cruise data provided for CSV export');
    return false;
  }
  
  try {
    // Find the parent contractor to include in export
    const parentContractor = cruise.contractorId ? findContractor(mapData, cruise.contractorId) : null;
    
    // Create a mini-dataset focused on this cruise with all relationships intact
    const exportData: MapData = {
      contractors: parentContractor ? [parentContractor] : [],
      cruises: [cruise]
    };
    
    // Add UTF-8 BOM for Excel compatibility
    const bomPrefix = '\uFEFF';
    
    // Use the standard CSV converter with our focused dataset
    const csvString = convertToCSV(exportData);
    const fileContent = bomPrefix + csvString;
    
    // Create a Blob with the CSV data
    const blob = new Blob([fileContent], { type: 'text/csv;charset=utf-8;' });
    
    // Create a download URL
    const url = URL.createObjectURL(blob);
    
    // Add date and cruise name to filename for uniqueness
    const date = new Date().toISOString().split('T')[0];
    const cruiseName = cruise.cruiseName || `cruise-${cruise.cruiseId}`;
    const fullFilename = `${filename}-${cruiseName.replace(/\s+/g, '_')}-${date}.csv`;
    
    // Create and trigger a download link
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fullFilename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL object
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error creating cruise CSV export:', error);
    return false;
  }
};

/**
 * Export contractor data including all its areas, blocks, cruises, stations, etc.
 * to ensure all relationships are maintained in the export
 * 
 * @param contractor The contractor to export
 * @param mapData The full map data to find relationships
 * @param filename The base filename (without extension)
 * @returns boolean indicating success or failure
 */
export const exportContractorCSV = (contractor: Contractor, mapData: MapData, filename = 'contractor-data'): boolean => {
  if (!contractor) {
    console.error('No contractor data provided for CSV export');
    return false;
  }
  
  try {
    // Find all cruises that belong to this contractor
    const contractorCruises = mapData.cruises?.filter(cruise => 
      cruise.contractorId === contractor.contractorId
    ) || [];
    
    // Create a mini-dataset focused on just this contractor and its cruises
    const exportData: MapData = {
      contractors: [contractor],
      cruises: contractorCruises
    };
    
    // Add UTF-8 BOM for Excel compatibility
    const bomPrefix = '\uFEFF';
    
    // Use the standard CSV converter with our focused dataset
    const csvString = convertToCSV(exportData);
    const fileContent = bomPrefix + csvString;
    
    // Create a Blob with the CSV data
    const blob = new Blob([fileContent], { type: 'text/csv;charset=utf-8;' });
    
    // Create a download URL
    const url = URL.createObjectURL(blob);
    
    // Add date and contractor name to filename for uniqueness
    const date = new Date().toISOString().split('T')[0];
    const contractorName = contractor.contractorName || `contractor-${contractor.contractorId}`;
    const fullFilename = `${filename}-${contractorName.replace(/\s+/g, '_').substring(0, 30)}-${date}.csv`;
    
    // Create and trigger a download link
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fullFilename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL object
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error creating contractor CSV export:', error);
    return false;
  }
};

export default {
  exportStationCSV,
  exportCruiseCSV,
  exportContractorCSV
};