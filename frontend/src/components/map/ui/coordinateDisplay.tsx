// frontend/src/components/map/ui/CoordinateDisplay.tsx
import React from 'react';
import styles from '../../../styles/map/base.module.css';
interface CoordinateDisplayProps {
  latitude: string | number;
  longitude: string | number;
}

const CoordinateDisplay: React.FC<CoordinateDisplayProps> = ({ latitude, longitude }) => {
  return (
    <div className={styles.coordinateDisplay}>
      {latitude}, {longitude}
    </div>
  );
};

export default CoordinateDisplay;