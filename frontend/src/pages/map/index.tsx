import React from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import { FilterProvider } from "../../contexts/filterContext";
import styles from "../../styles/map/mapPage.module.css";

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
        
        <div className={styles.mapSection}>
          <EnhancedMapComponent />
        </div>
        
        <div className={styles.mapInfoSection}>
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>🔍</div>
            <h3>Explore Contract Areas</h3>
            <p>
              Click on markers to view detailed information about exploration contracts,
              including mineral types, sponsoring states, and contract dates.
            </p>
          </div>
          
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>🌊</div>
            <h3>Deep Seabed Resources</h3>
            <p>
              The ISA regulates exploration and exploitation of minerals in the international
              seabed area, which covers approximately 54% of the total area of the world's oceans.
            </p>
          </div>
          
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>📊</div>
            <h3>Data Transparency</h3>
            <p>
              All contract information is made available as part of ISA's commitment to
              transparency in deep seabed activities and environmental protection.
            </p>
          </div>
        </div>
      </div>
    </FilterProvider>
  );
}