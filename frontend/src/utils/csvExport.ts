// frontend/src/utils/csvExport.ts

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
 * Case-insensitive property getter - works with both camelCase and PascalCase
 * @param obj Object to get property from
 * @param propName Property name (in camelCase format)
 * @returns The property value or undefined if not found
 */
function getProp(obj: any, propName: string): any {
    if (!obj || typeof obj !== 'object') return undefined;
    
    // Check direct property access (case-sensitive)
    if (obj[propName] !== undefined) {
        return obj[propName];
    }
    
    // Try PascalCase version
    const pascalCase = propName.charAt(0).toUpperCase() + propName.slice(1);
    if (obj[pascalCase] !== undefined) {
        return obj[pascalCase];
    }
    
    // Try case-insensitive search (slower but thorough)
    const lowerPropName = propName.toLowerCase();
    for (const key in obj) {
        if (key.toLowerCase() === lowerPropName) {
            return obj[key];
        }
    }
    
    return undefined;
}

/**
 * Normalizes an object's properties to camelCase for consistent access
 * @param data Object or array to normalize
 * @returns Normalized data with consistent property names
 */
function normalizeCase(data: any): any {
    if (!data) return data;
    
    if (Array.isArray(data)) {
        return data.map(item => normalizeCase(item));
    }
    
    if (typeof data === 'object' && data !== null) {
        const result: any = {};
        
        for (const key in data) {
            // Convert key to camelCase if it's in PascalCase
            const camelKey = key.charAt(0).toLowerCase() + key.slice(1);
            result[camelKey] = normalizeCase(data[key]);
        }
        
        return result;
    }
    
    return data;
}

/**
 * Converts data to CSV format with all related data
 * @param data MapData object to be converted
 * @returns CSV-formatted string with semicolon delimiter
 */
export const convertToCSV = (data: MapData): string => {
    if (!data) return '';
    
    // Log the data structure to debug
    console.log('Raw data for CSV export:', data);
    
    // Normalize all data to camelCase for consistent access
    const normalizedData = normalizeCase(data);
    console.log('Normalized data for CSV export:', normalizedData);

    // Use semicolon as delimiter for better Excel compatibility
    const delimiter = ';';
    
    // Store all rows here
    const allRows: string[] = [];
    
    // SECTION 1: CONTRACTORS - Matching exact column names from DbInitializer.cs
    if (normalizedData.contractors && normalizedData.contractors.length > 0) {
        // Add section title with empty cells for proper column alignment
        allRows.push(['CONTRACTORS', '', '', '', '', '', '', ''].join(delimiter));
        
        // Column headers - each in its own column matching DbInitializer.cs
        allRows.push(['ContractorId', 'ContractorName', 'ContractTypeId', 'ContractStatusId', 'ContractNumber', 'SponsoringState', 'ContractualYear', 'Remarks'].join(delimiter));
        
        // Add contractor data
        normalizedData.contractors.forEach((contractor: any) => {
            const row = [
                getProp(contractor, 'contractorId'),
                getProp(contractor, 'contractorName') || '',
                getProp(contractor, 'contractType') || '',
                getProp(contractor, 'contractStatus') || '',
                getProp(contractor, 'contractNumber') || '',
                getProp(contractor, 'sponsoringState') || '',
                getProp(contractor, 'contractualYear')?.toString() || '',
                getProp(contractor, 'remarks') || ''
            ];
            allRows.push(row.join(delimiter));
        });
        
        // Add empty rows as separator
        allRows.push(['', '', '', '', '', '', '', ''].join(delimiter));
        allRows.push(['', '', '', '', '', '', '', ''].join(delimiter));
    }
    
    // SECTION 2: CONTRACTOR AREAS - Matching exact column names from DbInitializer.cs
    const allAreas = normalizedData.contractors.flatMap((contractor: any) => 
        (getProp(contractor, 'areas') || []).map((area: any) => ({
            ...area,
            contractorId: getProp(contractor, 'contractorId'),
            contractorName: getProp(contractor, 'contractorName')
        }))
    );
    
    if (allAreas.length > 0) {
        allRows.push(['CONTRACTOR AREAS', '', '', '', '', '', '', '', '', ''].join(delimiter));
        
        // Headers matching exactly the columns in DbInitializer.cs
        allRows.push([
            'AreaId', 
            'ContractorId',
            'AreaName', 
            'AreaDescription',
            'CenterLatitude',
            'CenterLongitude',
            'TotalAreaSizeKm2',
            'AllocationDate',
            'ExpiryDate'
        ].join(delimiter));
        
        allAreas.forEach((area: any) => {
            // Log the area object to debug
            console.log('Processing area for CSV:', area);
            
            const row = [
                getProp(area, 'areaId'),
                getProp(area, 'contractorId'),
                getProp(area, 'areaName') || '',
                getProp(area, 'areaDescription') || '',
                getProp(area, 'centerLatitude') ? getProp(area, 'centerLatitude').toFixed(6) : '',
                getProp(area, 'centerLongitude') ? getProp(area, 'centerLongitude').toFixed(6) : '',
                getProp(area, 'totalAreaSizeKm2') ? getProp(area, 'totalAreaSizeKm2').toString() : '',
                getProp(area, 'allocationDate') ? new Date(getProp(area, 'allocationDate')).toISOString().split('T')[0] : '',
                getProp(area, 'expiryDate') ? new Date(getProp(area, 'expiryDate')).toISOString().split('T')[0] : ''
            ];
            
            allRows.push(row.join(delimiter));
        });
        
        // Add empty rows as separator
        allRows.push(['', '', '', '', '', '', '', '', '', ''].join(delimiter));
        allRows.push(['', '', '', '', '', '', '', '', '', ''].join(delimiter));
    }
    
    // SECTION 3: CONTRACTOR AREA BLOCKS - Matching exact column names from DbInitializer.cs
    const allBlocks = allAreas.flatMap((area: any) => 
        (getProp(area, 'blocks') || []).map((block: any) => ({
            ...block,
            areaId: getProp(area, 'areaId'),
            areaName: getProp(area, 'areaName'),
            contractorId: getProp(area, 'contractorId'),
            contractorName: getProp(area, 'contractorName')
        }))
    );
    
    if (allBlocks.length > 0) {
        allRows.push(['CONTRACTOR AREA BLOCKS', '', '', '', '', '', '', '', ''].join(delimiter));
        
        // Headers matching exactly the columns in DbInitializer.cs
        allRows.push([
            'BlockId', 
            'AreaId', 
            'BlockName', 
            'BlockDescription',
            'Status',
            'CenterLatitude',
            'CenterLongitude',
            'AreaSizeKm2',
            'Category'
        ].join(delimiter));
        
        allBlocks.forEach((block: any) => {
            // Log the block object to debug
            console.log('Processing block for CSV:', block);
            
            const row = [
                getProp(block, 'blockId'),
                getProp(block, 'areaId'),
                getProp(block, 'blockName') || '',
                getProp(block, 'blockDescription') || '',
                getProp(block, 'status') || '',
                getProp(block, 'centerLatitude') ? getProp(block, 'centerLatitude').toFixed(6) : '',
                getProp(block, 'centerLongitude') ? getProp(block, 'centerLongitude').toFixed(6) : '',
                getProp(block, 'areaSizeKm2') ? getProp(block, 'areaSizeKm2').toString() : '',
                getProp(block, 'category') || ''
            ];
            
            allRows.push(row.join(delimiter));
        });
        
        // Add empty rows as separator
        allRows.push(['', '', '', '', '', '', '', '', '', '', ''].join(delimiter));
        allRows.push(['', '', '', '', '', '', '', '', '', '', ''].join(delimiter));
    }
    
    // SECTION 4: CRUISES - Matching exact column names from DbInitializer.cs
    if (normalizedData.cruises && normalizedData.cruises.length > 0) {
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
        normalizedData.cruises.forEach((cruise: any) => {
            const row = [
                getProp(cruise, 'cruiseId'),
                getProp(cruise, 'contractorId'),
                getProp(cruise, 'cruiseName') || '',
                getProp(cruise, 'researchVessel') || '',
                getProp(cruise, 'startDate') ? new Date(getProp(cruise, 'startDate')).toISOString().split('T')[0] : '',
                getProp(cruise, 'endDate') ? new Date(getProp(cruise, 'endDate')).toISOString().split('T')[0] : ''
            ];
            
            allRows.push(row.join(delimiter));
        });
        
        // Add empty rows as separator
        allRows.push(['', '', '', '', '', ''].join(delimiter));
        allRows.push(['', '', '', '', '', ''].join(delimiter));
    }
    
    // SECTION 5: STATIONS - Matching exact column names from DbInitializer.cs
    // Collect all stations from all cruises
    const allStations = normalizedData.cruises.flatMap((cruise: any) => 
        (getProp(cruise, 'stations') || []).map((station: any) => ({
            ...station,
            cruiseId: getProp(cruise, 'cruiseId'),
            cruiseName: getProp(cruise, 'cruiseName'),
            contractorId: getProp(cruise, 'contractorId')
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
        allStations.forEach((station: any) => {
            const row = [
                getProp(station, 'stationId'),
                getProp(station, 'cruiseId'),
                getProp(station, 'stationCode') || '',
                getProp(station, 'stationType') || '',
                getProp(station, 'latitude') ? getProp(station, 'latitude').toFixed(6) : '',
                getProp(station, 'longitude') ? getProp(station, 'longitude').toFixed(6) : ''
            ];
            
            allRows.push(row.join(delimiter));
        });
        
        // Add empty rows as separator
        allRows.push(['', '', '', '', '', ''].join(delimiter));
        allRows.push(['', '', '', '', '', ''].join(delimiter));
    }
    
    // SECTION 6: CTD DATA - Matching exact column names from DbInitializer.cs
    // Collect all CTD data from all stations
    const allCTDData = allStations.flatMap((station: any) => 
        (getProp(station, 'ctdDataSet') || []).map((ctd: any) => ({
            ...ctd,
            stationId: getProp(station, 'stationId'),
            stationCode: getProp(station, 'stationCode'),
            cruiseId: getProp(station, 'cruiseId')
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
        allCTDData.forEach((ctd: any) => {
            const row = [
                getProp(ctd, 'ctdId'),
                getProp(ctd, 'stationId'),
                getProp(ctd, 'stationCode') || '',
                getProp(ctd, 'depthM') || '',
                getProp(ctd, 'temperatureC') || '',
                getProp(ctd, 'salinity') || '',
                getProp(ctd, 'oxygen') || '',
                getProp(ctd, 'ph') || '',
                getProp(ctd, 'measurementTime') ? new Date(getProp(ctd, 'measurementTime')).toISOString() : ''
            ];
            
            allRows.push(row.join(delimiter));
        });
        
        // Add empty rows as separator
        allRows.push(['', '', '', '', '', '', '', '', ''].join(delimiter));
        allRows.push(['', '', '', '', '', '', '', '', ''].join(delimiter));
    }
    
    // SECTION 7: SAMPLES - Matching exact column names from DbInitializer.cs
    // Collect all samples from all stations
    const allSamples = allStations.flatMap((station: any) => 
        (getProp(station, 'samples') || []).map((sample: any) => ({
            ...sample,
            stationId: getProp(station, 'stationId'),
            stationCode: getProp(station, 'stationCode'),
            cruiseId: getProp(station, 'cruiseId')
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
        allSamples.forEach((sample: any) => {
            // Debug the sample object to see all available properties
            console.log('Processing sample for CSV:', sample);
            
            const row = [
                getProp(sample, 'sampleId') || '',
                getProp(sample, 'stationId') || '',
                getProp(sample, 'sampleCode') || '',
                getProp(sample, 'sampleType') || '',
                getProp(sample, 'matrixType') || '',
                getProp(sample, 'habitatType') || '',
                getProp(sample, 'samplingDevice') || '',
                getProp(sample, 'depthLower') !== undefined ? getProp(sample, 'depthLower').toString() : '',
                getProp(sample, 'depthUpper') !== undefined ? getProp(sample, 'depthUpper').toString() : '',
                getProp(sample, 'sampleDescription') || '',
                getProp(sample, 'analysis') || '',
                getProp(sample, 'result') !== undefined ? getProp(sample, 'result').toString() : '',
                getProp(sample, 'unit') || ''
            ];
            
            allRows.push(row.join(delimiter));
        });
        
        // Add empty rows as separator
        allRows.push(['', '', '', '', '', '', '', '', '', '', '', '', ''].join(delimiter));
        allRows.push(['', '', '', '', '', '', '', '', '', '', '', '', ''].join(delimiter));
    }
    
    // SECTION 8: ENVIRONMENTAL RESULTS - Matching exact column names from DbInitializer.cs
    // Collect all environmental results from all samples
    const allEnvResults = allSamples.flatMap((sample: any) => 
        (getProp(sample, 'envResults') || []).map((result: any) => ({
            ...result,
            sampleId: getProp(sample, 'sampleId'),
            sampleCode: getProp(sample, 'sampleCode'),
            stationId: getProp(sample, 'stationId'),
            stationCode: getProp(sample, 'stationCode')
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
        allEnvResults.forEach((result: any) => {
            const row = [
                getProp(result, 'envResultId') || '',
                getProp(result, 'sampleId'),
                getProp(result, 'analysisCategory') || '',
                getProp(result, 'analysisName') || '',
                getProp(result, 'analysisValue') !== undefined ? getProp(result, 'analysisValue').toString() : '',
                getProp(result, 'units') || '',
                getProp(result, 'remarks') || ''
            ];
            
            allRows.push(row.join(delimiter));
        });
        
        // Add empty rows as separator
        allRows.push(['', '', '', '', '', '', ''].join(delimiter));
        allRows.push(['', '', '', '', '', '', ''].join(delimiter));
    }
    
    // SECTION 9: GEOLOGICAL RESULTS - Matching exact column names from DbInitializer.cs
    // Collect all geological results from all samples
    const allGeoResults = allSamples.flatMap((sample: any) => 
        (getProp(sample, 'geoResults') || []).map((result: any) => ({
            ...result,
            sampleId: getProp(sample, 'sampleId'),
            sampleCode: getProp(sample, 'sampleCode'),
            stationId: getProp(sample, 'stationId')
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
        allGeoResults.forEach((result: any) => {
            const row = [
                getProp(result, 'geoResultId') || '',
                getProp(result, 'sampleId'),
                getProp(result, 'category') || '',
                getProp(result, 'analysis') || '',
                getProp(result, 'value') !== undefined ? getProp(result, 'value').toString() : '',
                getProp(result, 'units') || '',
                getProp(result, 'qualifier') || '',
                getProp(result, 'remarks') || ''
            ];
            
            allRows.push(row.join(delimiter));
        });
        
        // Add empty rows as separator
        allRows.push(['', '', '', '', '', '', '', ''].join(delimiter));
        allRows.push(['', '', '', '', '', '', '', ''].join(delimiter));
    }
    
    // SECTION 10: PHOTO/VIDEO - Matching exact column names from DbInitializer.cs
    // Collect all media from all samples
    const allMedia = allSamples.flatMap((sample: any) => 
        (getProp(sample, 'photoVideos') || []).map((media: any) => ({
            ...media,
            sampleId: getProp(sample, 'sampleId'),
            sampleCode: getProp(sample, 'sampleCode'),
            stationId: getProp(sample, 'stationId')
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
        allMedia.forEach((media: any) => {
            const row = [
                getProp(media, 'mediaId') || '',
                getProp(media, 'sampleId'),
                getProp(media, 'fileName') || '',
                getProp(media, 'mediaType') || '',
                getProp(media, 'cameraSpecs') || '',
                getProp(media, 'captureDate') ? new Date(getProp(media, 'captureDate')).toISOString().split('T')[0] : '',
                getProp(media, 'remarks') || ''
            ];
            
            allRows.push(row.join(delimiter));
        });
        
        // Add empty rows as separator
        allRows.push(['', '', '', '', '', '', ''].join(delimiter));
        allRows.push(['', '', '', '', '', '', ''].join(delimiter));
    }
    
    // SECTION 11: LIBRARY - Matching exact column names from DbInitializer.cs
    // Collect all library entries from all contractors
    const allLibraries = normalizedData.contractors.flatMap((contractor: any) => 
        (getProp(contractor, 'libraries') || []).map((library: any) => ({
            ...library,
            contractorId: getProp(contractor, 'contractorId'),
            contractorName: getProp(contractor, 'contractorName')
        }))
    );
    
    if (allLibraries.length > 0) {
        // Add section title
        allRows.push(['LIBRARY', '', '', '', '', '', '', '', '', ''].join(delimiter));
        
        // Column headers matching DbInitializer.cs
        allRows.push([
            'LibraryId',
            'ContractorId',
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
        allLibraries.forEach((library: any) => {
            const row = [
                getProp(library, 'libraryId') || '',
                getProp(library, 'contractorId'),
                getProp(library, 'theme') || '',
                getProp(library, 'fileName') || '',
                getProp(library, 'title') || '',
                getProp(library, 'description') || '',
                getProp(library, 'year') || '',
                getProp(library, 'country') || '',
                getProp(library, 'submissionDate') ? new Date(getProp(library, 'submissionDate')).toISOString().split('T')[0] : '',
                getProp(library, 'isConfidential') ? 'true' : 'false'
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
 * Debug utility to log the exact field names available in the data
 * @param obj Any object to analyze 
 */
export const debugDataFields = (data: any): void => {
    if (!data) {
        console.log('No data to debug');
        return;
    }
    
    console.log('--- DEBUG DATA STRUCTURE ---');
    
    // For each section, log the first item to see its structure
    if (data.contractors?.length > 0) {
        console.log('Contractor fields:', Object.keys(data.contractors[0]));
        
        if (data.contractors[0].areas?.length > 0) {
            console.log('Area fields:', Object.keys(data.contractors[0].areas[0]));
            
            if (data.contractors[0].areas[0].blocks?.length > 0) {
                console.log('Block fields:', Object.keys(data.contractors[0].areas[0].blocks[0]));
            }
        }
    }
    
    if (data.cruises?.length > 0) {
        console.log('Cruise fields:', Object.keys(data.cruises[0]));
        
        if (data.cruises[0].stations?.length > 0) {
            console.log('Station fields:', Object.keys(data.cruises[0].stations[0]));
            
            if (data.cruises[0].stations[0].samples?.length > 0) {
                console.log('Sample fields:', Object.keys(data.cruises[0].stations[0].samples[0]));
            }
        }
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
    counts.contractors = getProp(data, 'contractors')?.length || 0;
    
    // Count areas and blocks
    data.contractors?.forEach((contractor: any) => {
        // Count areas
        counts.areas += getProp(contractor, 'areas')?.length || 0;
        
        // Count blocks
        getProp(contractor, 'areas')?.forEach((area: any) => {
            counts.blocks += getProp(area, 'blocks')?.length || 0;
        });
        
        // Count libraries
        counts.libraries += getProp(contractor, 'libraries')?.length || 0;
    });
    
    // Count cruises and stations
    counts.cruises = getProp(data, 'cruises')?.length || 0;
    
    data.cruises?.forEach((cruise: any) => {
        // Count stations
        counts.stations += getProp(cruise, 'stations')?.length || 0;
        
        // Count CTD data
        getProp(cruise, 'stations')?.forEach((station: any) => {
            counts.ctdData += getProp(station, 'ctdDataSet')?.length || 0;
            
            // Count samples
            counts.samples += getProp(station, 'samples')?.length || 0;
            
            // Count sample-related data
            getProp(station, 'samples')?.forEach((sample: any) => {
                counts.envResults += getProp(sample, 'envResults')?.length || 0;
                counts.geoResults += getProp(sample, 'geoResults')?.length || 0;
                counts.media += getProp(sample, 'photoVideos')?.length || 0;
            });
        });
    });
    
    return counts;
};

export default {
    convertToCSV,
    downloadCSV,
    analyzeMapData,
    debugDataFields
};