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
  
  // Contractor area data
  export interface ContractorArea {
    areaId: number;
    contractorId: number;
    areaName: string;
    areaDescription: string;
    blocks?: ContractorAreaBlock[];
  }
  
  // Area block data
  export interface ContractorAreaBlock {
    blockId: number;
    areaId: number;
    blockName: string;
    blockDescription: string;
    status: string;
    // GeoJSON coordinates could be added here if available
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