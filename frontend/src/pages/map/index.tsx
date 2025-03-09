import React from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import { FilterProvider } from "../../contexts/filterContext";
import styles from "../../styles/map/mapPage.module.css";
import { ImprovedFilterPanel } from "../../components/filters/filterPanel";

// Dynamically import MapComponent without SSR
const EnhancedMapComponent = dynamic(
  () => import("../../components/map/enhancedMapComponent"),
  { ssr: false }
);

export default function MapPage() {
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