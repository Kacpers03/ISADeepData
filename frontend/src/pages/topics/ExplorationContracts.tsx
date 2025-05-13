// frontend/src/pages/topics/ExplorationContracts.tsx
// Page component for displaying information about exploration contracts with internationalization support

import React from 'react'
import ExplorationContracts from '../../components/topics/ExplorationContractsTemplate' // Template component with exploration contracts content
import { useLanguage } from '../../contexts/languageContext' // Language context for internationalization

export default function ExplorationContractsPage() {
	// Get translation function from language context for internationalized content
	const { t } = useLanguage()

	// Render the exploration contracts template component with translation function
	return <ExplorationContracts t={t} />
}
