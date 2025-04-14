import React from "react";
import styles from "../../styles/topics/Workshops.module.css";
import { useLanguage } from "../../contexts/languageContext";

const WorkshopsTemplate: React.FC = () => {
  const { t } = useLanguage();

  // Workshop data matches the format of the ISA website
  const workshops = [
    {
      id: 1,
      title: "Deep Seabed Mineral Exploration Technologies Workshop",
      date: "March 15-16, 2025",
      thumbnail: "/image/workshop1.jpg",
    },
    {
      id: 2,
      title: "Environmental Impact Assessment Workshop",
      date: "February 10-12, 2025",
      thumbnail: "/image/workshop2.jpg",
    },
    {
      id: 3,
      title: "Legal Framework for Deep Seabed Mining",
      date: "January 22-24, 2025",
      thumbnail: "/image/workshop3.jpg",
    },
    {
      id: 4,
      title: "Marine Scientific Research Data Management",
      date: "December 5-7, 2024",
      thumbnail: "/image/workshop4.jpg",
    },
    {
      id: 5,
      title: "Capacity Building for Developing States",
      date: "November 18-20, 2024",
      thumbnail: "/image/workshop5.jpg",
    },
    {
      id: 6,
      title: "Standardization of Taxonomic Identifications Workshop",
      date: "October 8-10, 2024",
      thumbnail: "/image/workshop6.jpg",
    },
  ];

  // Redirect to the ISA website
  const redirectToISA = () => {
    window.open("https://www.isa.org.jm/workshops-and-webinars/", "_blank");
  };

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <h1 className={styles.heroTitle}>{t("workshops.hero.title")}</h1>
          <p className={styles.heroSubtitle}>{t("workshops.hero.subtitle")}</p>
        </div>
      </section>

      {/* Workshop Grid - Similar to ISA site */}
      <section className={styles.workshopsList}>
        <div className={styles.workshopsGrid}>
          {workshops.map((workshop) => (
            <div
              key={workshop.id}
              className={styles.workshopCard}
              onClick={redirectToISA}
            >
              <div className={styles.workshopContent}>
                <div className={styles.workshopDate}>{workshop.date}</div>
                <h3 className={styles.workshopTitle}>{workshop.title}</h3>
                <div className={styles.workshopLink}>
                  View Workshop Details →
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Link to ISA site */}
      <section className={styles.viewMoreSection}>
        <a
          href="https://www.isa.org.jm/workshops-and-webinars/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.viewMoreButton}
        >
          View All Workshops on the ISA Website
        </a>
      </section>
    </div>
  );
};

export default WorkshopsTemplate;
