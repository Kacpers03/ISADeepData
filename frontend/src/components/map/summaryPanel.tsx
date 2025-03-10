import React, { useState, useRef, useEffect } from 'react';
import styles from '../../styles/map/summary.module.css';

const SummaryPanel = ({
  data,
  selectedContractorInfo,
  contractorSummary,
  onClose,
  onViewContractorSummary
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const contentRef = useRef(null);
  
  // Format large numbers with commas
  const formatNumber = (num) => {
    if (num === undefined || num === null) return "0";
    return num.toLocaleString();
  };

  // Set appropriate max-height on the summary content
  useEffect(() => {
    if (contentRef.current) {
      // Make sure scrolling works properly with dynamic content
      contentRef.current.style.maxHeight = '300px'; // Reduced height to make panel less intrusive
    }
  }, [data, selectedContractorInfo]);
  
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
        <div 
          ref={contentRef}
          className={styles.summaryContent}
          style={{ overflowY: 'auto' }} // Ensure content is scrollable
        >
          {/* Selected Contractor View */}
          {selectedContractorInfo && (
            <div className={styles.selectedContractorSection}>
              <h4>{selectedContractorInfo.name || "Selected Contractor"}</h4>
              <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                  <div className={styles.statValue}>{selectedContractorInfo.totalAreas || 0}</div>
                  <div className={styles.statLabel}>Areas</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statValue}>{selectedContractorInfo.totalBlocks || 0}</div>
                  <div className={styles.statLabel}>Blocks</div>
                </div>
                {contractorSummary && (
                  <>
                    <div className={styles.statItem}>
                      <div className={styles.statValue}>{formatNumber(contractorSummary.summary.totalAreaKm2)} km²</div>
                      <div className={styles.statLabel}>Total Area</div>
                    </div>
                    <div className={styles.statItem}>
                      <div className={styles.statValue}>{formatNumber(contractorSummary.summary.totalStations)}</div>
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

          {/* No contractor selected message or Overall Summary */}
          {!selectedContractorInfo && (
            <div className={styles.globalSummarySection}>
              {(!data || (data.contractorCount === 0 && data.areaCount === 0 && data.blockCount === 0)) ? (
                <div className={styles.noContractorMessage}>
                  <p>No contractor selected</p>
                  <p className={styles.noContractorSubtext}>Select a contractor from the filter panel to view detailed information.</p>
                  <div className={styles.selectionHint}>
                    <div className={styles.hintIcon}>↑</div>
                    <p className={styles.hintText}>Use the filters on the left to select a contractor and visualize their exploration areas.</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Reduced to more compact layout */}
                  <div className={styles.globalStats}>
                    <div className={styles.statsRow}>
                      <div className={styles.statItem}>
                        <div className={styles.statValue}>{data?.contractorCount || 0}</div>
                        <div className={styles.statLabel}>Contractors</div>
                      </div>
                      <div className={styles.statItem}>
                        <div className={styles.statValue}>{data?.areaCount || 0}</div>
                        <div className={styles.statLabel}>Areas</div>
                      </div>
                    </div>
                    <div className={styles.statsRow}>
                      <div className={styles.statItem}>
                        <div className={styles.statValue}>{data?.blockCount || 0}</div>
                        <div className={styles.statLabel}>Blocks</div>
                      </div>
                      <div className={styles.statItem}>
                        <div className={styles.statValue}>{data?.stationCount || 0}</div>
                        <div className={styles.statLabel}>Stations</div>
                      </div>
                    </div>
                  </div>
                  
                  {data && data.totalAreaSizeKm2 > 0 && (
                    <div className={styles.totalArea}>
                      <span className={styles.areaLabel}>Total Exploration Area:</span>
                      <span className={styles.areaValue}>{formatNumber(data.totalAreaSizeKm2)} km²</span>
                    </div>
                  )}
                  
                  {/* Consolidated breakdown sections for space efficiency */}
                  {data && Object.keys(data.contractTypes || {}).length > 0 && (
                    <div className={styles.breakdownButton} onClick={() => document.getElementById('contractTypesBreakdown').classList.toggle(styles.expanded)}>
                      <span>Contract Types</span>
                      <span className={styles.expandIcon}>+</span>
                    </div>
                  )}
                  
                  <div id="contractTypesBreakdown" className={styles.breakdownSection}>
                    {data && Object.entries(data.contractTypes || {}).map(([type, count]) => (
                      <div key={type} className={styles.breakdownItem}>
                        <div className={styles.breakdownLabel}>{type}</div>
                        <div className={styles.breakdownValue}>{count}</div>
                      </div>
                    ))}
                  </div>
                  
                  {data && Object.keys(data.sponsoringStates || {}).length > 0 && (
                    <div className={styles.breakdownButton} onClick={() => document.getElementById('sponsoringStatesBreakdown').classList.toggle(styles.expanded)}>
                      <span>Sponsoring States</span>
                      <span className={styles.expandIcon}>+</span>
                    </div>
                  )}
                  
                  <div id="sponsoringStatesBreakdown" className={styles.breakdownSection}>
                    {data && Object.entries(data.sponsoringStates || {})
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 5)
                      .map(([state, count]) => (
                        <div key={state} className={styles.breakdownItem}>
                          <div className={styles.breakdownLabel}>{state}</div>
                          <div className={styles.breakdownValue}>{count}</div>
                        </div>
                      ))}
                    {data && Object.keys(data.sponsoringStates || {}).length > 5 && (
                      <div className={styles.moreItem}>
                        +{Object.keys(data.sponsoringStates).length - 5} more
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SummaryPanel;