import React from "react";
import styles from "../../styles/topics/MiningCode.module.css";
import { useLanguage } from "../../contexts/languageContext";

const MiningCode: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className={styles.container}>
      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <h1 className={styles.heroTitle}>{t("miningCode.hero.title")}</h1>
          <p className={styles.heroSubtitle}>{t("miningCode.hero.subtitle")}</p>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className={styles.about}>
        <div className={styles.textBlock}>
          <h2>{t("miningCode.about.title")}</h2>
          <p>{t("miningCode.about.description")}</p>

          <div className={styles.features}>
            <div className={styles.feature}>
              <h3>{t("miningCode.features.polymetallic.title")}</h3>
              <p>{t("miningCode.features.polymetallic.description")}</p>
            </div>
            <div className={styles.feature}>
              <h3>{t("miningCode.features.sulphides.title")}</h3>
              <p>{t("miningCode.features.sulphides.description")}</p>
            </div>
            <div className={styles.feature}>
              <h3>{t("miningCode.features.cobalt.title")}</h3>
              <p>{t("miningCode.features.cobalt.description")}</p>
            </div>
          </div>
        </div>

        <div className={styles.imageBlock}>
          <img
            src="../image/MiningCode.jpg"
            alt="Mining Code overview"
            className={styles.image}
          />
        </div>
      </section>

      {/* DETAILS SECTION */}
      <section className={styles.details}>
        <h2 className={styles.sectionTitle}>{t("miningCode.details.title")}</h2>
        <p>{t("miningCode.details.description1")}</p>
        <p
          dangerouslySetInnerHTML={{
            __html: t("miningCode.details.description2"),
          }}
        />
      </section>
    </div>
  );
};

export default MiningCode;
