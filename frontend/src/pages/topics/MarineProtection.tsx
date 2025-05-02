import React from 'react'
import MarineProtection from '../../components/topics/MarineProtectionTemplate'
import { useLanguage } from '../../contexts/languageContext'

export default function MarineProtectionPage() {
	const { t } = useLanguage()
	return <MarineProtection t={t} />
}
