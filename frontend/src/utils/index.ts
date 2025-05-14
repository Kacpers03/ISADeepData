// frontend/src/utils/index.ts
// Central export point for all data utility functions and models

// Re-export all CSV export functionality from their respective files
// This allows importing directly from 'utils' instead of individual files
export * from './dataModels' // Data interface definitions
export * from './dataUtilities' // Helper functions for data manipulation
export * from './csvExport' // CSV export functions for complex data

// Re-export the default exports as a combined object
// This creates a unified API for accessing all utility functions
import dataModels from './dataModels'
import dataUtilities from './dataUtilities'
import csvExport from './csvExport'

// Combine all default exports into a single unified object
// This allows importing the entire utility library with a single import
export default {
	...dataModels,
	...dataUtilities,
	...csvExport,
}
