import React from "react";
import styles from "../../styles/topics/MarineProtection.module.css";
import { FaShieldAlt, FaChartLine, FaMicroscope } from "react-icons/fa";
import { useLanguage } from "../../contexts/languageContext";

const MarineProtection: React.FC = () => {
  const { t } = useLanguage();

  // Protection approach booths based on ISA.org.jm content
  const approachBooths = [
    {
      id: 1,
      title: "Environmental Management Plans",
      description:
        "Regional Environmental Management Plans for different areas of the seabed",
      image: "../image/emp.jpg",
      url: "/marine-protection/environmental-management-plans",
    },
    {
      id: 2,
      title: "Environmental Impact Assessments",
      description:
        "Guidelines and procedures for assessing potential environmental impacts",
      image: "../image/eia.jpg",
      url: "/marine-protection/environmental-impact-assessments",
    },
    {
      id: 3,
      title: "Preservation Reference Zones",
      description:
        "Areas set aside for monitoring the environmental impacts of activities in the Area",
      image: "../image/preservation.jpg",
      url: "/marine-protection/preservation-reference-zones",
    },
  ];

  return (
    <div className={styles.container}>
      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <h1 className={styles.heroTitle}>
            Protection of the Marine Environment
          </h1>
          <p className={styles.heroSubtitle}>
            Ensuring the effective protection of the marine environment from
            harmful effects of deep-seabed mining activities
          </p>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className={styles.about}>
        <div className={styles.textBlock}>
          <h2>About Marine Environmental Protection</h2>
          <p>
            The International Seabed Authority is committed to ensuring that the
            marine environment is protected from any harmful effects which may
            arise during deep-seabed related activities. This commitment is
            embedded in the United Nations Convention on the Law of the Sea and
            the 1994 Agreement.
          </p>

          <div className={styles.features}>
            <div className={styles.feature}>
              <FaShieldAlt className={styles.icon} />
              <h3>Protection & Preservation</h3>
              <p>
                Safeguarding marine biodiversity and ecosystem functions in the
                international seabed area
              </p>
            </div>
            <div className={styles.feature}>
              <FaChartLine className={styles.icon} />
              <h3>Environmental Assessment</h3>
              <p>
                Evaluating potential impacts of deep-seabed activities through
                scientific research and monitoring
              </p>
            </div>
            <div className={styles.feature}>
              <FaMicroscope className={styles.icon} />
              <h3>Scientific Research</h3>
              <p>
                Advancing knowledge of deep-sea ecosystems to inform
                evidence-based protection measures
              </p>
            </div>
          </div>
        </div>

        <div className={styles.imageBlock}>
          <img
            src="../image/ProtectionMarineEnvironment.jpg"
            alt="Marine Environment Protection"
            className={styles.image}
          />
        </div>
      </section>

      {/* LEGAL FRAMEWORK SECTION */}
      <section className={styles.frameworkSection}>
        <h2 className={styles.sectionTitle}>Legal Framework</h2>
        <p>
          The legal regime for the protection and preservation of the marine
          environment in the Area is established by the Convention and the 1994
          Agreement, and implemented through the rules, regulations and
          procedures adopted by the Authority. These include:
        </p>
        <ul className={styles.frameworkList}>
          <li>Exploration regulations for the three mineral types</li>
          <li>Environmental recommendations for contractors</li>
          <li>LTC recommendations for the guidance of contractors</li>
          <li>Strategic Plan and High-Level Action Plan</li>
        </ul>
      </section>
    </div>
  );
};

export default MarineProtection;
