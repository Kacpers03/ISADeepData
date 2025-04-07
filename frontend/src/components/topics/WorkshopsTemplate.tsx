import React from "react";
import styles from "../../styles/topics/Workshops.module.css";

interface WorkshopsProps {
  t: (key: string) => string;
}

const Workshops: React.FC<WorkshopsProps> = ({ t }) => {
  return (
    <div className={styles.container}>
      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <h1 className={styles.heroTitle}>{t("workshops.hero.title")}</h1>
          <p className={styles.heroSubtitle}>{t("workshops.hero.subtitle")}</p>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className={styles.about}>
        <div className={styles.textBlock}>
          <h2>{t("workshops.about.title")}</h2>
          <p>{t("workshops.about.description")}</p>

          <div className={styles.features}>
            <div className={styles.feature}>
              <h3>{t("workshops.about.features.capacity.title")}</h3>
              <p>{t("workshops.about.features.capacity.description")}</p>
            </div>
            <div className={styles.feature}>
              <h3>{t("workshops.about.features.knowledge.title")}</h3>
              <p>{t("workshops.about.features.knowledge.description")}</p>
            </div>
            <div className={styles.feature}>
              <h3>{t("workshops.about.features.networking.title")}</h3>
              <p>{t("workshops.about.features.networking.description")}</p>
            </div>
          </div>
        </div>

        <div className={styles.imageBlock}>
          <img
            src="/images/workshops-webinars.jpg"
            alt={t("workshops.about.imageAlt")}
            className={styles.image}
          />
        </div>
      </section>

      {/* DETAILS SECTION */}
      <section className={styles.details}>
        <h2 className={styles.sectionTitle}>{t("workshops.details.title")}</h2>
        <p>{t("workshops.details.description")}</p>
        <p>
          <strong>{t("workshops.details.featuredTopics.label")}</strong>{" "}
          {t("workshops.details.featuredTopics.topics")}
        </p>
      </section>
    </div>
  );
};

export default Workshops;
