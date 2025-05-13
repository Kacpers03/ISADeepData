// frontend/src/pages/information/terms.tsx
// Terms and conditions page component with internationalization support

import React from 'react'
import { Terms } from '@/components/information/termsTemplate' // Terms component with all terms and conditions content
import { useLanguage } from '@/contexts/languageContext' // Language context for internationalization

export default function TermsPage() {
	// Get translation function from language context
	// This enables displaying terms and conditions in different languages
	const { t } = useLanguage()

	// Render the Terms component, passing the translation function
	// for internationalized content
	return <Terms t={t} />
}
