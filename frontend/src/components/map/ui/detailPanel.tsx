// frontend/src/components/map/ui/detailPanel.tsx
import React, { useState } from "react";
import { Station, Contractor, Cruise, Sample, Media } from "../../../types/filter-types";
import styles from '../../../styles/map/panels.module.css';
import uiStyles from '../../../styles/map/ui.module.css';
import layerStyles from '../../../styles/map/layers.module.css';
import { exportStationCSV, exportCruiseCSV, exportContractorCSV } from "../../../utils/detailExport";

interface DetailPanelProps {
  type: 'contractor' | 'cruise' | 'station' | null;
  station: Station | null;
  contractor: Contractor | null;
  cruise: Cruise | null;
  onClose: () => void;
  mapData?: any; // Full map data for contractor exports
}

const combinedStyles = { ...styles, ...uiStyles, ...layerStyles };

export const DetailPanel: React.FC<DetailPanelProps> = ({
  type,
  station,
  contractor,
  cruise,
  onClose,
  mapData
}) => {
  // State for download status
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<string | null>(null);
  
  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };
  
  // Handle CSV download based on panel type
  const handleDownloadCSV = () => {
    if (!mapData) {
      console.error("Missing mapData for export");
      return;
    }
    
    setIsExporting(true);
    setExportStatus("Preparing data...");
    
    try {
      let success = false;
      
      // Call appropriate export function based on panel type
      if (type === 'station' && station) {
        success = exportStationCSV(station, mapData, 'station-data');
      } 
      else if (type === 'cruise' && cruise) {
        success = exportCruiseCSV(cruise, mapData, 'cruise-data');
      }
      else if (type === 'contractor' && contractor) {
        success = exportContractorCSV(contractor, mapData, 'contractor-data');
      }
      
      if (success) {
        setExportStatus("Download successful!");
      } else {
        setExportStatus("Export failed. Try again.");
      }
    } catch (error) {
      console.error("Error during CSV export:", error);
      setExportStatus("Error exporting data");
    }
    
    // Reset status after a delay
    setTimeout(() => {
      setIsExporting(false);
      setExportStatus(null);
    }, 2000);
  };
  
  return (
    <div className={styles.detailPanel}>
      {/* Header with close button */}
      <div className={styles.detailHeader}>
        <h3>
          {type === 'contractor' && contractor ? contractor.contractorName : 
           type === 'cruise' && cruise ? cruise.cruiseName : 
           type === 'station' && station ? `Station ${station.stationCode}` : 'Details'}
        </h3>
        <button className={styles.closeButton} onClick={onClose}>×</button>
      </div>
      
      {/* Content based on type */}
      <div className={styles.detailContent}>
        {/* Contractor Details */}
        {type === 'contractor' && contractor && (
          <div className={styles.contractorDetails}>
            <div className={styles.detailField}>
              <span className={styles.fieldLabel}>Contractor Name:</span>
              <span>{contractor.contractorName}</span>
            </div>
            
            <div className={styles.detailField}>
              <span className={styles.fieldLabel}>Contract Type:</span>
              <span>{contractor.contractType}</span>
            </div>
            
            <div className={styles.detailField}>
              <span className={styles.fieldLabel}>Contract Status:</span>
              <span>{contractor.contractStatus}</span>
            </div>
            
            <div className={styles.detailField}>
              <span className={styles.fieldLabel}>Contract Number:</span>
              <span>{contractor.contractNumber}</span>
            </div>
            
            <div className={styles.detailField}>
              <span className={styles.fieldLabel}>Sponsoring State:</span>
              <span>{contractor.sponsoringState}</span>
            </div>
            
            <div className={styles.detailField}>
              <span className={styles.fieldLabel}>Contractual Year:</span>
              <span>{contractor.contractualYear}</span>
            </div>
            
            {contractor.remarks && (
              <div className={styles.detailField}>
                <span className={styles.fieldLabel}>Remarks:</span>
                <span>{contractor.remarks}</span>
              </div>
            )}
            
            {/* Areas */}
            {contractor.areas && contractor.areas.length > 0 && (
              <div className={styles.detailSection}>
                <h4>Areas ({contractor.areas.length})</h4>
                <div className={styles.areaList}>
                  {contractor.areas.map(area => (
                    <div key={area.areaId} className={styles.areaItem}>
                      <h5>{area.areaName}</h5>
                      <p>{area.areaDescription}</p>
                      
                      {/* Blocks */}
                      {area.blocks && area.blocks.length > 0 && (
                        <div className={styles.blockList}>
                          <h6>Blocks ({area.blocks.length})</h6>
                          <table className={styles.dataTable}>
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {area.blocks.map(block => (
                                <tr key={block.blockId}>
                                  <td>{block.blockName}</td>
                                  <td>{block.status}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Cruise Details */}
        {type === 'cruise' && cruise && (
          <div className={styles.cruiseDetails}>
            <div className={styles.detailField}>
              <span className={styles.fieldLabel}>Cruise Name:</span>
              <span>{cruise.cruiseName}</span>
            </div>
            
            <div className={styles.detailField}>
              <span className={styles.fieldLabel}>Research Vessel:</span>
              <span>{cruise.researchVessel}</span>
            </div>
            
            <div className={styles.detailField}>
              <span className={styles.fieldLabel}>Start Date:</span>
              <span>{formatDate(cruise.startDate)}</span>
            </div>
            
            <div className={styles.detailField}>
              <span className={styles.fieldLabel}>End Date:</span>
              <span>{formatDate(cruise.endDate)}</span>
            </div>
            
            {/* Stations */}
            {cruise.stations && cruise.stations.length > 0 && (
              <div className={styles.detailSection}>
                <h4>Stations ({cruise.stations.length})</h4>
                <div className={combinedStyles.card}>
                  <table className={combinedStyles.dataTable}>
                    <thead>
                      <tr>
                        <th>Code</th>
                        <th>Type</th>
                        <th>Latitude</th>
                        <th>Longitude</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cruise.stations.map(station => (
                        <tr key={station.stationId}>
                          <td>{station.stationCode}</td>
                          <td>{station.stationType}</td>
                          <td>{station.latitude.toFixed(4)}</td>
                          <td>{station.longitude.toFixed(4)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Station Details */}
        {type === 'station' && station && (
          <div className={styles.stationDetails}>
            <div className={styles.detailField}>
              <span className={styles.fieldLabel}>Station Code:</span>
              <span>{station.stationCode}</span>
            </div>
            
            <div className={styles.detailField}>
              <span className={styles.fieldLabel}>Station Type:</span>
              <span>{station.stationType}</span>
            </div>
            
            <div className={styles.detailField}>
              <span className={styles.fieldLabel}>Coordinates:</span>
              <span>{station.latitude.toFixed(6)}, {station.longitude.toFixed(6)}</span>
            </div>
            
            {/* Samples */}
            {station.samples && station.samples.length > 0 && (
              <div className={styles.detailSection}>
                <h4>Samples ({station.samples.length})</h4>
                <div className={combinedStyles.card}>
                  <div className={styles.accordionList}>
                    {station.samples.map(sample => (
                      <div key={sample.sampleId} className={styles.accordionItem}>
                        <div className={styles.accordionHeader}>
                          <span>{sample.sampleCode} - {sample.sampleType}</span>
                        </div>
                        <div className={styles.accordionContent}>
                          <div className={styles.detailField}>
                            <span className={styles.fieldLabel}>Matrix Type:</span>
                            <span>{sample.matrixType}</span>
                          </div>
                          <div className={styles.detailField}>
                            <span className={styles.fieldLabel}>Habitat Type:</span>
                            <span>{sample.habitatType}</span>
                          </div>
                          <div className={styles.detailField}>
                            <span className={styles.fieldLabel}>Sampling Device:</span>
                            <span>{sample.samplingDevice}</span>
                          </div>
                          <div className={styles.detailField}>
                            <span className={styles.fieldLabel}>Depth Range:</span>
                            <span>{sample.depthLower} - {sample.depthUpper} m</span>
                          </div>
                          
                          {/* Media */}
                          {sample.media && sample.media.length > 0 && (
                            <div className={styles.mediaList}>
                              <h5>Media ({sample.media.length})</h5>
                              <div className={styles.mediaGrid}>
                                {sample.media.map(media => (
                                  <div key={media.mediaId} className={styles.mediaCard}>
                                    <div className={styles.mediaInfo}>
                                      <strong>{media.fileName}</strong>
                                      <span>{media.mediaType}</span>
                                      <span>Captured: {formatDate(media.captureDate)}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Action buttons */}
      <div className={styles.detailActions}>
        <button className={styles.actionButton} onClick={onClose}>Close</button>
        
        {/* CSV Download button */}
        <button 
          className={styles.downloadButton || styles.actionButton} 
          onClick={handleDownloadCSV}
          disabled={isExporting}
        >
          {isExporting ? (
            <>
              <span className={styles.buttonSpinner}></span>
              <span>{exportStatus || 'Exporting...'}</span>
            </>
          ) : (
            <>Download CSV</>
          )}
        </button>
      </div>
    </div>
  );
};