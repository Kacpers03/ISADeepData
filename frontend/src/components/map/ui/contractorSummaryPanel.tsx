import React from "react";
import styles from '../../../styles/map/panels.module.css';
import layerStyles from '../../../styles/map/layers.module.css';

const combinedStyles = { ...styles, ...layerStyles };
interface ContractorSummaryPanelProps {
  data: any; // Replace with proper type when you have it defined
  onClose: () => void;
  onCloseAll: () => void; // New prop for closing all panels
}

export const ContractorSummaryPanel: React.FC<ContractorSummaryPanelProps> = ({
  data,
  onClose,
  onCloseAll
}) => {
  if (!data) return null;
  
  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString || dateString === "0001-01-01T00:00:00") return "N/A";
    return new Date(dateString).toLocaleDateString();
  };
  
  return (
    <div className={styles.detailPanel + ' ' + styles.compactDetailPanel}>
      {/* Header with close button */}
      <div className={styles.detailHeader}>
        <h3>{data.contractor.contractorName}</h3>
        <div className={styles.headerControls}>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
      </div>
      
      {/* Content - Simplified and more compact */}
      <div className={styles.detailContent}>
        <div className={styles.contractorBasicInfo}>
          <div className={styles.detailField}>
            <span className={styles.fieldLabel}>Contract Type:</span>
            <span>{data.contractor.contractType}</span>
          </div>
          <div className={styles.detailField}>
            <span className={styles.fieldLabel}>Status:</span>
            <span className={styles.statusBadge} 
              style={{ 
                backgroundColor: 
                  data.contractor.status === 'Active' ? '#4CAF50' : 
                  data.contractor.status === 'Pending' ? '#FFC107' : '#9E9E9E'
              }}
            >
              {data.contractor.status}
            </span>
          </div>
          <div className={styles.detailField}>
            <span className={styles.fieldLabel}>Sponsoring State:</span>
            <span>{data.contractor.sponsoringState}</span>
          </div>
        </div>

        {/* Summary Stats - More compact layout */}
        <div className={styles.analyticsSection}>
          <h4>Exploration Summary</h4>
          
          <div className={styles.compactSummaryStats}>
            <div className={styles.statBox}>
              <span className={styles.statValue}>{data.summary.totalAreas}</span>
              <span className={styles.statLabel}>Areas</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statValue}>{data.summary.totalBlocks}</span>
              <span className={styles.statLabel}>Blocks</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statValue}>{data.summary.totalAreaKm2.toLocaleString()}</span>
              <span className={styles.statLabel}>km²</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statValue}>{data.summary.totalStations}</span>
              <span className={styles.statLabel}>Stations</span>
            </div>
          </div>
          
          {/* Only show date info if it exists */}
          {(data.summary.earliestCruise && data.summary.earliestCruise !== "0001-01-01T00:00:00") && (
            <div className={styles.expeditionInfo}>
              <div className={styles.detailField}>
                <span className={styles.fieldLabel}>Earliest Cruise:</span>
                <span>{formatDate(data.summary.earliestCruise)}</span>
              </div>
              <div className={styles.detailField}>
                <span className={styles.fieldLabel}>Latest Cruise:</span>
                <span>{formatDate(data.summary.latestCruise)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer actions - Only showing Close and Close All buttons */}
      <div className={styles.detailActions}>
        <button className={styles.actionButton} onClick={onClose}>Close</button>
        <button className={styles.actionButton} onClick={onCloseAll}>Close All</button>
      </div>
    </div>
  );
};