import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "../../styles/topics/ExplorationContracts.module.css";

const contractTypes = [
  {
    title: "Polymetallic Nodules",
    count: 19,
    description:
      "Contracts for exploration of polymetallic nodules on the seabed",
    icon: "nodules",
  },
  {
    title: "Polymetallic Sulphides",
    count: 7,
    description:
      "Contracts for exploration of polymetallic sulphides in hydrothermal vents",
    icon: "sulphides",
  },
  {
    title: "Cobalt-rich Crusts",
    count: 5,
    description:
      "Contracts for exploration of cobalt-rich ferromanganese crusts on seamounts",
    icon: "cobalt",
  },
];

const ExplorationContracts = () => {
  return (
    <div className={styles.container}>
      {/* HERO SECTION - Modern full-width design */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Exploration Contracts</h1>
          <p className={styles.heroSubtitle}>
            Enabling sustainable and transparent seabed exploration for the
            benefit of all humanity
          </p>
          <div className={styles.heroActions}>
            <Link href="/contracts/database" className={styles.primaryButton}>
              Browse Contracts <span className={styles.arrowIcon}>→</span>
            </Link>
            <Link href="/learn-more" className={styles.secondaryButton}>
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* STATISTICS BANNER */}
      <section className={styles.statsBanner}>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>31</span>
          <span className={styles.statLabel}>Active Contracts</span>
        </div>
        <div className={styles.statDivider}></div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>22</span>
          <span className={styles.statLabel}>Sponsoring States</span>
        </div>
        <div className={styles.statDivider}></div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>1.5m</span>
          <span className={styles.statLabel}>km² Area</span>
        </div>
      </section>

      {/* ABOUT SECTION - Improved layout */}
      <section className={styles.about}>
        <div className={styles.textBlock}>
          <h2 className={styles.sectionHeading}>About Exploration Contracts</h2>
          <p className={styles.leadText}>
            The International Seabed Authority grants contracts for the
            exploration of mineral resources in the international seabed Area.
            These legally binding agreements outline the rights and obligations
            of contractors, ensuring that exploration activities adhere to
            environmental safeguards, reporting requirements, and the
            overarching principle of the common heritage of mankind.
          </p>

          <div className={styles.features}>
            <div className={styles.feature}>
              <div className={styles.featureIconWrapper}>
                <span className={styles.iconPlaceholder}>📄</span>
              </div>
              <h3>Legal Framework</h3>
              <p>
                Each contract operates under strict rules to maintain
                transparency and accountability.
              </p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIconWrapper}>
                <span className={styles.iconPlaceholder}>🛡️</span>
              </div>
              <h3>Environmental Safeguards</h3>
              <p>
                Contractors must follow best practices to protect marine
                ecosystems.
              </p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIconWrapper}>
                <span className={styles.iconPlaceholder}>💾</span>
              </div>
              <h3>Research &amp; Data Sharing</h3>
              <p>
                Promoting scientific research and knowledge exchange to advance
                seabed exploration.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.imageBlock}>
          <div className={styles.imageWrapper}>
            <Image
              src="/images/exploration-vessel.jpg"
              alt="Exploration vessel on ocean"
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
          Types of Exploration Contracts
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
                View Details <span className={styles.arrowIcon}>→</span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* DETAILS SECTION - Enhanced with card design */}
      <section className={styles.details}>
        <div className={styles.detailsCard}>
          <h2 className={styles.detailsTitle}>
            Contractors &amp; Sponsoring States
          </h2>
          <p>
            Exploration contracts are typically awarded to entities sponsored by
            a State Party to the United Nations Convention on the Law of the
            Sea. These sponsoring States bear responsibility for ensuring that
            contractors comply with regulations and uphold environmental and
            financial obligations.
          </p>
          <p>
            The ISA regularly reviews contractor performance, requiring detailed
            annual reports on exploration activities, environmental baseline
            studies, and any potential impacts on the marine environment.
          </p>
          <div className={styles.infoBox}>
            <h4>Key Requirements for Contractors:</h4>
            <ul className={styles.requirementsList}>
              <li>Annual activity reports</li>
              <li>Environmental monitoring</li>
              <li>Financial guarantees</li>
              <li>Technology transfer commitments</li>
              <li>Compliance with ISA regulations</li>
            </ul>
          </div>
        </div>
      </section>

      {/* INTERACTIVE MAP SECTION */}
      <section className={styles.mapSection}>
        <h2 className={styles.sectionHeading}>Exploration Areas</h2>
        <p className={styles.mapDescription}>
          View the geographic distribution of current exploration contracts
          around the world.
        </p>
        <div className={styles.mapContainer}>
          <div className={styles.mapPlaceholder}>
            <span>Interactive Map of Exploration Areas</span>
            <Link href="/exploration-map" className={styles.viewFullMapButton}>
              View Full Map
            </Link>
          </div>
        </div>
      </section>

      {/* CTA SECTION - Modernized */}
      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2>Learn More About Exploration Contracts</h2>
          <p>
            Discover the framework, obligations, and opportunities associated
            with exploration contracts, and find out how ISA works to balance
            resource development with environmental protection.
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/contact" className={styles.primaryButton}>
              Contact Us
            </Link>
            <Link href="/resources" className={styles.outlineButton}>
              Download Resources
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ExplorationContracts;
