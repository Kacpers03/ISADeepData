// frontend/src/utils/csvExport.ts

/**
 * Forbedret CSV-eksport med data formatert i kolonner for Excel
 */

// Typer definisjon
interface Contractor {
    contractorId: number;
    contractorName: string;
    contractType?: string;
    sponsoringState?: string;
    contractualYear?: number;
    contractStatus?: string;
    areas?: any[];
  }
  
  interface Cruise {
    cruiseId: number;
    cruiseName?: string;
    contractorId: number;
    startDate?: string;
    endDate?: string;
    centerLatitude?: number;
    centerLongitude?: number;
    stations?: Station[];
  }
  
  interface Station {
    stationId: number;
    stationCode?: string;
    stationType?: string;
    latitude: number;
    longitude: number;
    collectionDate?: string;
  }
  
  interface MapData {
    contractors: Contractor[];
    cruises: Cruise[];
  }
  
  /**
   * Lager en Excel-vennlig CSV-fil der hver verdi plasseres i egen kolonne
   */
  export const convertToCSV = (data: MapData): string => {
    if (!data) return '';
  
    // Vi bruker tabulatorer som separator for å sikre at Excel tolker hver verdi som egen kolonne
    // Excel foretrekker tabulatorer for automatisk kolonneseparering
    const separator = '\t';
    
    // Vi lagrer alle rader her
    const allRows: string[] = [];
    
    // TABELL 1: CONTRACTORS
    if (data.contractors && data.contractors.length > 0) {
      // Legg til tabellnavn i bold (Excel vil tolke dette som en enkel overskrift)
      allRows.push(`CONTRACTORS`);
      
      // Kolonneoverskrifter - uten separator, hver verdi i egen celle
      const contractorHeaders = [
        'ID', 
        'Name', 
        'Mineral Type', 
        'Sponsoring State', 
        'Year', 
        'Status'
      ];
      allRows.push(contractorHeaders.join(separator));
      
      // Legg til contractor data
      data.contractors.forEach(contractor => {
        const row = [
          contractor.contractorId,
          contractor.contractorName || '',
          contractor.contractType || '',
          contractor.sponsoringState || '',
          contractor.contractualYear?.toString() || '',
          contractor.contractStatus || ''
        ];
        allRows.push(row.join(separator));
      });
      
      // Legg til tomme rader som separator
      allRows.push('');
      allRows.push('');
    }
    
    // TABELL 2: CRUISES
    if (data.cruises && data.cruises.length > 0) {
      // Legg til tabellnavn
      allRows.push(`CRUISES`);
      
      // Kolonneoverskrifter
      const cruiseHeaders = [
        'ID', 
        'Name', 
        'Contractor ID',
        'Contractor Name',
        'Start Date', 
        'End Date',
        'Latitude',
        'Longitude'
      ];
      allRows.push(cruiseHeaders.join(separator));
      
      // Legg til cruise data med contractor navn
      data.cruises.forEach(cruise => {
        // Finn tilhørende contractor
        const contractor = data.contractors.find(c => c.contractorId === cruise.contractorId);
        const contractorName = contractor ? contractor.contractorName : '';
        
        const row = [
          cruise.cruiseId,
          cruise.cruiseName || '',
          cruise.contractorId,
          contractorName,
          cruise.startDate ? new Date(cruise.startDate).toISOString().split('T')[0] : '',
          cruise.endDate ? new Date(cruise.endDate).toISOString().split('T')[0] : '',
          cruise.centerLatitude ? cruise.centerLatitude.toFixed(6) : '',
          cruise.centerLongitude ? cruise.centerLongitude.toFixed(6) : ''
        ];
        
        allRows.push(row.join(separator));
      });
      
      // Legg til tomme rader som separator
      allRows.push('');
      allRows.push('');
    }
    
    // TABELL 3: STATIONS
    // Hent alle stasjoner fra alle cruises
    const allStations = data.cruises.flatMap(cruise => 
      (cruise.stations || []).map(station => ({
        ...station,
        cruiseId: cruise.cruiseId,
        cruiseName: cruise.cruiseName
      }))
    );
    
    if (allStations.length > 0) {
      // Legg til tabellnavn
      allRows.push(`STATIONS`);
      
      // Kolonneoverskrifter
      const stationHeaders = [
        'ID', 
        'Code', 
        'Type',
        'Cruise ID',
        'Cruise Name',
        'Latitude', 
        'Longitude'
      ];
      allRows.push(stationHeaders.join(separator));
      
      // Legg til station data
      allStations.forEach(station => {
        const row = [
          station.stationId,
          station.stationCode || '',
          station.stationType || '',
          station.cruiseId,
          station.cruiseName || '',
          station.latitude ? station.latitude.toFixed(6) : '',
          station.longitude ? station.longitude.toFixed(6) : ''
        ];
        
        allRows.push(row.join(separator));
      });
    }
    
    // Kombiner alle rader
    return allRows.join('\n');
  };
  
  /**
   * Generate and download data as a CSV file
   * @param data Map data object
   * @param filename Base filename without extension
   */
  export const downloadCSV = (data: MapData, filename = 'exploration-data'): boolean => {
    if (!data) {
      console.error('No data provided for CSV export');
      return false;
    }
    
    try {
      // Convert data to TSV format (Tab Separated Values for Excel)
      const tsvString = convertToCSV(data);
      
      // For Excel-kompatibilitet, legg til BOM (Byte Order Mark)
      // Dette hjelper Excel med å gjenkjenne UTF-8 tegnsett korrekt
      const bomPrefix = '\uFEFF';
      const fileContent = bomPrefix + tsvString;
      
      // Create a Blob with the TSV data
      // Selv om vi bruker tab separasjon, beholder vi .csv filending fordi
      // det er mer kjent for brukerne
      const blob = new Blob([fileContent], { type: 'text/csv;charset=utf-8;' });
      
      // Create a download URL
      const url = URL.createObjectURL(blob);
      
      // Add date to filename for uniqueness
      const date = new Date().toISOString().split('T')[0];
      const fullFilename = `${filename}-${date}.csv`;
      
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
      console.error('Error creating CSV export:', error);
      return false;
    }
  };
  
  // Eksporter block analytics data på samme måte med tab-separasjon
  export const exportAnalyticsCSV = (analyticsData: any, filename = 'analytics-data'): boolean => {
    if (!analyticsData) return false;
    
    try {
      // Vi bruker tabulatorer som separator for Excel
      const separator = '\t';
      
      // Vi lagrer alle rader her
      const allRows: string[] = [];
      
      // TABELL 1: BLOCK INFORMATION
      if (analyticsData.block) {
        // Legg til tabellnavn
        allRows.push('BLOCK INFORMATION');
        
        // Kolonneoverskrifter
        allRows.push(['Property', 'Value'].join(separator));
        
        // Legg til grunnleggende informasjon
        allRows.push(['Block ID', analyticsData.block.blockId].join(separator));
        allRows.push(['Block Name', analyticsData.block.blockName || ''].join(separator));
        allRows.push(['Status', analyticsData.block.status || ''].join(separator));
        allRows.push(['Area', analyticsData.block.area ? analyticsData.block.area.areaName || '' : ''].join(separator));
        allRows.push(['Contractor', analyticsData.block.area && analyticsData.block.area.contractor ? 
          analyticsData.block.area.contractor.contractorName || '' : ''].join(separator));
        allRows.push(['Size (km²)', analyticsData.block.areaSizeKm2 ? analyticsData.block.areaSizeKm2.toFixed(2) : ''].join(separator));
        
        // Legg til tomme rader som separator
        allRows.push('');
        allRows.push('');
      }
      
      // TABELL 2: ENVIRONMENTAL PARAMETERS
      if (analyticsData.environmentalParameters && analyticsData.environmentalParameters.length > 0) {
        allRows.push('ENVIRONMENTAL PARAMETERS');
        
        analyticsData.environmentalParameters.forEach(category => {
          // Legg til kategorinavn
          allRows.push(`${category.category}`);
          
          // Kolonneoverskrifter
          allRows.push(['Parameter', 'Average', 'Min', 'Max', 'Unit'].join(separator));
          
          // Legg til parameterdata
          category.parameters.forEach(param => {
            const row = [
              param.name || '',
              param.averageValue !== undefined ? param.averageValue.toFixed(2) : '',
              param.minValue !== undefined ? param.minValue.toFixed(2) : '',
              param.maxValue !== undefined ? param.maxValue.toFixed(2) : '',
              param.unit || ''
            ];
            allRows.push(row.join(separator));
          });
          
          // Legg til tom rad mellom kategorier
          allRows.push('');
        });
        
        // Legg til tom rad mellom seksjoner
        allRows.push('');
      }
      
      // TABELL 3: RESOURCE METRICS
      if (analyticsData.resourceMetrics && analyticsData.resourceMetrics.length > 0) {
        allRows.push('RESOURCE METRICS');
        
        analyticsData.resourceMetrics.forEach(category => {
          // Legg til kategorinavn
          allRows.push(`${category.category}`);
          
          // Kolonneoverskrifter
          allRows.push(['Analysis', 'Average', 'Min', 'Max', 'Unit'].join(separator));
          
          // Legg til analysisdata
          category.analyses.forEach(analysis => {
            const row = [
              analysis.analysis || '',
              analysis.averageValue !== undefined ? analysis.averageValue.toFixed(2) : '',
              analysis.minValue !== undefined ? analysis.minValue.toFixed(2) : '',
              analysis.maxValue !== undefined ? analysis.maxValue.toFixed(2) : '',
              analysis.unit || ''
            ];
            allRows.push(row.join(separator));
          });
          
          // Legg til tom rad mellom kategorier
          allRows.push('');
        });
        
        // Legg til tom rad mellom seksjoner
        allRows.push('');
      }
      
      // TABELL 4: SAMPLE TYPES
      if (analyticsData.sampleTypes && analyticsData.sampleTypes.length > 0) {
        allRows.push('SAMPLE TYPES');
        
        // Kolonneoverskrifter
        allRows.push(['Type', 'Count', 'Min Depth', 'Max Depth', 'Units'].join(separator));
        
        // Legg til sampleType data
        analyticsData.sampleTypes.forEach(sampleType => {
          const row = [
            sampleType.sampleType || '',
            sampleType.count || 0,
            sampleType.depthRange ? sampleType.depthRange.min : '',
            sampleType.depthRange ? sampleType.depthRange.max : '',
            'm'
          ];
          allRows.push(row.join(separator));
        });
        
        // Legg til tom rad mellom seksjoner
        allRows.push('');
        allRows.push('');
      }
      
      // TABELL 5: RECENT STATIONS
      if (analyticsData.recentStations && analyticsData.recentStations.length > 0) {
        allRows.push('RECENT STATIONS');
        
        // Kolonneoverskrifter
        allRows.push(['Station Code', 'Type', 'Latitude', 'Longitude'].join(separator));
        
        // Legg til stationdata
        analyticsData.recentStations.forEach(station => {
          const row = [
            station.stationCode || '',
            station.stationType || '',
            station.latitude ? station.latitude.toFixed(6) : '',
            station.longitude ? station.longitude.toFixed(6) : ''
          ];
          allRows.push(row.join(separator));
        });
      }
      
      // For Excel-kompatibilitet, legg til BOM (Byte Order Mark)
      const bomPrefix = '\uFEFF';
      const fileContent = bomPrefix + allRows.join('\n');
      
      // Last ned filen
      const blob = new Blob([fileContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const date = new Date().toISOString().split('T')[0];
      const fullFilename = `${filename}-${date}.csv`;
      
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', fullFilename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error('Error creating analytics CSV export:', error);
      return false;
    }
  };
  
  export default {
    convertToCSV,
    downloadCSV,
    exportAnalyticsCSV
  };