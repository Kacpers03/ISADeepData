import React, { useState } from 'react';
import styles from '../../styles/map/summary.module.css';

interface SummaryPanelProps {
  data: {
    contractorCount: number;
    areaCount: number;
    blockCount: number;
    stationCount: number;
    totalAreaSizeKm2: number;
    contractTypes: Record<string, number>;
    sponsoringStates: Record<string, number>;
  };
  selectedContractorInfo: {
    name: string;
    totalAreas: number;
    totalBlocks: number;
  } | null;
  contractorSummary: any | null;
  onClose: () => void;
  onViewContractorSummary: () => void;
}

const SummaryPanel: React.FC<SummaryPanelProps> = ({
  data,
  selectedContractorInfo,
  contractorSummary,
  onClose,
  onViewContractorSummary
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Format large numbers with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };
  
  return (
    <div className={`${styles.summaryPanel} ${isCollapsed ? styles.collapsed : ''}`}>
      <div className={styles.summaryHeader}>
        <h3>Exploration Summary</h3>
        <div className={styles.headerControls}>
          <button 
            className={styles.collapseButton} 
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            {isCollapsed ? '↓' : '↑'}
          </button>
          <button 
            className={styles.closeButton} 
            onClick={onClose}
            title="Close"
          >
            ×
          </button>
        </div>
      </div>
      
      {!isCollapsed && (
        <div className={styles.summaryContent}>
          {/* Selected Contractor View */}
          {selectedContractorInfo && (
            <div className={styles.selectedContractorSection}>
              <h4>{selectedContractorInfo.name}</h4>
              <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                  <div className={styles.statValue}>{selectedContractorInfo.totalAreas}</div>
                  <div className={styles.statLabel}>Areas</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statValue}>{selectedContractorInfo.totalBlocks}</div>
                  <div className={styles.statLabel}>Blocks</div>
                </div>
                {contractorSummary && (
                  <>
                    <div className={styles.statItem}>
                      <div className={styles.statValue}>{formatNumber(contractorSummary.summary.totalAreaKm2)} km²</div>
                      <div className={styles.statLabel}>Total Area</div>
                    </div>
                    <div className={styles.statItem}>
                      <div className={styles.statValue}>{contractorSummary.summary.totalStations}</div>
                      <div className={styles.statLabel}>Stations</div>
                    </div>
                  </>
                )}
              </div>
              <button 
                className={styles.viewDetailsButton} 
                onClick={onViewContractorSummary}
              >
                View Detailed Summary
              </button>
            </div>
          )}

          {/* Overall Summary */}
          {!selectedContractorInfo && (
            <div className={styles.globalSummarySection}>
              <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                  <div className={styles.statValue}>{data.contractorCount}</div>
                  <div className={styles.statLabel}>Contractors</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statValue}>{data.areaCount}</div>
                  <div className={styles.statLabel}>Areas</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statValue}>{data.blockCount}</div>
                  <div className={styles.statLabel}>Blocks</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statValue}>{data.stationCount}</div>
                  <div className={styles.statLabel}>Stations</div>
                </div>
              </div>
              
              {data.totalAreaSizeKm2 > 0 && (
                <div className={styles.totalArea}>
                  <span className={styles.areaLabel}>Total Exploration Area:</span>
                  <span className={styles.areaValue}>{formatNumber(data.totalAreaSizeKm2)} km²</span>
                </div>
              )}
              
              {/* Only show breakdowns if we have data */}
              {Object.keys(data.contractTypes).length > 0 && (
                <div className={styles.breakdownSection}>
                  <h5>Contract Types</h5>
                  <div className={styles.breakdownGrid}>
                    {Object.entries(data.contractTypes).map(([type, count]) => (
                      <div key={type} className={styles.breakdownItem}>
                        <div className={styles.breakdownLabel}>{type}</div>
                        <div className={styles.breakdownValue}>{count}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {Object.keys(data.sponsoringStates).length > 0 && (
                <div className={styles.breakdownSection}>
                  <h5>Sponsoring States</h5>
                  <div className={styles.breakdownGrid}>
                    {Object.entries(data.sponsoringStates)
                      .sort((a, b) => b[1] - a[1]) // Sort by count descending
                      .slice(0, 6) // Show top 6 only
                      .map(([state, count]) => (
                        <div key={state} className={styles.breakdownItem}>
                          <div className={styles.breakdownLabel}>{state}</div>
                          <div className={styles.breakdownValue}>{count}</div>
                        </div>
                      ))}
                    {Object.keys(data.sponsoringStates).length > 6 && (
                      <div className={styles.moreItem}>
                        +{Object.keys(data.sponsoringStates).length - 6} more
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SummaryPanel;