import React from "react";
import styles from "../../styles/map/map.module.css";

interface ContractorSummaryPanelProps {
  data: any; // Replace with proper type when you have it defined
  onClose: () => void;
}

export const ContractorSummaryPanel: React.FC<ContractorSummaryPanelProps> = ({
  data,
  onClose
}) => {
  if (!data) return null;
  
  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString || dateString === "0001-01-01T00:00:00") return "N/A";
    return new Date(dateString).toLocaleDateString();
  };
  
  return (
    <div className={styles.detailPanel}>
      {/* Header with close button */}
      <div className={styles.detailHeader}>
        <h3>{data.contractor.contractorName} Summary</h3>
        <button className={styles.closeButton} onClick={onClose}>×</button>
      </div>
      
      {/* Content */}
      <div className={styles.detailContent}>
        <div className={styles.contractorSummaryHeader}>
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
            <div className={styles.detailField}>
              <span className={styles.fieldLabel}>Contract Duration:</span>
              <span>{data.contractor.contractDuration} years (since {data.contractor.contractualYear})</span>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className={styles.analyticsSection}>
          <h4>Exploration Summary</h4>
          
          <div className={styles.summaryStats}>
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
              <span className={styles.statValue}>{data.summary.totalCruises}</span>
              <span className={styles.statLabel}>Cruises</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statValue}>{data.summary.totalStations}</span>
              <span className={styles.statLabel}>Stations</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statValue}>{data.summary.totalSamples}</span>
              <span className={styles.statLabel}>Samples</span>
            </div>
          </div>
          
          <div className={styles.expeditionInfo}>
            <div className={styles.detailField}>
              <span className={styles.fieldLabel}>Earliest Cruise:</span>
              <span>{formatDate(data.summary.earliestCruise)}</span>
            </div>
            <div className={styles.detailField}>
              <span className={styles.fieldLabel}>Latest Cruise:</span>
              <span>{formatDate(data.summary.latestCruise)}</span>
            </div>
            <div className={styles.detailField}>
              <span className={styles.fieldLabel}>Total Expedition Days:</span>
              <span>{data.summary.expeditionDays}</span>
            </div>
          </div>
        </div>

        {/* Areas List */}
        {data.areas && data.areas.length > 0 && (
          <div className={styles.analyticsSection}>
            <h4>Exploration Areas</h4>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Area Name</th>
                  <th>Size (km²)</th>
                  <th>Blocks</th>
                </tr>
              </thead>
              <tbody>
                {data.areas.map((area, index) => (
                  <tr key={`area-${index}`}>
                    <td>{area.areaName}</td>
                    <td>{area.totalAreaSizeKm2.toLocaleString()}</td>
                    <td>{area.blockCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Footer actions */}
      <div className={styles.detailActions}>
        <button className={styles.actionButton} onClick={onClose}>Close</button>
        <button className={styles.actionButton}>View All Areas on Map</button>
      </div>
    </div>
  );
};