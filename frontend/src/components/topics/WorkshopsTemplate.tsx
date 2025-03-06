import React from "react";
import styles from "../../styles/topics/Workshops.module.css";

const Workshops: React.FC = () => {
  return (
    <div className={styles.container}>
      {/* HERO SECTION */}

      <section className={styles.hero}>
        <div className={styles.heroText}>
          <h1 className={styles.heroTitle}>Workshops </h1>
          <p className={styles.heroSubtitle}>
            Expanding knowledge and fostering collaboration through interactive
            events.{" "}
          </p>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className={styles.about}>
        <div className={styles.textBlock}>
          <h2>Engage, Learn, and Innovate</h2>
          <p>
            ISA’s Workshops &amp; Webinars bring together experts, researchers,
            and policymakers to discuss the latest developments in deep seabed
            exploration and marine environmental protection. These events aim to
            promote capacity-building, knowledge exchange, and innovative
            solutions for the sustainable management of ocean resources.
          </p>

          <div className={styles.features}>
            <div className={styles.feature}>
              <img
                src="/icons/training.svg"
                alt="Training icon"
                className={styles.icon}
              />
              <h3>Capacity Building</h3>
              <p>Hands-on training sessions to enhance skills and expertise.</p>
            </div>
            <div className={styles.feature}>
              <img
                src="/icons/knowledge.svg"
                alt="Knowledge icon"
                className={styles.icon}
              />
              <h3>Knowledge Sharing</h3>
              <p>Exchange ideas and best practices with global stakeholders.</p>
            </div>
            <div className={styles.feature}>
              <img
                src="/icons/network.svg"
                alt="Networking icon"
                className={styles.icon}
              />
              <h3>Networking</h3>
              <p>
                Connect with professionals, researchers, and industry leaders.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.imageBlock}>
          <img
            src="/images/workshops-webinars.jpg"
            alt="ISA Workshops"
            className={styles.image}
          />
        </div>
      </section>

      {/* DETAILS SECTION */}
      <section className={styles.details}>
        <h2 className={styles.sectionTitle}>Upcoming &amp; Past Events</h2>
        <p>
          Stay informed about upcoming workshops and webinars on topics ranging
          from marine technology advancements to regulatory updates. Our past
          events library offers recorded sessions and materials for continued
          learning and reference.
        </p>
        <p>
          <strong>Featured Topics:</strong> Deep-sea ecosystem research,
          environmental impact assessments, resource evaluation methods, and
          more.
        </p>
      </section>

      {/* CTA SECTION */}
      <section className={styles.cta}>
        <h2>Join the Conversation</h2>
        <p>
          Sign up for our next workshop or webinar to learn from leading experts
          and contribute to shaping the future of ocean governance.
        </p>
        <a href="/contact" className={styles.ctaButton}>
          Contact Us
        </a>
      </section>
    </div>
  );
};

export default Workshops;
