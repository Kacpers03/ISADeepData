import React from "react";
import { useRouter } from "next/router";
import styles from "../../styles/topics/StrategicPlan.module.css";
import { FaBalanceScale, FaLeaf, FaGlobeAmericas } from "react-icons/fa";
import { useLanguage } from "../../contexts/languageContext";

const StrategicPlan: React.FC = () => {
  const router = useRouter();
  const { t } = useLanguage();

  const handleDownloadClick = () => {
    router.push("/StrategicPlanPDF");
  };

  return (
    <div className={styles.container}>
      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <h1 className={styles.heroTitle}>{t("strategicPlan.hero.title")}</h1>
          <p className={styles.heroSubtitle}>
            {t("strategicPlan.hero.subtitle")}
          </p>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className={styles.about}>
        <div className={styles.aboutContent}>
          <h2>{t("strategicPlan.about.title")}</h2>
          <p>{t("strategicPlan.about.description")}</p>
          <div className={styles.features}>
            <div className={styles.feature}>
              <div className={styles.featureHeader}>
                <h3>{t("strategicPlan.features.regulation.title")}</h3>
                <FaBalanceScale className={styles.icon} />
              </div>
              <p className={styles.featureSummary}>
                {t("strategicPlan.features.regulation.description")}
              </p>
              <p className={styles.featureDetails}>
                {t("strategicPlan.features.regulation.details")}
              </p>
            </div>

            <div className={styles.feature}>
              <div className={styles.featureHeader}>
                <h3>{t("strategicPlan.features.environment.title")}</h3>
                <FaLeaf className={styles.icon} />
              </div>
              <p className={styles.featureSummary}>
                {t("strategicPlan.features.environment.description")}
              </p>
              <p className={styles.featureDetails}>
                {t("strategicPlan.features.environment.details")}
              </p>
            </div>

            <div className={styles.feature}>
              <div className={styles.featureHeader}>
                <h3>{t("strategicPlan.features.collaboration.title")}</h3>
                <FaGlobeAmericas className={styles.icon} />
              </div>
              <p className={styles.featureSummary}>
                {t("strategicPlan.features.collaboration.description")}
              </p>
              <p className={styles.featureDetails}>
                {t("strategicPlan.features.collaboration.details")}
              </p>
            </div>
          </div>
        </div>

        <div className={styles.aboutImage}>
          <img
            src="../image/StrategicPicture.jpg"
            alt="ISA Strategic Directions"
            className={styles.image}
          />
        </div>
      </section>

      {/* DOWNLOAD SECTION */}
      <section className={styles.downloadSection}>
        <h2>{t("strategicPlan.download.title")}</h2>
        <p>{t("strategicPlan.download.description")}</p>
        <button className={styles.downloadButton} onClick={handleDownloadClick}>
          {t("strategicPlan.download.button")}
        </button>
      </section>
    </div>
  );
};

export default StrategicPlan;
