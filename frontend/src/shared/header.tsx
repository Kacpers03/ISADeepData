// frontend/src/shared/header.tsx
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import Navigation from "../components/navigation/navigation";
import { useLanguage } from "../contexts/languageContext";

export default function Header() {
  const router = useRouter();
  // Ikke lenger nødvendig å spore header-synlighet
  // const [showHeader, setShowHeader] = useState(true);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    console.log("Route changed to: ", router.asPath);
    // Bare ruller tilbake til toppen ved ruteendring, ingen header-endring nødvendig
    window.scrollTo(0, 0);
  }, [router.asPath]);

  // Fjernet scroll-håndtering siden vi ikke lenger trenger å vise/skjule headeren basert på scrolling
  // Header vil nå oppføre seg som et normalt element som forsvinner når man scroller ned

  // Close language menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavToggle = () => {
    setIsNavOpen((prev) => !prev);
    // Ingen header-oppdatering nødvendig
  };

  const handleLanguageChange = (lang: 'en' | 'es' | 'fr') => {
    setLanguage(lang);
    setLangMenuOpen(false);
  };

  return (
    <header
      className="sticky-header"
    >
      <div className="container">
        {/* Top row with logo, language selector, and burger button */}
        <div className="d-flex align-items-center justify-content-between py-2">
          <Link href="/" passHref legacyBehavior>
            <a className="home-link d-flex align-items-center text-decoration-none">
              <Image src="/image/image.png" alt="Logo" width={70} height={70} />
              <div className="ms-3">
                <h1 className="h4 mb-0">{t('header.home')}</h1>
                <p className="text-primary mb-0">{t('header.subtitle')}</p>
              </div>
            </a>
          </Link>
          
          {/* Language selector and burger menu container */}
          <div className="d-flex align-items-center">
            <div className="position-relative mx-3" ref={langMenuRef}>
              <button 
                className="btn btn-sm btn-outline-secondary d-flex align-items-center" 
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                aria-label="Select language"
              >
                <span className="me-1">{language.toUpperCase()}</span>
                <i className={`fas fa-chevron-${langMenuOpen ? 'up' : 'down'} small`}></i>
              </button>
              
              {langMenuOpen && (
                <div className="position-absolute top-100 mt-1 end-0 bg-white shadow-sm rounded py-1" style={{ zIndex: 11000, minWidth: '120px' }}>
                  <button 
                    className={`dropdown-item px-3 py-2 ${language === 'en' ? 'fw-bold text-primary' : ''}`}
                    onClick={() => handleLanguageChange('en')}
                  >
                    {t('languages.en')}
                  </button>
                  <button 
                    className={`dropdown-item px-3 py-2 ${language === 'es' ? 'fw-bold text-primary' : ''}`}
                    onClick={() => handleLanguageChange('es')}
                  >
                    {t('languages.es')}
                  </button>
                  <button 
                    className={`dropdown-item px-3 py-2 ${language === 'fr' ? 'fw-bold text-primary' : ''}`}
                    onClick={() => handleLanguageChange('fr')}
                  >
                    {t('languages.fr')}
                  </button>
                </div>
              )}
            </div>
            
            {/* Burger button - only shown on mobile */}
            <button
              className="navbar-toggler custom-toggler d-lg-none"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded={isNavOpen}
              aria-label="Toggle navigation"
              onClick={handleNavToggle}
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>
        </div>
        {/* Navigation menu */}
        <Navigation />
      </div>
    </header>
  );
}