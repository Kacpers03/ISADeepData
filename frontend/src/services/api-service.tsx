import { MapFilterParams } from '../types/filter-types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5062/api';

// Helper function to build query parameters
const buildQueryParams = (params: Record<string, any>): string => {
  const validParams = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');
  
  return validParams ? `?${validParams}` : '';
};

export const apiService = {
  // Get all filter options for dropdowns
  async getFilterOptions() {
    try {
      const [contractTypes, contractStatuses, states, years] = await Promise.all([
        fetch(`${API_BASE_URL}/MapFilter/contract-types`).then(res => res.json()),
        fetch(`${API_BASE_URL}/MapFilter/contract-statuses`).then(res => res.json()),
        fetch(`${API_BASE_URL}/MapFilter/sponsoring-states`).then(res => res.json()),
        fetch(`${API_BASE_URL}/MapFilter/contractual-years`).then(res => res.json())
      ]);
      
      return {
        contractTypes,
        contractStatuses,
        sponsoringStates: states,
        contractualYears: years
      };
    } catch (error) {
      console.error('Failed to fetch filter options:', error);
      throw error;
    }
  },

  // Get map data with filters
  async getMapData(filters: MapFilterParams = {}) {
    try {
      const queryParams = buildQueryParams(filters);
      const response = await fetch(`${API_BASE_URL}/MapFilter/map-data${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch map data:', error);
      throw error;
    }
  },
  
  // Get stations with geo filters
  async getStations(params: {
    cruiseId?: number;
    minLat?: number;
    maxLat?: number;
    minLon?: number;
    maxLon?: number;
  } = {}) {
    try {
      const queryParams = buildQueryParams(params);
      const response = await fetch(`${API_BASE_URL}/MapFilter/stations${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch stations:', error);
      throw error;
    }
  }
};