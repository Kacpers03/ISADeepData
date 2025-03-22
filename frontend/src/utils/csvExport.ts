// frontend/src/utils/enhancedCsvExport.ts

/**
 * Enhanced CSV export with complete data and exact column name mapping to match backend
 * Ensures all related data including GeoResult, CTDData, and Library are included
 */

// Types definition matching backend models
interface Contractor {
    contractorId: number;
    contractorName: string;
    contractType?: string;
    contractTypeId?: number;
    sponsoringState?: string;
    contractualYear?: number;
    contractStatus?: string;
    contractStatusId?: number;
    contractNumber?: string;
    remarks?: string;
    areas?: Area[];
    cruises?: Cruise[];
    libraries?: Library[];
}

interface Area {
    areaId: number;
    areaName: string;
    areaDescription?: string;
    contractorId: number;
    centerLatitude?: number;
    centerLongitude?: number;
    totalAreaSizeKm2?: number;
    geoJsonBoundary?: string;
    allocationDate?: string;
    expiryDate?: string;
    blocks?: Block[];
}

interface Block {
    blockId: number;
    blockName: string;
    blockDescription?: string;
    areaId: number;
    status?: string;
    geoJsonBoundary?: string;
    centerLatitude?: number;
    centerLongitude?: number;
    areaSizeKm2?: number;
    category?: string;
}

interface Cruise {
    cruiseId: number;
    cruiseName?: string;
    contractorId: number;
    researchVessel?: string;
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
    cruiseId: number;
    latitude: number;
    longitude: number;
    samples?: Sample[];
    ctdDataSet?: CTDData[];
}

interface Sample {
    sampleId: number;
    sampleCode?: string;
    sampleType?: string;
    stationId: number;
    matrixType?: string;
    habitatType?: string;
    samplingDevice?: string;
    depthLower?: number;
    depthUpper?: number;
    sampleDescription?: string;
    analysis?: string;
    result?: number;
    unit?: string;
    envResults?: EnvResult[];
    geoResults?: GeoResult[];
    photoVideos?: PhotoVideo[];
}

interface EnvResult {
    envResultId: number;
    sampleId: number;
    analysisCategory?: string;
    analysisName?: string;
    analysisValue?: number;
    units?: string;
    remarks?: string;
}

interface GeoResult {
    geoResultId: number;
    sampleId: number;
    category?: string;
    analysis?: string;
    value?: number;
    units?: string;
    qualifier?: string;
    remarks?: string;
}

interface CTDData {
    ctdId: number;
    stationId: number;
    depthM?: number;
    temperatureC?: number;
    salinity?: number;
    oxygen?: number;
    ph?: number;
    measurementTime?: string;
}

interface PhotoVideo {
    mediaId: number;
    sampleId: number;
    fileName?: string;
    mediaType?: string;
    cameraSpecs?: string;
    captureDate?: string;
    remarks?: string;
}

interface Library {
    libraryId: number;
    contractorId: number;
    theme?: string;
    fileName?: string;
    title?: string;
    description?: string;
    year?: number;
    country?: string;
    submissionDate?: string;
    isConfidential?: boolean;
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
    
    // SECTION 1: CONTRACTORS - Matching exact column names from DbInitializer.cs
    if (data.contractors && data.contractors.length > 0) {
        // Add section title with empty cells for proper column alignment
        allRows.push(['CONTRACTORS', '', '', '', '', '', '', ''].join(delimiter));
        
        // Column headers - each in its own column matching DbInitializer.cs
        allRows.push(['ContractorId', 'ContractorName', 'ContractTypeId', 'ContractStatusId', 'ContractNumber', 'SponsoringState', 'ContractualYear', 'Remarks'].join(delimiter));
        
        // Add contractor data
        data.contractors.forEach(contractor => {
            const row = [
                contractor.contractorId,
                contractor.contractorName || '',
                contractor.contractTypeId || '',
                contractor.contractStatusId || '',
                contractor.contractNumber || '',
                contractor.sponsoringState || '',
                contractor.contractualYear?.toString() || '',
                contractor.remarks || ''
            ];
            allRows.push(row.join(delimiter));
        });
        
        // Add empty rows as separator
        allRows.push(['', '', '', '', '', '', '', ''].join(delimiter));
        allRows.push(['', '', '', '', '', '', '', ''].join(delimiter));
    }
    
    // SECTION 2: CONTRACTOR AREAS - Matching exact column names from DbInitializer.cs
    const allAreas = data.contractors.flatMap(contractor => 
        (contractor.areas || []).map(area => ({
            ...area,
            contractorId: contractor.contractorId,
            contractorName: contractor.contractorName
        }))
    );
    
    if (allAreas.length > 0) {
        allRows.push(['CONTRACTOR AREAS', '', '', '', '', '', '', '', '', ''].join(delimiter));
        
        allRows.push([
            'AreaId', 
            'ContractorId', 
            'ContractorName',
            'AreaName', 
            'AreaDescription',
            'CenterLatitude',
            'CenterLongitude',
            'TotalAreaSizeKm2',
            'AllocationDate',
            'ExpiryDate'
        ].join(delimiter));
        
        allAreas.forEach(area => {
            const row = [
                area.areaId,
                area.contractorId,
                area.contractorName || '',
                area.areaName || '',
                area.areaDescription || '',
                area.centerLatitude ? area.centerLatitude.toFixed(6) : '',
                area.centerLongitude ? area.centerLongitude.toFixed(6) : '',
                area.totalAreaSizeKm2 ? area.totalAreaSizeKm2.toString() : '',
                area.allocationDate ? new Date(area.allocationDate).toISOString().split('T')[0] : '',
                area.expiryDate ? new Date(area.expiryDate).toISOString().split('T')[0] : ''
            ];
            
            allRows.push(row.join(delimiter));
        });
        
        // Add empty rows as separator
        allRows.push(['', '', '', '', '', '', '', '', '', ''].join(delimiter));
        allRows.push(['', '', '', '', '', '', '', '', '', ''].join(delimiter));
    }
    
    // SECTION 3: CONTRACTOR AREA BLOCKS - Matching exact column names from DbInitializer.cs
    const allBlocks = allAreas.flatMap(area => 
        (area.blocks || []).map(block => ({
            ...block,
            areaId: area.areaId,
            areaName: area.areaName,
            contractorId: area.contractorId,
            contractorName: area.contractorName
        }))
    );
    
    if (allBlocks.length > 0) {
        allRows.push(['CONTRACTOR AREA BLOCKS', '', '', '', '', '', '', '', '', '', ''].join(delimiter));
        
        allRows.push([
            'BlockId', 
            'AreaId', 
            'AreaName',
            'ContractorId',
            'ContractorName',
            'BlockName', 
            'BlockDescription',
            'Status',
            'CenterLatitude',
            'CenterLongitude',
            'AreaSizeKm2'
        ].join(delimiter));
        
        allBlocks.forEach(block => {
            const row = [
                block.blockId,
                block.areaId,
                block.areaName || '',
                block.contractorId,
                block.contractorName || '',
                block.blockName || '',
                block.blockDescription || '',
                block.status || '',
                block.centerLatitude ? block.centerLatitude.toFixed(6) : '',
                block.centerLongitude ? block.centerLongitude.toFixed(6) : '',
                block.areaSizeKm2 ? block.areaSizeKm2.toString() : ''
            ];
            
            allRows.push(row.join(delimiter));
        });
        
        // Add empty rows as separator
        allRows.push(['', '', '', '', '', '', '', '', '', '', ''].join(delimiter));
        allRows.push(['', '', '', '', '', '', '', '', '', '', ''].join(delimiter));
    }
    
    // SECTION 4: CRUISES - Matching exact column names from DbInitializer.cs
    if (data.cruises && data.cruises.length > 0) {
        // Add section title with empty cells for proper column alignment
        allRows.push(['CRUISES', '', '', '', '', ''].join(delimiter));
        
        // Column headers - each in its own column matching DbInitializer.cs
        allRows.push([
            'CruiseId', 
            'ContractorId',
            'CruiseName', 
            'ResearchVessel', 
            'StartDate', 
            'EndDate'
        ].join(delimiter));
        
        // Add cruise data
        data.cruises.forEach(cruise => {
            const row = [
                cruise.cruiseId,
                cruise.contractorId,
                cruise.cruiseName || '',
                cruise.researchVessel || '',
                cruise.startDate ? new Date(cruise.startDate).toISOString().split('T')[0] : '',
                cruise.endDate ? new Date(cruise.endDate).toISOString().split('T')[0] : ''
            ];
            
            allRows.push(row.join(delimiter));
        });
        
        // Add empty rows as separator
        allRows.push(['', '', '', '', '', ''].join(delimiter));
        allRows.push(['', '', '', '', '', ''].join(delimiter));
    }
    
    // SECTION 5: STATIONS - Matching exact column names from DbInitializer.cs
    // Collect all stations from all cruises
    const allStations = data.cruises.flatMap(cruise => 
        (cruise.stations || []).map(station => ({
            ...station,
            cruiseId: cruise.cruiseId,
            cruiseName: cruise.cruiseName,
            contractorId: cruise.contractorId
        }))
    );
    
    if (allStations.length > 0) {
        // Add section title with empty cells for proper column alignment
        allRows.push(['STATIONS', '', '', '', '', ''].join(delimiter));
        
        // Column headers - each in its own column matching DbInitializer.cs
        allRows.push([
            'StationId', 
            'CruiseId',
            'StationCode', 
            'StationType', 
            'Latitude', 
            'Longitude'
        ].join(delimiter));
        
        // Add station data
        allStations.forEach(station => {
            const row = [
                station.stationId,
                station.cruiseId,
                station.stationCode || '',
                station.stationType || '',
                station.latitude ? station.latitude.toFixed(6) : '',
                station.longitude ? station.longitude.toFixed(6) : ''
            ];
            
            allRows.push(row.join(delimiter));
        });
        
        // Add empty rows as separator
        allRows.push(['', '', '', '', '', ''].join(delimiter));
        allRows.push(['', '', '', '', '', ''].join(delimiter));
    }
    
    // SECTION 6: CTD DATA - Matching exact column names from DbInitializer.cs
    // Collect all CTD data from all stations
    const allCTDData = allStations.flatMap(station => 
        (station.ctdDataSet || []).map(ctd => ({
            ...ctd,
            stationId: station.stationId,
            stationCode: station.stationCode,
            cruiseId: station.cruiseId
        }))
    );
    
    if (allCTDData.length > 0) {
        // Add section title
        allRows.push(['CTD DATA', '', '', '', '', '', '', ''].join(delimiter));
        
        // Column headers matching DbInitializer.cs
        allRows.push([
            'CtdId',
            'StationId',
            'StationCode',
            'DepthM',
            'TemperatureC',
            'Salinity',
            'Oxygen',
            'Ph',
            'MeasurementTime'
        ].join(delimiter));
        
        // Add CTD data
        allCTDData.forEach(ctd => {
            const row = [
                ctd.ctdId,
                ctd.stationId,
                ctd.stationCode || '',
                ctd.depthM || '',
                ctd.temperatureC || '',
                ctd.salinity || '',
                ctd.oxygen || '',
                ctd.ph || '',
                ctd.measurementTime ? new Date(ctd.measurementTime).toISOString() : ''
            ];
            
            allRows.push(row.join(delimiter));
        });
        
        // Add empty rows as separator
        allRows.push(['', '', '', '', '', '', '', '', ''].join(delimiter));
        allRows.push(['', '', '', '', '', '', '', '', ''].join(delimiter));
    }
    
    // SECTION 7: SAMPLES - Matching exact column names from DbInitializer.cs
    // Collect all samples from all stations
    const allSamples = allStations.flatMap(station => 
        (station.samples || []).map(sample => ({
            ...sample,
            stationId: station.stationId,
            stationCode: station.stationCode,
            cruiseId: station.cruiseId
        }))
    );
    
    if (allSamples.length > 0) {
        // Add section title
        allRows.push(['SAMPLES', '', '', '', '', '', '', '', '', '', '', '', '', ''].join(delimiter));
        
        // Column headers matching DbInitializer.cs
        allRows.push([
            'SampleId', 
            'StationId',
            'SampleCode', 
            'SampleType',
            'MatrixType',
            'HabitatType',
            'SamplingDevice',
            'DepthLower',
            'DepthUpper',
            'SampleDescription',
            'Analysis',
            'Result',
            'Unit'
        ].join(delimiter));
        
        // Add sample data
        allSamples.forEach(sample => {
            const row = [
                sample.sampleId,
                sample.stationId,
                sample.sampleCode || '',
                sample.sampleType || '',
                sample.matrixType || '',
                sample.habitatType || '',
                sample.samplingDevice || '',
                sample.depthLower !== undefined ? sample.depthLower.toString() : '',
                sample.depthUpper !== undefined ? sample.depthUpper.toString() : '',
                sample.sampleDescription || '',
                sample.analysis || '',
                sample.result !== undefined ? sample.result.toString() : '',
                sample.unit || ''
            ];
            
            allRows.push(row.join(delimiter));
        });
        
        // Add empty rows as separator
        allRows.push(['', '', '', '', '', '', '', '', '', '', '', '', ''].join(delimiter));
        allRows.push(['', '', '', '', '', '', '', '', '', '', '', '', ''].join(delimiter));
    }
    
    // SECTION 8: ENVIRONMENTAL RESULTS - Matching exact column names from DbInitializer.cs
    // Collect all environmental results from all samples
    const allEnvResults = allSamples.flatMap(sample => 
        (sample.envResults || []).map(result => ({
            ...result,
            sampleId: sample.sampleId,
            sampleCode: sample.sampleCode,
            stationId: sample.stationId,
            stationCode: sample.stationCode
        }))
    );
    
    if (allEnvResults.length > 0) {
        // Add section title
        allRows.push(['ENVIRONMENTAL RESULTS', '', '', '', '', '', ''].join(delimiter));
        
        // Column headers matching DbInitializer.cs
        allRows.push([
            'EnvResultId',
            'SampleId',
            'AnalysisCategory',
            'AnalysisName',
            'AnalysisValue',
            'Units',
            'Remarks'
        ].join(delimiter));
        
        // Add environmental result data
        allEnvResults.forEach(result => {
            const row = [
                result.envResultId || '',
                result.sampleId,
                result.analysisCategory || '',
                result.analysisName || '',
                result.analysisValue !== undefined ? result.analysisValue.toString() : '',
                result.units || '',
                result.remarks || ''
            ];
            
            allRows.push(row.join(delimiter));
        });
        
        // Add empty rows as separator
        allRows.push(['', '', '', '', '', '', ''].join(delimiter));
        allRows.push(['', '', '', '', '', '', ''].join(delimiter));
    }
    
    // SECTION 9: GEOLOGICAL RESULTS - Matching exact column names from DbInitializer.cs
    // Collect all geological results from all samples
    const allGeoResults = allSamples.flatMap(sample => 
        (sample.geoResults || []).map(result => ({
            ...result,
            sampleId: sample.sampleId,
            sampleCode: sample.sampleCode,
            stationId: sample.stationId
        }))
    );
    
    if (allGeoResults.length > 0) {
        // Add section title
        allRows.push(['GEOLOGICAL RESULTS', '', '', '', '', '', '', ''].join(delimiter));
        
        // Column headers matching DbInitializer.cs
        allRows.push([
            'GeoResultId',
            'SampleId',
            'Category',
            'Analysis',
            'Value',
            'Units',
            'Qualifier',
            'Remarks'
        ].join(delimiter));
        
        // Add geological result data
        allGeoResults.forEach(result => {
            const row = [
                result.geoResultId || '',
                result.sampleId,
                result.category || '',
                result.analysis || '',
                result.value !== undefined ? result.value.toString() : '',
                result.units || '',
                result.qualifier || '',
                result.remarks || ''
            ];
            
            allRows.push(row.join(delimiter));
        });
        
        // Add empty rows as separator
        allRows.push(['', '', '', '', '', '', '', ''].join(delimiter));
        allRows.push(['', '', '', '', '', '', '', ''].join(delimiter));
    }
    
    // SECTION 10: PHOTO/VIDEO - Matching exact column names from DbInitializer.cs
    // Collect all media from all samples
    const allMedia = allSamples.flatMap(sample => 
        (sample.photoVideos || []).map(media => ({
            ...media,
            sampleId: sample.sampleId,
            sampleCode: sample.sampleCode,
            stationId: sample.stationId
        }))
    );
    
    if (allMedia.length > 0) {
        // Add section title
        allRows.push(['PHOTO_VIDEO', '', '', '', '', '', ''].join(delimiter));
        
        // Column headers matching DbInitializer.cs
        allRows.push([
            'MediaId',
            'SampleId',
            'FileName',
            'MediaType',
            'CameraSpecs',
            'CaptureDate',
            'Remarks'
        ].join(delimiter));
        
        // Add media data
        allMedia.forEach(media => {
            const row = [
                media.mediaId || '',
                media.sampleId,
                media.fileName || '',
                media.mediaType || '',
                media.cameraSpecs || '',
                media.captureDate ? new Date(media.captureDate).toISOString().split('T')[0] : '',
                media.remarks || ''
            ];
            
            allRows.push(row.join(delimiter));
        });
        
        // Add empty rows as separator
        allRows.push(['', '', '', '', '', '', ''].join(delimiter));
        allRows.push(['', '', '', '', '', '', ''].join(delimiter));
    }
    
    // SECTION 11: LIBRARY - Matching exact column names from DbInitializer.cs
    // Collect all library entries from all contractors
    const allLibraries = data.contractors.flatMap(contractor => 
        (contractor.libraries || []).map(library => ({
            ...library,
            contractorId: contractor.contractorId,
            contractorName: contractor.contractorName
        }))
    );
    
    if (allLibraries.length > 0) {
        // Add section title
        allRows.push(['LIBRARY', '', '', '', '', '', '', '', '', ''].join(delimiter));
        
        // Column headers matching DbInitializer.cs
        allRows.push([
            'LibraryId',
            'ContractorId',
            'ContractorName',
            'Theme',
            'FileName',
            'Title',
            'Description',
            'Year',
            'Country',
            'SubmissionDate',
            'IsConfidential'
        ].join(delimiter));
        
        // Add library data
        allLibraries.forEach(library => {
            const row = [
                library.libraryId || '',
                library.contractorId,
                library.contractorName || '',
                library.theme || '',
                library.fileName || '',
                library.title || '',
                library.description || '',
                library.year || '',
                library.country || '',
                library.submissionDate ? new Date(library.submissionDate).toISOString().split('T')[0] : '',
                library.isConfidential ? 'true' : 'false'
            ];
            
            allRows.push(row.join(delimiter));
        });
    }
    
    // Combine all rows into one string
    return allRows.join('\r\n');
};

/**
 * Generate and download data as a CSV file with all related data
 * Column names exactly match the backend DbInitializer.cs file
 * 
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
 * Recursively traverse the map data to ensure all related data is loaded
 * This helps find any missing data like CTDData, Libraries, etc.
 * 
 * @param data MapData object to check
 * @returns Object with counts of each entity type
 */
export const analyzeMapData = (data: MapData): any => {
    if (!data) return { error: 'No data provided' };
    
    const counts = {
        contractors: 0,
        areas: 0,
        blocks: 0,
        cruises: 0,
        stations: 0,
        samples: 0,
        ctdData: 0,
        envResults: 0,
        geoResults: 0,
        media: 0,
        libraries: 0
    };
    
    // Count contractors
    counts.contractors = data.contractors?.length || 0;
    
    // Count areas and blocks
    data.contractors?.forEach(contractor => {
        // Count areas
        counts.areas += contractor.areas?.length || 0;
        
        // Count blocks
        contractor.areas?.forEach(area => {
            counts.blocks += area.blocks?.length || 0;
        });
        
        // Count libraries
        counts.libraries += contractor.libraries?.length || 0;
    });
    
    // Count cruises and stations
    counts.cruises = data.cruises?.length || 0;
    
    data.cruises?.forEach(cruise => {
        // Count stations
        counts.stations += cruise.stations?.length || 0;
        
        // Count CTD data
        cruise.stations?.forEach(station => {
            counts.ctdData += station.ctdDataSet?.length || 0;
            
            // Count samples
            counts.samples += station.samples?.length || 0;
            
            // Count sample-related data
            station.samples?.forEach(sample => {
                counts.envResults += sample.envResults?.length || 0;
                counts.geoResults += sample.geoResults?.length || 0;
                counts.media += sample.photoVideos?.length || 0;
            });
        });
    });
    
    return counts;
};

export default {
    convertToCSV,
    downloadCSV,
    analyzeMapData
};