// frontend/src/components/map/filters/resultInfo.tsx
import React from 'react';
import styles from '../../../styles/map/filter.module.css';

interface ResultsInfoProps {
  loading: boolean;
  contractorCount: number;
  cruiseCount: number;
  stationCount: number;
  onDownloadCSV: () => void; // New prop for CSV download handler
}

const ResultsInfo: React.FC<ResultsInfoProps> = ({
  loading,
  contractorCount,
  cruiseCount,
  stationCount,
  onDownloadCSV
}) => {
  return (
    <div className={styles.resultsInfoWrapper}>
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
      
      {/* Download CSV button */}
      <button 
        className={styles.downloadButton}
        onClick={onDownloadCSV}
        disabled={loading || contractorCount === 0}
      >
        Download CSV
      </button>
    </div>
  );
};

export default ResultsInfo;