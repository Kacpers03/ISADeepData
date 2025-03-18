import React from "react";
import styles from '../../../styles/map/panels.module.css';
import layerStyles from '../../../styles/map/layers.module.css';
interface BlockAnalyticsPanelProps {
  data: any; // Replace with proper type when you have it defined
  onClose: () => void;
}
const combinedStyles = { ...styles, ...layerStyles };
export const BlockAnalyticsPanel: React.FC<BlockAnalyticsPanelProps> = ({
  data,
  onClose
}) => {
  if (!data) return null;
  
  return (
    <div className={styles.detailPanel}>
      {/* Header with close button */}
      <div className={styles.detailHeader}>
        <h3>{data.block.blockName} Analytics</h3>
        <button className={styles.closeButton} onClick={onClose}>×</button>
      </div>
      
      {/* Content */}
      <div className={styles.detailContent}>
        <div className={styles.blockAnalyticsHeader}>
          <div className={styles.blockBasicInfo}>
            <div className={styles.detailField}>
              <span className={styles.fieldLabel}>Block:</span>
              <span>{data.block.blockName}</span>
            </div>
            <div className={styles.detailField}>
              <span className={styles.fieldLabel}>Status:</span>
              <span className={styles.statusBadge} 
                style={{ 
                  backgroundColor: 
                    data.block.status === 'Active' ? '#4CAF50' : 
                    data.block.status === 'Pending' ? '#FFC107' : '#9E9E9E'
                }}
              >
                {data.block.status}
              </span>
            </div>
            <div className={styles.detailField}>
              <span className={styles.fieldLabel}>Area:</span>
              <span>{data.block.area.areaName}</span>
            </div>
            <div className={styles.detailField}>
              <span className={styles.fieldLabel}>Contractor:</span>
              <span>{data.block.area.contractor.contractorName}</span>
            </div>
            <div className={styles.detailField}>
              <span className={styles.fieldLabel}>Area Size:</span>
              <span>{data.block.areaSizeKm2.toLocaleString()} km²</span>
            </div>
          </div>
        </div>

        {/* Analytics Data */}
        <div className={styles.analyticsSection}>
          <h4>Exploration Data</h4>
          
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
            ))}
          </div>
        )}
        
        {/* Resource Metrics - flyttet inn i riktig sted */}
        {data.resourceMetrics && data.resourceMetrics.length > 0 && (
          <div className={styles.analyticsSection}>
            <h4>Resource Metrics</h4>
            
            {data.resourceMetrics.map((category, index) => (
              <div key={`res-cat-${index}`} className={styles.dataCategory}>
                <h5>{category.category}</h5>
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
            ))}
          </div>
        )}

        {/* Sample Types - flyttet inn i riktig sted */}
        {data.sampleTypes && data.sampleTypes.length > 0 && (
          <div className={styles.analyticsSection}>
            <h4>Sample Types</h4>
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
        )}

        {/* Recent Stations - flyttet inn i riktig sted */}
        {data.recentStations && data.recentStations.length > 0 && (
          <div className={styles.analyticsSection}>
            <h4>Recent Stations</h4>
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