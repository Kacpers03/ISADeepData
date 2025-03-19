// frontend/src/utils/enhancedCsvExport.ts

/**
 * Enhanced CSV export with complete data
 * Ensures all related data is included for filtered elements
 */

// Types definition
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
    samples?: Sample[];
}

interface Sample {
    sampleId: number;
    sampleCode?: string;
    sampleType?: string;
    matrixType?: string;
    habitatType?: string;
    samplingDevice?: string;
    depthLower?: number;
    depthUpper?: number;
    sampleDescription?: string;
    envResults?: any[];
    geoResults?: any[];
    media?: any[];
}

interface MapData {
    contractors: Contractor[];
    cruises: Cruise[];
}

/**
 * Converts data to CSV format with all related data
 * @param data MapData object to be converted
 * @returns CSV-formatted string with semicolon delimiter
 */
export const convertToCSV = (data: MapData): string => {
    if (!data) return '';

    // Use semicolon as delimiter for better Excel compatibility
    const delimiter = ';';
    
    // Store all rows here
    const allRows: string[] = [];
    
    // SECTION 1: CONTRACTORS
    if (data.contractors && data.contractors.length > 0) {
        // Add section title with empty cells for proper column alignment
        allRows.push(['CONTRACTORS', '', '', '', '', ''].join(delimiter));
        
        // Column headers - each in its own column
        allRows.push(['ID', 'Name', 'Mineral Type', 'Sponsoring State', 'Year', 'Status'].join(delimiter));
        
        // Add contractor data
        data.contractors.forEach(contractor => {
            const row = [
                contractor.contractorId,
                contractor.contractorName || '',
                contractor.contractType || '',
                contractor.sponsoringState || '',
                contractor.contractualYear?.toString() || '',
                contractor.contractStatus || ''
            ];
            allRows.push(row.join(delimiter));
        });
        
        // Add empty rows as separator
        allRows.push(['', '', '', '', '', ''].join(delimiter));
        allRows.push(['', '', '', '', '', ''].join(delimiter));
    }
    
    // SECTION 2: CRUISES
    if (data.cruises && data.cruises.length > 0) {
        // Add section title with empty cells for proper column alignment
        allRows.push(['CRUISES', '', '', '', '', '', '', ''].join(delimiter));
        
        // Column headers - each in its own column
        allRows.push([
            'ID', 
            'Name', 
            'Contractor ID',
            'Contractor Name',
            'Start Date', 
            'End Date',
            'Latitude',
            'Longitude'
        ].join(delimiter));
        
        // Add cruise data with contractor name
        data.cruises.forEach(cruise => {
            // Find corresponding contractor
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
            
            allRows.push(row.join(delimiter));
        });
        
        // Add empty rows as separator
        allRows.push(['', '', '', '', '', '', '', ''].join(delimiter));
        allRows.push(['', '', '', '', '', '', '', ''].join(delimiter));
    }
    
    // SECTION 3: STATIONS
    // Collect all stations from all cruises
    const allStations = data.cruises.flatMap(cruise => 
        (cruise.stations || []).map(station => ({
            ...station,
            cruiseId: cruise.cruiseId,
            cruiseName: cruise.cruiseName
        }))
    );
    
    if (allStations.length > 0) {
        // Add section title with empty cells for proper column alignment
        allRows.push(['STATIONS', '', '', '', '', '', '', ''].join(delimiter));
        
        // Column headers - each in its own column
        allRows.push([
            'ID', 
            'Code', 
            'Type',
            'Cruise ID',
            'Cruise Name',
            'Latitude', 
            'Longitude',
            'Date'
        ].join(delimiter));
        
        // Add station data
        allStations.forEach(station => {
            const row = [
                station.stationId,
                station.stationCode || '',
                station.stationType || '',
                station.cruiseId,
                station.cruiseName || '',
                station.latitude ? station.latitude.toFixed(6) : '',
                station.longitude ? station.longitude.toFixed(6) : '',
                station.collectionDate ? new Date(station.collectionDate).toISOString().split('T')[0] : ''
            ];
            
            allRows.push(row.join(delimiter));
        });
        
        // Add empty rows as separator
        allRows.push(['', '', '', '', '', '', '', ''].join(delimiter));
        allRows.push(['', '', '', '', '', '', '', ''].join(delimiter));
    }
    
    // SECTION 4: SAMPLES
    // Collect all samples from all stations
    const allSamples = allStations.flatMap(station => 
        (station.samples || []).map(sample => ({
            ...sample,
            stationId: station.stationId,
            stationCode: station.stationCode,
            cruiseId: station.cruiseId,
            cruiseName: station.cruiseName
        }))
    );
    
    if (allSamples.length > 0) {
        // Add section title with empty cells for proper column alignment
        allRows.push(['SAMPLES', '', '', '', '', '', '', '', '', '', ''].join(delimiter));
        
        // Column headers - each in its own column
        allRows.push([
            'ID', 
            'Code', 
            'Type',
            'Station ID',
            'Station Code',
            'Cruise ID',
            'Cruise Name',
            'Matrix Type',
            'Habitat Type',
            'Sampling Device',
            'Depth Range (m)'
        ].join(delimiter));
        
        // Add sample data
        allSamples.forEach(sample => {
            const depthRange = (sample.depthLower !== undefined && sample.depthUpper !== undefined)
                ? `${sample.depthLower} - ${sample.depthUpper}` 
                : '';
                
            const row = [
                sample.sampleId,
                sample.sampleCode || '',
                sample.sampleType || '',
                sample.stationId,
                sample.stationCode || '',
                sample.cruiseId,
                sample.cruiseName || '',
                sample.matrixType || '',
                sample.habitatType || '',
                sample.samplingDevice || '',
                depthRange
            ];
            
            allRows.push(row.join(delimiter));
        });
        
        // Add empty rows as separator
        allRows.push(['', '', '', '', '', '', '', '', '', '', ''].join(delimiter));
        allRows.push(['', '', '', '', '', '', '', '', '', '', ''].join(delimiter));
    }
    
    // SECTION 5: ENVIRONMENTAL RESULTS
    // Collect all environmental results from all samples
    const allEnvResults = allSamples.flatMap(sample => 
        (sample.envResults || []).map(result => ({
            ...result,
            sampleId: sample.sampleId,
            sampleCode: sample.sampleCode,
            stationId: sample.stationId,
            stationCode: sample.stationCode,
            cruiseId: sample.cruiseId
        }))
    );
    
    if (allEnvResults.length > 0) {
        // Add section title
        allRows.push(['ENVIRONMENTAL RESULTS', '', '', '', '', '', '', ''].join(delimiter));
        
        // Column headers
        allRows.push([
            'ID',
            'Sample ID',
            'Sample Code',
            'Station ID',
            'Category',
            'Analysis',
            'Value',
            'Unit'
        ].join(delimiter));
        
        // Add environmental result data
        allEnvResults.forEach(result => {
            const row = [
                result.envResultId || '',
                result.sampleId,
                result.sampleCode || '',
                result.stationId,
                result.analysisCategory || '',
                result.analysisName || '',
                result.analysisValue || '',
                result.units || ''
            ];
            
            allRows.push(row.join(delimiter));
        });
        
        // Add empty rows as separator
        allRows.push(['', '', '', '', '', '', '', ''].join(delimiter));
        allRows.push(['', '', '', '', '', '', '', ''].join(delimiter));
    }
    
    // SECTION 6: GEOLOGICAL RESULTS
    // Collect all geological results from all samples
    const allGeoResults = allSamples.flatMap(sample => 
        (sample.geoResults || []).map(result => ({
            ...result,
            sampleId: sample.sampleId,
            sampleCode: sample.sampleCode,
            stationId: sample.stationId,
            stationCode: sample.stationCode,
            cruiseId: sample.cruiseId
        }))
    );
    
    if (allGeoResults.length > 0) {
        // Add section title
        allRows.push(['GEOLOGICAL RESULTS', '', '', '', '', '', '', '', ''].join(delimiter));
        
        // Column headers
        allRows.push([
            'ID',
            'Sample ID',
            'Sample Code',
            'Station ID',
            'Category',
            'Analysis',
            'Value',
            'Unit',
            'Qualifier'
        ].join(delimiter));
        
        // Add geological result data
        allGeoResults.forEach(result => {
            const row = [
                result.geoResultId || '',
                result.sampleId,
                result.sampleCode || '',
                result.stationId,
                result.category || '',
                result.analysis || '',
                result.value || '',
                result.units || '',
                result.qualifier || ''
            ];
            
            allRows.push(row.join(delimiter));
        });
        
        // Add empty rows as separator
        allRows.push(['', '', '', '', '', '', '', '', ''].join(delimiter));
        allRows.push(['', '', '', '', '', '', '', '', ''].join(delimiter));
    }
    
    // SECTION 7: MEDIA (PHOTOS/VIDEOS)
    // Collect all media from all samples
    const allMedia = allSamples.flatMap(sample => 
        (sample.media || []).map(media => ({
            ...media,
            sampleId: sample.sampleId,
            sampleCode: sample.sampleCode,
            stationId: sample.stationId,
            stationCode: sample.stationCode,
            cruiseId: sample.cruiseId
        }))
    );
    
    if (allMedia.length > 0) {
        // Add section title
        allRows.push(['MEDIA (PHOTOS/VIDEOS)', '', '', '', '', '', ''].join(delimiter));
        
        // Column headers
        allRows.push([
            'ID',
            'Sample ID',
            'Filename',
            'Media Type',
            'Capture Date',
            'Camera Specs',
            'Remarks'
        ].join(delimiter));
        
        // Add media data
        allMedia.forEach(media => {
            const row = [
                media.mediaId || '',
                media.sampleId,
                media.fileName || '',
                media.mediaType || '',
                media.captureDate ? new Date(media.captureDate).toISOString().split('T')[0] : '',
                media.cameraSpecs || '',
                media.remarks || ''
            ];
            
            allRows.push(row.join(delimiter));
        });
    }
    
    // Combine all rows into one string
    return allRows.join('\r\n');
};

/**
 * Generate and download data as a CSV file with all related data
 * @param data MapData object
 * @param filename Base filename without extension
 * @returns true if successful, false on error
 */
export const downloadCSV = (data: MapData, filename = 'exploration-data'): boolean => {
    if (!data) {
        console.error('No data provided for CSV export');
        return false;
    }
    
    try {
        // Convert data to CSV format
        const csvString = convertToCSV(data);
        
        // Add UTF-8 BOM for Excel compatibility
        const bomPrefix = '\uFEFF';
        const fileContent = bomPrefix + csvString;
        
        // Create a Blob with the CSV data
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

/**
 * Export analytics data in CSV format
 */
export const exportBlockAnalyticsCSV = (analyticsData: any, filename = 'block-analytics'): boolean => {
    if (!analyticsData) return false;
    
    try {
        // Use semicolon as delimiter for better Excel compatibility
        const delimiter = ';';
        
        // We'll store all rows here
        const allRows: string[] = [];
        
        // SECTION 1: BLOCK INFORMATION
        if (analyticsData.block) {
            // Add section title with padding for column alignment
            allRows.push(['BLOCK INFORMATION', ''].join(delimiter));
            
            // Column headers - in separate columns
            allRows.push(['Property', 'Value'].join(delimiter));
            
            // Add basic information
            allRows.push(['Block ID', analyticsData.block.blockId].join(delimiter));
            allRows.push(['Block Name', analyticsData.block.blockName || ''].join(delimiter));
            allRows.push(['Status', analyticsData.block.status || ''].join(delimiter));
            allRows.push(['Area', analyticsData.block.area ? analyticsData.block.area.areaName || '' : ''].join(delimiter));
            allRows.push(['Contractor', analyticsData.block.area && analyticsData.block.area.contractor ? 
                analyticsData.block.area.contractor.contractorName || '' : ''].join(delimiter));
            allRows.push(['Size (km²)', analyticsData.block.areaSizeKm2 ? analyticsData.block.areaSizeKm2.toFixed(2) : ''].join(delimiter));
            
            // Add empty rows as separator
            allRows.push(['', ''].join(delimiter));
            allRows.push(['', ''].join(delimiter));
        }
        
        // SECTION 2: ENVIRONMENTAL PARAMETERS
        if (analyticsData.environmentalParameters && analyticsData.environmentalParameters.length > 0) {
            allRows.push(['ENVIRONMENTAL PARAMETERS', '', '', '', ''].join(delimiter));
            
            analyticsData.environmentalParameters.forEach(category => {
                // Add category name with padding for column alignment
                allRows.push([category.category, '', '', '', ''].join(delimiter));
                
                // Column headers - properly separated
                allRows.push(['Parameter', 'Average', 'Min', 'Max', 'Unit'].join(delimiter));
                
                // Add parameter data
                category.parameters.forEach(param => {
                    const row = [
                        param.name || '',
                        param.averageValue !== undefined ? param.averageValue.toFixed(2) : '',
                        param.minValue !== undefined ? param.minValue.toFixed(2) : '',
                        param.maxValue !== undefined ? param.maxValue.toFixed(2) : '',
                        param.unit || ''
                    ];
                    allRows.push(row.join(delimiter));
                });
                
                // Add empty row between categories
                allRows.push(['', '', '', '', ''].join(delimiter));
            });
            
            // Add empty row between sections
            allRows.push(['', '', '', '', ''].join(delimiter));
        }
        
        // SECTION 3: RESOURCE METRICS
        if (analyticsData.resourceMetrics && analyticsData.resourceMetrics.length > 0) {
            allRows.push(['RESOURCE METRICS', '', '', '', ''].join(delimiter));
            
            analyticsData.resourceMetrics.forEach(category => {
                // Add category name with padding for column alignment
                allRows.push([category.category, '', '', '', ''].join(delimiter));
                
                // Column headers - properly separated
                allRows.push(['Analysis', 'Average', 'Min', 'Max', 'Unit'].join(delimiter));
                
                // Add analysis data
                category.analyses.forEach(analysis => {
                    const row = [
                        analysis.analysis || '',
                        analysis.averageValue !== undefined ? analysis.averageValue.toFixed(2) : '',
                        analysis.minValue !== undefined ? analysis.minValue.toFixed(2) : '',
                        analysis.maxValue !== undefined ? analysis.maxValue.toFixed(2) : '',
                        analysis.unit || ''
                    ];
                    allRows.push(row.join(delimiter));
                });
                
                // Add empty row between categories
                allRows.push(['', '', '', '', ''].join(delimiter));
            });
            
            // Add empty row between sections
            allRows.push(['', '', '', '', ''].join(delimiter));
        }
        
        // SECTION 4: SAMPLE TYPES
        if (analyticsData.sampleTypes && analyticsData.sampleTypes.length > 0) {
            allRows.push(['SAMPLE TYPES', '', '', '', ''].join(delimiter));
            
            // Column headers - properly separated
            allRows.push(['Type', 'Count', 'Min Depth', 'Max Depth', 'Units'].join(delimiter));
            
            // Add sampleType data
            analyticsData.sampleTypes.forEach(sampleType => {
                const row = [
                    sampleType.sampleType || '',
                    sampleType.count || 0,
                    sampleType.depthRange ? sampleType.depthRange.min : '',
                    sampleType.depthRange ? sampleType.depthRange.max : '',
                    'm'
                ];
                allRows.push(row.join(delimiter));
            });
            
            // Add empty row between sections
            allRows.push(['', '', '', '', ''].join(delimiter));
            allRows.push(['', '', '', '', ''].join(delimiter));
        }
        
        // SECTION 5: RECENT STATIONS
        if (analyticsData.recentStations && analyticsData.recentStations.length > 0) {
            allRows.push(['RECENT STATIONS', '', '', ''].join(delimiter));
            
            // Column headers - properly separated
            allRows.push(['Station Code', 'Type', 'Latitude', 'Longitude'].join(delimiter));
            
            // Add station data
            analyticsData.recentStations.forEach(station => {
                const row = [
                    station.stationCode || '',
                    station.stationType || '',
                    station.latitude ? station.latitude.toFixed(6) : '',
                    station.longitude ? station.longitude.toFixed(6) : ''
                ];
                allRows.push(row.join(delimiter));
            });
        }
        
        // For Excel compatibility, add UTF-8 BOM
        const bomPrefix = '\uFEFF';
        const fileContent = bomPrefix + allRows.join('\r\n');
        
        // Download the file
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
    exportBlockAnalyticsCSV
};