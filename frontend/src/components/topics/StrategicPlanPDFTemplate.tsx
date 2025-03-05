// components/StrategicPlanPDFTemplates.tsx
import React from "react";
import styles from "../styles/topics/StrategicPlanPDF.module.css";

const StrategicPlanPDFTemplates: React.FC = () => {
  return (
    <div className={styles.pdfContainer}>
      <iframe
        src="/docs/ISA_Strategic_Plan.pdf"
        title="ISA Strategic Plan PDF"
        width="100%"
        height="600px"
      />
      <div className={styles.downloadWrapper}>
        <a
          href="/docs/ISA_Strategic_Plan.pdf"
          download
          className={styles.downloadButton}
        >
          Download PDF
        </a>
      </div>
    </div>
  );
};

export default StrategicPlanPDFTemplates;
