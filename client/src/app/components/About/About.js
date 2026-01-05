import styles from "./About.module.css";

const About = () => {
  return (
    <section className={styles.about}>
      <div className={styles.aboutContainer}>
        <h2 className={styles.aboutTitle}>О клинике</h2>
        <p className={styles.aboutText}>
          Наша Миссия - Предоставлять широкий спектр медицинских услуг для жителей Актау и области,
          обеспечивая качественное лечение через точную диагностику, высококвалифицированных врачей
          и современное оборудование
        </p>
        <button className={styles.aboutButton}>
          <span className={styles.buttonText}>ПОДРОБНЕЕ</span>
        </button>
      </div>
    </section>
  )
}

export default About

