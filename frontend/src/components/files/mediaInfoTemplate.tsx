// components/files/mediaInfoTemplate.tsx
import React from "react";
import { useRouter } from "next/router";
import styles from "../../styles/files/mediaInfo.module.css";
import { 
  ArrowLeft, 
  Download, 
  Calendar, 
  User, 
  FileText, 
  Tag, 
  AlertCircle, 
  Shield, 
  Map, 
  Globe, 
  Clock 
} from "lucide-react";
import { FileInfo } from "../../types/fileTypes";
import { Contractor, ContractorArea, ContractorAreaBlock } from "../../types/filter-types";
import { useLanguage } from "../../contexts/languageContext";

interface FileInfoProps {
  fileInfo: FileInfo;
}

const MediaInfoTemplate: React.FC<FileInfoProps> = ({ fileInfo }) => {
  const router = useRouter();
  const { t } = useLanguage();

  // Format the date properly (assuming date comes in as ISO string)
  const formatDate = (dateString: string) => {
    if (!dateString) return  t('library.fileInfo.na') || "N/A";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    } catch (e) {
      // If date can't be parsed, return the original string or first part
      return dateString.split("T")[0] || dateString;
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <button 
            className={styles.backButton} 
            onClick={() => router.back()}
            aria-label={t('library.fileInfo.goBack') || "Go back"}
          >
            <ArrowLeft size={20} />
            <span>{t('library.fileInfo.backToFiles') || "Back to Files"}</span>
          </button>
          <h1 className={styles.pageTitle}>{t('library.fileInfo.title') || "File Information"}</h1>
        </div>
      </div>

      <div className={styles.contentContainer}>
        <div className={styles.mediaInfoCard}>
          <div className={styles.titleSection}>
            <h2 className={styles.fileTitle}>{fileInfo.title}</h2>
            {fileInfo.isConfidential && (
              <div className={styles.confidentialBadge}>
                <Shield size={16} />
                <span>{t('library.fileInfo.confidential') || "Confidential"}</span>
              </div>
            )}
          </div>

          <div className={styles.divider}></div>

          <div className={styles.fileMetaGrid}>
            <div className={styles.metaItem}>
              <div className={styles.metaLabel}>
                <FileText size={18} />
                <span>{t('library.fileInfo.fileName') || "File Name"}</span>
              </div>
              <div className={styles.metaValue}>
                <span className={styles.fileNameValue}>
                  {fileInfo.fileName.split('/').pop() || fileInfo.fileName}
                </span>
                <a 
                  href={fileInfo.fileName} 
                  download 
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.downloadButton}
                  aria-label={t('library.fileInfo.downloadFile') || "Download file"}
                >
                  <Download size={16} />
                  <span>{t('library.fileInfo.download') || "Download"}</span>
                </a>
              </div>
            </div>

            <div className={styles.metaItem}>
              <div className={styles.metaLabel}>
                <Tag size={18} />
                <span>{t('library.fileInfo.theme') || "Theme"}</span>
              </div>
              <div className={styles.metaValue}>{fileInfo.theme}</div>
            </div>

            <div className={styles.metaItem}>
              <div className={styles.metaLabel}>
                <User size={18} />
                <span>{t('library.fileInfo.contractor') || "Contractor"}</span>
              </div>
              <div className={styles.metaValue}>
                {fileInfo.contractor}
                {fileInfo.contractorObj && (
                  <span className={styles.metaExtra}>
                    {t('library.fileInfo.contractType') || "Contract Type"}: {fileInfo.contractorObj.contractType}
                  </span>
                )}
              </div>
            </div>

            <div className={styles.metaItem}>
              <div className={styles.metaLabel}>
                <Calendar size={18} />
                <span>{t('library.fileInfo.submissionDate') || "Submission Date"}</span>
              </div>
              <div className={styles.metaValue}>{formatDate(fileInfo.submissionDate)}</div>
            </div>

            {fileInfo.country && (
              <div className={styles.metaItem}>
                <div className={styles.metaLabel}>
                  <Globe size={18} />
                  <span>{t('library.fileInfo.country') || "Country"}</span>
                </div>
                <div className={styles.metaValue}>{fileInfo.country}</div>
              </div>
            )}

            {fileInfo.year && (
              <div className={styles.metaItem}>
                <div className={styles.metaLabel}>
                  <Clock size={18} />
                  <span>{t('library.fileInfo.year') || "Year"}</span>
                </div>
                <div className={styles.metaValue}>{fileInfo.year}</div>
              </div>
            )}

            {fileInfo.contractorArea && (
              <div className={styles.metaItem}>
                <div className={styles.metaLabel}>
                  <Map size={18} />
                  <span>{t('library.fileInfo.contractArea') || "Contract Area"}</span>
                </div>
                <div className={styles.metaValue}>
                  {fileInfo.contractorArea.areaName}
                  {fileInfo.contractorArea.totalAreaSizeKm2 && (
                    <span className={styles.metaExtra}>
                      {t('library.fileInfo.size') || "Size"}: {fileInfo.contractorArea.totalAreaSizeKm2} km²
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className={styles.descriptionSection}>
            <div className={styles.descriptionHeader}>
              <AlertCircle size={18} />
              <h3>{t('library.fileInfo.description') || "Description"}</h3>
            </div>
            <p className={styles.descriptionText}>{fileInfo.description}</p>
          </div>

          {fileInfo.contractorBlock && (
            <div className={styles.relatedInfoSection}>
              <div className={styles.sectionHeader}>
                <Map size={18} />
                <h3>{t('library.fileInfo.blockInformation') || "Block Information"}</h3>
              </div>
              <div className={styles.blockInfo}>
                <div className={styles.blockInfoItem}>
                  <span className={styles.blockInfoLabel}>{t('library.fileInfo.blockName') || "Block Name"}:</span>
                  <span className={styles.blockInfoValue}>{fileInfo.contractorBlock.blockName}</span>
                </div>
                {fileInfo.contractorBlock.status && (
                  <div className={styles.blockInfoItem}>
                    <span className={styles.blockInfoLabel}>{t('library.fileInfo.status') || "Status"}:</span>
                    <span className={styles.blockInfoValue}>{fileInfo.contractorBlock.status}</span>
                  </div>
                )}
                {fileInfo.contractorBlock.areaSizeKm2 && (
                  <div className={styles.blockInfoItem}>
                    <span className={styles.blockInfoLabel}>{t('library.fileInfo.areaSize') || "Area Size"}:</span>
                    <span className={styles.blockInfoValue}>{fileInfo.contractorBlock.areaSizeKm2} km²</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaInfoTemplate;