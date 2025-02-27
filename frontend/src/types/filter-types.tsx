// TypeScript type definitions for filter system
export interface MapFilterParams {
    contractorId?: number;
    contractTypeId?: number;
    contractStatusId?: number;
    sponsoringState?: string;
    year?: number;
    cruiseId?: number;
    minLat?: number;
    maxLat?: number;
    minLon?: number;
    maxLon?: number;
  }


  // I frontend/src/types/filter-types.tsx

// Legg til disse nye typene
export interface GeoJsonFeature {
  type: "Feature";
  properties: Record<string, any>;
  geometry: {
    type: string;
    coordinates: number[][][];
  };
}

export interface ContractorAreaGeoData {
  areaId: number;
  areaName: string;
  geoJson: string;
  centerLat: number;
  centerLon: number;
  totalAreaSizeKm2: number;
  allocationDate: string;
  expiryDate: string;
  blocks: ContractorBlockGeoData[];
}

export interface ContractorBlockGeoData {
  blockId: number;
  blockName: string;
  status: string;
  geoJson: string;
  centerLat: number;
  centerLon: number;
  areaSizeKm2: number;
}

// Oppdater eksisterende typer
export interface ContractorAreaBlock {
  blockId: number;
  areaId: number;
  blockName: string;
  blockDescription: string;
  status: string;
  geoJsonBoundary?: string;
  centerLatitude?: number;
  centerLongitude?: number;
  areaSizeKm2?: number;
}

export interface ContractorArea {
  areaId: number;
  contractorId: number;
  areaName: string;
  areaDescription: string;
  geoJsonBoundary?: string;
  centerLatitude?: number;
  centerLongitude?: number;
  totalAreaSizeKm2?: number;
  allocationDate?: string;
  expiryDate?: string;
  blocks?: ContractorAreaBlock[];
}
  
  // Filter dropdown options
  export interface FilterOptions {
    contractTypes: ContractType[];
    contractStatuses: ContractStatus[];
    sponsoringStates: string[];
    contractualYears: number[];
  }
  
  // Contract types
  export interface ContractType {
    contractTypeId: number;
    contractTypeName: string;
  }
  
  // Contract statuses
  export interface ContractStatus {
    contractStatusId: number;
    contractStatusName: string;
  }
  
  // Contractor data
  export interface Contractor {
    contractorId: number;
    contractorName: string;
    contractTypeId: number;
    contractStatusId: number;
    contractNumber: string;
    sponsoringState: string ;
    contractualYear: number;
    remarks: string;
    contractType?: string; 
    contractStatus?: string;
    areas?: ContractorArea[];
  }
  
 // Oppdater eksisterende typer
export interface ContractorAreaBlock {
    blockId: number;
    areaId: number;
    blockName: string;
    blockDescription: string;
    status: string;
    geoJsonBoundary?: string;
    centerLatitude?: number;
    centerLongitude?: number;
    areaSizeKm2?: number;
  }
  
  export interface ContractorArea {
    areaId: number;
    contractorId: number;
    areaName: string;
    areaDescription: string;
    geoJsonBoundary?: string;
    centerLatitude?: number;
    centerLongitude?: number;
    totalAreaSizeKm2?: number;
    allocationDate?: string;
    expiryDate?: string;
    blocks?: ContractorAreaBlock[];
  }
  
 
  // Cruise data
  export interface Cruise {
    cruiseId: number;
    contractorId: number;
    cruiseName: string;
    researchVessel: string;
    startDate: string;
    endDate: string;
    stations?: Station[];
  }
  
  // Station data
  export interface Station {
    stationId: number;
    cruiseId: number;
    stationCode: string;
    stationType: string;
    latitude: number;
    longitude: number;
    samples?: Sample[];
  }
  
  // Sample data
  export interface Sample {
    sampleId: number;
    stationId: number;
    sampleCode: string;
    sampleType: string;
    matrixType: string;
    habitatType: string;
    samplingDevice: string;
    depthLower: number;
    depthUpper: number;
    sampleDescription: string;
    media?: Media[];
  }
  
  // Media data
  export interface Media {
    mediaId: number;
    sampleId: number;
    fileName: string;
    mediaType: string;
    cameraSpecs: string;
    captureDate: string;
    remarks: string;
  }
  
  // Complete map data response
  export interface MapData {
    contractors: Contractor[];
    cruises: Cruise[];
  }


  // Legg til disse nye typene
export interface GeoJsonFeature {
    type: "Feature";
    properties: Record<string, any>;
    geometry: {
      type: string;
      coordinates: number[][][];
    };
  }
  
  export interface ContractorAreaGeoData {
    areaId: number;
    areaName: string;
    geoJson: string;
    centerLat: number;
    centerLon: number;
    totalAreaSizeKm2: number;
    allocationDate: string;
    expiryDate: string;
    blocks: ContractorBlockGeoData[];
  }
  
  export interface ContractorBlockGeoData {
    blockId: number;
    blockName: string;
    status: string;
    geoJson: string;
    centerLat: number;
    centerLon: number;
    areaSizeKm2: number;
  }