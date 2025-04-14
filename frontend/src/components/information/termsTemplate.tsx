import React from "react";
import styles from "../../styles/information/terms.module.css";

interface TermsProps {
  t: (key: string) => string;
}

export const Terms: React.FC<TermsProps> = ({ t }) => {
  return (
    <div className={styles.container}>
      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <h1 className={styles.heroTitle}>{t("terms.title")}</h1>
          <p className={styles.heroSubtitle}>{t("terms.subtitle")}</p>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className={styles.about}>
        <div className={styles.textBlock}>
          <h2>{t("terms.overview.title")}</h2>
          <p>{t("terms.overview.paragraph1")}</p>
          <p>{t("terms.overview.paragraph2")}</p>

          <div className={styles.features}>
            <div className={styles.feature}>
              <h3>{t("terms.toc.disclaimers")}</h3>
              <p>{t("terms.disclaimers.paragraph1")}</p>
            </div>
            <div className={styles.feature}>
              <h3>{t("terms.toc.immunities")}</h3>
              <p>{t("terms.immunities.paragraph1")}</p>
            </div>
            <div className={styles.feature}>
              <h3>{t("terms.toc.general")}</h3>
              <p>{t("terms.general.paragraph1")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* DETAILS SECTION */}
      <section className={styles.details}>
        {/* Disclaimers */}
        <div className={styles.infoBox} id="disclaimers">
          <h3>
            <span className={styles.accordionIcon}>⚠️</span>{" "}
            {t("terms.disclaimers.title")}
          </h3>
          <p>{t("terms.disclaimers.paragraph1")}</p>
          <p>{t("terms.disclaimers.paragraph2")}</p>
        </div>

        {/* Preservation of Immunities */}
        <div className={styles.infoBox} id="immunities">
          <h3>
            <span className={styles.accordionIcon}>🛡️</span>{" "}
            {t("terms.immunities.title")}
          </h3>
          <p>{t("terms.immunities.paragraph1")}</p>
        </div>

        {/* General */}
        <div className={styles.infoBox} id="general">
          <h3>
            <span className={styles.accordionIcon}>⚙️</span>{" "}
            {t("terms.general.title")}
          </h3>
          <p>{t("terms.general.paragraph1")}</p>
          <p>{t("terms.general.paragraph2")}</p>
        </div>

        {/* Notification of Amendments */}
        <div className={styles.infoBox} id="amendments">
          <h3>
            <span className={styles.accordionIcon}>✏️</span>{" "}
            {t("terms.amendments.title")}
          </h3>
          <p>{t("terms.amendments.paragraph1")}</p>
        </div>
      </section>
    </div>
  );
};

export default Terms;
