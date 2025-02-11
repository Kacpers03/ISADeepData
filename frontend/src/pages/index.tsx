import styles from "../styles/home.module.css";

export default function Home() {
  return (
    // Wrapper for å bryte ut av Layouts container
    <div className={styles.homeWrapper}>
      <div className={styles.homeContainer}>
        <video autoPlay muted loop className={styles.heroVideo}>
          <source src="/video/ocean.mp4" type="video/mp4" />
          Din nettleser støtter ikke videoavspilling.
        </video>
        <div className={styles.overlay}>
          <h2>Welcome to ISA DeepData</h2>
          <p>Explore the ocean's depths with our interactive maps and resources.</p>
        </div>
      </div>
    </div>
  );
}
