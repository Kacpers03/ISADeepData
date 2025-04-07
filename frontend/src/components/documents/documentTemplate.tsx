// frontend/src/components/documents/documentTemplate.tsx
import React, { ReactNode } from "react";
import styles from "../../styles/document/document.module.css";

interface DocumentTemplateProps {
  children?: ReactNode;
}

export default function DocumentTemplate({ children }: DocumentTemplateProps) {
  return (
    <div className={styles.documentPage}>
      <div className={styles.documentContainer}>
        <h1 className={styles.documentTitle}>User Manual</h1>
        
        <p className={styles.documentDescription}>
          The ISA DeepData User Manual provides detailed instructions and guidance on how to effectively use all features of the platform. It includes step-by-step tutorials, explanations of data visualization tools, and best practices for data exploration and analysis.
        </p>
        
        <div className={styles.contentsSection}>
          <h2 className={styles.contentsTitle}>In this manual you'll find:</h2>
          <ul className={styles.contentsList}>
            <li>Platform navigation and interface overview</li>
            <li>Data search and filtering techniques</li>
            <li>Interactive map tools and features</li>
            <li>Downloading and exporting data</li>
            <li>Advanced analysis and visualization options</li>
          </ul>
        </div>
        
        <div className={styles.buttonContainer}>
          <a
            href="/docs/UserManualISA.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.documentButton}
          >
            <span>Open User Manual</span>
            <svg 
              className={styles.buttonIcon}
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" 
                fill="none"
                stroke="currentColor"
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2"
              />
            </svg>
          </a>
        </div>
        
        {children}
      </div>
    </div>
  );
}