"use client";
import styles from "./page.module.css";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

const appointmentsData = [
  {
    id: 1,
    doctor: "Анна Ивановна",
    date: "28 апреля 2024",
    time: "18:20"
  },
  {
    id: 2,
    doctor: "Анна Ивановна",
    date: "28 апреля 2024",
    time: "18:20"
  },
  {
    id: 3,
    doctor: "Анна Ивановна",
    date: "28 апреля 2024",
    time: "18:20"
  },
  {
    id: 4,
    doctor: "Анна Ивановна",
    date: "28 апреля 2024",
    time: "18:20"
  },
  {
    id: 5,
    doctor: "Анна Ивановна",
    date: "28 апреля 2024",
    time: "18:20"
  },
  {
    id: 6,
    doctor: "Анна Ивановна",
    date: "28 апреля 2024",
    time: "18:20"
  }
];

const AppointmentsPage = () => {
  const pathname = usePathname();

  return (
    <div className={styles.pageWrapper}>
      <Header 
        // navItems={["Главная", "Услуги", "Врачи", "O нас"]}
        showAccountButton={false}
        fixed={true}
      />

      <div className={styles.contentWrapper}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <nav className={styles.sidebarNav}>
            <Link href="/profile" className={`${styles.sidebarItem} ${pathname === "/profile" ? styles.sidebarItemActive : ""}`}>
              <div className={styles.sidebarIcon}>
                <img src={pathname === "/profile" ? "/profile-active.png" : "/profile.png"} alt="" />
              </div>
              <span className={styles.sidebarText}>Профиль</span>
            </Link>

            <Link href="/appointments" className={`${styles.sidebarItem} ${pathname === "/appointments" ? styles.sidebarItemActive : ""}`}>
              <div className={styles.sidebarIcon}>
                <img src={pathname === "/appointments" ? "/appointments-active.png" : "/appointments.png"} alt="" />
              </div>
              <span className={styles.sidebarText}>Записи</span>
            </Link>

            <Link href="#" className={styles.sidebarItem}>
              <div className={styles.sidebarIcon}>
                <img src="/analyzes.png" alt="" />
              </div>
              <span className={styles.sidebarText}>Анализы</span>
            </Link>

            <Link href="#" className={styles.sidebarItem}>
              <div className={styles.sidebarIcon}>
                <img src="/notes.png" alt="" />
              </div>
              <span className={styles.sidebarText}>Выписки</span>
            </Link>

            <Link href="#" className={styles.sidebarItem}>
              <div className={styles.sidebarIcon}>
                <img src="/insurance.png" alt="" />
              </div>
              <span className={styles.sidebarText}>Страхования</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className={styles.mainContent}>
          <div className={styles.contentContainer}>
            <h1 className={styles.pageTitle}>Записи</h1>

            <div className={styles.appointmentsGrid}>
              {appointmentsData.map((appointment) => (
                <div key={appointment.id} className={styles.appointmentCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.dateTime}>
                      <div className={styles.date}>{appointment.date}</div>
                      <div className={styles.divider}></div>
                      <div className={styles.time}>{appointment.time}</div>
                    </div>
                  </div>

                  <div className={styles.cardBody}>
                    <div className={styles.doctorInfo}>
                      <span className={styles.doctorLabel}>Врач:</span>
                      <span className={styles.doctorName}>{appointment.doctor}</span>
                    </div>
                  </div>

                  <div className={styles.cardFooter}>
                    <button className={styles.detailsButton}>
                      <span className={styles.buttonText}>Подробнее</span>
                      <span className={styles.buttonIcon}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M7.5 15L12.5 10L7.5 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* <div className={styles.scrollbar}>
              <div className={styles.scrollbarThumb}></div>
            </div> */}
          </div>
        </main>
      </div>

      {/* Custom Footer */}
      <Footer></Footer>
      {/* <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerLeft}>
            <Image
              src="/logo.png"
              alt="Sadap Clinic"
              width={149}
              height={74}
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
                <span className={styles.contactText}>+7 702 301 2796</span>
              </a>

              <a href="https://instagram.com/sadapclinic_kz" target="_blank" rel="noopener noreferrer" className={styles.contactItem}>
                <Image
                  src="/instagram.png"
                  alt="Instagram"
                  width={24}
                  height={24}
                  className={styles.contactIcon}
                />
                <span className={styles.contactText}>@sadapclinic_kz</span>
              </a>

              <a href="mailto:support@sadapclinic.kz" className={styles.contactItem}>
                <Image
                  src="/mail.png"
                  alt="Email"
                  width={24}
                  height={24}
                  className={styles.contactIcon}
                />
                <span className={styles.contactText}>support@sadapclinic.kz</span>
              </a>
            </div>
          </div>
        </div>
      </footer> */}
    </div>
  );
};

export default AppointmentsPage;

