import React from "react";
import styles from "../../styles/topics/MarineProtection.module.css";

interface MarineProtectionProps {
  t: (key: string) => string;
}

const MarineProtection: React.FC<MarineProtectionProps> = ({ t }) => {
  return (
    <div className={styles.container}>
      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <h1 className={styles.heroTitle}>
            {t("marineProtection.hero.title")}
          </h1>
          <p className={styles.heroSubtitle}>
            {t("marineProtection.hero.subtitle")}
          </p>
        </div>
      </section>
      {/* ABOUT SECTION */}
      <section className={styles.about}>
        <div className={styles.textBlock}>
          <h2>{t("marineProtection.about.title")}</h2>
          <p>{t("marineProtection.about.description")}</p>

          <div className={styles.features}>
            <div className={styles.feature}>
              <h3>{t("marineProtection.features.conservation.title")}</h3>
              <p>{t("marineProtection.features.conservation.description")}</p>
            </div>
            <div className={styles.feature}>
              <h3>{t("marineProtection.features.monitoring.title")}</h3>
              <p>{t("marineProtection.features.monitoring.description")}</p>
            </div>
            <div className={styles.feature}>
              <h3>{t("marineProtection.features.research.title")}</h3>
              <p>{t("marineProtection.features.research.description")}</p>
            </div>
          </div>
        </div>

        <div className={styles.imageBlock}>
          <img
            src="../image/ProtectionMarineEnvironment.jpg"
            alt={t("marineProtection.about.imageAlt")}
            className={styles.image}
          />
        </div>
      </section>
    </div>
  );
};

export default MarineProtection;
