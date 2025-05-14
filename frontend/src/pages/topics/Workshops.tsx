// frontend/src/pages/topics/Workshops.tsx
// Page component for displaying information about workshops with internationalization support

import React from 'react'
import Workshops from '../../components/topics/WorkshopsTemplate' // Template component with workshops content
import { useLanguage } from '../../contexts/languageContext' // Language context for internationalization

export default function WorkshopsPage() {
	// Get translation function from language context for internationalized content
	const { t } = useLanguage()

	// Render the workshops template component with translation function
	return <Workshops t={t} />
}
