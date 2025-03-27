import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "../../styles/topics/ExplorationContracts.module.css";

interface ExplorationContractsProps {
  t: (key: string) => string;
}

const ExplorationContracts: React.FC<ExplorationContractsProps> = ({ t }) => {
  const contractTypes = [
    {
      title: t('explorationContracts.types.polymetallic.title'),
      count: 19,
      description: t('explorationContracts.types.polymetallic.description'),
      icon: "nodules",
    },
    {
      title: t('explorationContracts.types.sulphides.title'),
      count: 7,
      description: t('explorationContracts.types.sulphides.description'),
      icon: "sulphides",
    },
    {
      title: t('explorationContracts.types.cobalt.title'),
      count: 5,
      description: t('explorationContracts.types.cobalt.description'),
      icon: "cobalt",
    },
  ];

  return (
    <div className={styles.container}>
      {/* HERO SECTION - Modern full-width design */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>{t('explorationContracts.hero.title')}</h1>
          <p className={styles.heroSubtitle}>
            {t('explorationContracts.hero.subtitle')}
          </p>
          <div className={styles.heroActions}>
            <Link href="/contracts/database" className={styles.primaryButton}>
              {t('explorationContracts.hero.browseButton')} <span className={styles.arrowIcon}>→</span>
            </Link>
            <Link href="/learn-more" className={styles.secondaryButton}>
              {t('explorationContracts.hero.learnMoreButton')}
            </Link>
          </div>
        </div>
      </section>

      {/* STATISTICS BANNER */}
      <section className={styles.statsBanner}>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>31</span>
          <span className={styles.statLabel}>{t('explorationContracts.stats.activeContracts')}</span>
        </div>
        <div className={styles.statDivider}></div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>22</span>
          <span className={styles.statLabel}>{t('explorationContracts.stats.sponsoringStates')}</span>
        </div>
        <div className={styles.statDivider}></div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>1.5m</span>
          <span className={styles.statLabel}>{t('explorationContracts.stats.area')}</span>
        </div>
      </section>

      {/* ABOUT SECTION - Improved layout */}
      <section className={styles.about}>
        <div className={styles.textBlock}>
          <h2 className={styles.sectionHeading}>{t('explorationContracts.about.title')}</h2>
          <p className={styles.leadText}>
            {t('explorationContracts.about.description')}
          </p>

          <div className={styles.features}>
            <div className={styles.feature}>
              <div className={styles.featureIconWrapper}>
                <span className={styles.iconPlaceholder}>📄</span>
              </div>
              <h3>{t('explorationContracts.about.features.legal.title')}</h3>
              <p>
                {t('explorationContracts.about.features.legal.description')}
              </p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIconWrapper}>
                <span className={styles.iconPlaceholder}>🛡️</span>
              </div>
              <h3>{t('explorationContracts.about.features.environmental.title')}</h3>
              <p>
                {t('explorationContracts.about.features.environmental.description')}
              </p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIconWrapper}>
                <span className={styles.iconPlaceholder}>💾</span>
              </div>
              <h3>{t('explorationContracts.about.features.research.title')}</h3>
              <p>
                {t('explorationContracts.about.features.research.description')}
              </p>
            </div>
          </div>
        </div>

        <div className={styles.imageBlock}>
          <div className={styles.imageWrapper}>
            <Image
              src="/images/exploration-vessel.jpg"
              alt={t('explorationContracts.about.imageAlt')}
              fill
              className={styles.image}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* CONTRACT TYPES SECTION */}
      <section className={styles.contractTypes}>
        <h2 className={styles.sectionHeading}>
          {t('explorationContracts.typesSection.title')}
        </h2>
        <div className={styles.contractTypeGrid}>
          {contractTypes.map((type, index) => (
            <div key={index} className={styles.contractTypeCard}>
              <div className={styles.contractCardHeader}>
                <div className={styles.contractIcon}>
                  <Image
                    src={`/icons/${type.icon}.svg`}
                    alt={type.title}
                    width={32}
                    height={32}
                  />
                </div>
                <span className={styles.contractCount}>{type.count}</span>
              </div>
              <h3 className={styles.contractCardTitle}>{type.title}</h3>
              <p className={styles.contractCardDescription}>
                {type.description}
              </p>
              <Link
                href={`/contracts/${type.icon}`}
                className={styles.contractCardLink}
              >
                {t('explorationContracts.typesSection.viewDetails')} <span className={styles.arrowIcon}>→</span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* DETAILS SECTION - Enhanced with card design */}
      <section className={styles.details}>
        <div className={styles.detailsCard}>
          <h2 className={styles.detailsTitle}>
            {t('explorationContracts.details.title')}
          </h2>
          <p>
            {t('explorationContracts.details.paragraph1')}
          </p>
          <p>
            {t('explorationContracts.details.paragraph2')}
          </p>
          <div className={styles.infoBox}>
            <h4>{t('explorationContracts.details.requirements.title')}</h4>
            <ul className={styles.requirementsList}>
              <li>{t('explorationContracts.details.requirements.item1')}</li>
              <li>{t('explorationContracts.details.requirements.item2')}</li>
              <li>{t('explorationContracts.details.requirements.item3')}</li>
              <li>{t('explorationContracts.details.requirements.item4')}</li>
              <li>{t('explorationContracts.details.requirements.item5')}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* INTERACTIVE MAP SECTION */}
      <section className={styles.mapSection}>
        <h2 className={styles.sectionHeading}>{t('explorationContracts.map.title')}</h2>
        <p className={styles.mapDescription}>
          {t('explorationContracts.map.description')}
        </p>
        <div className={styles.mapContainer}>
          <div className={styles.mapPlaceholder}>
            <span>{t('explorationContracts.map.placeholder')}</span>
            <Link href="/exploration-map" className={styles.viewFullMapButton}>
              {t('explorationContracts.map.viewFullMapButton')}
            </Link>
          </div>
        </div>
      </section>

      {/* CTA SECTION - Modernized */}
      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2>{t('explorationContracts.cta.title')}</h2>
          <p>
            {t('explorationContracts.cta.description')}
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/contact" className={styles.primaryButton}>
              {t('explorationContracts.cta.contactButton')}
            </Link>
            <Link href="/resources" className={styles.outlineButton}>
              {t('explorationContracts.cta.resourcesButton')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ExplorationContracts;