import React from "react";
// Importer din egen modulære CSS-fil
import styles from "../../styles/topics/StrategicPlan.module.css";

const StrategicPlan: React.FC = () => {
  return (
    <div className={styles.container}>
      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>ISA Strategic Plan</h1>
          <p className={styles.heroSubtitle}>
            Guiding the sustainable future of deep seabed mining.
          </p>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className={styles.about}>
        <div className={styles.textBlock}>
          <h2>About the Strategic Plan</h2>
          <p>
            The ISA Strategic Plan outlines our vision for a balanced,
            sustainable, and scientifically informed approach to deep seabed
            resource management. It provides a roadmap for effective regulation,
            research, and capacity-building, ensuring that exploration and
            exploitation benefit all of humanity.
          </p>

          <div className={styles.features}>
            <div className={styles.feature}>
              <img
                src="/icons/regulation.svg"
                alt="Regulation icon"
                className={styles.icon}
              />
              <h3>Robust Regulation</h3>
              <p>Establishing strong frameworks to govern seabed activities.</p>
            </div>
            <div className={styles.feature}>
              <img
                src="/icons/environment.svg"
                alt="Environment icon"
                className={styles.icon}
              />
              <h3>Environmental Protection</h3>
              <p>Preserving marine ecosystems for future generations.</p>
            </div>
            <div className={styles.feature}>
              <img
                src="/icons/collab.svg"
                alt="Collaboration icon"
                className={styles.icon}
              />
              <h3>Global Collaboration</h3>
              <p>Fostering partnerships with stakeholders worldwide.</p>
            </div>
          </div>
        </div>

        <div className={styles.imageBlock}>
          <img
            src="/images/strategic-directions.jpg"
            alt="ISA Strategic Directions"
            className={styles.image}
          />
        </div>
      </section>

      {/* CTA SECTION */}
      <section className={styles.cta}>
        <h2>Join Our Strategic Vision</h2>
        <p>
          Learn more about how our Strategic Plan shapes the future of deep
          seabed mining. Explore key initiatives, engage with our community, and
          contribute to a sustainable ocean for all.
        </p>
        <a href="/contact" className={styles.ctaButton}>
          Contact Us
        </a>
      </section>
    </div>
  );
};

export default StrategicPlan;
