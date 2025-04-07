import React from "react";
import styles from "../../styles/topics/ExplorationContracts.module.css";

interface ExplorationContractsProps {
  t: (key: string) => string;
}

const ExplorationContracts: React.FC<ExplorationContractsProps> = ({ t }) => {
  return (
    <div className={styles.container}>
      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <h1 className={styles.heroTitle}>
            {t("explorationContracts.hero.title")}
          </h1>
          <p className={styles.heroSubtitle}>
            {t("explorationContracts.hero.subtitle")}
          </p>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className={styles.about}>
        <div className={styles.textBlock}>
          <h2>{t("explorationContracts.about.title")}</h2>
          <p>{t("explorationContracts.about.description")}</p>

          <div className={styles.features}>
            <div className={styles.feature}>
              <h3>{t("explorationContracts.about.features.legal.title")}</h3>
              <p>
                {t("explorationContracts.about.features.legal.description")}
              </p>
            </div>
            <div className={styles.feature}>
              <h3>
                {t("explorationContracts.about.features.environmental.title")}
              </h3>
              <p>
                {t(
                  "explorationContracts.about.features.environmental.description"
                )}
              </p>
            </div>
            <div className={styles.feature}>
              <h3>{t("explorationContracts.about.features.research.title")}</h3>
              <p>
                {t("explorationContracts.about.features.research.description")}
              </p>
            </div>
          </div>
        </div>

        <div className={styles.imageBlock}>
          <img
            src="../image/miningContract.jpg"
            alt={t("explorationContracts.about.imageAlt")}
            className={styles.image}
          />
        </div>
      </section>

      {/* CONTRACT TYPES SECTION */}
      <section className={styles.contractTypesSection}>
        <h2 className={styles.sectionTitle}>
          {t("explorationContracts.typesSection.title")}
        </h2>

        <div className={styles.contractTypeLinks}>
          <a
            href="/exploration-contracts/polymetallic-nodules"
            className={styles.contractTypeItem}
          >
            <div className={styles.contractImage}>
              <img src="../image/nodules.jpg" alt="Polymetallic Nodules" />
            </div>
            <h3 className={styles.contractTypeTitle}>
              {t("explorationContracts.types.polymetallic.title")}
            </h3>
          </a>

          <a
            href="/exploration-contracts/polymetallic-sulphides"
            className={styles.contractTypeItem}
          >
            <div className={styles.contractImage}>
              <img src="../image/sulphides.jpg" alt="Polymetallic Sulphides" />
            </div>
            <h3 className={styles.contractTypeTitle}>
              {t("explorationContracts.types.sulphides.title")}
            </h3>
          </a>

          <a
            href="/exploration-contracts/cobalt-crusts"
            className={styles.contractTypeItem}
          >
            <div className={styles.contractImage}>
              <img
                src="../image/crust.jpg"
                alt="Cobalt-rich Ferromanganese Crusts"
              />
            </div>
            <h3 className={styles.contractTypeTitle}>
              {t("explorationContracts.types.cobalt.title")}
            </h3>
          </a>
        </div>
      </section>

      {/* DETAILS SECTION */}
      <section className={styles.details}>
        <h2 className={styles.sectionTitle}>
          {t("explorationContracts.details.title")}
        </h2>
        <p>{t("explorationContracts.details.paragraph1")}</p>
        <p>{t("explorationContracts.details.paragraph2")}</p>
        <div className={styles.infoBox}>
          <h4>{t("explorationContracts.details.requirements.title")}</h4>
          <ul className={styles.requirementsList}>
            <li>{t("explorationContracts.details.requirements.item1")}</li>
            <li>{t("explorationContracts.details.requirements.item2")}</li>
            <li>{t("explorationContracts.details.requirements.item3")}</li>
            <li>{t("explorationContracts.details.requirements.item4")}</li>
            <li>{t("explorationContracts.details.requirements.item5")}</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default ExplorationContracts;
