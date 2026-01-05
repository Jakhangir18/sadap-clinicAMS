"use client";
import styles from "./page.module.css";
import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

const doctorsData = [
  {
    id: 1,
    name: "Ахметов Айдар Серикович",
    position: "Врач-эндоскопист, заведующий отделением-врач-эндоскопист",
    avatar: "/services/doctor.png",
    slug: "ahmetov-aidar"
  },
  {
    id: 2,
    name: "Ахметов Айдар Серикович",
    position: "Врач-эндоскопист, заведующий отделением-врач-эндоскопист",
    avatar: "/services/doctor.png",
    slug: "ahmetov-aidar-2"
  },
  {
    id: 3,
    name: "Ахметов Айдар Серикович",
    position: "Врач-эндоскопист, заведующий отделением-врач-эндоскопист",
    avatar: "/services/doctor.png",
    slug: "ahmetov-aidar-3"
  },
  {
    id: 4,
    name: "Ахметов Айдар Серикович",
    position: "Врач-эндоскопист, заведующий отделением-врач-эндоскопист",
    avatar: "/services/doctor.png",
    slug: "ahmetov-aidar-4"
  },
  {
    id: 5,
    name: "Ахметов Айдар Серикович",
    position: "Врач-эндоскопист, заведующий отделением-врач-эндоскопист",
    avatar: "/services/doctor.png",
    slug: "ahmetov-aidar-5"
  },
  {
    id: 6,
    name: "Ахметов Айдар Серикович",
    position: "Врач-эндоскопист, заведующий отделением-врач-эндоскопист",
    avatar: "/services/doctor.png",
    slug: "ahmetov-aidar-6"
  }
];

// 🔹 Категории-специальности под поиском
const specialties = [
  "Педиатр",
  "Кардиолог",
  "Гинеколог",
  "Терапевт",
  "Невролог",
  "Эндокринолог",
  "Хирург",
  "Дерматолог"
];

const DoctorsPage = () => {
  return (
    <div className={styles.pageWrapper}>
      <Header 
        // navItems={["Записаться на прием", "Выбрать врача", "Личный кабинет"]}
        showAccountButton={false}
        fixed={true}
      />

      <div className={styles.contentWrapper}>
        <div className={styles.container}>
          {/* Page Header */}
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Наши врачи</h1>
            <p className={styles.pageSubtitle}>Наши врачи - наша гордость!</p>
          </div>

          {/* Search and Filter */}
          <div className={styles.searchWrapper}>
            <div className={styles.searchInput}>
              <svg width="21" height="20" viewBox="0 0 21 20" fill="none" className={styles.searchIcon}>
                <path d="M9.5 17C13.6421 17 17 13.6421 17 9.5C17 5.35786 13.6421 2 9.5 2C5.35786 2 2 5.35786 2 9.5C2 13.6421 5.35786 17 9.5 17Z" stroke="#D9D9D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M19 19L14.65 14.65" stroke="#D9D9D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <input
                type="text"
                placeholder="Введите специализацию, имя или фамилию врача"
                className={styles.searchField}
              />
            </div>

            <button className={styles.searchButton}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M21 21L16.65 16.65" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Поиск</span>
            </button>

            <button className={styles.filterButton}>
              <Image
                src="/filter.png"
                alt=""
                width={24}
                height={24}
                className={styles.filterIcon}
              />
              <span>Фильтровать</span>
            </button>
          </div>

          {/* 🔹 КАТЕГОРИИ СПЕЦИАЛЬНОСТЕЙ ПОД ПОИСКОМ */}
          <div className={styles.specialtiesWrapper}>
            {specialties.map((spec) => (
              <button
                key={spec}
                type="button"
                className={styles.specialtyButton}
              >
                {spec}
              </button>
            ))}
          </div>

          {/* Doctors List */}
          <div className={styles.doctorsList}>
            {doctorsData.map((doctor) => (
              <Link
                key={doctor.id}
                href={`/doctors/${doctor.slug}`}
                className={styles.doctorCardLink}
              >
                <div className={styles.doctorCard}>
                  <div className={styles.doctorAvatar}>
                    <Image
                      src={doctor.avatar}
                      alt={doctor.name}
                      width={73}
                      height={82}
                      className={styles.avatarImage}
                    />
                  </div>

                  <div className={styles.doctorInfo}>
                    <h3 className={styles.doctorName}>{doctor.name}</h3>
                    <p className={styles.doctorPosition}>{doctor.position}</p>
                  </div>

                  <button className={styles.appointmentButton}>
                    <span className={styles.buttonText}>Записаться</span>
                  </button>
                </div>
              </Link>
            ))}
          </div>

          <div className={styles.scrollbar}></div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DoctorsPage;
