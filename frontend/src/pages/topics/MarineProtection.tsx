// frontend/src/pages/topics/MarineProtection.tsx
// Page component for displaying information about marine protection initiatives with internationalization support

import React from 'react'
import MarineProtection from '../../components/topics/MarineProtectionTemplate' // Template component with marine protection content
import { useLanguage } from '../../contexts/languageContext' // Language context for internationalization

export default function MarineProtectionPage() {
	// Get translation function from language context for internationalized content
	const { t } = useLanguage()

	// Render the marine protection template component with translation function
	return <MarineProtection t={t} />
}
