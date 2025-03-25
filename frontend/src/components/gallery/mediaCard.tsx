import React, { useState } from "react";
import styles from "../../styles/gallery/gallery.module.css";

interface MediaItem {
  mediaId: number;
  fileName: string;
  fileUrl: string;
  mediaType: string;
  thumbnailUrl: string;
  captureDate: string;
  stationId: number;
  stationCode: string;
  contractorId: number;
  contractorName: string;
  cruiseId: number;
  cruiseName: string;
  sampleId: number;
  sampleCode: string;
  latitude: number;
  longitude: number;
  description: string;
  cameraSpecs?: string;
}

interface MediaCardProps {
  media: MediaItem;
  onClick: () => void;
}

const MediaCard: React.FC<MediaCardProps> = ({ media, onClick }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Determine if media is video or image
  const isVideo =
    media.mediaType?.toLowerCase().includes("video") ||
    media.fileName.match(/\.(mp4|webm|avi|mov|wmv|flv)$/i);

  // Format date for display
  const formattedDate = media.captureDate
    ? new Date(media.captureDate).toLocaleDateString()
    : "Date unknown";

  // Handle thumbnail load error
  const handleImageError = () => {
    setImageError(true);
    setIsLoading(false);
  };

  // Handle thumbnail load success
  const handleImageLoad = () => {
    setIsLoading(false);
  };

  // Truncate filename if too long
  const truncateFileName = (name: string, maxLength: number = 20) => {
    if (name.length <= maxLength) return name;
    const extension = name.split(".").pop();
    const baseName = name.substring(0, name.lastIndexOf("."));
    return `${baseName.substring(
      0,
      maxLength - extension!.length - 3
    )}...${extension}`;
  };

  // Prevent click propagation when clicking download
  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className={styles.mediaCard}>
      <div className={styles.mediaThumbnail} onClick={onClick}>
        {isLoading && (
          <div className={styles.thumbnailLoading}>
            <div className={styles.spinner}></div>
          </div>
        )}

        {isVideo ? (
          // Video thumbnail with play icon overlay
          <>
            {!imageError ? (
              <img
                src={media.thumbnailUrl || "/images/video-placeholder.jpg"}
                alt={media.fileName}
                className={styles.thumbnailImage}
                onError={handleImageError}
                onLoad={handleImageLoad}
              />
            ) : (
              <div className={styles.fallbackThumbnail}>
                <span className={styles.videoIcon}>🎬</span>
              </div>
            )}
            <div className={styles.playIconOverlay}>
              <svg className={styles.playIcon} viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </>
        ) : // Image thumbnail
        !imageError ? (
          <img
            src={
              media.thumbnailUrl ||
              media.fileUrl ||
              "/images/image-placeholder.jpg"
            }
            alt={media.fileName}
            className={styles.thumbnailImage}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        ) : (
          <div className={styles.fallbackThumbnail}>
            <span className={styles.imageIcon}>🖼️</span>
          </div>
        )}

        {/* Media type badge */}
        <div className={styles.mediaTypeBadge}>
          {isVideo ? "Video" : "Image"}
        </div>
      </div>

      <div className={styles.mediaInfo} onClick={onClick}>
        <h3 className={styles.mediaTitle} title={media.fileName}>
          {truncateFileName(media.fileName)}
        </h3>

        <div className={styles.mediaDetails}>
          {media.stationCode && (
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Station:</span>
              <span className={styles.detailValue}>{media.stationCode}</span>
            </div>
          )}

          {media.captureDate && (
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Date:</span>
              <span className={styles.detailValue}>{formattedDate}</span>
            </div>
          )}

          {media.contractorName && (
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Contractor:</span>
              <span className={styles.detailValue} title={media.contractorName}>
                {media.contractorName.length > 15
                  ? `${media.contractorName.substring(0, 15)}...`
                  : media.contractorName}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Card actions */}
      <div className={styles.cardActions}>
        <button className={styles.viewButton} onClick={onClick}>
          View Details
        </button>
        <a
          href={media.fileUrl}
          target="_blank"
          rel="noopener noreferrer" 
          className={styles.downloadButton}
          onClick={handleDownloadClick}
        >
          Download
        </a>
      </div>
    </div>
  );
};

export default MediaCard;