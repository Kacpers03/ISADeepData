// frontend/src/pages/document/documents.tsx
// Documents page component for displaying and managing document library

import React from 'react'
import DocumentTemplate from '../../components/documents/documentTemplate' // Template component with document browsing functionality

export default function Documents() {
	// Render the document template component which handles all document listing,
	// filtering, sorting, and viewing functionality
	return <DocumentTemplate />
}
