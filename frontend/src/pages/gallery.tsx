import React from 'react'
import Head from 'next/head'
import GalleryTemplate from '../components/gallery/galleryTemplate'
import { useLanguage } from '../contexts/languageContext'

const GalleryPage: React.FC = () => {
	const { t } = useLanguage()

	return (
		<>
			<Head>
				<title>{t('gallery.pageTitle') || 'Gallery'} | ISA DeepData</title>
				<meta
					name='description'
					content={t('gallery.pageDescription') || 'Browse deep-sea images and videos from the ISA DeepData gallery'}
				/>
			</Head>

			<GalleryTemplate />
		</>
	)
}

export default GalleryPage
