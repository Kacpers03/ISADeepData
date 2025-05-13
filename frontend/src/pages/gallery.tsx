// frontend/src/pages/gallery.tsx
// Gallery page component for displaying deep-sea images and videos with internationalization support

import React from 'react'
import Head from 'next/head' // Next.js Head component for managing document head
import GalleryTemplate from '../components/gallery/galleryTemplate' // Main gallery component with all functionality
import { useLanguage } from '../contexts/languageContext' // Language context for internationalization

const GalleryPage: React.FC = () => {
	// Get translation function from language context
	// This enables multi-language support throughout the page
	const { t } = useLanguage()

	return (
		<>
			<Head>
				{/* Dynamic page title with fallback based on current language */}
				<title>{t('gallery.pageTitle') || 'Gallery'} | ISA DeepData</title>

				{/* Dynamic meta description with fallback based on current language */}
				<meta
					name='description'
					content={t('gallery.pageDescription') || 'Browse deep-sea images and videos from the ISA DeepData gallery'}
				/>
			</Head>

			{/* Main gallery component that handles loading and displaying media */}
			<GalleryTemplate />
		</>
	)
}

export default GalleryPage
