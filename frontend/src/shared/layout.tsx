// frontend/src/shared/layout.tsx
// Main layout component that wraps all pages with header, footer and language provider

import { useRouter } from 'next/router' // Import Next.js router for path information
import Header from './header' // Import Header component
import Footer from './footer' // Import Footer component
import { LanguageProvider } from '../contexts/languageContext' // Import language provider for translations

// Layout component that wraps all page content
export default function Layout({ children }: { children: React.ReactNode }) {
	const { pathname } = useRouter() // Get current route path from Next.js router
	const mainClass = pathname === '/' ? 'homeMain' : 'container mt-4' // Different styling for home page vs other pages

	return (
		<LanguageProvider>
			{' '}
			{/* Wrap everything in language provider for translations */}
			<div className='layout'>
				{' '}
				{/* Main layout container */}
				<Header /> {/* Include the header component */}
				<main className={mainClass}>{children}</main> {/* Main content area with conditional styling */}
				<Footer /> {/* Include the footer component */}
			</div>
		</LanguageProvider>
	)
}
