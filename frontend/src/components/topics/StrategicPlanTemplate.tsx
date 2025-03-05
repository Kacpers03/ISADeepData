import React from "react";
import { useRouter } from "next/router";
import styles from "../../styles/topics/StrategicPlan.module.css";
import { FaBalanceScale, FaLeaf, FaGlobeAmericas } from "react-icons/fa";

const StrategicPlan: React.FC = () => {
  const router = useRouter();

  const handleDownloadClick = () => {
    router.push("/StrategicPlanPDF");
  };

  return (
    <div className={styles.container}>
      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <h1 className={styles.heroTitle}>ISA Strategic Plan</h1>
          <p className={styles.heroSubtitle}>
            Guiding the sustainable future of deep seabed mining.
          </p>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className={styles.about}>
        <div className={styles.aboutContent}>
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
              <div className={styles.featureHeader}>
                <h3>Robust Regulation</h3>
                <FaBalanceScale className={styles.icon} />
              </div>
              <p className={styles.featureSummary}>
                Establishing strong frameworks to govern seabed activities.
              </p>
              <p className={styles.featureDetails}>
                Our robust regulatory framework is designed to provide clear
                guidelines and enforceable measures. By incorporating periodic
                reviews and continuous stakeholder engagement, we ensure that
                our regulations remain responsive and effective, fostering an
                environment of accountability and transparency.
              </p>
            </div>

            <div className={styles.feature}>
              <div className={styles.featureHeader}>
                <h3>Environmental Protection</h3>
                <FaLeaf className={styles.icon} />
              </div>
              <p className={styles.featureSummary}>
                Preserving marine ecosystems for future generations.
              </p>
              <p className={styles.featureDetails}>
                Environmental protection is at the heart of our mission. We
                implement comprehensive conservation measures, including regular
                environmental assessments and proactive monitoring programs, to
                ensure the sustainable management of marine ecosystems. This
                approach not only protects biodiversity but also promotes
                long-term ecological resilience.
              </p>
            </div>

            <div className={styles.feature}>
              <div className={styles.featureHeader}>
                <h3>Global Collaboration</h3>
                <FaGlobeAmericas className={styles.icon} />
              </div>
              <p className={styles.featureSummary}>
                Fostering partnerships with stakeholders worldwide.
              </p>
              <p className={styles.featureDetails}>
                Global collaboration is essential for harnessing the collective
                expertise of our international partners. By working closely with
                global stakeholders, regulatory bodies, and scientific
                communities, we strive to build a cohesive and innovative
                framework that benefits all parties involved. This spirit of
                partnership ensures that we share knowledge, harmonize best
                practices, and jointly address the challenges of deep seabed
                mining.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.aboutImage}>
          <img
            src="../image/StrategicPicture.jpg"
            alt="ISA Strategic Directions"
            className={styles.image}
          />
        </div>
      </section>

      {/* DOWNLOAD SECTION */}
      <section className={styles.downloadSection}>
        <h2>Download the Strategic Plan</h2>
        <p>
          Access the full ISA Strategic Plan document and explore the key
          objectives, regulations, and initiatives shaping the future of deep
          seabed mining.
        </p>
        <button className={styles.downloadButton} onClick={handleDownloadClick}>
          View and Download PDF
        </button>
      </section>
    </div>
  );
};

export default StrategicPlan;
