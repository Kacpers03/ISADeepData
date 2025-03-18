// src/components/filters/ResultsInfo.tsx
import React from 'react';
import styles from '../../styles/map/filter.module.css';

interface ResultsInfoProps {
  loading: boolean;
  contractorCount: number;
  cruiseCount: number;
  stationCount: number;
}

const ResultsInfo: React.FC<ResultsInfoProps> = ({
  loading,
  contractorCount,
  cruiseCount,
  stationCount
}) => {
  return (
    <div className={styles.resultsInfo}>
      {loading ? (
        <span>Loading data...</span>
      ) : (
        <span>
          Showing {contractorCount} contractor{contractorCount !== 1 ? 's' : ''}, 
          {cruiseCount} cruise{cruiseCount !== 1 ? 's' : ''}, 
          and {stationCount} station{stationCount !== 1 ? 's' : ''}
        </span>
      )}
    </div>
  );
};

export default ResultsInfo;