// frontend/src/shared/header.tsx
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import Navigation from "../components/navigation/navigation";
import { useLanguage } from "../contexts/languageContext";

export default function Header() {
  const router = useRouter();
  const [showHeader, setShowHeader] = useState(true);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    console.log("Route changed to: ", router.asPath);
    setShowHeader(true);
    lastScrollY.current = 0;
    window.scrollTo(0, 0);
  }, [router.asPath]);

  useEffect(() => {
    const handleScroll = () => {
      if (isNavOpen) {
        setShowHeader(true);
        lastScrollY.current = window.scrollY;
        return;
      }
      if (window.scrollY > lastScrollY.current && window.scrollY > 100) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      lastScrollY.current = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isNavOpen]);

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
    setShowHeader(true);
  };

  const handleLanguageChange = (lang: 'en' | 'es' | 'fr') => {
    setLanguage(lang);
    setLangMenuOpen(false);
  };

  return (
    <header
      className={`sticky-header ${
        showHeader ? "header-visible" : "header-hidden"
      }`}
    >
      <div className="container">
        {/* Top row with logo, language selector, and burger button */}
        <div className="d-flex align-items-center justify-content-between py-3">
          <Link href="/" passHref legacyBehavior>
            <a className="home-link d-flex align-items-center text-decoration-none">
              <Image src="/image/image.png" alt="Logo" width={80} height={80} />
              <div className="ms-3">
                <h1 className="h4 mb-0">{t('header.home')}</h1>
                <p className="text-primary">{t('header.subtitle')}</p>
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
                <div className="position-absolute top-100 mt-1 end-0 bg-white shadow-sm rounded py-1" style={{ zIndex: 1100, minWidth: '120px' }}>
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