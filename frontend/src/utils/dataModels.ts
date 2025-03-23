// frontend/src/utils/dataModels.ts

/**
 * Type definitions matching backend models
 * These interfaces represent the data structures used throughout the application
 */

export interface Contractor {
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

export interface Area {
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

export interface Block {
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

export interface Cruise {
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

export interface Station {
    stationId: number;
    stationCode?: string;
    stationType?: string;
    cruiseId: number;
    latitude: number;
    longitude: number;
    samples?: Sample[];
    ctdDataSet?: CTDData[];
}

export interface Sample {
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

export interface EnvResult {
    envResultId: number;
    sampleId: number;
    analysisCategory?: string;
    analysisName?: string;
    analysisValue?: number;
    units?: string;
    remarks?: string;
}

export interface GeoResult {
    geoResultId: number;
    sampleId: number;
    category?: string;
    analysis?: string;
    value?: number;
    units?: string;
    qualifier?: string;
    remarks?: string;
}

export interface CTDData {
    ctdId: number;
    stationId: number;
    depthM?: number;
    temperatureC?: number;
    salinity?: number;
    oxygen?: number;
    ph?: number;
    measurementTime?: string;
}

export interface PhotoVideo {
    mediaId: number;
    sampleId: number;
    fileName?: string;
    mediaType?: string;
    cameraSpecs?: string;
    captureDate?: string;
    remarks?: string;
}

export interface Library {
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

export interface MapData {
    contractors: Contractor[];
    cruises: Cruise[];
}