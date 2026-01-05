"use client";
import styles from "./page.module.css";
import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header/Header";

const AboutUsPage = () => {
  return (
    <div className={styles.pageWrapper}>
      <Header 
        navItems={["Главная", "Услуги", "Врачи", "О нас"]}
        showAccountButton={true}
        fixed={true}
      />

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.container}>
          {/* Page Heading */}
          <div className={styles.pageHeading}>
            <h1 className={styles.title}>О нас</h1>
            <p className={styles.subtitle}>
              Здесь вы можете найти наши адреса, а также контакты для связи.
            </p>
          </div>

          {/* Content Section */}
          <div className={styles.contentSection}>
            {/* Map */}
            <div className={styles.mapContainer}>
              <iframe
                src="https://yandex.ru/map-widget/v1/?um=constructor%3A6df61d1066108ba7de888fb905c55d7845d03493b3184fccc061177dea5927b2&amp;source=constructor"
                width="700"
                height="392"
                frameBorder="0"
                className={styles.map}
                title="Карта расположения клиники"
              ></iframe>
            </div>

            {/* Contact Info */}
            <div className={styles.contactInfo}>
              <div className={styles.contactBlock}>
                <h3 className={styles.contactLabel}>Адрес:</h3>
                <p className={styles.contactText}>19 мкр, ЖК «Ханшайым», 4 офис.</p>
              </div>

              <div className={styles.contactBlock}>
                <h3 className={styles.contactLabel}>Записаться на приём:</h3>
                <a href="tel:+77023012796" className={styles.contactLink}>
                  +7 702 301 2796
                </a>
              </div>

              <div className={styles.contactBlock}>
                <h3 className={styles.contactLabel}>Горячая линия 1:</h3>
                <a href="tel:+77777777777" className={styles.contactLink}>
                  +7 777 777 77 77
                </a>
              </div>

              <div className={styles.contactBlock}>
                <h3 className={styles.contactLabel}>Горячая линия 2:</h3>
                <a href="tel:+77777777777" className={styles.contactLink}>
                  +7 777 777 77 77
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerLeft}>
            <Image
              src="/logo.png"
              alt="Sadap Clinic"
              width={120}
              height={40}
              className={styles.footerLogo}
            />
            <p className={styles.footerTagline}>Радость. Здоровье. Успех!</p>
            <p className={styles.footerCopyright}>Все права защищены, 2024.</p>
          </div>

          <div className={styles.footerRight}>
            <div className={styles.footerLinks}>
              <a href="#" className={styles.footerLink}>Услуги</a>
              <a href="#" className={styles.footerLink}>Врачи</a>
              <a href="#" className={styles.footerLink}>Отзывы</a>
              <a href="#" className={styles.footerLink}>О нас</a>
            </div>

            <div className={styles.footerContacts}>
              <a href="tel:+77023012796" className={styles.contactItem}>
                <Image
                  src="/phone.png"
                  alt="Phone"
                  width={24}
                  height={24}
                  className={styles.contactIcon}
                />
                <span className={styles.contactItemText}>+7 702 301 2796</span>
              </a>

              <a href="https://instagram.com/sadapclinic_kz" target="_blank" rel="noopener noreferrer" className={styles.contactItem}>
                <Image
                  src="/instagram.png"
                  alt="Instagram"
                  width={24}
                  height={24}
                  className={styles.contactIcon}
                />
                <span className={styles.contactItemText}>@sadapclinic_kz</span>
              </a>

              <a href="mailto:support@sadapclinic.kz" className={styles.contactItem}>
                <Image
                  src="/mail.png"
                  alt="Email"
                  width={24}
                  height={24}
                  className={styles.contactIcon}
                />
                <span className={styles.contactItemText}>support@sadapclinic.kz</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutUsPage;

