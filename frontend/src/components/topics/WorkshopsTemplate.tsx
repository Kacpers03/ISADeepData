import React from "react";
import styles from "../../styles/topics/Workshops.module.css";
import { useLanguage } from "../../contexts/languageContext";

const WorkshopsTemplate: React.FC = () => {
  const { t } = useLanguage();

  // Workshop data from the ISA website image
  const workshops = [
    {
      id: 1,
      title:
        "Advancing marine spatial planning in Areas Beyond National Jurisdiction for sustainable deep-sea stewardship: best practices and key insights from the REMP process",
      date: "23 April 2025 - 27 April 2025",
      url: "https://www.isa.org.jm/events/advancing-marine-spatial-planning-in-areas-beyond-national-jurisdiction-for-sustainable-deep-sea-stewardship-best-practices-and-key-insights-from-the-remp-process/",
    },
    {
      id: 2,
      title: "Advancing Caribbean Blue Economy through Deep Sea Research",
      date: "26 November 2024 - 28 November 2024",
      url: "https://www.isa.org.jm/events/advancing-caribbean-blue-economy-through-deep-sea-research/",
    },
    {
      id: 3,
      title: "Technical workshop | Scientific and legal aspects of Test Mining",
      date: "16 December 2024 - 17 December 2024",
      url: "https://www.isa.org.jm/events/technical-workshop-scientific-and-legal-aspects-of-test-mining/",
    },
    {
      id: 4,
      title:
        "Workshop on the development of a Regional Environmental Management Plan for the Area of the Indian Ocean, with a focus on the Mid-Ocean Ridges and Central Indian Ocean Basin",
      date: "27 April 2025 - 1 May 2025",
      url: "https://www.isa.org.jm/events/workshop-on-the-development-of-a-remp-for-the-area-of-the-indian-ocean/",
    },
    {
      id: 5,
      title:
        "Workshop on the Development of a Regional Environmental Management Plan for the Area of the Northwest Pacific",
      date: "19 February 2024 - 23 February 2024",
      url: "https://www.isa.org.jm/events/workshop-on-the-development-of-a-regional-environmental-management-plan-for-the-area-of-the-northwest-pacific-2/",
    },
    {
      id: 6,
      title:
        "Workshop on the development of a scientific approach to identifying key deep-sea taxa in support of the protection of the marine environment in the Area",
      date: "3 June 2024 - 6 June 2024",
      url: "https://www.isa.org.jm/events/workshop-on-the-development-of-a-scientific-approach-to-identifying-key-deep-sea-taxa-in-support-of-the-protection-of-the-marine-environment-in-the-area/",
    },
    {
      id: 7,
      title:
        "Expert scoping workshop on charting future horizons: harnessing advanced technologies for the protection and sustainable use of the international seabed area",
      date: "3 April 2024 - 5 April 2024",
      url: "https://www.isa.org.jm/events/expert-scoping-workshop-on-charting-future-horizons-harnessing-advanced-technologies-for-the-protection-and-sustainable-use-of-the-international-seabed-area/",
    },
    {
      id: 8,
      title:
        "ISA-Philippines National Capacity Development Workshop on deep-sea related matters",
      date: "9 October 2023 - 11 October 2023",
      url: "https://www.isa.org.jm/events/isa-philippines-national-capacity-development-workshop-on-deep-sea-related-matters/",
    },
    {
      id: 9,
      title:
        "Workshop on the Development of a Regional Environmental Management Plan for the Area of the Northwest Pacific",
      date: "19 February 2024 - 23 February 2024", // Duplicate entry in original image
      url: "https://www.isa.org.jm/events/workshop-on-the-development-of-a-regional-environmental-management-plan-for-the-area-of-the-northwest-pacific-2/",
    },
    {
      id: 10,
      title:
        "Workshop on Enhancing Biological Data Sharing to Advance Deep-Sea Taxonomy",
      date: "3 October 2023 - 6 October 2023",
      url: "https://www.isa.org.jm/events/workshop-on-enhancing-biological-data-sharing-to-advance-deep-sea-taxonomy/",
    },
  ];

  // For the yearly archive counts (from the image)
  const yearlyWorkshops = [
    { year: "2025", count: 2 },
    { year: "2024", count: 6 },
    { year: "2023", count: 3 },
    { year: "2022", count: 5 },
    { year: "2021", count: 8 },
  ];

  const yearlyEvents = [
    { year: "2025", count: 2 },
    { year: "2024", count: 15 },
    { year: "2023", count: 8 },
    { year: "2022", count: 17 },
    { year: "2021", count: 9 },
  ];

  // Redirect to specific workshop page
  const redirectToWorkshop = (url: string) => {
    window.open(url, "_blank");
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

      {/* Workshops List - Similar to ISA site */}
      <section className={styles.workshopsList}>
        <div className={styles.mainContent}>
          {workshops.map((workshop) => (
            <div
              key={workshop.id}
              className={styles.workshopItem}
              onClick={() => redirectToWorkshop(workshop.url)}
            >
              <div className={styles.workshopDate}>{workshop.date}</div>
              <h3 className={styles.workshopTitle}>{workshop.title}</h3>
            </div>
          ))}
        </div>

        {/* Sidebar with yearly archives */}
        <div className={styles.sidebar}>
          <div className={styles.archiveSection}>
            <h2 className={styles.archiveTitle}>WORKSHOPS BY YEAR</h2>
            <ul className={styles.archiveList}>
              {yearlyWorkshops.map((item) => (
                <li key={item.year} className={styles.archiveItem}>
                  <span className={styles.archiveYear}>{item.year}</span>
                  <span className={styles.archiveCount}>({item.count})</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.archiveSection}>
            <h2 className={styles.archiveTitle}>EVENTS BY YEAR</h2>
            <ul className={styles.archiveList}>
              {yearlyEvents.map((item) => (
                <li key={item.year} className={styles.archiveItem}>
                  <span className={styles.archiveYear}>{item.year}</span>
                  <span className={styles.archiveCount}>({item.count})</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.viewAllSection}>
            <a
              href="https://www.isa.org.jm/events-archive/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.viewAllButton}
            >
              All Archived Events →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WorkshopsTemplate;
