// frontend/src/contexts/languageContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Import language files
import enTranslations from '../languages/en.json';
import esTranslations from '../languages/es.json';
import frTranslations from '../languages/fr.json';

// Define available languages
export type Language = 'en' | 'es' | 'fr';

// Language resources
const resources = {
  en: enTranslations,
  es: esTranslations,
  fr: frTranslations
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Try to get language from localStorage, default to 'en'
  const [language, setLanguage] = useState<Language>('en');

  // Load stored language on initial render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedLanguage = localStorage.getItem('language') as Language;
      if (storedLanguage && ['en', 'es', 'fr'].includes(storedLanguage)) {
        setLanguage(storedLanguage);
      }
    }
  }, []);

  // Update localStorage when language changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', language);
      document.documentElement.lang = language;
    }
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    // Split the key by dots to access nested properties
    const keys = key.split('.');
    let translation: any = resources[language];

    // Navigate through the nested properties
    for (const k of keys) {
      if (translation && translation[k] !== undefined) {
        translation = translation[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }

    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};