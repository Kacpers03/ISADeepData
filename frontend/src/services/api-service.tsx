// Types for filter parameters
export interface MapFilterParams {
  contractorId?: number;
  contractTypeId?: number;
  contractStatusId?: number;
  sponsoringState?: string | null;
  year?: number;
  cruiseId?: number;
}

// Types for filter options
export interface FilterOptions {
  contractTypes: Array<{ contractTypeId: number; contractTypeName: string }>;
  contractStatuses: Array<{ contractStatusId: number; contractStatusName: string }>;
  sponsoringStates: string[];
  contractualYears: number[];
}

// Configuration for API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5062/api';

// Utility function to build query parameters
const buildQueryParams = (params: MapFilterParams): string => {
  // Convert params to query string, handling null/undefined/empty values
  const queryParams = Object.entries(params)
    .filter(([_, value]) => 
      value !== undefined && 
      value !== null && 
      (typeof value !== 'string' || value.trim() !== '')
    )
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');
  
  return queryParams ? `?${queryParams}` : '';
};

// API Service with robust error handling
export const apiService = {
  // Fetch all filter options for dropdowns
  async getFilterOptions(): Promise<FilterOptions> {
    try {
      const endpoints = [
        'contract-types',
        'contract-statuses', 
        'sponsoring-states', 
        'contractual-years'
      ];

      const responses = await Promise.all(
        endpoints.map(endpoint => 
          fetch(`${API_BASE_URL}/MapFilter/${endpoint}`).then(res => {
            if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);
            return res.json();
          })
        )
      );

      return {
        contractTypes: responses[0],
        contractStatuses: responses[1],
        sponsoringStates: responses[2],
        contractualYears: responses[3]
      };
    } catch (error) {
      console.error('Error fetching filter options:', error);
      throw error;
    }
  },

  // Fetch map data with flexible filtering
  async getMapData(filters: MapFilterParams = {}): Promise<any> {
    try {
      // Sanitize filters to remove empty strings
      const sanitizedFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => 
          v !== undefined && 
          v !== null && 
          (typeof v !== 'string' || v.trim() !== '')
        )
      );

      const queryParams = buildQueryParams(sanitizedFilters);
      
      const response = await fetch(`${API_BASE_URL}/MapFilter/map-data${queryParams}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch map data:', error);
      throw error;
    }
  },
  
  // Fetch stations with geographic filtering
  async getStations(params: {
    cruiseId?: number;
    minLat?: number;
    maxLat?: number;
    minLon?: number;
    maxLon?: number;
  } = {}): Promise<any> {
    try {
      const queryParams = buildQueryParams(params);
      
      const response = await fetch(`${API_BASE_URL}/MapFilter/stations${queryParams}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch stations:', error);
      throw error;
    }
  }
};