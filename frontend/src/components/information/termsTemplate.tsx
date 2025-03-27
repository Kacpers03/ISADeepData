import React from "react";
import styles from "../../styles/information/terms.module.css";

interface TermsProps {
  t: (key: string) => string;
}

export const Terms: React.FC<TermsProps> = ({ t }) => {
  return (
    <>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <h1 className={styles.heroTitle}>{t('terms.title')}</h1>
          <p className={styles.heroSubtitle}>
            {t('terms.subtitle')}
          </p>
        </div>
      </section>

      {/* Table of Contents */}
      <nav className={styles.toc}>
        <ul className={styles.tocList}>
          <li>
            <a href="#disclaimers" className={styles.tocLink}>
              {t('terms.toc.disclaimers')}
            </a>
          </li>
          <li>
            <a href="#immunities" className={styles.tocLink}>
              {t('terms.toc.immunities')}
            </a>
          </li>
          <li>
            <a href="#general" className={styles.tocLink}>
              {t('terms.toc.general')}
            </a>
          </li>
          <li>
            <a href="#amendments" className={styles.tocLink}>
              {t('terms.toc.amendments')}
            </a>
          </li>
        </ul>
      </nav>

      {/* Overview Section */}
      <section className={styles.overview}>
        <div className={styles.overviewContent}>
          <h2 className={styles.sectionTitle}>{t('terms.overview.title')}</h2>
          <p className={styles.sectionText}>
            {t('terms.overview.paragraph1')}
          </p>
          <p className={styles.sectionText}>
            {t('terms.overview.paragraph2')}
          </p>
        </div>
      </section>

      {/* Accordion Section */}
      <section className={styles.accordionSection}>
        <div className="accordion" id="termsAccordion">
          {/* Disclaimers */}
          <div className="accordion-item" id="disclaimers">
            <h2 className="accordion-header" id="headingOne">
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseOne"
                aria-expanded="true"
                aria-controls="collapseOne"
              >
                <span className={styles.accordionIcon}>⚠️</span> {t('terms.disclaimers.title')}
              </button>
            </h2>
            <div
              id="collapseOne"
              className="accordion-collapse collapse show"
              aria-labelledby="headingOne"
              data-bs-parent="#termsAccordion"
            >
              <div className="accordion-body">
                <p className={styles.sectionText}>
                  {t('terms.disclaimers.paragraph1')}
                </p>
                <p className={styles.sectionText}>
                  {t('terms.disclaimers.paragraph2')}
                </p>
              </div>
            </div>
          </div>

          {/* Preservation of Immunities */}
          <div className="accordion-item" id="immunities">
            <h2 className="accordion-header" id="headingTwo">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseTwo"
                aria-expanded="false"
                aria-controls="collapseTwo"
              >
                <span className={styles.accordionIcon}>🛡️</span> {t('terms.immunities.title')}
              </button>
            </h2>
            <div
              id="collapseTwo"
              className="accordion-collapse collapse"
              aria-labelledby="headingTwo"
              data-bs-parent="#termsAccordion"
            >
              <div className="accordion-body">
                <p className={styles.sectionText}>
                  {t('terms.immunities.paragraph1')}
                </p>
              </div>
            </div>
          </div>

          {/* General */}
          <div className="accordion-item" id="general">
            <h2 className="accordion-header" id="headingThree">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseThree"
                aria-expanded="false"
                aria-controls="collapseThree"
              >
                <span className={styles.accordionIcon}>⚙️</span> {t('terms.general.title')}
              </button>
            </h2>
            <div
              id="collapseThree"
              className="accordion-collapse collapse"
              aria-labelledby="headingThree"
              data-bs-parent="#termsAccordion"
            >
              <div className="accordion-body">
                <p className={styles.sectionText}>
                  {t('terms.general.paragraph1')}
                </p>
                <p className={styles.sectionText}>
                  {t('terms.general.paragraph2')}
                </p>
              </div>
            </div>
          </div>

          {/* Notification of Amendments */}
          <div className="accordion-item" id="amendments">
            <h2 className="accordion-header" id="headingFour">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseFour"
                aria-expanded="false"
                aria-controls="collapseFour"
              >
                <span className={styles.accordionIcon}>✏️</span> {t('terms.amendments.title')}
              </button>
            </h2>
            <div
              id="collapseFour"
              className="accordion-collapse collapse"
              aria-labelledby="headingFour"
              data-bs-parent="#termsAccordion"
            >
              <div className="accordion-body">
                <p className={styles.sectionText}>
                  {t('terms.amendments.paragraph1')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Terms;