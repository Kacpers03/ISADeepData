// frontend/src/components/documents/documentTemplate.tsx
import React, { ReactNode } from "react";
import { useLanguage } from "../../contexts/languageContext";
import styles from "../../styles/document/document.module.css";

interface DocumentTemplateProps {
  children?: ReactNode;
}

export default function DocumentTemplate({ children }: DocumentTemplateProps) {
  const { t } = useLanguage();
  
  return (
    <div className={styles.documentPage}>
      <div className={styles.documentContainer}>
        <h1 className={styles.documentTitle}>{t('documents.title')}</h1>
        
        <p className={styles.documentDescription}>
          {t('documents.userManual.description')}
        </p>
        
        <div className={styles.contentsSection}>
          <h2 className={styles.contentsTitle}>{t('documents.userManual.contents.title')}</h2>
          <ul className={styles.contentsList}>
            <li>{t('documents.userManual.contents.item1')}</li>
            <li>{t('documents.userManual.contents.item2')}</li>
            <li>{t('documents.userManual.contents.item3')}</li>
            <li>{t('documents.userManual.contents.item4')}</li>
            <li>{t('documents.userManual.contents.item5')}</li>
          </ul>
        </div>
        
        <div className={styles.buttonContainer}>
          <a
            href="/docs/UserManualISA.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.documentButton}
          >
            <span>{t('documents.userManual.openManual')}</span>
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