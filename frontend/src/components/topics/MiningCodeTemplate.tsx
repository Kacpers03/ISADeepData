import React from "react";
import styles from "../../styles/topics/MiningCode.module.css";

const MiningCode: React.FC = () => {
  return (
    <div className={styles.container}>
      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>The Mining Code</h1>
          <p className={styles.heroSubtitle}>
            A comprehensive set of rules, regulations and procedures for
            sustainable exploration and exploitation of marine minerals.
          </p>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className={styles.about}>
        <div className={styles.textBlock}>
          <h2>About the Mining Code</h2>
          <p>
            The “Mining Code” refers to the complete framework issued by the
            International Seabed Authority to regulate prospecting, exploration,
            and exploitation of marine minerals in the international seabed
            Area. It encompasses regulations, recommendations, and procedures
            designed to ensure that seabed activities are carried out
            responsibly and benefit all of humankind.
          </p>

          <div className={styles.features}>
            <div className={styles.feature}>
              <img
                src="/icons/polymetallic.svg"
                alt="Polymetallic nodules"
                className={styles.icon}
              />
              <h3>Polymetallic Nodules</h3>
              <p>
                Regulations for exploring nodules rich in nickel, copper,
                cobalt, and manganese.
              </p>
            </div>
            <div className={styles.feature}>
              <img
                src="/icons/sulphides.svg"
                alt="Polymetallic sulphides"
                className={styles.icon}
              />
              <h3>Polymetallic Sulphides</h3>
              <p>
                Guidance on sustainable exploration of seafloor massive
                sulphides.
              </p>
            </div>
            <div className={styles.feature}>
              <img
                src="/icons/cobalt.svg"
                alt="Cobalt crusts"
                className={styles.icon}
              />
              <h3>Cobalt-Rich Crusts</h3>
              <p>
                Regulations for crusts containing cobalt, iron, and other
                metals.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.imageBlock}>
          <img
            src="/images/mining-code-overview.jpg"
            alt="Mining Code overview"
            className={styles.image}
          />
        </div>
      </section>

      {/* DETAILS SECTION */}
      <section className={styles.details}>
        <h2 className={styles.sectionTitle}>Regulatory Framework</h2>
        <p>
          The Mining Code is continually evolving to address new technologies
          and environmental considerations. It is supplemented by
          recommendations from the Legal and Technical Commission, ensuring that
          the best available scientific and technical information is integrated
          into regulations.
        </p>
        <p>
          The ISA also works on <strong>draft exploitation regulations</strong>,
          commonly referred to as the “Mining Code,” which outline the
          responsibilities of contractors and States sponsoring them,
          environmental protection measures, and financial payment structures.
        </p>
      </section>

      {/* CTA SECTION */}
      <section className={styles.cta}>
        <h2>Explore the Code Further</h2>
        <p>
          Learn how the Mining Code fosters sustainable management of seabed
          resources, promotes international cooperation, and balances economic
          development with marine environmental protection.
        </p>
        <a href="/contact" className={styles.ctaButton}>
          Contact Us
        </a>
      </section>
    </div>
  );
};

export default MiningCode;
