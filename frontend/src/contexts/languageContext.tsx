// frontend/src/contexts/languageContext.tsx
// Provides a React context for managing application language and translations

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react' // Import React and required hooks for context management

// Import language files with translation strings
import enTranslations from '../languages/en.json' // English translations
import esTranslations from '../languages/es.json' // Spanish translations
import frTranslations from '../languages/fr.json' // French translations

// Define available languages as a TypeScript type for type safety
export type Language = 'en' | 'es' | 'fr' // English, Spanish, French language codes

// Language resources object mapping language codes to their translation files
const resources = {
	en: enTranslations, // English translation data
	es: esTranslations, // Spanish translation data
	fr: frTranslations, // French translation data
}

// Interface defining the shape of the language context
interface LanguageContextType {
	language: Language // Current active language
	setLanguage: (language: Language) => void // Function to change the active language
	t: (key: string) => string // Translation function that returns strings for given keys
}

// Create the language context with undefined as initial value
const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Props interface for the LanguageProvider component
interface LanguageProviderProps {
	children: ReactNode // React children to be wrapped by the provider
}

// LanguageProvider component to wrap the application and provide language context
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
	// Initialize language state with default 'en' (English)
	const [language, setLanguage] = useState<Language>('en')

	// Load stored language preference from localStorage on initial render
	useEffect(() => {
		if (typeof window !== 'undefined') {
			// Check if running in browser environment
			const storedLanguage = localStorage.getItem('language') as Language // Get stored language
			if (storedLanguage && ['en', 'es', 'fr'].includes(storedLanguage)) {
				// Validate language is supported
				setLanguage(storedLanguage) // Set language to stored preference
			}
		}
	}, []) // Empty dependency array ensures this effect runs only once on mount

	// Update localStorage and document language attribute when language changes
	useEffect(() => {
		if (typeof window !== 'undefined') {
			// Check if running in browser environment
			localStorage.setItem('language', language) // Save language preference to localStorage
			document.documentElement.lang = language // Update HTML lang attribute for accessibility
		}
	}, [language]) // Run effect when language state changes

	// Translation function to retrieve localized strings
	const t = (key: string): string => {
		// Split the key by dots to access nested properties in translation objects
		const keys = key.split('.') // e.g., 'nav.home' becomes ['nav', 'home']
		let translation: any = resources[language] // Start with the root of current language resources

		// Navigate through the nested properties to find the translation
		for (const k of keys) {
			if (translation && translation[k] !== undefined) {
				translation = translation[k] // Move deeper into the object
			} else {
				console.warn(`Translation key not found: ${key}`) // Log warning for missing translations
				return key // Return the key itself as fallback
			}
		}

		return translation // Return the found translation string
	}

	// Provide the language context to child components
	return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

// Custom hook to use the language context in components
export const useLanguage = (): LanguageContextType => {
	const context = useContext(LanguageContext) // Access the language context
	if (!context) {
		// Throw error if hook is used outside of LanguageProvider
		throw new Error('useLanguage must be used within a LanguageProvider')
	}
	return context // Return the context with language state and functions
}
