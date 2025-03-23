// frontend/src/components/map/filters/resultInfo.tsx
import React, { useState } from 'react';
import styles from '../../../styles/map/filter.module.css';
import { downloadCSV, analyzeMapData } from '../../../utils';

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
  const [exportState, setExportState] = useState<string | null>(null);
  
  // Handler for CSV download with improved error handling and data analysis
  const handleDownloadCSV = async () => {
    if (!mapData || isExporting) return;
    
    setIsExporting(true);
    setExportState('Analyzing data...');
    
    try {
      // Check if all data is properly loaded
      const dataCounts = analyzeMapData(mapData);
      console.log('Data analysis for export:', dataCounts);
      
      // Set status message to show what's being exported
      setExportState(`Preparing CSV with ${dataCounts.contractors} contractors, ${dataCounts.cruises} cruises...`);
      
      // Use the enhanced utility function to download the CSV
      const result = await downloadCSV(mapData, `exploration-data`);
      
      if (result) {
        setExportState('CSV downloaded successfully!');
      } else {
        setExportState('Error during download');
      }
    } catch (error) {
      console.error('Error exporting CSV:', error);
      setExportState('Error: ' + (error.message || 'Failed to export data'));
    } finally {
      // Reset state after a delay
      setTimeout(() => {
        setIsExporting(false);
        setExportState(null);
      }, 2000);
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
      
      {/* CSV Export Button with improved loading state and feedback */}
      <button 
        className={styles.downloadButton}
        onClick={handleDownloadCSV}
        disabled={loading || contractorCount === 0 || isExporting}
        title="Download complete data as CSV file"
      >
        {isExporting ? (
          <>
            <span className={styles.buttonSpinner}></span>
            <span>{exportState || 'Exporting...'}</span>
          </>
        ) : (
          <>Download CSV</>
        )}
      </button>
    </div>
  );
};

export default ResultsInfo;