"use client";
import styles from "./page.module.css";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

const NewsPage = () => {
  return (
    <div className={styles.pageWrapper}>
      <Header 
        navItems={["Главная", "Услуги", "Врачи", "О нас"]}
        showAccountButton={true}
        fixed={true}
      />

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <h1 className={styles.heroTitle}>Новости</h1>
          <p className={styles.heroSubtitle}>Здесь вы можете найти все доступные отзывы и оставить свои.</p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default NewsPage;

