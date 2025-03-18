// frontend/src/components/map/ui/loadingOverlay.tsx
import React from 'react';
import styles from '../../../styles/map/base.module.css';

const LoadingOverlay = () => {
  return (
    <div className={styles.loadingOverlay}>
      <div className={styles.loadingSpinner}></div>
      <div className={styles.loadingText}>Loading map data...</div>
    </div>
  );
};

export default LoadingOverlay;