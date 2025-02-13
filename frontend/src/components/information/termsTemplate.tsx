import React from 'react';
import styles from '../../styles/information/temps.module.css';

export const Terms: React.FC = () => {
  return (
    <>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <h1 className={styles.heroTitle}>Terms &amp; Conditions</h1>
          <p className={styles.heroSubtitle}>International Seabed Authority Website</p>
        </div>
      </section>

      {/* Table of Contents */}
      <nav className={styles.toc}>
        <ul className={styles.tocList}>
          <li>
            <a href="#disclaimers" className={styles.tocLink}>
              Disclaimers
            </a>
          </li>
          <li>
            <a href="#immunities" className={styles.tocLink}>
              Preservation of Immunities
            </a>
          </li>
          <li>
            <a href="#general" className={styles.tocLink}>
              General
            </a>
          </li>
          <li>
            <a href="#amendments" className={styles.tocLink}>
              Notification of Amendments
            </a>
          </li>
        </ul>
      </nav>

      {/* Overview Section */}
      <section className={styles.overview}>
        <div className={styles.overviewContent}>
          <h2 className={styles.sectionTitle}>Overview</h2>
          <p className={styles.sectionText}>
            The user of this website constitutes agreement with the following terms and conditions.
            The International Seabed Authority (ISA) maintains this website (the “Site”) as a courtesy
            to those who may choose to access it (“Users”). The information presented is for informational purposes only.
          </p>
          <p className={styles.sectionText}>
            ISA grants permission to Users to visit the Site and to download, copy and print the information,
            documents and materials (collectively, “Materials”) for the User’s personal, non-commercial use,
            subject to more specific restrictions that may apply.
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
                <span className={styles.accordionIcon}>⚠️</span> Disclaimers
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
                  Materials provided on the Site are provided “as is,” without warranty of any kind,
                  either express or implied. ISA does not make any warranties or representations as to the accuracy
                  or completeness of any such Materials.
                </p>
                <p className={styles.sectionText}>
                  Under no circumstances shall ISA be liable for any loss, damage, liability or expense incurred or suffered
                  that is claimed to have resulted from the use of the Site, including, without limitation,
                  any fault, error, omission, interruption or delay.
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
                <span className={styles.accordionIcon}>🛡️</span> Preservation of Immunities
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
                  Nothing herein shall constitute or be considered to be a limitation upon or a waiver of the privileges
                  and immunities of ISA, which are specifically reserved.
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
                <span className={styles.accordionIcon}>⚙️</span> General
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
                  ISA reserves its exclusive right in its sole discretion to alter, limit, or discontinue the Site or any Materials
                  in any respect. ISA shall have no obligation to take the needs of any User into consideration in connection therewith.
                </p>
                <p className={styles.sectionText}>
                  ISA reserves the right to deny in its sole discretion any user access to this Site or any portion thereof without notice.
                  No waiver by ISA of any provision of these Terms and Conditions shall be binding except as set forth in writing and
                  signed by its duly authorized representative.
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
                <span className={styles.accordionIcon}>✏️</span> Notification of Amendments
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
                  ISA reserves the right to amend this policy at its own discretion. If you do not agree to any such modifications,
                  you should immediately discontinue use of the Site.
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
