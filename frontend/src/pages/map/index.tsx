// frontend/src/pages/map/index.tsx
import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import { FilterProvider } from "../../components/map/context/filterContext";
import styles from "../../styles/map/mapPage.module.css";
import { ImprovedFilterPanel } from "../../components/map/filters/filterPanel";
import { useRouter } from "next/router";

// Dynamically import MapComponent without SSR
const EnhancedMapComponent = dynamic(
  () => import("../../components/map/mapComponent"),
  { ssr: false }
);

export default function MapPage() {
  const router = useRouter();

  // Hook for å fikse navigasjonsklikk på kartsiden
  useEffect(() => {
    // Legg til global event listener som stopper kartets fangst av klikk på nav-elementer
    const handleNavbarClicks = (e) => {
      // Sjekk om klikk er på navbar eller dropdown
      const isNavbarClick = e.target.closest('.navbar') !== null || 
                           e.target.classList.contains('dropdown-item') ||
                           e.target.classList.contains('nav-link');
      
      if (isNavbarClick) {
        // Stopp hendelsespropagering før den når kartkomponenten
        e.stopPropagation();
      }
    };

    // Legg til event listener i capturing-fasen (true)
    document.addEventListener('click', handleNavbarClicks, true);
    
    // Sørg for at Bootstrap JS er lastet og initialisert (dropdown og navbar)
    if (typeof window !== 'undefined') {
      // Hent inn Bootstrap JS
      require('bootstrap/dist/js/bootstrap.bundle.min.js');
      
      // Initialiser dropdowns på nytt
      document.querySelectorAll('.dropdown-toggle').forEach(dropdownToggle => {
        const dropdownMenu = dropdownToggle.nextElementSibling;
        
        // Legg til manuell toggle-funksjonalitet (backup)
        dropdownToggle.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          if (dropdownMenu && dropdownMenu.classList.contains('show')) {
            dropdownMenu.classList.remove('show');
          } else if (dropdownMenu) {
            // Lukk alle andre åpne dropdowns først
            document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
              if (menu !== dropdownMenu) menu.classList.remove('show');
            });
            
            dropdownMenu.classList.add('show');
          }
        });
      });
    }
    
    // Rens opp event listeners når komponenten unmounts
    return () => {
      document.removeEventListener('click', handleNavbarClicks, true);
    };
  }, []);

  // Tilfør ytterligere Bootstrap JS-initialiseringer ved behov
  useEffect(() => {
    // Sørg for at navbar-kollapsen fungerer riktig på mobilvisning
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.getElementById('navbarNav');
    
    if (navbarToggler && navbarCollapse) {
      navbarToggler.addEventListener('click', () => {
        navbarCollapse.classList.toggle('show');
      });
    }
  }, []);

  return (
    <FilterProvider>
      <Head>
        <title>ISA DeepData - Exploration Map</title>
        <meta name="description" content="Interactive map of deep seabed exploration contracts and areas regulated by the International Seabed Authority" />
      </Head>
      
      <div className={styles.mapPageContainer}>
        <header className={styles.mapHeader}>
          <h1>ISA Exploration Areas</h1>
          <p className={styles.mapDescription}>
            Interactive map of deep seabed exploration contracts and areas regulated by the
            International Seabed Authority. Use the filters to explore by mineral type,
            contract status, location, and sponsoring state.
          </p>
        </header>
        
        {/* New layout with side-by-side filter panel and map */}
        <div className={styles.mapLayout}>
          {/* Side filter panel with integrated search */}
          <div className={styles.sideFilterPanel}>
            <ImprovedFilterPanel />
          </div>
          
          {/* Map container */}
          <div className={styles.mapSection}>
            <EnhancedMapComponent />
          </div>
        </div>
        
        <div className={styles.mapInfoSection}>
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <h3>Explore Contract Areas</h3>
            <p>
              Use the search function to quickly find contractors, areas, blocks, 
              and stations. Click on markers for detailed information.
            </p>
          </div>
          
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <h3>Deep Seabed Resources</h3>
            <p>
              The ISA regulates exploration of minerals in the international
              seabed area, which covers approximately 54% of the world's oceans.
            </p>
          </div>
          
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18"></path>
                <path d="M18 17V9"></path>
                <path d="M13 17V5"></path>
                <path d="M8 17v-3"></path>
              </svg>
            </div>
            <h3>Data Transparency</h3>
            <p>
              All contract information is available as part of ISA's commitment to
              transparency in deep seabed activities and environmental protection.
            </p>
          </div>
        </div>
      </div>
    </FilterProvider>
  );
}