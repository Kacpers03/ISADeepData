// frontend/src/components/map/filters/resultInfo.tsx
import React, { useState } from 'react';
import styles from '../../../styles/map/filter.module.css';
import { downloadCSV } from '../../../utils/csvExport';

interface ResultsInfoProps {
  loading: boolean;
  contractorCount: number;
  cruiseCount: number;
  stationCount: number;
  mapData: any; // The actual map data to export
}

const ResultsInfo: React.FC<ResultsInfoProps> = ({
  loading,
  contractorCount,
  cruiseCount,
  stationCount,
  mapData
}) => {
  const [isExporting, setIsExporting] = useState(false);
  
  // Handler for CSV download
  const handleDownloadCSV = async () => {
    if (!mapData || isExporting) return;
    
    setIsExporting(true);
    
    try {
      // Use the utility function to download the CSV
      await downloadCSV(mapData, `exploration-data`);
    } catch (error) {
      console.error('Error exporting CSV:', error);
    } finally {
      // Short delay to show loading state
      setTimeout(() => {
        setIsExporting(false);
      }, 500);
    }
  };

  return (
    <div className={styles.resultsInfoWrapper}>
      <div className={styles.resultsInfo}>
        {loading ? (
          <span>Loading data...</span>
        ) : (
          <span>
            Showing {contractorCount} contractor{contractorCount !== 1 ? 's' : ''}, {' '}
            {cruiseCount} cruise{cruiseCount !== 1 ? 's' : ''}, {' '}
            and {stationCount} station{stationCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>
      
      {/* CSV Export Button with loading state */}
      <button 
        className={styles.downloadButton}
        onClick={handleDownloadCSV}
        disabled={loading || contractorCount === 0 || isExporting}
        title="Download data as CSV file"
      >
        {isExporting ? (
          <>
            <span className={styles.buttonSpinner}></span>
            <span>Exporting...</span>
          </>
        ) : (
          <>Download CSV</>
        )}
      </button>
    </div>
  );
};

export default ResultsInfo;