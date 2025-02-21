import React from "react";
import styles from "../../styles/topics/ExplorationContracts.module.css";

const ExplorationContracts: React.FC = () => {
  return (
    <div className={styles.container}>
      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Exploration Contracts</h1>
          <p className={styles.heroSubtitle}>
            Enabling sustainable and transparent seabed exploration for the
            benefit of all.
          </p>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className={styles.about}>
        <div className={styles.textBlock}>
          <h2>About Exploration Contracts</h2>
          <p>
            The International Seabed Authority grants contracts for the
            exploration of mineral resources in the international seabed Area.
            These legally binding agreements outline the rights and obligations
            of contractors, ensuring that exploration activities adhere to
            environmental safeguards, reporting requirements, and the
            overarching principle of the common heritage of mankind.
          </p>

          <div className={styles.features}>
            <div className={styles.feature}>
              <img
                src="/icons/contract.svg"
                alt="Contract icon"
                className={styles.icon}
              />
              <h3>Legal Framework</h3>
              <p>
                Each contract operates under strict rules to maintain
                transparency and accountability.
              </p>
            </div>
            <div className={styles.feature}>
              <img
                src="/icons/environmental.svg"
                alt="Environmental icon"
                className={styles.icon}
              />
              <h3>Environmental Safeguards</h3>
              <p>
                Contractors must follow best practices to protect marine
                ecosystems.
              </p>
            </div>
            <div className={styles.feature}>
              <img
                src="/icons/research.svg"
                alt="Research icon"
                className={styles.icon}
              />
              <h3>Research &amp; Data Sharing</h3>
              <p>
                Promoting scientific research and knowledge exchange to advance
                seabed exploration.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.imageBlock}>
          <img
            src="/images/exploration-contracts.jpg"
            alt="Exploration Contracts"
            className={styles.image}
          />
        </div>
      </section>

      {/* DETAILS SECTION */}
      <section className={styles.details}>
        <h2 className={styles.sectionTitle}>
          Contractors &amp; Sponsoring States
        </h2>
        <p>
          Exploration contracts are typically awarded to entities sponsored by a
          State Party to the United Nations Convention on the Law of the Sea.
          These sponsoring States bear responsibility for ensuring that
          contractors comply with regulations and uphold environmental and
          financial obligations.
        </p>
        <p>
          The ISA regularly reviews contractor performance, requiring detailed
          annual reports on exploration activities, environmental baseline
          studies, and any potential impacts on the marine environment.
        </p>
      </section>

      {/* CTA SECTION */}
      <section className={styles.cta}>
        <h2>Learn More About Exploration Contracts</h2>
        <p>
          Discover the framework, obligations, and opportunities associated with
          exploration contracts, and find out how ISA works to balance resource
          development with environmental protection.
        </p>
        <a href="/contact" className={styles.ctaButton}>
          Contact Us
        </a>
      </section>
    </div>
  );
};

export default ExplorationContracts;
