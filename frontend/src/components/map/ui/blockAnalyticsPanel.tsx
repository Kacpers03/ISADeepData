import React from "react";
import styles from '../../../styles/map/panels.module.css';
import layerStyles from '../../../styles/map/layers.module.css';

interface BlockAnalyticsPanelProps {
  data: any; // Replace with proper type when you have it defined
  onClose: () => void;
}

export const BlockAnalyticsPanel: React.FC<BlockAnalyticsPanelProps> = ({
  data,
  onClose
}) => {
  if (!data) return null;
  
  // Helper to format numbers with commas for thousands
  const formatNumber = (num) => {
    return num.toLocaleString();
  };
  
  return (
    <div className={styles.detailPanel}>
      {/* Header with close button */}
      <div className={styles.detailHeader}>
        <h3>{data.block.blockName} Analytics</h3>
        <button className={styles.closeButton} onClick={onClose}>×</button>
      </div>
      
      {/* Content */}
      <div className={styles.detailContent}>
        {/* Basic Block Information - Improved grid layout */}
        <div className={styles.blockBasicInfoGrid}>
          <div className={styles.infoGroup}>
            <div className={styles.infoLabel}>Block:</div>
            <div className={styles.infoValue}>{data.block.blockName}</div>
          </div>
          
          <div className={styles.infoGroup}>
            <div className={styles.infoLabel}>Status:</div>
            <div className={`${styles.statusBadge} ${
              data.block.status === 'Active' ? styles.statusActive : 
              data.block.status === 'Pending' ? styles.statusPending : 
              data.block.status === 'Reserved' ? styles.statusReserved : 
              styles.statusInactive
            }`}>
              {data.block.status}
            </div>
          </div>
          
          <div className={styles.infoGroup}>
            <div className={styles.infoLabel}>Area:</div>
            <div className={styles.infoValue}>{data.block.area.areaName}</div>
          </div>
          
          <div className={styles.infoGroup}>
            <div className={styles.infoLabel}>Contractor:</div>
            <div className={styles.infoValue}>{data.block.area.contractor.contractorName}</div>
          </div>
          
          <div className={styles.infoGroup}>
            <div className={styles.infoLabel}>Area Size:</div>
            <div className={styles.infoValue}>{formatNumber(data.block.areaSizeKm2)} km²</div>
          </div>
        </div>

        {/* Divider */}
        <div className={styles.sectionDivider}></div>

        {/* Exploration Data Section */}
        <div className={styles.sectionTitle}>Exploration Data</div>

        {/* Analytics Data */}
        <div className={styles.analyticsSection}>          
          <div className={styles.analyticsCounts}>
            <div className={styles.analyticsCount}>
              <span className={styles.countValue}>{data.counts.stations}</span>
              <span className={styles.countLabel}>Stations</span>
            </div>
            <div className={styles.analyticsCount}>
              <span className={styles.countValue}>{data.counts.samples}</span>
              <span className={styles.countLabel}>Samples</span>
            </div>
            <div className={styles.analyticsCount}>
              <span className={styles.countValue}>{data.counts.environmentalResults}</span>
              <span className={styles.countLabel}>Env. Results</span>
            </div>
            <div className={styles.analyticsCount}>
              <span className={styles.countValue}>{data.counts.geologicalResults}</span>
              <span className={styles.countLabel}>Geo. Results</span>
            </div>
          </div>
        </div>

        {/* Environmental Parameters */}
        {data.environmentalParameters && data.environmentalParameters.length > 0 && (
          <div className={styles.analyticsSection}>
            <h4>Environmental Parameters</h4>
            
            {data.environmentalParameters.map((category, index) => (
              <div key={`env-cat-${index}`} className={styles.dataCategory}>
                <h5>{category.category}</h5>
                <div className={styles.card}>
                  <table className={styles.dataTable}>
                    <thead>
                      <tr>
                        <th>Parameter</th>
                        <th>Average</th>
                        <th>Min</th>
                        <th>Max</th>
                        <th>Unit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {category.parameters.map((param, paramIndex) => (
                        <tr key={`env-param-${paramIndex}`}>
                          <td>{param.name}</td>
                          <td>{param.averageValue.toFixed(2)}</td>
                          <td>{param.minValue.toFixed(2)}</td>
                          <td>{param.maxValue.toFixed(2)}</td>
                          <td>{param.unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Resource Metrics */}
        {data.resourceMetrics && data.resourceMetrics.length > 0 && (
          <div className={styles.analyticsSection}>
            <h4>Resource Metrics</h4>
            
            {data.resourceMetrics.map((category, index) => (
              <div key={`res-cat-${index}`} className={styles.dataCategory}>
                <h5>{category.category}</h5>
                <div className={styles.card}>
                  <table className={styles.dataTable}>
                    <thead>
                      <tr>
                        <th>Analysis</th>
                        <th>Average</th>
                        <th>Min</th>
                        <th>Max</th>
                        <th>Unit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {category.analyses.map((analysis, analysisIndex) => (
                        <tr key={`res-analysis-${analysisIndex}`}>
                          <td>{analysis.analysis}</td>
                          <td>{analysis.averageValue.toFixed(2)}</td>
                          <td>{analysis.minValue.toFixed(2)}</td>
                          <td>{analysis.maxValue.toFixed(2)}</td>
                          <td>{analysis.unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sample Types */}
        {data.sampleTypes && data.sampleTypes.length > 0 && (
          <div className={styles.analyticsSection}>
            <h4>Sample Types</h4>
            <div className={styles.card}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Count</th>
                    <th>Depth Range</th>
                  </tr>
                </thead>
                <tbody>
                  {data.sampleTypes.map((sampleType, index) => (
                    <tr key={`sample-type-${index}`}>
                      <td>{sampleType.sampleType}</td>
                      <td>{sampleType.count}</td>
                      <td>{sampleType.depthRange.min} - {sampleType.depthRange.max} m</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Recent Stations */}
        {data.recentStations && data.recentStations.length > 0 && (
          <div className={styles.analyticsSection}>
            <h4>Recent Stations</h4>
            <div className={styles.card}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Type</th>
                    <th>Location</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentStations.map((station, index) => (
                    <tr key={`station-${index}`}>
                      <td>{station.stationCode}</td>
                      <td>{station.stationType}</td>
                      <td>{station.latitude.toFixed(4)}, {station.longitude.toFixed(4)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer actions */}
      <div className={styles.detailActions}>
        <button className={styles.actionButton} onClick={onClose}>Close</button>
        <button className={styles.actionButton}>Export Data</button>
      </div>
    </div>
  );
};