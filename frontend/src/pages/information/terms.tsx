// frontend/src/pages/information/terms.tsx
import React from 'react'
import { Terms } from '@/components/information/termsTemplate'
import { useLanguage } from '@/contexts/languageContext'

export default function TermsPage() {
	const { t } = useLanguage()
	return <Terms t={t} />
}
