import React from "react";
import styles from "../../styles/topics/MarineProtection.module.css";

const MarineProtection: React.FC = () => {
  return (
    <div className={styles.container}>
      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <h1 className={styles.heroTitle}>
            Protection of the Marine Environment
          </h1>
          <p className={styles.heroSubtitle}>
            Preserving ocean ecosystems for a sustainable future.
          </p>
        </div>
      </section>
      {/* ABOUT SECTION */}
      <section className={styles.about}>
        <div className={styles.textBlock}>
          <h2>Our Commitment to Marine Conservation</h2>
          <p>
            The International Seabed Authority is dedicated to ensuring that all
            deep seabed activities are carried out with the utmost regard for
            the marine environment. Our policies and practices are designed to
            protect sensitive ecosystems, preserve biodiversity, and promote
            sustainable use of marine resources.
          </p>

          <div className={styles.features}>
            <div className={styles.feature}>
              <h3>Conservation Measures</h3>
              <p>Implementing robust measures to safeguard marine habitats.</p>
            </div>
            <div className={styles.feature}>
              <h3>Environmental Monitoring</h3>
              <p>
                Utilizing advanced technology to monitor ocean health in real
                time.
              </p>
            </div>
            <div className={styles.feature}>
              <h3>Scientific Research</h3>
              <p>
                Supporting research initiatives to understand and mitigate
                impacts on marine ecosystems.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.imageBlock}>
          <img
            src="../image/ProtectionMarineEnvironment.jpg"
            alt="Marine Environment"
            className={styles.image}
          />
        </div>
      </section>

      {/* CTA SECTION */}
      <section className={styles.cta}>
        <h2>Join Our Conservation Efforts</h2>
        <p>
          Discover how ISA’s initiatives protect the marine environment and
          learn how you can contribute to a sustainable future for our oceans.
        </p>
        <a href="/contact" className={styles.ctaButton}>
          Contact Us
        </a>
      </section>
    </div>
  );
};

export default MarineProtection;
