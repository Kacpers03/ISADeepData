import React from "react";
import styles from "../../styles/topics/StrategicPlan.module.css"; // Opprett en CSS-modul med din styling

const StrategicPlan: React.FC = () => {
  return (
    <div className={styles.container}>
      {/* Hero / Header */}
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Strategic Plan</h1>
          <p className={styles.subtitle}>
            Guiding the future of deep seabed mining through sustainable
            practices and international cooperation.
          </p>
        </div>
      </header>

      {/* Ingress */}
      <section className={styles.intro}>
        <p>
          The International Seabed Authority's Strategic Plan outlines our
          vision for a balanced, sustainable, and scientifically informed
          management of deep seabed resources. This plan sets the framework for
          effective regulation, research, and capacity building, ensuring that
          the exploration and exploitation of deep seabed minerals contribute to
          the benefit of all mankind.
        </p>
      </section>

      {/* Key Objectives */}
      <section className={styles.objectives}>
        <h2 className={styles.sectionTitle}>Key Objectives</h2>
        <ul className={styles.objectivesList}>
          <li>
            Ensure sustainable resource management and environmental protection.
          </li>
          <li>Promote international collaboration and capacity building.</li>
          <li>Encourage innovation in deep-sea exploration and technology.</li>
          <li>Strengthen legal and regulatory frameworks.</li>
          <li>Foster transparency and accountability in decision-making.</li>
        </ul>
      </section>

      {/* Main Content */}
      <section className={styles.content}>
        <h2 className={styles.sectionTitle}>Our Vision and Strategy</h2>
        <p>
          Our vision is to create a framework that not only supports the
          sustainable development of deep seabed resources, but also protects
          marine ecosystems for future generations. The strategy emphasizes
          coordinated international efforts, robust scientific research, and the
          integration of advanced technologies in monitoring and regulating
          activities on the deep seabed.
        </p>
        <p>
          Through targeted investments in research and development, enhanced
          stakeholder engagement, and adaptive policy-making, we aim to balance
          economic opportunities with environmental stewardship. This strategic
          plan serves as a roadmap for the ISA and its partners as we navigate
          the challenges and opportunities of deep seabed mining.
        </p>
      </section>

      {/* Call to Action */}
      <section className={styles.cta}>
        <p>
          Learn more about our initiatives and how we work with international
          partners to implement this strategic vision.
        </p>
        <a href="/contact" className={styles.ctaButton}>
          Contact Us for More Information
        </a>
      </section>
    </div>
  );
};

export default StrategicPlan;
