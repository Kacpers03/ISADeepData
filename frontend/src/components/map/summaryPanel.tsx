// Modified portion of SummaryPanel.tsx component
// This fixes the issue with cruise and station counts not updating correctly

import React, { useState, useRef, useEffect } from 'react';
import styles from '../../styles/map/summary.module.css';

const SummaryPanel = ({
  data,
  selectedContractorInfo,
  contractorSummary,
  onClose,
  onViewContractorSummary,
  mapData,
  setSelectedCruiseId,
  setDetailPanelType,
  setShowDetailPanel
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const contentRef = useRef(null);
  
  // Track expanded sections
  const [expandedSections, setExpandedSections] = useState({
    contractTypes: false,
    sponsoringStates: false
  });
  
  const formatNumber = (num) => {
    if (num === undefined || num === null || isNaN(num)) {
      return "No data available";
    }
    return num.toLocaleString();
  };
  
  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Set appropriate max-height on the summary content
  useEffect(() => {
    if (contentRef.current) {
      // Make sure scrolling works properly with dynamic content
      contentRef.current.style.height = '300px';
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
        >
          {/* Selected Contractor View */}
          {selectedContractorInfo && (
            <div className={styles.selectedContractorSection}>
              <h4>{selectedContractorInfo.name || "Selected Contractor"}</h4>
              <div className={styles.statsGrid}>
                <div className={styles.statBox}>
                  <div className={styles.statValue}>{selectedContractorInfo.totalAreas || 0}</div>
                  <div className={styles.statLabel}>Areas</div>
                </div>
                <div className={styles.statBox}>
                  <div className={styles.statValue}>{selectedContractorInfo.totalBlocks || 0}</div>
                  <div className={styles.statLabel}>Blocks</div>
                </div>
                {contractorSummary && (
                  <>
                    <div className={styles.statBox}>
                      <div className={styles.statValue}>{formatNumber(contractorSummary.summary.totalAreaKm2)} km²</div>
                      <div className={styles.statLabel}>Total Area</div>
                    </div>
                    <div className={styles.statBox}>
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
              {!data ? (
                <div className={styles.noContractorMessage}>
                  <p>No contractor selected</p>
                  <p className={styles.noContractorSubtext}>Select a contractor from the filter panel to view detailed information.</p>
                </div>
              ) : (
                <>
                  {/* Stats grid - 2x2 layout with bordered boxes */}
                  <div className={styles.statsGrid}>
                    <div className={styles.statBox}>
                      <div className={styles.statValue}>{data?.contractorCount || 0}</div>
                      <div className={styles.statLabel}>Contractors</div>
                    </div>
                    <div className={styles.statBox}>
                      <div className={styles.statValue}>{data?.areaCount || 0}</div>
                      <div className={styles.statLabel}>Areas</div>
                    </div>
                    <div className={styles.statBox}>
                      <div className={styles.statValue}>{data?.blockCount || 0}</div>
                      <div className={styles.statLabel}>Blocks</div>
                    </div>
                    <div className={styles.statBox}>
                      <div className={styles.statValue}>{data?.stationCount || 0}</div>
                      <div className={styles.statLabel}>Stations</div>
                    </div>
                    <div className={styles.statBox}>
                      {/* FIX: Use data.cruiseCount instead of mapData.cruises.length */}
                      <div className={styles.statValue}>{data?.cruiseCount || 0}</div>
                      <div className={styles.statLabel}>Cruises</div>
                    </div>
                  </div>

                  {/* Total Exploration Area - styled as a box */}
                  <div className={styles.explorationAreaBox}>
                    <div className={styles.areaLabel}>Total Exploration Area:</div>
                    <div className={styles.areaValue}>
                      {data?.totalAreaSizeKm2 != null && !isNaN(data.totalAreaSizeKm2)
                        ? `${formatNumber(data.totalAreaSizeKm2)} km²`
                        : "No data available"}
                    </div>
                  </div>

                  {/* Contract Types section - with box styling */}
                  <div className={styles.categoryBox}>
                    <div 
                      className={styles.categoryHeader}
                      onClick={() => toggleSection('contractTypes')}
                    >
                      <span>Mineral Types</span>
                      <span className={styles.plusIcon}>{expandedSections.contractTypes ? '−' : '+'}</span>
                    </div>
                    
                    {expandedSections.contractTypes && (
                      <div className={styles.expandedContent}>
                        {data && Object.entries(data.contractTypes || {})
                          .map(([type, count]) => (
                            <div key={type} className={styles.expandedItem}>
                              <span>{type}</span>
                              <span>{count}</span>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Sponsoring States section - with box styling */}
                  <div className={styles.categoryBox}>
                    <div 
                      className={styles.categoryHeader}
                      onClick={() => toggleSection('sponsoringStates')}
                    >
                      <span>Sponsoring States</span>
                      <span className={styles.plusIcon}>{expandedSections.sponsoringStates ? '−' : '+'}</span>
                    </div>
                    
                    {expandedSections.sponsoringStates && (
                      <div className={styles.expandedContent}>
                        {data && Object.entries(data.sponsoringStates || {})
                          .sort((a, b) => b[1] - a[1])
                          .map(([state, count]) => (
                            <div key={state} className={styles.expandedItem}>
                              <span>{state}</span>
                              <span>{count}</span>
                            </div>
                          ))}
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